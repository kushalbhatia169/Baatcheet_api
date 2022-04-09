import React, { useCallback, useState, useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import TextFieldsComponent from '../../common/text_field/text_field';
import { useStyles } from '../../style_jsx/styles';
import { context } from '../../store/store';
import APICallManager from '../../services/api_manager';
import { useHistory } from 'react-router';
import { showMessage } from '../../common/showMessages';

const Checkotp = (props) => {
  const classes = useStyles(),
        { setIsOtp, setCaptchaContainer } = props,
        { state } = useContext(context),
        history = useHistory(),
        [otp, setOtp] = useState({
          '1': '',
          '2': '',
          '3': '',
          '4': '',
          '5': '',
          '6': '',
        }),
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        setOtpData = useCallback(async (stateName, value) => {
          setOtp((prevState) => ({ ...prevState, [stateName]: value.replace(/\D+/g, '') }));
        }, []);

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
        phoneNumber && showMessage(`${phoneNumber} is verified.`, isCallbackCall, 'success', setIsOtp, setCaptchaContainer, history );
      });

      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      showMessage(error, null, 'error', setIsOtp, setCaptchaContainer, history );
    });
  };

  return (
    <Box className="d-flex align-items-center flex-column">
      <form onSubmit={handleSubmit((event) => onSubmitOTP(event))}>
        <Box className="d-flex align-items-center flex-column">
          <h2 className="heading">Verify Your PhoneNumber</h2>
          <Box className="d-flex mt-3 flex-column">
            <p>Enter the verification code sent to your phone number</p>
            <Box className="d-flex justify-content-center">
              {Object.keys(otp).map((item, key) => {
                return <TextFieldsComponent key={key} {...{ classes, label: '-', icon: false, required: true,
                  value: otp[item], setValue: setOtpData, name: item, maxLength: 1,
                  classnames: `${classes.input_otp} me-2 ms-2 p-1`,
                  register, errors, notShowError: true,
                  type: 'validate' }} />;
              })}
              <Box>
                <Button type="submit" variant="outlined" title="Verify" className="ms-3 mb-2">
            Verify
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Checkotp;