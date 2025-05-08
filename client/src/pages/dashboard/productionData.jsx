import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField } from '@mui/material';
import axios from 'axios';

const getCellColor = (value) => {
  if (value >= 40) return '#90ee90'; // Green
  if (value >= 30) return '#ffff99'; // Yellow
  return '#ff6666'; // Red
};

const initialRow = {
  hour: '',
  prep: '',
  case: '',
  semi: '',
  edge: '',
  inspect: '',
  pass: '',
  rework: '',
  codes: '',
};




export default function ProductionDisplayBoard() {
  const [rows, setRows] = useState(
    Array(8).fill().map((_, i) => ({ ...initialRow, hour: `${i + 1}th Hour` }))
  );
  const [targetQty, setTargetQty] = useState('');

  const perHourTarget = targetQty ? Math.ceil(parseInt(targetQty) / 8) : 0;


  const handleScan = async (scannerType, hourIndex = 0) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/api/mqtt-data`);
      const scannedValue = res.data?.count || 1;

      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === hourIndex
            ? { ...row, [scannerType]: (parseInt(row[scannerType]) || 0) + scannedValue }
            : row
        )
      );
    } catch (error) {
      console.error('Error fetching MQTT data:', error);
    }
  };


  const calculateTotal = (field) =>
    rows.reduce((acc, row) => acc + (parseInt(row[field]) || 0), 0);
  
  const totalRow = {
    hour: 'Total',
    prep: calculateTotal('prep'),
    case: calculateTotal('case'),
    semi: calculateTotal('semi'),
    edge: calculateTotal('edge'),
    inspect: calculateTotal('inspect'),
    pass: calculateTotal('pass'),
    rework: calculateTotal('rework'),
    codes: calculateTotal('codes'),
  };
  
  const balRow = {
    hour: 'Bal',
    prep: perHourTarget * 8 - totalRow.prep,
    case: perHourTarget * 8 - totalRow.case,
    semi: perHourTarget * 8 - totalRow.semi,
    edge: perHourTarget * 8 - totalRow.edge,
    inspect: perHourTarget * 8 - totalRow.inspect,
    pass: perHourTarget * 8 - totalRow.pass,
    rework: perHourTarget * 8 - totalRow.rework,
    codes: perHourTarget * 8 - totalRow.codes,
  };
  
  return (
    <Box p={2}>
      <Typography variant="h5" align="center" fontWeight="bold">
        KH EXPORTS INDIA PVT LTD., (GLOVE DIVISION)
      </Typography>
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
          onChange={(e) => setTargetQty(e.target.value)}
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
            <TableRow >
              <TableCell  sx={{ backgroundColor: '#59B5F7' }}>HOUR</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>PREP</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>CASE</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>SEMI FINISH</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>FINAL EDGE INKING</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>INSPECT</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>PASS</TableCell>
              <TableCell sx={{ border: '1px solid #ccc' }}>REWORK</TableCell>
              <TableCell  sx={{ backgroundColor: '#59B5F7' }}>Booked NCP Codes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {rows.map((row, index) => (
    <TableRow key={index}>
     <TableCell sx={{ border: '1px solid #ccc' }}>{row.hour}</TableCell>
{[row.prep, row.case, row.semi, row.edge, row.inspect, row.pass, row.rework].map((val, i) => (
  <TableCell
    key={i}
    sx={{ backgroundColor: val !== '' ? getCellColor(val) : undefined, border: '1px solid #ccc' }}
  >
    {val}
  </TableCell>
))}
<TableCell sx={{ border: '1px solid #ccc' }}>{row.codes}</TableCell>

    </TableRow>
  ))}

  {/* Total Row */}
  <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
    <TableCell sx={{ border: '1px solid #ccc' }}><strong>{totalRow.hour}</strong></TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.prep}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.case}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.semi}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.edge}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.inspect}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.pass}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.rework}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{totalRow.codes}</TableCell>
  </TableRow>

  {/* ACH / BAL Row (Header) */}
  {/* <TableRow>
    <TableCell></TableCell>
    <TableCell>ACH</TableCell>
    <TableCell>BAL</TableCell>
    <TableCell>ACH</TableCell>
    <TableCell>ACH</TableCell>
    <TableCell>ACH</TableCell>
    <TableCell>BAL</TableCell>
    <TableCell>BAL</TableCell>
    <TableCell></TableCell>
  </TableRow> */}

  {/* Balance Row */}
  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
    <TableCell sx={{ border: '1px solid #ccc' }}><strong>{balRow.hour}</strong></TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.prep}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.case}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.semi}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.edge}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.inspect}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.pass}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.rework}</TableCell>
    <TableCell sx={{ border: '1px solid #ccc' }}>{balRow.codes}</TableCell>
  </TableRow>
</TableBody>

        </Table>
      </TableContainer>

      {/* Temp Scan Buttons */}
      <Box mt={2} display="flex" gap={2}>
        {/* <button onClick={() => handleScan('prep', 0)}>Scan PREP</button>
        <button onClick={() => handleScan('case', 0)}>Scan CASE</button>
        <button onClick={() => handleScan('semi', 0)}>Scan SEMI</button>
        <button onClick={() => handleScan('edge', 0)}>Scan EDGE</button> */}
      </Box>
    </Box>
  );
}
