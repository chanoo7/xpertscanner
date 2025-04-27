import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS (if using)
import '../style.css'; // Import your custom CSS for styling
import { Card, CardContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'; // Import Grid2

export default function QrDataView() {
  const [data, setData] = useState({
    stationId: null,
    timestamp: null,
    qr: null,
    status: null,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateCount, setUpdateCount] = useState(0); // Count updates

  const [history, setHistory] = useState([]);

  // useEffect(() => {
  //   if (data) {
  //     setHistory((prev) => [data, ...prev]); // Append new data at the top
  //   }
  // }, [data]);

  useEffect(() => {
    if (data && (history.length === 0 || JSON.stringify(data) !== JSON.stringify(history[0]))) {
      setHistory((prev) => [data, ...prev]);
    }
  }, [data]);
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/api/mqtt-data`);
        const newData = response.data;
  
        setData((prevData) =>
          JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData
        );
        setUpdateCount((prevCount) => prevCount + 1);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
  
    return () => clearInterval(intervalId);
  }, []);
  



  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100"> {/* Center the loader */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>; // Display error message with alert
  }

  return (
    <div className="dashboard-container">
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>



      <Grid2 container spacing={2}>
        {/* First Card */}
        <Grid2 xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">
                <strong>Station ID:</strong> {data.stationId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Updated:</strong>{" "}
                {data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : "N/A"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Data Receiving Count: <strong>{updateCount}</strong> {/* Show updates */}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Second Card */}
        <Grid2 xs={12} sm={6}>
          <Typography variant="h6">History:</Typography>
          {history.map((item, index) => (
            <Card variant="outlined" key={index} style={{ marginBottom: 8 }}>
              <CardContent>
                <Typography variant="body1">
                  <strong>Station ID:</strong> {item.stationId}
                </Typography>
                <Typography>
                  <strong>QR Code:</strong> {item.qr || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: item.status === "online" ? "green" : "red",
                    }}
                  >
                    {item.status || "N/A"}
                  </span>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid2>
      </Grid2>
    </div>
  );
}

