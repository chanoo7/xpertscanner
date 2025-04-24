import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RoomView from "./RoomView";
import Grid from '@mui/system/Unstable_Grid';

import MFM from './MFM';
import HWThermostat from './HWThermostat';


// import DataDisplayComponent from './DataDisplayComponent'; 

import { Thermostat } from '@mui/icons-material';

export default function AccordionExpandIcon() {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">6th Floor</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2}>
        <Grid item xs={1.5}>
            <RoomView/>
          </Grid>        
            
              <Grid item xs={4}>
                <HWThermostat/>
              </Grid>
              <Grid item xs={1.5}>
                <MFM/>
              </Grid>
        </Grid>
        

        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">7th Floor</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {/* <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp; */}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">8th Floor</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {/* <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp;
        <RoomView></RoomView> &nbsp;&nbsp;&nbsp;&nbsp; */}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
