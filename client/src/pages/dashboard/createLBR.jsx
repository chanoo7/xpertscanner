import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

export default function CreateLBR() {
  const [styles, setStyles] = useState([]);
  const [styleRouteMaps, setStyleRouteMaps] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [subProcesses, setSubProcesses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    styleId: "",
    styleRouteMapId: "",
    processId: "",
    subProcessId: "",
    line: 1,
    productionPlanFrom: null,
    productionPlanEnd: null,
    inputStyle: "",
    noOfPositions: 50,
    overallTargetQuantity: 0,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleSelect = (styleId) => {
    handleInputChange("styleId", styleId);
    fetchStyleRouteMapMasters(styleId); // Fetch route maps based on selected style
    setFormData((prev) => ({
      ...prev,
      styleRouteMapId: "",
      processId: "",
      subProcessId: "",
    }));
  };
  
  
  const handleRouteSelect = (routeMapId) => {
    handleInputChange("styleRouteMapId", routeMapId); // Update form data
    fetchStyleProcessMasters(routeMapId); // Fetch processes for the selected route map
    setFormData((prev) => ({
      ...prev,
      processId: "", // Reset process and sub-process IDs
      subProcessId: "",
    }));
  };
  
  
  
  const handleProcessSelect = (processId) => {
    handleInputChange("processId", processId);
    fetchStyleSubProcessMasters(processId); // Fetch sub-processes for selected process
    setFormData((prev) => ({
      ...prev,
      subProcessId: "",
    }));
  };
  
  // Fetch Style Masters (Initial Fetch)
const fetchStyleMasters = async () => {
  try {
    const response = await axios.post(
      "https://service.khexports.in/api/IOT/GetStyleMasters", // Replace with correct API endpoint
      {
        pFactoryID: "2",
        pLoggedInUserID: "2",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidmVyaWZ5IjoibGFtZGhhaWRoYWtuNjc4OTAwPD48Pmxramh1IiwiaWF0IjoxNjg0MjMyMzMyfQ.2u50OOphaOs13DiAv1Z8UaQ60Jog-qFDqknscXbrA40",
        },
      }
    );

    let originalString = response.data.Data;
    originalString = originalString.replace(/\\/g, "");
    const arrayString = `[${originalString}]`;
    const styleArray = JSON.parse(arrayString);

    setStyles(styleArray); // Store the fetched styles in the state
  } catch (error) {
    console.error("Error fetching style masters:", error);
  }
};

  // Fetch Style Route Map Masters (Filtered by Style ID)
  const fetchStyleRouteMapMasters = async (styleId) => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleRouteMapMasters",
        {
          pFactoryID: "2",
          pLoggedInUserID: "2",
          pStyleID: styleId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidmVyaWZ5IjoibGFtZGhhaWRoYWtuNjc4OTAwPD48Pmxramh1IiwiaWF0IjoxNjg0MjMyMzMyfQ.2u50OOphaOs13DiAv1Z8UaQ60Jog-qFDqknscXbrA40",
          },
        }
      );
  
      let originalString = response.data.Data;
      originalString = originalString.replace(/\\/g, "");
      const arrayString = `[${originalString}]`;
      const routeMapArray = JSON.parse(arrayString);
  
      // Filter route maps based on the selected styleId
      const filteredRouteMaps = routeMapArray.filter(
        (routeMap) => routeMap.StyleID === styleId
      );
  
      setStyleRouteMaps(filteredRouteMaps); // Set the filtered route maps
    } catch (error) {
      console.error("Error fetching style route map masters:", error);
    }
  };
  
  
  // Fetch Style Process Masters (Filtered by Route Map ID)
  const fetchStyleProcessMasters = async (routeMapId) => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleProcessMasters",
        {
          pFactoryID: "2",
          pLoggedInUserID: "2",
          pStyleRouteMapID: routeMapId, // Send the selected route map ID
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidmVyaWZ5IjoibGFtZGhhaWRoYWtuNjc4OTAwPD48Pmxramh1IiwiaWF0IjoxNjg0MjMyMzMyfQ.2u50OOphaOs13DiAv1Z8UaQ60Jog-qFDqknscXbrA40",
          },
        }
      );
  
      let originalString = response.data.Data;
      originalString = originalString.replace(/\\/g, "");
      const arrayString = `[${originalString}]`;
      const processArray = JSON.parse(arrayString);
  
      // Filter the processes by the selected RouteMapID
      const filteredProcesses = processArray.filter(
        (process) => process.StyleRouteMapID === routeMapId
      );
  
      // Set the filtered processes into state
      setProcesses(filteredProcesses);
    } catch (error) {
      console.error("Error fetching style process masters:", error);
    }
  };
  
  
  
  
  // Fetch Style Sub-Process Masters (Filtered by Process ID)
  const fetchStyleSubProcessMasters = async (processId) => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleSubProcessMasters",
        {
          pFactoryID: "2",
          pLoggedInUserID: "2",
          pStyleProcessID: processId, // Assuming processId is required as a parameter
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidmVyaWZ5IjoibGFtZGhhaWRoYWtuNjc4OTAwPD48Pmxramh1IiwiaWF0IjoxNjg0MjMyMzMyfQ.2u50OOphaOs13DiAv1Z8UaQ60Jog-qFDqknscXbrA40",
          },
        }
      );
  
      let originalString = response.data.Data;
      originalString = originalString.replace(/\\/g, "");
      const arrayString = `[${originalString}]`;
      const subProcessArray = JSON.parse(arrayString);
  
      setSubProcesses(subProcessArray);
    } catch (error) {
      console.error("Error fetching style sub-process masters:", error);
    }
  };
  

  useEffect(() => {
    fetchStyleMasters();
  }, []);

  
  const handleSubmit = () => {
    if (
      formData.productionPlanEnd &&
      formData.productionPlanFrom &&
      formData.productionPlanEnd < formData.productionPlanFrom
    ) {
      alert("End date must be after start date");
      return;
    }

    setIsCreating(true);

    setTimeout(() => {
      console.log("Submitted:", formData);
      setIsCreating(false);
      alert("LBR Created!");
    }, 1000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: 450,
            padding: 4,
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom fontWeight="600">
            Create LBR
          </Typography>

          <Stack spacing={2}>
            {/* Style */}
            <FormControl fullWidth size="small">
              <InputLabel>Style</InputLabel>
              <Select
                value={formData.styleId}
                label="Style"
                onChange={(e) => handleStyleSelect(e.target.value)}
              >
                {styles.map((style) => (
                  <MenuItem key={style.StyleID} value={style.StyleID}>
                    {style.KHStyleDescription}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Style Route Map */}
            <FormControl fullWidth size="small" disabled={!styleRouteMaps.length}>
              <InputLabel>Style Route Map</InputLabel>
              <Select
                value={formData.styleRouteMapId}
                label="Style Route Map"
                onChange={(e) => handleRouteSelect(e.target.value)}
              >
                {styleRouteMaps.map((routeMap) => (
                  <MenuItem key={routeMap.StyleRouteMapID} value={routeMap.StyleRouteMapID}>
                    {routeMap.Descriptions}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Process */}
            <FormControl fullWidth size="small" disabled={!processes.length}>
              <InputLabel>Process</InputLabel>
              <Select
                value={formData.processId}
                label="Process"
                onChange={(e) => handleProcessSelect(e.target.value)}
              >
                {processes.map((process) => (
                  <MenuItem key={process.ProcessID} value={process.ProcessID}>
                    {process.ProcessDescription}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>



            {/* Sub-Process */}
            <FormControl fullWidth size="small" disabled={!subProcesses.length}>
              <InputLabel>Sub-Process</InputLabel>
              <Select
                value={formData.subProcessId}
                label="Sub-Process"
                onChange={(e) => handleInputChange("subProcessId", e.target.value)}
              >
                {subProcesses.map((subProcess) => (
                  <MenuItem key={subProcess.SubProcessID} value={subProcess.SubProcessID}>
                    {subProcess.SubProcessDescription}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              disabled={isCreating}
            >
              {isCreating ? (
                <CircularProgress size={24} />
              ) : (
                "Create LBR"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
