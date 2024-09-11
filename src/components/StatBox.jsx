import React from "react";
import { Box, Typography } from "@mui/material";
import ProgressCircle from "./ProgressCircle";
import { green, grey } from "@mui/material/colors";

const StatBox = ({ cantidad, producto, icon, progress, disponible }) => {
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h6" fontWeight="bold" sx={{ color: grey[900] }}>
            {cantidad}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h" sx={{ color: green[500] }}>
          {producto}
        </Typography>
        <Typography variant="h" sx={{ color: green[500] }}>
          {disponible}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;

//COPIA POR SI LA EMBARRO
// import React from "react";
// import { Box, Typography } from "@mui/material";
// import ProgressCircle from "./ProgressCircle";
// import { green, grey } from "@mui/material/colors";

// const StatBox = ({ title, subtitle, icon, progress, disponible }) => {
//   return (
//     <Box width="100%" m="0 30px">
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Box>
//           <Typography variant="h4" fontWeight="bold" sx={{ color: grey[900] }}>
//             {title}
//           </Typography>
//           <Typography variant="h6" sx={{ color: grey[500] }}>
//             {subtitle}
//           </Typography>
//         </Box>
//         <Box>
//           {icon}
//         </Box>
//       </Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mt="10px">
//         <ProgressCircle progress={progress} />
//         <Typography variant="h5" sx={{ color: green[500] }}>
//           {disponible}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default StatBox;
