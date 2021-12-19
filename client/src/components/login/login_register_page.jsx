import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router';
import FormLoginRegister from './form_login_register';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';
import useGetRoute from '../../common/use_Get_Route';
import firebase from '../../firebase';
import Checkotp from './checkOtp';
import { notification } from 'antd';
import { getNotificationStyle } from '../../common/getNotificarionStyle.ts';
import './login.scss';
import { setCookie } from '../../common/globalCookies';

const LoginRegisterPage = (props) => {
  const { state, dispatch } = useContext(context);
  const { Header, Logo, PageContent, from } = props,
        { getRoute } = useGetRoute(),
        [captchaContainer, setCaptchaContainer] = useState(),
        history = useHistory(),
        [otp, setOtp] = useState({
          '1': '',
          '2': '',
          '3': '',
          '4': '',
          '5': '',
          '6': '',
        }),
        [isOtp, showIsOtp] = useState(false);

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
          dispatch({ type: 'userData', payload: { ...res.data } });
        });
        !isEmail && dispatch({ type: 'userData', payload: { ...res.data } });
        return;
      }
      else if (res.success) {
        setCookie('token', res.data.jwt, 1);
        dispatch({ type: 'userData', payload: { ...res.data, isLoggedIn: true } });
        history.push(getRoute('contacts'));
      }
    });
  };

  const apiCallRegister = props = e => {
    const { username, password, phone, email } = e;
    dispatch({ type: 'userData', payload: { ...e } });
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
      dispatch({ type: 'userData', payload: { ...res.data } });
    });
    notVerify && await sendOtp(phoneNumber, appVerifier);
  };

  const sendOtp = async (phoneNumber, appVerifier) => {
    await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
        showIsOtp(true);
        window.confirmationResult = confirmationResult;
        showMessage('OTP has been sent to your mobile number', null, 'success');
      // ...
      }).catch(() => {
      // Error; SMS not sent
        setCaptchaContainer();
        showIsOtp(false);
        showMessage('Authentication process failed', null, 'error');
      });
  };
  const onSubmitOTP = (/* e */) => {
    //e.preventDefault();
    const code = Object.keys(otp).map(key => otp[key]).join('');
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const { phoneNumber } = result.user;
      const isCallbackCall = true;
      const obj = { url: state.config.baseUrl + state.config.verifyPhone + state.userData._id };
      const data = { phoneVerified: true };
      APICallManager.putCall(obj, data, async () => {
        phoneNumber && showMessage(`${phoneNumber} is verified.`, isCallbackCall, 'success');
      });

      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      showMessage(error, null, 'error');
    });
  };

  const showMessage = (message, isCallbackCall, type) => {
    notification[type]({
      message: type = 'error' && 'An Error occurred' || 'Success',
      description: message,
      style: getNotificationStyle(type),
      duration: 0,
      onClose: () => {
        if (isCallbackCall) {
          showIsOtp(false);
          setCaptchaContainer();
          history.push(getRoute('login'));
        }
      },
    });
  };

  return (
    <>
      {Header}
      <Box className={`d-flex login-main login-main--${from}`}>
        <Box className="login-main__logo">
          <Box className="login-main__logo_div">
            {Logo}
          </Box>
          <Box className="mt-3 login-main__form">
            {captchaContainer}
            {!isOtp && <FormLoginRegister {...{ from, apiCall: from === 'login' ? apiCallLogin : apiCallRegister }} />
            || <Checkotp {...{ otp, setOtp, onSubmitOTP }} />}
          </Box>
        </Box>
      </Box>
      <Box>
        {PageContent}
      </Box>
    </>
  );
};

export default LoginRegisterPage;


// await firebase.auth().createUserWithEmailAndPassword(email, password)
//   .then(user => {
//     if (user) {
//       user.user.sendEmailVerification().then(() => {
//         showMessage('Verification link has been sent to your email');
//       });
//     }
//     // firebase.auth().onAuthStateChanged((user) => {
//     //   user.sendEmailVerification();
//     //   window.confirmationResultEmail = user;
//     //   showMessage('Verification link has been sent to your email');
//     // });
//   }).catch((e) => {
//     // Error; SMS not sent
//     showMessage(e.message);
//   });