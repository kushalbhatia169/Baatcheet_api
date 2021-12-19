import React from 'react';
import withWelcome from '../../common/welcome_hoc/with_welcome';

// const module = 'welcome';
const Home = (props) => {
  const { Header, Logo, PageContent } = props;

  return (
    <>
      {Header}
      {Logo}
      {PageContent}
    </>
  );
};

export default withWelcome(Home, 'Home');
