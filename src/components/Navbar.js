'use client';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Navbar({ darkMode, setDarkMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
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
          {isLoggedIn ? (
            <Button 
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link href="/login" passHref style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ fontWeight: pathname === '/login' ? 'bold' : 'normal' }}
              >
                Login
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