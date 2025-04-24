
import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';



// material-ui
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


//component for mapview
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


// project import
import MainCard from 'components/MainCard';
import { Grid } from '@mui/material';

// ==============================|| SAMPLE PAGE ||============================== //

export default function ViewMap() {

  const [data, setData] = useState([]);
  // const [loc, setLoc]=
  
 // Function to fetch data using Axios
 const fetchData = async () => {
 try {
      const response = await axios.get("http://localhost:4000/mqtt/getDeviceStates");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
 };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);



  // axios.get(`http://localhost:4000/mqtt/getDeviceStates`)
  //     .then(res => {
  //       // devices.push(res.data);
  //       setDevices(devices,res.data);
  //       // const devices = res.data;
  //       console.log('from state ' + devices.toString())
  //       // this.setState({ devices });
  //     })
  
  //Chennai
  const position = [13.0843, 80.2705];
  
  // Dharapuram 10.7369° N, 77.5258° E
  // const position = [10.7369, 77.5258];

  //Egmore Metro
  const egmore=[13.078378637966114, 80.26153240446209];
  const symbioteq = [12.964371785137024, 80.2450168073203];

  return (

    <MainCard fixed>


      <MapContainer 
        center={symbioteq} 
        zoom={16} 
        scrollWheelZoom={true}
        style={{ height: '75vh', width: '100wh' }}
        >
           <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />

                {data.filter(post => post.latitude && post.longitude).map((post) => (
                 
                                 <Marker position={[parseFloat(post.latitude), parseFloat(post.longitude)]}>
                                    <Popup>
                                        Pump No.: {post.deviceID}<br/>
                                        Status : {post.runState}
                                    </Popup>
                                    <Tooltip>
                                      Pump No.: {post.deviceID}
                                    </Tooltip>
                                 </Marker>     
                ))}
{/* 
          {data.map( (device) => {
              <Marker position={device.location}>
                <Popup>
                  device.deviceID
                </Popup>
              </Marker> 
            })} */}

{/* <Marker position={[12.96325309221214, 80.24592877799292]}>
             <Popup>
               Pump #1
             </Popup>
           </Marker> 
           */}


            {/* {devices.map((devices,i) => {
              <Marker position={devices.location}>
                <Popup>
                  devices.deviceID
                </Popup>
              </Marker> 
            })} */}
           
           {/* <Marker position={position}>
             <Popup>
               Pump #1
             </Popup>
           </Marker> 
           <Marker position={egmore}>
             <Popup>
                Welcome to Egmore Metro             
             </Popup>
           </Marker> 
           <Marker position={symbioteq}>
             <Popup>
                Symbioteq             
             </Popup>
           </Marker>  */}
    
    

         </MapContainer> 
    </MainCard>
   
  );
}
