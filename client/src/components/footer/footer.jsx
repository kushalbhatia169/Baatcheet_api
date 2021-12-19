import React from 'react';
import { Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './footer.scss';

const Footer = () => {
  const today = new Date();
  return (
    <Box className="footer mt-3 d-flex p-3 justify-content-between flex-wrap">
      <span>{today.getFullYear()} © BaatCheet Ltd.</span>
      <Box>
        <a href="my_app.com">Privacy Policy <ArrowForwardIosIcon /></a>
      </Box>
    </Box>
  );
};

export default Footer;
