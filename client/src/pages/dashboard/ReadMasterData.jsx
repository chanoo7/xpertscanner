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

export default function ReadMasterData() {
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
    setFormData((prev) => ({
      ...prev,
      [field]: field === "subProcessId" ? Number(value) : value,
    }));
  };

  const handleStyleSelect = (styleId) => {
    handleInputChange("styleId", styleId);
    fetchStyleRouteMapMasters(styleId);
    setFormData((prev) => ({
      ...prev,
      styleRouteMapId: "",
      processId: "",
      subProcessId: "",
    }));
  };

  const handleRouteSelect = (routeMapId) => {
    handleInputChange("styleRouteMapId", routeMapId);
    fetchStyleProcessMasters(routeMapId);
    setFormData((prev) => ({
      ...prev,
      processId: "",
      subProcessId: "",
    }));
  };

  const handleProcessSelect = (processId) => {
    handleInputChange("processId", processId);
    fetchStyleSubProcessMasters(processId);
    setFormData((prev) => ({
      ...prev,
      subProcessId: "",
    }));
  };

  const fetchStyleMasters = async () => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleMasters",
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

      setStyles(styleArray);
    } catch (error) {
      console.error("Error fetching style masters:", error);
    }
  };

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

      const filteredRouteMaps = routeMapArray.filter(
        (routeMap) => routeMap.StyleID === styleId
      );

      setStyleRouteMaps(filteredRouteMaps);
    } catch (error) {
      console.error("Error fetching style route map masters:", error);
    }
  };

  const fetchStyleProcessMasters = async (routeMapId) => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleProcessMasters",
        {
          pFactoryID: "2",
          pLoggedInUserID: "2",
          pStyleRouteMapID: routeMapId,
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

      const filteredProcesses = processArray.filter(
        (process) => process.StyleRouteMapID === routeMapId
      );
      setProcesses(filteredProcesses);
    } catch (error) {
      console.error("Error fetching style process masters:", error);
    }
  };

  const fetchStyleSubProcessMasters = async (processId) => {
    try {
      const response = await axios.post(
        "https://service.khexports.in/api/IOT/GetStyleSubProcessMasters",
        {
          pFactoryID: "2",
          pLoggedInUserID: "2",
          pStyleProcessID: processId,
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

      const filteredProcesses = subProcessArray.filter(
        (process) => process.StyleProcessID === processId
      );
      setSubProcesses(filteredProcesses);
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
            Read Master Data
          </Typography>

          <Stack spacing={2}>
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

            <FormControl fullWidth size="small">
              <InputLabel>Route Map</InputLabel>
              <Select
                value={formData.styleRouteMapId}
                label="Route Map"
                onChange={(e) => handleRouteSelect(e.target.value)}
              >
                {styleRouteMaps.map((route) => (
                  <MenuItem key={route.StyleRouteMapID} value={route.StyleRouteMapID}>
                    {route.Descriptions}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Process</InputLabel>
              <Select
                value={formData.processId}
                label="Process"
                onChange={(e) => handleProcessSelect(e.target.value)}
              >
                {processes.map((proc) => (
                  <MenuItem key={proc.StyleProcessID} value={proc.StyleProcessID}>
                    {proc.ProcessName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Sub Process</InputLabel>
              <Select
                value={formData.subProcessId}
                label="Sub Process"
                onChange={(e) => handleInputChange("subProcessId", e.target.value)}
              >
                {subProcesses.map((sub) => (
                  <MenuItem key={sub.ProcessID} value={sub.ProcessID}>
                    {sub.ProcessName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Line Selection */}
            <FormControl fullWidth size="small">
              <InputLabel>Line</InputLabel>
              <Select
                value={formData.line}
                label="Line"
                onChange={(e) => handleInputChange("line", e.target.value)}
              >
                {[...Array(10).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Line {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* No. of Positions */}
            <TextField
              label="No. of Positions"
              type="number"
              fullWidth
              size="small"
              value={formData.noOfPositions}
              onChange={(e) => handleInputChange("noOfPositions", Number(e.target.value))}
            />

            {/* Overall Target Quantity */}
            <TextField
              label="Overall Target Quantity"
              type="number"
              fullWidth
              size="small"
              value={formData.overallTargetQuantity}
              onChange={(e) =>
                handleInputChange("overallTargetQuantity", Number(e.target.value))
              }
            />

            {/* Production Plan Start Date */}
            <DatePicker
              label="Production Plan Start Date"
              value={formData.productionPlanFrom}
              onChange={(newValue) => handleInputChange("productionPlanFrom", newValue)}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />

            {/* Production Plan End Date */}
            <DatePicker
              label="Production Plan End Date"
              value={formData.productionPlanEnd}
              onChange={(newValue) => handleInputChange("productionPlanEnd", newValue)}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />

            {/* <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              disabled={isCreating}
            >
              {isCreating ? <CircularProgress size={24} /> : "Create LBR"}
            </Button> */}
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
