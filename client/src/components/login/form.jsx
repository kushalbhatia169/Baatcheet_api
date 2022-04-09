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
import { checkConfirmPassword } from '../../common/showMessages';
import FormLabel from '@mui/material/FormLabel';
import { showMessage } from '../../common/showMessages';

const Form = (props) => {
  const classes = useStyles(),
        { from, apiCall } = props,
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
              // setPhoneError(true);
              showMessage('Please Enter Valid Phone Number', null, 'error');
              return false;
            }
          }
          if (!phone) {
            // setPhoneError(true);
            showMessage('Please Fill All the Fields', null, 'error');
            return false;
          }

          setPhoneError(false);
          return true;
        },
        onSubmit = () => {
          if (from === 'login') {
            if(!username || !password) {
              showMessage('Please Fill all the Fields', null, 'error');
              return;
            }
            apiCall({ ...fields });
          }
          else {
            if(!username || !email || !phone || !password || !confirmPassword) {
              showMessage('Please Fill all the Fields', null, 'error');
              return;
            }
            else if (phone_Number_Check()) {
              if (checkConfirmPassword(password, confirmPassword)){
                if (hasValidEmail(email)) {
                  apiCall({ ...fields });
                  return;
                }
                else {
                  showMessage('Please Enter Valid Email', null, 'error');
                  return;
                }
              }
              apiCall({ ...fields });
            }
          }
        };

  return (
    <form className="login-main__form_div" onSubmit={handleSubmit(() => onSubmit())}>
      <FormLabel className={classes.formLabel} required={true}>
        Username
      </FormLabel>
      <TextFieldsComponent {...{ classes, label: '', icon: <PersonIcon />, required: true,
        value: username, setValue: setStateData, name: 'username', register, errors }} />
      {from === 'register' && <>
          <FormLabel className={classes.formLabel} required={true}>
          Email
          </FormLabel>
          <TextFieldsComponent {...{ classes, label: '', icon: <EmailIcon />, required: true,
            value: email, setValue: setStateData, name: 'email', register, errors,
            validate: hasValidEmail, type: 'validate' }} />
        <FormLabel className={classes.formLabel} required={true}>
        Phone Number
        </FormLabel>
        <Phone_number {...{ classes, label: 'Phone Number', value: phone, name: 'phone',
          setValue: setStateData, inputRef, phone_Number_Check, phoneError, required: true }} />
      </>}
      <FormLabel className={classes.formLabel} required={true}>
        Password
      </FormLabel>
      <Password_fields {...{ classes, label: '', value: password, name: 'password',
        setValue: setStateData, register, errors, validate: from === 'register' && validate,
        errorCheckPassword }} />
      {from === 'register' && <>
      <FormLabel className={classes.formLabel} required={true}>
        Confirm Password
      </FormLabel>
      <Password_fields {...{ classes, label: 'Confirm Password',
        value: confirmPassword, name: 'confirmPassword', setValue: setStateData,
        register, errors, validate, errorCheckPassword }} />
      </>}
      <Button type="submit" className="login-main__form_div__button" variant="outlined" title={from === 'register' ? 'Register' : 'Login'}
        onClick={() => { from === 'register' && phone_Number_Check() }}>
        {from === 'register' ? 'Register' : 'Login'}
      </Button>
      <div className='d-flex w-100 ms-3 mb-3'>
        <Link className={"login-main__form_div__link ms-2 justify-content-center d-flex" + (from === 'register' ? ' login-main__form_div__link--register' : '')}
          to={{ pathname: from === 'login' ? '/register' : '/login', from: from === 'login' ? 'login' : 'register' }}>
          {from === 'login' ? 'Register?' : 'Login?'}
        </Link>
        {from === 'login' &&  <Link className="login-main__form_div__register ms-3 justify-content-center d-flex"
          to={{ pathname: '/register' }}>
          Forget Password?
        </Link>}
      </div>
    </form>
  );
};

export default Form;
