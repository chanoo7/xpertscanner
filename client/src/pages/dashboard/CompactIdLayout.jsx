import React, { useState } from "react";
import { Grid, Typography, Popover, Box } from "@mui/material";
import { styled } from '@mui/system';

// Styled Components
const LayoutDiv = styled('div')(({ theme, color }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  border: '1px solid #ccc',
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color || 'transparent',
}));

const ConveyorBox = styled(Box)(({ color }) => ({
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  writingMode: 'vertical-lr',
  textOrientation: 'upright',
}));

const CompactIdLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };
  const data = {
    "title": "COMPACT ID LAYOUT",
    "sections": [
      {
        "leftItems": ["", "IOT 1", "IOT 3", "", "", "IOT 5", "", "IOT 7", ""],
        "rightItems": ["", "IOT 2", "", "IOT 4", "", "IOT 6", "", "", "IOT 8"],
        "leftProcesses": [
          { "label": "WIP STORAGE", "color": "#9595cb" },
          { "label": "PATTI HEATING" },
          { "label": "PATTI PRIMER 2" },
          { "label": "DRYING TABLE" },
          { "label": "PATTI PASTING" },
          { "label": "PATTI ATTACHING" },
          { "label": "TABLE" },
          { "label": "STAMP ATTACHING" },
          { "label": "RE-CUTTING" }
        ],
        "rightProcesses": [
          { "label": "WIP STORAGE", "color": "#9595cb" },
          { "label": "PATTI PRIMER 1" },
          { "label": "DRYING TABLE" },
          { "label": "PATTI EDGE INKING" },
          { "label": "DRYING TABLE" },
          { "label": "PATTI LINING STITCHING" },
          { "label": "TABLE" },
          { "label": "STAMP PASTING" },
          { "label": "EMBOSSING" }
        ],
        "conveyorColor": "#efcca2"
      },
      {
        "leftItems": [
          "IOT 10", "", "IOT 12", "", "IOT 14", "IOT 16", "", "IOT 18",
          "IOT 21", "IOT 22", "IOT 24"
        ],
        "rightItems": [
          "IOT 9", "IOT 11", "", "IOT 13", "IOT 15", "IOT 17", "",
          "IOT 19", "IOT 20", "IOT 23", "IOT 25"
        ],
        "leftProcesses": [
          { "label": "PKT LAMPING" },
          { "label": "PKT HEATING" },
          { "label": "PKT EDGE INKING" },
          { "label": "WALLET CASE PASTING" },
          { "label": "WALLET CASE LAMPING" },
          { "label": "CASE & DIVIDER PRIMER" },
          { "label": "DRYING TABLE" },
          { "label": "ADDON CASE PASTING" },
          { "label": "LABEL & DIVIDER ATTACHING" },
          { "label": "ADDON FINAL PASTING" },
          { "label": "ADDON FINAL ATTACHING" }
        ],
        "rightProcesses": [
          { "label": "PKT STITCHING " },
          { "label": "PKT PRIMER 1" },
          { "label": "PKT PRIMER 2" },
          { "label": "WALLET CASE ATTACHING" },
          { "label": "WALLET CASE STITCHING" },
          { "label": "CASE & DRIVER EI" },
          { "label": "DRYING TABLE" },
          { "label": "ADDON CASE ATTACHING" },
          { "label": "LABEL & DRIVER PASTING" },
          { "label": "WALLET FINAL PASTING" },
          { "label": "WALLET FINAL ATTACHING" }
        ],
        "conveyorColor": "#efcca2"
      },
      {
        "leftItems": ["IOT 27", "IOT 29", "IOT 30", "", "IOT 31", "IOT 32", "IOT 35", "", "IOT 37"],
        "rightItems": ["IOT 26", "IOT 28", "", "", "IOT 33", "IOT 34", "IOT 36", "", ""],
        "leftProcesses": [
          { "label": "ADDON FINAL STITCHING" },
          { "label": "UV CLEANING " },
          { "label": "INLINE QA" },
          { "label": "HEATING" },
          { "label": "FINAL PROMOTER" },
          { "label": "FINAL PRIMER 01" },
          { "label": "FINAL PRIMER 04" },
          { "label": "TABLE" },
          { "label": "CLEANING" }
        ],
        "rightProcesses": [
          { "label": "FINAL WALLET STITCHING" },
          { "label": "FINAL LAMPING" },
          { "label": "TABLE" },
          { "label": "PRESSING" },
          { "label": "FINAL PRIMER 02" },
          { "label": "FINAL PRIMER 03" },
          { "label": "FINAL EDGEINKING" },
          { "label": "FINAL EI QA" },
          { "label": "CLEANING" }
        ],
        "conveyorColor": "#efcca2",
        "inspection": [
          {
            "label": "FINAL INSPECTION",
            "iot": "IOT 38"
          }
        ]
      },
      {
        "leftItems": ["", ""],
        "rightItems": ["", ""],
        "leftProcesses": [
          { "label": "FG QA" },
          { "label": "PACKING " }
        ],
        "rightProcesses": [
          { "label": "TABLE" },
          { "label": "PACKING" }
        ],
        "conveyorColor": "#efcca2"
      }
    ]
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px' }} justifyContent="center">
      {/* Title */}
      <Grid item xs={10} style={{ textAlign: 'center' }} >
        <Typography variant="h4">{data.title}</Typography>
      </Grid>
      <Grid item xs={10} style={{ textAlign: 'center' }} >
        <LayoutDiv color="#16822a">
          <Typography variant="subtitle1">ASSEMBLY START</Typography>
        </LayoutDiv>
      </Grid>
      {/* Render Each Section */}
      {data.sections.map((section, index) => (
        <Grid item xs={12} container spacing={2} key={index} justifyContent="center">
          {/* Left IOT Column */}
          <Grid item xs={1} style={{ textAlign: 'center' }}               onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {section.leftItems.map((label, i) => (
              <LayoutDiv key={i} color={label ? "#63638d" : "white"}>
                <Typography variant="subtitle2" style={{color: 'white'}}>{label}</Typography>
              </LayoutDiv>
            ))}
            <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMouseLeave}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <div style={{ padding: "10px", minWidth: "200px" }}>
              <Typography variant="body1">
                I'll appear when you hover over the button.
              </Typography>
            </div>
          </Popover>
          </Grid>

          {/* Left Process Column */}
          <Grid item xs={3} style={{ textAlign: 'center' }}>
          {section.leftProcesses.map((process, i) => (
            <LayoutDiv key={i} color={process.label.includes("QA") ? "red" : process.color}>
              <Typography variant="subtitle2" style={{ color: 'black' }}>{process.label}</Typography>
            </LayoutDiv>
          ))}
        </Grid>

         
         {/* Conveyor in Center */}
          <Grid item xs={0.5} style={{ display: "flex", flexDirection: "column" }}>
            <Box style={{ height: "100%", display: "flex", alignItems: "stretch" }}>
              <ConveyorBox color={section.conveyorColor} style={{ flexGrow: 1 }}>
                CONVEYOR
              </ConveyorBox>
            </Box>
          </Grid>

          {/* Right Process Column */}
          <Grid item xs={3} style={{ textAlign: 'center' }}>
            {section.rightProcesses.map((process, i) => (
              <LayoutDiv key={i} color={process.label.includes("QA") ? "red" : process.color}>
                <Typography variant="subtitle2" style={{ color: 'black' }}>{process.label}</Typography>
              </LayoutDiv>
            ))}
          </Grid>

          {/* Right IOT Column */}
          <Grid item xs={1} style={{ textAlign: 'center' }}>
            {section.rightItems.map((label, i) => (
              <LayoutDiv key={i} color={label ? "#63638d" : "white"}>
                <Typography variant="subtitle2" style={{ color: label ? 'white' : 'black' }}>
                  {label}
                </Typography>
              </LayoutDiv>
            ))}
          </Grid>
          {/* Inspection Full Width */}
          {section.inspection && (
                <Grid item xs={12} container spacing={2} justifyContent="center">
                  {/* Left IOT Column */}
                  <Grid item xs={1} style={{ textAlign: 'center' }}>
                    <LayoutDiv color={"#63638d"}>
                      <Typography variant="subtitle2" style={{ color: 'white' }}>
                      {section.inspection[0]?.iot || "IOT 38"} {/* Dynamically load IOT */}
                      </Typography>
                    </LayoutDiv>
                  </Grid>

                  {/* FINAL INSPECTION spans remaining columns */}
                  <Grid item xs={7.5} style={{ textAlign: 'center' }}>
                    <LayoutDiv color="red">
                      <Typography variant="subtitle2" style={{ color: 'white' }}>
                      {section.inspection[0]?.label || "FINAL INSPECTION"} {/* Dynamic label */}
                      </Typography>
                    </LayoutDiv>
                  </Grid>
                </Grid>
              )}
          <Grid item xs={8} style={{ textAlign: 'center' }}>
            <Box style={{ height: '40px' }}></Box> {/* Adjust height as needed */}
          </Grid>

        </Grid>
       
      ))}
     <Grid item xs={10} style={{ textAlign: 'center' }}>
        <LayoutDiv color="#16822a">
          <Typography variant="subtitle1">ASSEMBLY END</Typography>
        </LayoutDiv>
      </Grid>
    </Grid>
  );
};

export default CompactIdLayout;
