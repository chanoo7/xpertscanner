import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card,  Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';

export default function DashboardDefault() {
  const [summary, setSummary] = useState(null);

useEffect(() => {
  axios
    .get("http://localhost:5000/product/summary")
    .then((response) => {
      //console.log("Axios Response:", response); // ✅ Log full response
      setSummary(response.data); // ✅ Assign `response.data`
    })
    .catch((error) => {
      console.error("Axios Error:", error);
    });
}, []);

  return (
    <div className="dashboard-container">
      <Typography variant="h5" gutterBottom>
        PRODUCTION MONITOR
      </Typography>
      {summary ? ( 
        <>
      <Grid2 container spacing={5}>
        {/* Total Lines */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" >Total Lines</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.data.totalLines}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Total Stations */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" >Total Stations</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.data.totalStations}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Total Styles */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#4CAF50">
            <Typography variant="h5" align="center" >Total Styles</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.data.styles}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Offline Stations (RED CARD) */}
        <Grid2 xs={12} md={3}>
          <StyledCard bgColor="#F44336">
            <Typography variant="h5" align="center">Offline Stations</Typography>
            <Typography variant="h4" fontWeight="bold" className="number" align="center">
              {summary.data.offlineStations}
            </Typography>
          </StyledCard>
        </Grid2>

        {/* Detail Cards (Station ID, History) */}
      </Grid2>
       </>
      ) : (
        <p>Loading...</p> // ✅ Show loading state
      )}
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