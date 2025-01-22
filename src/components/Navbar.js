// src/components/Navbar.js
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { useRouter } from 'next/router';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function Navbar({ darkMode, setDarkMode }) {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Button 
            color="inherit" 
            onClick={() => router.push('/')}
            sx={{ fontWeight: router.pathname === '/' ? 'bold' : 'normal' }}
          >
            DG Shipping
          </Button>
          <Button color="inherit" disabled>
            USA Visa
          </Button>
          <Button color="inherit" disabled>
            Study Material
          </Button>
          <Button 
            color="inherit" 
            onClick={() => router.push('/contact')}
            sx={{ fontWeight: router.pathname === '/contact' ? 'bold' : 'normal' }}
          >
            Contact
          </Button>
        </Box>
        <Box>
          <Button 
            color="inherit" 
            onClick={() => router.push('/admin')}
            sx={{ fontWeight: router.pathname === '/admin' ? 'bold' : 'normal' }}
          >
            Admin Login
          </Button>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}