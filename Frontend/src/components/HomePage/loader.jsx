import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Backdrop } from "@mui/material";

function CircularProgressWithLabel({ value, open }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        {/* <CircularProgress variant="determinate" value={v} /> */}
        <CircularProgress size={120} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography component="div" color="#ffffff" align="center">
            {`Loading model...`}
          </Typography>
          <Typography component="div" color="#ffffff" align="center">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    </Backdrop>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function CircularWithValueLabel({ progress, open }) {
  return <CircularProgressWithLabel value={progress} open={open} />;
}
