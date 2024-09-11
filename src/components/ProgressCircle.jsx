import React from "react";
import { Box } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  const angle = progress * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(${grey[300]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${red[500]} ${angle}deg 360deg),
            ${green[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
