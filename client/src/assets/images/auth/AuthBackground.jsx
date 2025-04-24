// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// import logo from 'assets/images/logo_part.svg';

import logo from 'assets/images/auth/water.png';


// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(12px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
          <img src={logo} alt="xpert" width="100%" />

    </Box>
  );
}
