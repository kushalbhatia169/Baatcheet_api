import React from 'react';
import { Box } from '@mui/material';

import Header from './header';
import Logo from './logo';
import PageContent from './page_content';
import './with_welcome.scss';

const withWelcome = (Module, module_name) => {
  const Welcome = ({ ...props }) => {
    const { location: { from } } = props;

    return <Box className="d-flex flex-column flex-wrap welcome-main">
      <Module {...{
        Header: <><Header {...{ module_name, from }} /></>,
        Logo: <><Logo {...{ module_name, from }} /></>,
        PageContent: <><PageContent /></>,
        props,
      }} />
    </Box>;
  };
  return Welcome;
};

export default withWelcome;
