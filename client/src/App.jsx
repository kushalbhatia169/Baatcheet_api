import React from 'react';
import Router from './router/router';
import Store from './store/store';
import { ThemeProvider } from '@mui/material/styles';
import { formLabelsTheme } from './style_jsx/styles';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';


const App = () => {

  return (
    <ThemeProvider theme={formLabelsTheme}>
      <Store>
        <Router />
      </Store>
    </ThemeProvider>
  );
};

export default App;
