'use client';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar({ darkMode, setDarkMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [pathname]);

  const checkAdminStatus = () => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    setIsAdmin(isLoggedIn === 'true');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    setIsAdmin(false);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button 
              color="inherit" 
              sx={{ fontWeight: pathname === '/' ? 'bold' : 'normal' }}
            >
              DG Shipping
            </Button>
          </Link>
          <Button color="inherit" disabled>
            USA Visa
          </Button>
          <Button color="inherit" disabled>
            Study Material
          </Button>
          <Link href="/contact" passHref style={{ textDecoration: 'none' }}>
            <Button 
              color="inherit" 
              sx={{ fontWeight: pathname === '/contact' ? 'bold' : 'normal' }}
            >
              Contact
            </Button>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAdmin ? (
            <Button 
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link href="/admin" passHref style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ fontWeight: pathname === '/admin' ? 'bold' : 'normal' }}
              >
                Admin Login
              </Button>
            </Link>
          )}
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}