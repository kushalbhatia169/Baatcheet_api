import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import TextFieldsComponent from '../../common/text_field/text_field';
import { useStyles } from '../../style_jsx/styles';

const Checkotp = (props) => {
  const classes = useStyles(),
        { otp, setOtp, onSubmitOTP } = props,
        { register, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onBlur' }),
        setOtpData = useCallback(async (stateName, value) => {
          setOtp((prevState) => ({ ...prevState, [stateName]: value.replace(/\D+/g, '') }));
        }, []);

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