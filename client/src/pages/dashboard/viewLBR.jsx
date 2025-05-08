import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const processOptions = ["PREP", "CASE", "SEMI FINISH", "FINAL EDGE INKING", "INSPECT", "PASS", "REWORK"];

function ViewLBR() {
  const [lbrData, setLbrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [processMap, setProcessMap] = useState({});
  const [scannerInput, setScannerInput] = useState("");
  const [scannedPositions, setScannedPositions] = useState([]);

  useEffect(() => {
    fetchLBRData();
  }, []);

  const fetchLBRData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/getproductionplan`);
      const latest = res.data[res.data.length - 1];
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

  const handleBoxClick = (pos) => {
    setSelectedPosition(pos);
  };

  const handleProcessSelect = (process) => {
    setProcessMap((prev) => ({ ...prev, [selectedPosition]: process }));
    setSelectedPosition(null);
  };

  const handleScanInput = () => {
    const positions = scannerInput
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((n) => !isNaN(n));
    setScannedPositions(positions);
    setScannerInput("");
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

      <Box sx={{ my: 3 }}>
        <TextField
          label="Scanner Input (e.g., 1,3,5)"
          value={scannerInput}
          onChange={(e) => setScannerInput(e.target.value)}
          onBlur={handleScanInput}
          fullWidth
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6">Left (Odd Positions)</Typography>
          {left.map((pos) => (
            <Box
              key={pos}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: scannedPositions.includes(pos) ? "#fff3e0" : "#e3f2fd",
                border: "1px solid #ccc",
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => handleBoxClick(pos)}
            >
              Position {pos} <br />
              {processMap[pos] && <strong>Process:</strong>} {processMap[pos] || "Click to assign"}
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
                bgcolor: scannedPositions.includes(pos) ? "#fff3e0" : "#fce4ec",
                border: "1px solid #ccc",
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => handleBoxClick(pos)}
            >
              Position {pos} <br />
              {processMap[pos] && <strong>Process:</strong>} {processMap[pos] || "Click to assign"}
            </Box>
          ))}
        </Grid>
      </Grid>

      <Dialog open={selectedPosition !== null} onClose={() => setSelectedPosition(null)}>
        <DialogTitle>Select Process for Position {selectedPosition}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Process"
            onChange={(e) => handleProcessSelect(e.target.value)}
          >
            {processOptions.map((process) => (
              <MenuItem key={process} value={process}>
                {process}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPosition(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default ViewLBR;
