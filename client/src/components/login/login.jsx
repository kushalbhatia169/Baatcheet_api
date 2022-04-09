import React from 'react';
import withWelcome from '../../common/welcome_hoc/with_welcome';
import Page from './page';

const Login = (props) => {
  const { Header, Logo, PageContent } = props;

  return (
    <Page {...{ Header, Logo, PageContent, from: 'login' }} />
  );
};

export default withWelcome(Login, 'Login');
