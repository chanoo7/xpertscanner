import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper, TextField
} from '@mui/material';
import axios from 'axios';

const getCellColor = (value) => {
  if (value >= 40) return '#90ee90'; // Green
  if (value >= 30) return '#ffff99'; // Yellow
  return '#ff6666'; // Red
};

const initialRow = {
  hour: '',
  prep: 0,
  case: 0,
  semi: 0,
  edge: 0,
};

const getCurrentHourIndex = () => {
  const now = new Date();
  const hour = now.getHours();
  const shiftStart = 12; // 12 PM
  const shiftEnd = 20;   // 8 PM
  if (hour < shiftStart || hour >= shiftEnd) return -1;
  return hour - shiftStart;
};

export default function ProductionDisplayBoard() {
  const [rows, setRows] = useState(
    Array(8).fill().map((_, i) => ({ ...initialRow, hour: `${i + 1}th Hour` }))
  );
  const [targetQty, setTargetQty] = useState('');
  const [scannedQRCodes, setScannedQRCodes] = useState(() => {
    const saved = localStorage.getItem('scannedQRCodes');
    return saved ? JSON.parse(saved) : {};
  });

  const lastProcessedKeyRef = useRef(null);

  // Initialize Set once on mount
  useEffect(() => {
    if (!lastProcessedKeyRef.current) {
      lastProcessedKeyRef.current = new Set();
    }
  }, []);

  // Persist scanned QR codes to localStorage
  useEffect(() => {
    localStorage.setItem('scannedQRCodes', JSON.stringify(scannedQRCodes));
  }, [scannedQRCodes]);

  // Load saved target quantity
  useEffect(() => {
    const savedQty = localStorage.getItem('targetQty');
    if (savedQty) setTargetQty(parseInt(savedQty));
  }, []);

  // Load saved production rows
  useEffect(() => {
    const saved = localStorage.getItem('productionRows');
    if (saved) setRows(JSON.parse(saved));
  }, []);

  // Persist production rows
  useEffect(() => {
    localStorage.setItem('productionRows', JSON.stringify(rows));
  }, [rows]);

  const saveTargetQty = (qty) => {
    localStorage.setItem('targetQty', qty);
    setTargetQty(qty);
  };

  const perHourTarget = targetQty ? Math.ceil(parseInt(targetQty) / 8) : 0;

  const handleQRCodeScan = (stationId, qrCode) => {
  const hourIndex = getCurrentHourIndex();
  if (hourIndex === -1) {
    console.warn("Outside working hour");
    return;
  }

  const stationIdToStage = {
    '94A99003C00C': 'prep',
    '94A99003C174': 'case',
    '94A99003C190': 'semi',
    '94A99003BF5C': 'edge',
  };

  const stage = stationIdToStage[stationId];
  if (!stage) {
    console.warn("Unknown station ID:", stationId);
    return;
  }

  const uniqueKey = `${stationId}_${qrCode}`;
  if (scannedQRCodes[uniqueKey]) {
    console.log("Already scanned:", uniqueKey);
    return;
  }

  console.log(`Updating count for ${stage} at hour ${hourIndex}`);

  setScannedQRCodes(prev => ({
    ...prev,
    [uniqueKey]: true,
  }));

  setRows(prevRows => {
    const updated = [...prevRows];
    const current = updated[hourIndex];
    updated[hourIndex] = {
      ...current,
      [stage]: (parseInt(current[stage]) || 0) + 1,
    };
    return updated;
  });
};


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
          handleQRCodeScan(stationId, code);
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


  const calculateTotal = (field) =>
    rows.reduce((acc, row) => acc + (parseInt(row[field]) || 0), 0);

  const totalRow = {
    hour: 'Total',
    prep: calculateTotal('prep'),
    case: calculateTotal('case'),
    semi: calculateTotal('semi'),
    edge: calculateTotal('edge'),
  };

  const balRow = {
    hour: 'Bal',
    prep: targetQty - totalRow.prep,
    case: targetQty - totalRow.case,
    semi: targetQty - totalRow.semi,
    edge: targetQty - totalRow.edge,
  };

  return (
    <Box p={2}>
      <Typography variant="subtitle1" align="center" fontStyle="italic">
        LINE WISE DISPLAY BOARD-1
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <TextField
          label="Target Quantity"
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

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#59B5F7' }}>HOUR</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Heating Patti</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Embosing Pkt</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>Case Edgeinking</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>FINAL Lamping 1</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ccc' }}>{row.hour}</TableCell>
                {[row.prep, row.case, row.semi, row.edge].map((val, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      backgroundColor: val !== '' ? getCellColor(val) : undefined,
                      border: '1px solid #ccc'
                    }}
                  >
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell sx={{ border: '1px solid #ccc' }}><strong>{totalRow.hour}</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.prep}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.case}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.semi}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.edge}</TableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ border: '1px solid #ccc' }}><strong>{balRow.hour}</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.prep}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.case}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.semi}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.edge}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
