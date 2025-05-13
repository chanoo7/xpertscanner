import React, { useEffect, useState, useRef } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Box, Typography
} from '@mui/material';
import axios from 'axios';

// Map of stationId to stage name
const stageMap = {
  '94A99003C00C': 'prep',   // Heating Patti
  '94A99003C190': 'semi',   // Embossing Pkt
  '94A99003C174': 'case',   // Case Edging
  '94A99003BF5C': 'edge',   // FINAL Lamping 1
};

const stageHeaders = {
  prep: 'Heating Patti',
  semi: 'Embossing Pkt',
  case: 'Case Edging',
  edge: 'FINAL Lamping 1',
};

const initialRow = { prep: 0, semi: 0, case: 0, edge: 0 };

const getCellColor = (value) => {
  if (value >= 40) return '#90ee90'; // Green
  if (value >= 30) return '#ffff99'; // Yellow
  return '#ff6666'; // Red
};

export default function HourlyProductionTable() {
  const [rows, setRows] = useState(Array.from({ length: 8 }, () => ({ ...initialRow })));
  const lastProcessedKeyRef = useRef(new Set());
  const [targetQty, setTargetQty] = useState('');

  // Load saved target quantity
  useEffect(() => {
    const savedQty = localStorage.getItem('targetQty');
    if (savedQty) setTargetQty(parseInt(savedQty));
  }, []);

  // Save target quantity to localStorage
  const saveTargetQty = (qty) => {
    localStorage.setItem('targetQty', qty);
    setTargetQty(qty);
  };

  const perHourTarget = targetQty ? parseInt(targetQty) : 0; // Plan target per hour

  // Fetch data on mount and every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/production/listProductionData`);
        const data = res.data;

        console.log("Fetched:", data.statuses);

        data.statuses.forEach(({ stationId, code, timestamp }) => {
          const uniqueKey = `${stationId}_${code}_${timestamp}`;
          if (!lastProcessedKeyRef.current.has(uniqueKey)) {
            console.log("New Scan:", uniqueKey);
            lastProcessedKeyRef.current.add(uniqueKey);
            handleQRCodeScan(stationId, code, timestamp);
          } else {
            console.log("Duplicate ignored:", uniqueKey);
          }
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle QR code scan and update the table
  const handleQRCodeScan = (stationId, code, timestamp) => {
    const scanTime = new Date(parseInt(timestamp) * 1000);
    const hour = scanTime.getHours(); // returns 0-23
    const hourIndex = hour - 8; // 8 AM is 0th index

    const stage = stageMap[stationId];
    if (!stage || hourIndex < 0 || hourIndex >= 8) return; // out of range

    setRows(prevRows => {
      const updated = [...prevRows];
      updated[hourIndex] = {
        ...updated[hourIndex],
        [stage]: (updated[hourIndex][stage] || 0) + 1,
      };
      return updated;
    });
  };

  // Calculate totals for each stage
  const totals = rows.reduce((acc, row) => {
    Object.keys(initialRow).forEach(key => {
      acc[key] += row[key];
    });
    return acc;
  }, { ...initialRow });

  // Calculate balance for each stage (Total - Plan Target)
  const balance = {
    prep: perHourTarget - totals.prep,
    semi: perHourTarget - totals.semi,
    case: perHourTarget - totals.case,
    edge: perHourTarget - totals.edge,
  };

  return (
    <Box p={2}>
      <Typography variant="subtitle1" align="center" fontStyle="italic">
        LINE WISE DISPLAY BOARD-1
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <TextField
          label="Plan Target Qty/Hour"
          variant="outlined"
          size="small"
          type="number"
          value={targetQty}
          onChange={(e) => saveTargetQty(e.target.value)}
        />
        <Box display="flex" gap={2}>
          <Box bgcolor="#ff6666" px={1}> &lt;&lt; 29 </Box>
          <Box bgcolor="#ffff99" px={1}> 30 to 40 </Box>
          <Box bgcolor="#90ee90" px={1}> 40 &gt;&gt; </Box>
        </Box>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#59B5F7' }}><strong>HOUR</strong></TableCell>
              {Object.values(stageHeaders).map((label, index) => (
                <TableCell key={index} align="center" sx={{ border: '1px solid #ccc' }}>
                  <strong>{label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ccc' }}>{index + 1}th Hour</TableCell>
                {Object.keys(stageHeaders).map(key => (
                  <TableCell
                    key={key}
                    align="center"
                    sx={{
                      backgroundColor: row?.[key] !== undefined ? getCellColor(row[key]) : undefined,
                      border: '1px solid #ccc',
                    }}
                  >
                    {row?.[key] ?? 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell sx={{ border: '1px solid #ccc' }}><strong>Total</strong></TableCell>
              {Object.keys(stageHeaders).map(key => (
                <TableCell key={key} align="center" sx={{ border: '1px solid #ccc' }}>
                  <strong>{totals[key]}</strong>
                </TableCell>
              ))}
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ border: '1px solid #ccc' }}><strong>Balance</strong></TableCell>
              {Object.keys(stageHeaders).map(key => (
                <TableCell key={key} align="center" sx={{ border: '1px solid #ccc' }}>
                  {balance[key]}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}