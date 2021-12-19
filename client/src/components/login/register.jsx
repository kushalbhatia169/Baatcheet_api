import React from 'react';
import withWelcome from '../../common/welcome_hoc/with_welcome';
import LoginRegisterPage from './login_register_page';

const Register = (props) => {
  const { Header, Logo, PageContent } = props;

  return (
    <LoginRegisterPage {...{ Header, Logo, PageContent, from: 'register' }} />
  );
};

export default withWelcome(Register, 'Register');