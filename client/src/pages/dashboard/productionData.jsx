import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const planTarget = 40;

const getCellColor = (value) => {
  if (value >= 40) return '#90ee90'; // Green
  if (value >= 30) return '#ffff99'; // Yellow
  return '#ff6666'; // Red
};

const rows = [
  {
    hour: '1st Hour',
    prep: 40,
    case: 20,
    semi: 40,
    edge: 45,
    inspect: 50,
    pass: 35,
    rework: 15,
    codes: 'NCP1,NCP2',
  },
  {
    hour: '2nd Hour',
    prep: 50,
    case: '',
    semi: '',
    edge: '',
    inspect: '',
    pass: '',
    rework: '',
    codes: '',
  },
  ...Array(6).fill({ hour: '', prep: '', case: '', semi: '', edge: '', inspect: '', pass: '', rework: '', codes: '' }),
];

const totals = {
  prep: 90,
  case: 20,
  semi: 40,
  edge: 45,
  inspect: 50,
  pass: 35,
  rework: 15,
};

const balances = {
  prep: 50,
  case: -20,
  semi: 0,
  edge: 5,
  inspect: 10,
  pass: -5,
  rework: -25,
};

export default function ProductionDisplayBoard() {
  return (
    <Box p={2}>
      <Typography variant="h5" align="center" fontWeight="bold">
        KH EXPORTS INDIA PVT LTD., (GLOVE DIVISION)
      </Typography>
      <Typography variant="subtitle1" align="center" fontStyle="italic">
        LINE WISE DISPLAY BOARD-1
      </Typography>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2} mb={1}>
        <Box bgcolor="#ff6666" px={1}> &lt;&lt; 29 </Box>
        <Box bgcolor="#ffff99" px={1}> 30 to 40 </Box>
        <Box bgcolor="#90ee90" px={1}> 40 &gt;&gt; </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>HOUR</TableCell>
              <TableCell>PREP</TableCell>
              <TableCell>CASE</TableCell>
              <TableCell>SEMI FINISH</TableCell>
              <TableCell>FINAL EDGE INKING</TableCell>
              <TableCell>INSPECT</TableCell>
              <TableCell>PASS</TableCell>
              <TableCell>REWORK</TableCell>
              <TableCell>Booked NCP Codes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>113%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>100%</TableCell>
              <TableCell>113%</TableCell>
              <TableCell>125%</TableCell>
              <TableCell>88%</TableCell>
              <TableCell>38%</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ACH</TableCell>
              <TableCell>BAL</TableCell>
              <TableCell>ACH</TableCell>
              <TableCell>ACH</TableCell>
              <TableCell>ACH</TableCell>
              <TableCell>BAL</TableCell>
              <TableCell>BAL</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.hour || `${index + 3}th Hour`}</TableCell>
                {[row.prep, row.case, row.semi, row.edge, row.inspect, row.pass, row.rework].map((val, i) => (
                  <TableCell
                    key={i}
                    style={{ backgroundColor: val !== '' ? getCellColor(val) : undefined }}
                  >
                    {val}
                  </TableCell>
                ))}
                <TableCell>{row.codes}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{totals.prep}</TableCell>
              <TableCell>{totals.case}</TableCell>
              <TableCell>{totals.semi}</TableCell>
              <TableCell>{totals.edge}</TableCell>
              <TableCell>{totals.inspect}</TableCell>
              <TableCell>{totals.pass}</TableCell>
              <TableCell>{totals.rework}</TableCell>
              <TableCell>0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>2</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bal</TableCell>
              <TableCell>{balances.prep}</TableCell>
              <TableCell>{balances.case}</TableCell>
              <TableCell>{balances.semi}</TableCell>
              <TableCell>{balances.edge}</TableCell>
              <TableCell>{balances.inspect}</TableCell>
              <TableCell>{balances.pass}</TableCell>
              <TableCell>{balances.rework}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}