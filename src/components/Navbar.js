// 'use client';
// import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
// import { usePathname, useRouter } from 'next/navigation';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';
// import LogoutIcon from '@mui/icons-material/Logout';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { supabase } from '../supabase';

// export default function Navbar({ darkMode, setDarkMode }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setIsLoggedIn(!!user);
//     };

//     checkAuthStatus();
//   }, [pathname]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsLoggedIn(false);
//     router.push('/');
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar sx={{ justifyContent: 'space-between' }}>
//         <Box>
//           <Link href="/" passHref style={{ textDecoration: 'none' }}>
//             <Button 
//               color="inherit" 
//               sx={{ fontWeight: pathname === '/' ? 'bold' : 'normal' }}
//             >
//               DG Shipping
//             </Button>
//           </Link>
//           <Button color="inherit" disabled>
//             USA Visa
//           </Button>
//           <Button color="inherit" disabled>
//             Study Material
//           </Button>
//           <Link href="/contact" passHref style={{ textDecoration: 'none' }}>
//             <Button 
//               color="inherit" 
//               sx={{ fontWeight: pathname === '/contact' ? 'bold' : 'normal' }}
//             >
//               Contact
//             </Button>
//           </Link>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           {isLoggedIn ? (
//             <Button 
//               color="inherit"
//               startIcon={<LogoutIcon />}
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           ) : (
//             <Link href="/login" passHref style={{ textDecoration: 'none' }}>
//               <Button 
//                 color="inherit" 
//                 sx={{ fontWeight: pathname === '/login' ? 'bold' : 'normal' }}
//               >
//                 Login
//               </Button>
//             </Link>
//           )}
//           <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
//             {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
//           </IconButton>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

'use client';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Navbar({ darkMode, setDarkMode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('profile_picture, full_name')
          .eq('email', user.email)
          .single();

        setUserProfile(userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    };

    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    setAnchorEl(null);
    router.push('/');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
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
            <>
              <Avatar 
                src={userProfile?.profile_picture || undefined}
                onClick={handleProfileMenuOpen}
                sx={{ cursor: 'pointer' }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem disabled>
                  <PersonIcon sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem disabled>
                  <SettingsIcon sx={{ mr: 1 }} /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
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