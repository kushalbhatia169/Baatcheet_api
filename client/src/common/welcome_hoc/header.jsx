import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import useGetRoute from '../use_Get_Route';

const Header = ({ module_name }) => {
  const [active, setActive] = useState(module_name || 'Home');

  return (
    <Box className="d-flex welcome-head justify-content-between">
      <Box className="d-flex logo m-2 p-2">
        <h2>BC!</h2>
      </Box>
      <Box className="d-flex m-2 p-2 mt-3 welcome-head__link">
        <HeadingLink {...{ isIcon: false, setActive, active }}>Home</HeadingLink>
        <HeadingLink {...{ isIcon: false, setActive, active }}>Login</HeadingLink>
        <HeadingLink {...{ isIcon: false, setActive, active }}>Register</HeadingLink>
        <HeadingLink {...{ isIcon: false, setActive, active }}>About Us</HeadingLink>
        <HeadingLink {...{ isIcon: false, setActive, active }}>FAQ</HeadingLink>
      </Box>
      <Box className="d-flex m-2 p-2 mt-3 icon welcome-head__link">
        <a href="https://twitter.com/?lang=en" className="ms-2 me-2 heading welcome-head__link__list"
          target="_blank" rel="noreferrer" title="twitter"><TwitterIcon /></a>
        <a href="https://www.facebook.com/" className="ms-2 me-2 heading welcome-head__link__list"
          target="_blank" rel="noreferrer" title="facebook"><FacebookIcon /></a>
        <a href="https://www.instagram.com/" className="ms-2 me-2 heading welcome-head__link__list"
          target="_blank" rel="noreferrer" title="instagram"><InstagramIcon /></a>
      </Box>
    </Box>
  );
};

const HeadingLink = ({ children, isIcon, setActive, active }) => {
  const history = useHistory();
  const { getRoute } = useGetRoute(),
        routePage = () => {
          setActive(children);
          history.push(`${getRoute(children)}`);
        };

  return <Box className={`ms-2 me-2 heading ${active === children && !isIcon && 'active'}
    welcome-head__link__list`} title={children} onClick={!isIcon && routePage}>
    {children}
  </Box>;
};

export default Header;
