import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useShowPassword from '../use_show_password';
import LockIcon from '@mui/icons-material/Lock';
import { Box, InputAdornment, TextField } from '@mui/material';
import './password_field.scss';

const PasswordField = (props) => {
  const { classes, register, name, autoComplete, errors, setValue, label, value, validate, errorCheckPassword,
        } = props,
        { showPassword, handleClickShowPassword, handleMouseDownPassword } = useShowPassword();
  return (<Box className={`${errors[name]?.type === 'hasCharNumSpecialChar' && 'password_field'}`}>
    <TextField {...
      {
        InputProps: {
          className: `${classes.input} mt-4`,
          endAdornment: (
            <InputAdornment position="end">
              {showPassword ? <VisibilityIcon className={classes.show_hide_password}
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword}
                onMouseDown={handleMouseDownPassword} /> :
                <VisibilityOffIcon className={classes.show_hide_password}
                  aria-label="toggle password visibility"
                  onClick={() => handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword} />}
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        },
        placeholder: label,
        name,
        id: 'outlined-password-input',
        type: showPassword ? 'text' : 'password',
        size: 'small',
        value,
        autoComplete,
        variant: 'outlined',
        ...register(name, { onChange: (e) => setValue(name, e.target.value),
          required: true, maxLength: 30, validate,
        }),
        error: Boolean(errors && errors[name]),
        helperText: errors && errors[name] && <Box style={{ 'marginLeft': '-1rem', color: 'red' }} component="span"
          className="text-capitalize">
          *{validate && errorCheckPassword(errors[name].type) || 'password is required'}
        </Box>,
      }
    } /></Box>
  );
};

export default PasswordField;