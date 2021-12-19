import React, { useState, useCallback, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useStyles } from '../../style_jsx/styles';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import TextFieldsComponent from '../../common/text_field/text_field';
import Password_fields from '../../common/password_field/password_field';
import Phone_number from '../../common/phone_number/phone_number';
import useGetRoute from '../../common/use_Get_Route';
import { notification } from 'antd';
import { getNotificationStyle } from '../../common/getNotificarionStyle.ts';

const checkConfirmPassword = (password, confirmPasssword) => {
  if (password !== confirmPasssword) {
    notification['error']({
      message: 'An Error occurred',
      description: 'Password and Confirm Password shoulde be same.',
      style: getNotificationStyle('error'),
      duration: 0,
    });
  }
  else {
    return true;
  }
};

const FormLoginRegister = (props) => {
  const classes = useStyles(),
        { from, apiCall } = props,
        { getRoute } = useGetRoute(),
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        inputRef = useRef(),
        [phoneError, setPhoneError] = useState(false),
        [fields, setFields] = useState({
          username: 'kushalJi',
          email: 'kushalbhatia169@gmail.com',
          phone: '8127717273',
          password: 'Baatcheet@735',
          confirmPassword: 'Baatcheet@735',
        }),
        hasValidEmail = (value) => /\S+@\S+\.\S+/i.test(value),
        { username, email, phone, password, confirmPassword } = fields,
        setStateData = useCallback(async (stateName, value) => {
          setFields((prevState) => ({
            ...prevState,
            [stateName]: value }));
        }, []),
        errorCheckPassword = (passwordType) => {
          const errorData = (passwordType === 'minLength' || passwordType === 'required') ?
            'minimum 8 characters required'
            : passwordType === 'hasCharNumSpecialChar' ?
              `password should contains uppercase, lowercase, numbers or special characters.`
              : passwordType === 'hasNotSpace' ?
                `The password cannot contain space`
                : passwordType === 'hasNotDollar' &&
                `The password cannot contain a $ sign.`;
          return errorData;
        },
        validate = {
          hasNotSpace: (value) => value && /^\S+$/i.test(value),
          hasNotDollar: (value) => value && /^[^$]+$/i.test(value),
          hasCharNumSpecialChar: (value) => value && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value),
        },
        phone_Number_Check = () => {
          if (phone) {
            if (phone.replace(/\D+/g, '').length < 10) {
              setPhoneError(true);
              return false;
            }
          }
          if (!phone) {
            setPhoneError(true);
            return false;
          }

          setPhoneError(false);
          return true;
        },
        onSubmit = () => {
          if (from === 'login') {
            apiCall({ ...fields });
          }
          else {
            if (phone_Number_Check()) {
              if (checkConfirmPassword(password, confirmPassword))
                apiCall({ ...fields });
            }
            else {
              inputRef.current.handleInputFocus();
              return;
            }

          }
        };

  return (
    <>
      <Box className="login-main__div">
        <p component="legend"
          className={`${classes.label_form} labels mt-2 heading content_26`}>
          {from === 'login' && 'Welcome Back' || 'Register Yourself'}!
        </p>
      </Box>
      <>
        <form className="login-main__form_div" onSubmit={handleSubmit(() => onSubmit())}>
          <p>{from === 'login' && 'Login' || 'Register'} and start chatting with your friends</p>
          <TextFieldsComponent {...{ classes, label: 'Username', icon: <PersonIcon />, required: true,
            value: username, setValue: setStateData, name: 'username', register, errors }} />
          {from === 'register' && <>
            <Box className="mt-4">
              <TextFieldsComponent {...{ classes, label: 'Email', icon: <EmailIcon />, required: true,
                value: email, setValue: setStateData, name: 'email', register, errors,
                validate: hasValidEmail, type: 'validate' }} />
            </Box>
            <Phone_number {...{ classes, label: 'Phone Number', value: phone, name: 'phone',
              setValue: setStateData, inputRef, phone_Number_Check, phoneError, required: true }} />
          </>}
          <Password_fields {...{ classes, label: 'Password', value: password, name: 'password',
            setValue: setStateData, register, errors, validate: from === 'register' && validate,
            errorCheckPassword }} />
          {from === 'register' && <Password_fields {...{ classes, label: 'Confirm Password',
            value: confirmPassword, name: 'confirmPassword', setValue: setStateData,
            register, errors, validate, errorCheckPassword }} />}
          <Box className="mt-3 login-main__button_div">
            <Box className={`login-main__button ${from === 'login' && 'justify-content-between'
        || 'justify-content-end'}`}>
              {from === 'login' && <Box className="d-flex mt-2">
                <Link className="heading" to={{ pathname: getRoute('register') }}>Forget Password?</Link>
              </Box>}
              <Button type="submit" variant="outlined" title={from === 'register' && 'Register' || 'Login'}
                onClick={() => { from === 'register' && phone_Number_Check() }}>
                {from === 'register' && 'Register' || 'Login'}
              </Button>
            </Box>
            <Box className="d-flex justify-content-between mt-2">
              <p className="mt-1">{from === 'login' && 'Not' || 'Already'} on Baatcheet?</p>
              <Link className="heading" to={{ pathname: getRoute(from === 'login' && 'register' || 'login'),
                from: from === 'login' && 'login' || 'register' }}>
                {from === 'login' && 'Register' || 'Login'} Now</Link>
            </Box>
          </Box>
        </form>
      </>
    </>
  );
};

export default FormLoginRegister;
