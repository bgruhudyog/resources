// pages/_app.js
import { ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
    </ThemeProvider>
  );
}

export default MyApp;

// components/Navbar.js
import { AppBar, Toolbar, Button, IconButton, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Navbar({ darkMode, setDarkMode }) {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => router.push('/')}>
          DG Shipping
        </Button>
        <Button color="inherit" disabled>
          USA Visa
        </Button>
        <Button color="inherit" disabled>
          Study Material
        </Button>
        <Button color="inherit" onClick={() => router.push('/contact')}>
          Contact
        </Button>
        <Button color="inherit" onClick={() => router.push('/admin')}>
          Admin Login
        </Button>
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
          <DarkModeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}