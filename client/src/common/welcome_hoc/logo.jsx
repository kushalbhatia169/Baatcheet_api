import React, { useState } from 'react';
import { Box } from '@mui/material';
//import BCLogo from '../../images/BC_white_logo.png';

const Logo = ({ module_name }) => {
  const [module] = useState(module_name);

  return (
    <Box className="d-flex welcome-logo align-items-center mt-5 flex-column">
      <Box className="d-flex flex-column heading content">
        <div className={`d-flex justify-content-center content__logo
         ${(module === 'Login' || module === 'Register')
         && 'content__logo--module'}`}>
          <span className="heading logo">Chat</span>
          <span className="heading logo">Bot</span>
          <span className="heading logo">!</span>
        </div>
      </Box>
      <h2 className="content__text heading">Lo Karlo Baat
        <span role="img" aria-label="" className="mb-2 fs-1" style={{color:'#fff'}}>🗣️</span>
      </h2>
    </Box>
  );
};

export default Logo;
