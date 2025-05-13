import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert
} from '@mui/material';

import MainCard from 'components/MainCard';
import reasonData from './data.json'; // adjust path as needed

export default function ViewReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchReports = useCallback(async (statusFilter = '') => {
    setLoading(true);
    setError(null);
    let apiUrl = 'http://192.168.53.3:5000/fqc/filterStatus';
    const queryParams = [];

    if (statusFilter) {
      queryParams.push(`filterBy=status`);
      queryParams.push(`value=${statusFilter.toLowerCase()}`);
    }

    if (queryParams.length > 0) {
      apiUrl += `?${queryParams.join('&')}`;
    } else {
      apiUrl = 'http://192.168.53.3:5000/fqc/listStatus';
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.statuses) {
        setReports(data.statuses);
      } else if (Array.isArray(data)) {
        setReports(data);
      } else {
        setError('Invalid response format from API.');
      }
    } catch (error) {
      setError('Failed to load reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getReasonDescription = (code) => {
    for (const category in reasonData) {
      const found = reasonData[category].find(reason => reason.code === code);
      if (found) return found.description;
    }
    return 'Unknown Reason';
  };

  const formatRemarks = (remarks) => {
    if (remarks?.reasonCodes?.length) {
      return remarks.reasonCodes.map(code => `${code} - ${getReasonDescription(code)}`).join(', ');
    }
    return JSON.stringify(remarks);
  };

  return (
    <MainCard title="FQC Status Reports">
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => fetchReports(filterStatus)}>
          Filter
        </Button>
        <Button variant="outlined" onClick={() => { setFilterStatus(''); fetchReports(); }}>
          Reset
        </Button>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Timestamp</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Remarks</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No reports found</TableCell>
                </TableRow>
              ) : (
                reports.map((item) => (
                  <TableRow key={item.id || item.code + item.timestamp}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{new Date(parseInt(item.timestamp) * 1000).toLocaleString()}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {item.status === 'fail'
                        ? formatRemarks(item.remarks)
                        : JSON.stringify(item.remarks)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
}
