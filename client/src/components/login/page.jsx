import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router';
import Form from './form';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';
import firebase from '../../firebase';
import Checkotp from './checkOtp';
import './login.scss';
import { setCookie } from '../../common/globalCookies';
import { showMessage } from '../../common/showMessages';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/userSlice';

const Page = (props) => {
  const { state, dispatch: dispatchContext } = useContext(context);
  const { Header, Logo, PageContent, from } = props,
        [captchaContainer, setCaptchaContainer] = useState(),
        dispatch = useDispatch(),
        history = useHistory(),
        [isOtp, setIsOtp] = useState(false);

  const apiCallLogin = props = e => {
    const { username, password, phone, email } = e;
    const obj = { url: state.config.baseUrl + state.config.loginUser };
    const data = { username, password };
    APICallManager.getCall(obj, data, async (res) => {
      const notVerify = res.message.split(' ').find(word => word.includes('verify'));
      const isPhone = res.message.split(' ').find(word => word.includes('phone'));
      const isEmail = res.message.split(' ').find(word => word.includes('email'));
      if (!res.success && notVerify) {
        isPhone && setCaptchaContainer(<div id="recaptcha-container"></div>);
        isPhone && onSignInSubmit(phone.replace(/\D+/g, ''), email, password, username, notVerify);
        !isPhone && isEmail && APICallManager.postCall(obj, data, async (res) => {
          dispatchContext({ type: 'userData', payload: { ...res.data } });
          dispatch(setUser({...res.data}));
        });
        !isEmail && dispatchContext({ type: 'userData', payload: { ...res.data } });
        !isEmail && dispatch(setUser({...res.data}));
        return;
      }
      else if (res.success) {
        setCookie('token', res.data.jwt, 1);
        dispatchContext({ type: 'userData', payload: { ...res.data, isLoggedIn: true } });
        dispatch(setUser({...res.data, isLoggedIn: true}));
        history.push('/chats');
      }
    });
  };

  const apiCallRegister = props = e => {
    const { username, password, phone, email } = e;
    dispatchContext({ type: 'userData', payload: { ...e } });
    dispatch({...e});
    setCaptchaContainer(<div id="recaptcha-container"></div>);
    onSignInSubmit(phone.replace(/\D+/g, ''), email, password, username);
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //onSignInSubmit();
      },
      defaultCountry: 'IN',
    });
  };

  const onSignInSubmit = async (phone, email, password, username, notVerify) => {
    //event.preventDefault();
    configureCaptcha();
    const phoneNumber = '+91' + phone;
    const appVerifier = window.recaptchaVerifier;
    const obj = { url: state.config.baseUrl };
    const data = { username, password, phoneNumber: parseInt(phone.replace(/\D+/g, '')), email };
    !notVerify && APICallManager.postCall(obj, data, async (res) => {
      if (res.success) {
        await sendOtp(phoneNumber, appVerifier);
      }
      dispatchContext({ type: 'userData', payload: { ...res.data } });
    });
    notVerify && await sendOtp(phoneNumber, appVerifier);
  };

  const sendOtp = async (phoneNumber, appVerifier) => {
    await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
        setIsOtp(true);
        window.confirmationResult = confirmationResult;
        showMessage('OTP has been sent to your mobile number', null, 'success', setIsOtp, setCaptchaContainer, history );
      // ...
      }).catch(() => {
      // Error; SMS not sent
        setCaptchaContainer();
        setIsOtp(false);
        showMessage('Authentication process failed', null, 'error', setIsOtp, setCaptchaContainer, history );
      });
  };

  return (
    <>
      {Header}
      <Box className={`d-flex login-main login-main--${from}`}>
          {Logo}
          <Box className="login-main__form">
            {captchaContainer}
            {!isOtp && <Form {...{ from, apiCall: from === 'login' ? apiCallLogin : apiCallRegister }} />
            || <Checkotp {...{ isOtp, setIsOtp , setCaptchaContainer}} />}
          </Box>
      </Box>
      <Box>
        {PageContent}
      </Box>
    </>
  );
};

export default Page;