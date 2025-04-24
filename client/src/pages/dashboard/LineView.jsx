import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme, status }) => ({
  backgroundColor: status === "offline" ? theme.palette.error.main : theme.palette.success.main,
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  height: '100%',
}));

function LineView() {
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/summary")
      .then((res) => res.json())
      .then((data) => {
        const lineList = Array.from({ length: data.totalLines }, (_, i) => i + 1);
        setLines(lineList);

        if (lineList.length > 0) {
          setSelectedLine(lineList[0]);
          fetchStations(lineList[0]);
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const fetchStations = (lineId) => {
    fetch(`http://localhost:5000/lines/${lineId}/stations`)
      .then((res) => res.json())
      .then((data) => setStations(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching stations:", err);
        setStations([]);
      });
  };

  useEffect(() => {
    if (selectedLine) {
      fetchStations(selectedLine);
    }
  }, [selectedLine]);

  return (
    <Grid2 container spacing={3} sx={{ backgroundColor: "white", color: "black", minHeight: "100vh", padding: 4 }}>
      <Grid2 xs={12}>
        <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
          PRODUCTION MONITOR
        </Typography>
        <Select
          value={selectedLine || ""}
          onChange={(e) => {
            setSelectedLine(e.target.value);
            fetchStations(e.target.value);
          }}
          sx={{ width: "30%", color: "white", "& .MuiSelect-icon": { color: "black" } }}
        >
          {lines.map((line) => (
            <MenuItem key={line} value={line}>
              Line {line}
            </MenuItem>
          ))}
        </Select>
      </Grid2>

    

      {selectedLine && (
        <Grid2 container spacing={3} sx={{ padding: 3 }}>
          {stations.map((station) => (
            <Grid2 key={station.id} xs={12} xl={4} lg={4} md={6} sm={12}>
              <StyledCard status={station.status.toLowerCase()}>
                <CardContent>
                  <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
                    {station.name}
                  </Typography>

                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 xs={6}>
                      <Typography variant="body1">
                        <strong>Target:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2 xs={6}>
                      <TextField
                        value={station.target}
                        InputProps={{ readOnly: true }}
                        sx={{ width: "100%", textAlign: "end", "& .MuiInputBase-input":{textAlign: "end"}}}
                      />
                    </Grid2>

                    <Grid2 xs={6} mt={2}>
                      <Typography variant="body1">
                        <strong>Actual:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2 xs={6} mt={2}>
                      <TextField
                        value={station.actual}
                        InputProps={{ readOnly: true }}
                        sx={{ width: "100%", textAlign: "end", "& .MuiInputBase-input":{textAlign: "end"}}}
                      />
                    </Grid2>

                    <Grid2 xs={6} mt={2}>
                      <Typography variant="body1">
                        <strong>Gap:</strong>
                      </Typography>
                    </Grid2>
                    <Grid2 xs={6} mt={2}>
                      <TextField
                        value={station.target - station.actual}
                        InputProps={{ readOnly: true }}
                        sx={{ width: "100%", textAlign: "end", "& .MuiInputBase-input":{textAlign: "end"}}}
                      />
                    </Grid2>
                  </Grid2>
                </CardContent>
              </StyledCard>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Grid2>
  );
}

export default LineView;