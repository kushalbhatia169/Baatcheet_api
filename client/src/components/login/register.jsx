import React from 'react';
import withWelcome from '../../common/welcome_hoc/with_welcome';
import Page from './page';

const Register = (props) => {
  const { Header, Logo, PageContent } = props;

  return (
    <Page {...{ Header, Logo, PageContent, from: 'register' }} />
  );
};

export default withWelcome(Register, 'Register');