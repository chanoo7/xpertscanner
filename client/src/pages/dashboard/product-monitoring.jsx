import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';

export default function DashboardDefault() {
  const [summary, setSummary] = useState({
    totalLines: 0,
    totalStations: 0,
    styles: 0,
    offlineStations: 0,
  });

  // useEffect(() => {
  //   fetch("http://localhost:5000/summary")
  //     .then((res) => res.json())
  //     .then((data) => setSummary(data))
  //     .catch((err) => console.error("Error:", err));
  // }, []);

  return (
    <div className="dashboard-container">
      <Typography variant="h5" gutterBottom>
        PRODUCTION MONITOR
      </Typography>

      <Grid2 container spacing={5}>
        {/* Total Lines */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" className="number">Total Lines</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.totalLines}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Total Stations */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" className="number">Total Stations</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.totalStations}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Total Styles */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" className="number">Total Styles</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.styles}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Offline Stations (RED CARD) */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#F44336">
            <Typography variant="h5" align="center" className="number">Offline Stations</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.offlineStations}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Detail Cards (Station ID, History) */}
      </Grid2>
    </div>
  );
}

// Styled Components for consistent styling
const StyledCard = styled(Card)(({ theme, bgColor }) => ({
  backgroundColor: bgColor,
  color: theme.palette.common.white,
  textAlign: 'center',
  padding: theme.spacing(3),
  minHeight: 250,
  height: '100%',
  display: 'flex', // Use Flexbox
  flexDirection: 'column', // Stack elements vertically
  justifyContent: 'center', // Vertically center content
  alignItems: 'center', // Horizontally center content
  '& .number': {
    fontSize: '2.5rem',
  },
}));