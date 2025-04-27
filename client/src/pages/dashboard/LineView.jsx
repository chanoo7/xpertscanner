import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import axios from "axios";

const getColorForStyle = (styleId) => {
  const colorMap = {
    1: "#ff33a8", // Pink
    2: "#f4d03f", // Yellow
    3: "#16a085", // Teal    
    4: "#ff5733", // Red-Orange
    5: "#33ff57", // Green
    6: "#3357ff", // Blue
  };

  return colorMap[styleId] || `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Fallback random color
};

// Styled Card Component
const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.violet.main, // Use prop or theme color
  color: 'rgb(0 0 0 / 83%)', // Automatically adjust text color
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& .number": {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
}));

// ✅ Watches styles for changes

function LineView() {
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [styles, setStyles] = useState([]); // ✅ Ensure it's always an array
  const [loading, setLoading] = useState(); // ✅ Loading state
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/product/summary`)
      .then((response) => {
        //console.log("Summary Data:", response.data);
        const totalLines = response?.data?.data?.totalLines || 0;
        const lineList = Array.from({ length: totalLines }, (_, i) => i + 1);
        setLines(lineList);
        setLoading(false);

        if (lineList.length > 0) {
          setSelectedLine(lineList[0]);
          fetchStyles(lineList[0]); // ✅ Fetch styles after setting selected line
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error);
        setLoading(false);
      });
  }, []);


  const fetchStyles = async (lineId) => {
    console.log("Fetching styles for:", lineId);

    setStyles([]);  // ✅ Clear styles before fetching
    setRenderKey((prev) => prev + 1); // 👈 Force re-render

    try {
      if (lineId === "All") {
        console.log("Fetching all lines...");

        const requests = lines.map((line) =>
          axios.get(`${import.meta.env.VITE_API_URL}/product/lines/${line}/stations`)
        );

        const responses = await Promise.all(requests);
        let allStyles = [];

        responses.forEach((response, index) => {
          const stations = response?.data?.data || [];
          const styleMap = new Map();

          stations.forEach((station) => {
            if (station.styleId && !styleMap.has(station.styleId)) {
              styleMap.set(station.styleId, {
                id: station.styleId,
                lineID: lines[index],
                name: station.styleName || `Style ${station.styleId}`,
                target: station.target,
                actual: station.actual,
                gap: station.target - station.actual,
                stations: [],
              });
            }
            const style = styleMap.get(station.styleId);
            if (style) style.stations.push(station);
          });

          allStyles = [...allStyles, ...Array.from(styleMap.values())];
        });

        setStyles(allStyles);
      } else {
        console.log(`Fetching styles for line ${lineId}...`);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/lines/${lineId}/stations`);
        const stations = response?.data?.data || [];
        const styleMap = new Map();

        stations.forEach((station) => {
          if (station.styleId && !styleMap.has(station.styleId)) {
            styleMap.set(station.styleId, {
              id: station.styleId,
              lineID: lineId,
              name: station.styleName || `Style ${station.styleId}`,
              target: station.target,
              actual: station.actual,
              gap: station.target - station.actual,
              stations: [],
            });
          }
          const style = styleMap.get(station.styleId);
          if (style) style.stations.push(station);
        });

        setStyles(Array.from(styleMap.values()));
      }
    } catch (error) {
      console.error("Error fetching styles:", error);
      setStyles([]);  // ✅ Ensure styles reset even on error
    } finally {
      setLoading(false);
    }
  };


  return (
    <Grid2 container spacing={3} sx={{ backgroundColor: "white", color: "black", minHeight: "50vh", padding: 1 }} key={renderKey}>

      <Grid2 xs={12} >
        <Typography variant="h3" align="center" fontWeight="bold" mb={1}>
          PRODUCTION MONITOR
        </Typography>

        <Select
          value={selectedLine || ""}
          onChange={(e) => {
            const newLine = e.target.value;
            console.log("Selected Line:", newLine);

            setStyles([]); // ✅ Clear immediately
            setRenderKey((prev) => prev + 1); // 👈 Ensure a UI reset
            setSelectedLine(newLine);
            fetchStyles(newLine);
          }}
          sx={{ width: "30%", color: "black", "& .MuiSelect-icon": { color: "black" } }}
        >
          <MenuItem value="All">All</MenuItem>
          {lines.map((line) => (
            <MenuItem key={line} value={line}>
              Line {line}
            </MenuItem>
          ))}
        </Select>



      </Grid2>

      {loading ? (
        <Grid2 xs={12} display="flex" justifyContent="center">
          <CircularProgress />
        </Grid2>
      ) : (
        <Grid2 container spacing={3} sx={{ padding: 3 }}>
          {styles.length > 0 ? (
            styles.map((style) => (
              <Grid2 key={style.id} xs={12} xl={4} lg={4} md={6} sm={12}>
                <StyledCard bgcolor={getColorForStyle(style.id)}>
                  <CardContent>
                  <Grid2 style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant="h4" fontWeight="bold" mb={2} style={{ textAlign: "left" }}>
                    Line {style.lineID} 
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" style={{ textAlign: "right" }}>
                        {style.name}
                    </Typography>
                </Grid2>
          
                   
                    {/* Display aggregated Target, Actual, and Gap */}
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={6}>
                        <Typography variant="h4"><strong>Target:</strong></Typography>
                      </Grid2>
                      <Grid2 xs={6} >
                        <TextField
                          value={style.target || 0}
                          InputProps={{ readOnly: true }}
                          sx={{
                            width: "100%",
                            textAlign: "end",
                            "& .MuiInputBase-input": {
                              textAlign: "end",
                              fontWeight: "bold",
                              fontSize: "30px",  // Adjust size as needed
                              color: "black",  // Adjust text color
                              backgroundColor: "white",  // Set background color to white
                              borderRadius: "5px",  // Optional: Add rounded corners
                              padding: "5px",  // Optional: Add padding for better appearance
                            },
                          }}
                        />
                      </Grid2>

                      <Grid2 xs={6} mt={2}>
                        <Typography variant="h4"><strong>Actual:</strong></Typography>
                      </Grid2>
                      <Grid2 xs={6} mt={2}>
                        <TextField
                          value={style.actual || 0}
                          InputProps={{ readOnly: true }}
                          sx={{
                            width: "100%",
                            textAlign: "end",
                            "& .MuiInputBase-input": {
                              textAlign: "end",
                              fontWeight: "bold",
                              fontSize: "30px",  // Adjust size as needed
                              color: "black",  // Adjust text color
                              backgroundColor: "white",  // Set background color to white
                              borderRadius: "5px",  // Optional: Add rounded corners
                              padding: "5px",  // Optional: Add padding for better appearance
                            },
                          }}
                        />
                      </Grid2>

                      <Grid2 xs={6} mt={2}>
                        <Typography variant="h4"><strong>Gap:</strong></Typography>
                      </Grid2>
                      <Grid2 xs={6} mt={2}>
                        <TextField
                          value={style.gap || 0}
                          InputProps={{ readOnly: true }}
                          sx={{
                            width: "100%",
                            textAlign: "end",
                            "& .MuiInputBase-input": {
                              textAlign: "end",
                              fontWeight: "bold",
                              fontSize: "30px",  // Adjust size as needed
                              color: "black",  // Adjust text color
                              backgroundColor: "white",  // Set background color to white
                              borderRadius: "5px",  // Optional: Add rounded corners
                              padding: "5px",  // Optional: Add padding for better appearance
                            },
                          }}
                        />
                      </Grid2>
                    </Grid2>


                    {style.stations.length > 0 ? (
                      <Typography variant="h5" sx={{ marginTop: 1 }}>
                        Station {style.stations[0]?.id} to {style.stations[style.stations.length - 1]?.id}
                        {/* Stations: {style.stations.map(station => station.id).join(", ")} */}
                      </Typography>
                    ) : (
                      <Typography variant="h2" sx={{ marginTop: 1 }}>
                        No Stations Available
                      </Typography>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid2>
            ))
          ) : (
            <Grid2 xs={12} display="flex" justifyContent="center">
              <Typography variant="h6">No styles available</Typography>
            </Grid2>
          )}
        </Grid2>
      )}
    </Grid2>
  );
}



export default LineView;
