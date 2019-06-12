import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import Layout from './components/Layout';
import { theme } from './config/AppConstants';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Layout />
  </ThemeProvider>,
  document.getElementById('root')
);
