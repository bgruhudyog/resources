'use client';
import { ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
        dark: darkMode ? '#648dae' : '#1565c0',
        light: darkMode ? '#a6d4fa' : '#42a5f5',
      },
      secondary: {
        main: darkMode ? '#ce93d8' : '#9c27b0',
        dark: darkMode ? '#8e6c9c' : '#7b1fa2',
        light: darkMode ? '#dea1e6' : '#ba68c8',
      },
      error: {
        main: darkMode ? '#f48fb1' : '#d32f2f',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1e1e1e',
        secondary: darkMode ? '#b0b0b0' : '#666666',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1e1e1e',
            boxShadow: darkMode ? '0 1px 3px rgba(255, 255, 255, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, backgroundColor: theme.palette.background.default }}>
        <ThemeProvider theme={theme}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}