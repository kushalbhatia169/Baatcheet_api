//for implementation you can check dependents module
import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';

const TextFieldComponent = (props) => {
  const { value, classes, register, label, name, autoComplete, errors, type, maxLength,
    setValue, typeField, icon, validate, classnames, children, notShowError } = props;

  return (
    <TextField {...
      {
        InputProps: {
          className: `${classes.input} ${classnames}`,
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
        },
        placeholder: label,
        name: name,
        id: 'outlined-password-input',
        type: typeField,
        size: 'small',
        value: value,
        autoComplete,
        variant: 'outlined',
        inputProps: { maxLength: maxLength || 50 },
        ...register(name, { onChange: (e) => setValue(name, e.target.value),
          // required: true, maxLength: maxLength || 30, validate,
        }),
        // error: Boolean(errors && errors[name]),
        // helperText: !notShowError && errors && errors[name] && <Box style={{ 'marginLeft': '-1rem', color: 'red' }} component="span"
        //   className="text-capitalize">
        //   *{errors[name]?.type === type && `invalid ${name} type` || `${name} is required`}</Box>,
      }
    }>
      {children}
    </TextField>
  );
};

export default TextFieldComponent;