import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const formLabelsTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      //main: '#EB9937',
      main: '#800080',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: '#db3131',
        '&$error': {
          color: '#db3131',
        },
      },
    },
  },
});

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      overflow: 'auto',
    },
  },
  input: {
    height: 40,
    // [theme.breakpoints.up('300')]: {
    //   width: 130,
    // },
    // [theme.breakpoints.up('576')]: {
    //   width: 200,
    // },
    // [theme.breakpoints.up('768')]: {
    //   width: 130,
    // },
    //[theme.breakpoints.up('1024')]: {
    width: 480,
    // },
    color: '#76787A',
    fontSize: '14px',
  },
  input_otp: {
    height: 40,
    width: 40,
    color: '#76787A',
    fontSize: '14px',
  },
  labelAsterisk: {
    color: 'red',
  },
  notchedOutline: {
    '&:focus': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
  },
  focused: {
    borderColor: '#db3131',
  },
  labelForm: {
    fontSize: 18,
  },
  formLabel: {  // for login form
    fontSize: 16,
    color: '#1A202C',
    fontWeight: 'bold',
    width: '100%',
    marginBottom: '10px',
    marginTop: '10px',
    marginLeft: '30px',
    justifyContent: 'start', // for login form
    display: 'flex',
  },
}));

