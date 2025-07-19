import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ECDC4',
      light: '#7FEFE9',
      dark: '#2B9B94',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF9999',
      dark: '#CC3D3D',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2D2D2D',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {showDashboard ? (
          <Dashboard />
        ) : (
          <LandingPage onEnter={() => setShowDashboard(true)} />
        )}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
