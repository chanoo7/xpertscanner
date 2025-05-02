import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

function ViewLBR() {
  const [lbrData, setLbrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLBRData();
  }, []);

  const fetchLBRData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/getproductionplan`);
      const latest = res.data[res.data.length - 1]; // Get last record
      setLbrData(latest);
    } catch (err) {
      console.error("Error fetching LBR:", err);
    } finally {
      setLoading(false);
    }
  };

  const splitPositions = (total) => {
    const left = [], right = [];
    for (let i = 1; i <= total; i++) {
      if (i % 2 !== 0) left.push(i);
      else right.push(i);
    }
    return [left, right];
  };

  if (loading) return <CircularProgress />;
  if (!lbrData) return <Typography>No LBR data found.</Typography>;

  const [left, right] = splitPositions(lbrData.noOfPositions || 0);

  return (
    <Card sx={{ p: 3, m: 3 }}>
      <Typography variant="h5" gutterBottom>LBR View</Typography>

      <Typography><strong>Style:</strong> {lbrData.style}</Typography>
      <Typography><strong>Route Map:</strong> {lbrData.routeMap}</Typography>
      <Typography><strong>Line:</strong> {lbrData.line}</Typography>
      <Typography><strong>Shift:</strong> {lbrData.shift || "N/A"}</Typography>
      <Typography><strong>Target Quantity:</strong> {lbrData.targetQty}</Typography>
      <Typography><strong>No. of Positions:</strong> {lbrData.noOfPositions}</Typography>
      <Typography><strong>From:</strong> {new Date(lbrData.productionPlanFrom).toLocaleDateString()}</Typography>
      <Typography><strong>To:</strong> {new Date(lbrData.productionPlanEnd).toLocaleDateString()}</Typography>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={6}>
          <Typography variant="h6">Left (Odd Positions)</Typography>
          {left.map((pos) => (
            <Box
              key={pos}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: "#e3f2fd",
                border: "1px solid #ccc",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              Position {pos}
            </Box>
          ))}
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Right (Even Positions)</Typography>
          {right.map((pos) => (
            <Box
              key={pos}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: "#fce4ec",
                border: "1px solid #ccc",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              Position {pos}
            </Box>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
}

export default ViewLBR;
