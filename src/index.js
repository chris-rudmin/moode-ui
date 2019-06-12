import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import AlbumGrid from './components/AlbumGrid';
import Header from './components/Header';
import { theme } from './config/AppConstants';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <AlbumGrid />
  </ThemeProvider>,
  document.getElementById('root')
);
