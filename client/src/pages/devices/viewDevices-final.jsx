
import React from "react";
import { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";

import axios from 'axios';



import PropTypes from 'prop-types';

// material-ui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// import Dot from '@mui/material/Dot';
import Dot from 'components/@extended/Dot';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import MapViewModal from './MapViewModal';
import DeviceConfiguration from "./deviceConfiguration";

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { FormOutlined, DiffOutlined, EnvironmentOutlined, SyncOutlined } from '@ant-design/icons';


// project import
import MUIDataTable from "mui-datatables";

//Custom - from Udaya
// import RSSIIndicator from './RSSIIndicator';
import RunStatus from './RunStatusIndicator';
import BatteryLevelIndicator from './BatteryLevelIndicator';
import CarrierStatusIndicator from "./CarrierDetailsIndicator";


// ==============================|| SAMPLE PAGE ||============================== //

export default function ViewReports() {

  const [open, setOpen] = React.useState(false);
  const [openConfig, setOpenConfig] = React.useState(false);
  const [location, setLocation] = React.useState([]);
  const [deviceId, setDeviceId] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenConfig = () => setOpenConfig(true);
  const handleCloseConfig = () => setOpenConfig(false);

  function onViewMap({lat,long}){
    setLocation([lat, long])
    handleOpen();
  }

  function onConfigChange({deviceId}){
    console.log('inside onConfigChange')
    setDeviceId(deviceId)
    console.log(deviceId)
    handleOpenConfig();
  }
  
  const columns = [
    {
      name: "slNo",
      label: "#",
      options: {
       filter: true,
       sort: true,
       setCellProps: () => ({style: {width:"20px"}})
      }
     },
    {
     name: "deviceID",
     label: "Device",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
      name: "location",
      label: "Location",
      options: {
       filter: true,
       sort: false,
      }
     },
     {
      name: "batteryLevel",
      label: "Battery Level",
      options: {
       filter: true,
       sort: false,
       customBodyRender: (value, tableMeta) => {
          let batteryLevel  =value.split(',')[0]
          let runState = value.split('-')[1]
        return (
          <>
          <BatteryLevelIndicator level={batteryLevel} />
            {/* <Typography>
              {`${batteryLevel}`}   
            </Typography> */}
          </>
        );
      }
    }
    },
    {
     name: "carrierDetails",
     label: "Carrier Details",
     options: {
      display: true,
      filter: true,
      sort: false,
      setCellProps: () => ({style: {width:"330px"}}),
      customBodyRender: (value, tableMeta) => {
        return(
          <>     
            <CarrierStatusIndicator value ={value} />
          </>
        );
        
    }
   },
     
    },
  
     {
      name: "runState",
      label: "Running Status",
      options: {
       filter: true,
       sort: false,
       customBodyRender: (value, tableMeta) => {
           return (
              <>
                <RunStatus status={value} />
              </>
          );
      }
      }
     },
    {
      name: "actions",
      label:"Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          let deviceId = value.split(',')[0] 
          let lat = value.split(',')[1]
          let long = value.split(',')[2]
          return (
            <>
                          <IconButton Tooltip ="Edit Configuration" onClick={onConfigChange.bind(this,{deviceId})}>
                            <FormOutlined />
                          </IconButton>
                          <IconButton Tooltip ="Reboot Device">
                            <SyncOutlined />
                          </IconButton>
                            <IconButton Tooltip ="View in Map" disabled ={ !(lat && long) } onClick={onViewMap.bind(this,{lat,long})}>
                              <EnvironmentOutlined />
                            </IconButton>
                          <IconButton Tooltip ="File a report">
                            <DiffOutlined />
                          </IconButton>
  
            </>
          );
  
        }
      }
  
    }
   ];
  
  
  const options = {
    filter: false,
    filterType: 'dropdown',
    responsive: 'standard',
    download:false,
    print:false,
    viewColumns:false,
    selectableRows: 'multiple',
    selectableRowsHideCheckboxes: true,
    rowsPerPageOptions:[5,10,20]
  };

  const [data, setData] = useState([]);
  // const [loc, setLoc]=

  // Function to fetch data using Axios
  const fetchData = async () => {
  try {
      const response = await axios.get("http://localhost:5000/accounts/allvendors");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  let rowData = data.map((item, index) => {
    return{
      slNo: index +1,
      deviceID: item.legalName,
      location: "undefined",
      carrierDetails:`${item.simNumber},${item.rssi},${item.networkName},${item.networkType}`,
      batteryLevel: item.batteryLevel + '-' + item.runState,
      runState: item.isClient,
      actions:  `${item.deviceID},${item.latitude || ""},${item.longitude  || ""}`
    };
  });
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const styleConfig = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <MUIDataTable data={rowData} columns={columns} options={options} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MapViewModal position={location} />
        </Box>
      </Modal>
      <Modal
        open={openConfig}
        onClose={handleCloseConfig}        
      >
        <Box sx={styleConfig}>
            <DeviceConfiguration deviceId={deviceId} />      
        </Box>
      </Modal>
    </>    
  );
}

RunStatus.propTypes = { status: PropTypes.number };

