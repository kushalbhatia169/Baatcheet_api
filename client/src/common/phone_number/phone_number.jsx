import React from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { InputAdornment, Box } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const PhoneNumber = (props) => {
  const { classes, value, phone_Number_Check, required, phoneError, inputRef, label,
    name, setValue } = props;

  return (
    <MuiPhoneNumber
      id="outlined"
      InputProps={{
        className: `${classes.input}`,
        classes: {
          notchedOutline: inputRef ? classes.notchedOutline : null,
          focused: classes.focused,
        },
        startAdornment: (
          <InputAdornment position="start">
            <LocalPhoneIcon />
          </InputAdornment>
        ),
      }}autofocus
      disableDropdown={true}
      //
      placeholder={label}
      variant="outlined"
      disableCountryCode={true}
      type="text"
      autoComplete="new-password"
      name={name}
      countryCodeEditable={true}
      defaultCountry="in"
      onlyCountries={['in']}
      value={value}
      ref={inputRef || null}
      onChange={(phone) => setValue(`${name}`, phone)}
      minLength="15"
      onBlur={required && phone_Number_Check}
      // error={required && Boolean(phoneError)}
      // helperText= {required && phoneError &&
      //           <Box style={{ marginLeft: '-1rem', fontSize: '13px', color: 'red' }} component="span">
      //             *Phone Number is rquired.
      //           </Box>}
      rules={{ minLength: 15 }}
    />
  );
};
export default PhoneNumber;