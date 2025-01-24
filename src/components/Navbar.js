

// 'use client';
// import { 
//   AppBar, 
//   Toolbar, 
//   Button, 
//   Box, 
//   Avatar, 
//   Menu, 
//   MenuItem 
// } from '@mui/material';
// import { usePathname, useRouter } from 'next/navigation';
// import LogoutIcon from '@mui/icons-material/Logout';
// import PersonIcon from '@mui/icons-material/Person';
// import SettingsIcon from '@mui/icons-material/Settings';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { supabase } from '../supabase';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (user) {
//         const { data: userData } = await supabase
//           .from('users')
//           .select('profile_picture, full_name')
//           .eq('email', user.email)
//           .single();

//         setUserProfile(userData);
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//         setUserProfile(null);
//       }
//     };

//     checkAuthStatus();
//   }, [pathname]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsLoggedIn(false);
//     setUserProfile(null);
//     setAnchorEl(null);
//     router.push('/');
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
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
//             <>
//               <Avatar 
//                 src={userProfile?.profile_picture || undefined}
//                 onClick={handleProfileMenuOpen}
//                 sx={{ cursor: 'pointer' }}
//               />
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleProfileMenuClose}
//               >
//                 <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//                   <MenuItem>
//                     <PersonIcon sx={{ mr: 1 }} /> Profile
//                   </MenuItem>
//                 </Link>
//                 <MenuItem disabled>
//                   <SettingsIcon sx={{ mr: 1 }} /> Settings
//                  </MenuItem>
//                 <MenuItem onClick={handleLogout}>
//                   <LogoutIcon sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//               </Menu>
//             </>
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
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

// 'use client';
// import { 
//   AppBar, 
//   Toolbar, 
//   Button, 
//   Box, 
//   Avatar, 
//   Menu, 
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from '@mui/material';
// import { usePathname, useRouter } from 'next/navigation';
// import LogoutIcon from '@mui/icons-material/Logout';
// import PersonIcon from '@mui/icons-material/Person';
// import SettingsIcon from '@mui/icons-material/Settings';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { supabase } from '../supabase';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedNavItem, setSelectedNavItem] = useState('DG Shipping');

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (user) {
//         const { data: userData } = await supabase
//           .from('users')
//           .select('profile_picture, full_name')
//           .eq('email', user.email)
//           .single();

//         setUserProfile(userData);
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//         setUserProfile(null);
//       }
//     };

//     checkAuthStatus();
//   }, [pathname]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsLoggedIn(false);
//     setUserProfile(null);
//     setAnchorEl(null);
//     router.push('/');
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNavItemChange = (event) => {
//     const selectedItem = event.target.value;
//     setSelectedNavItem(selectedItem);

//     switch(selectedItem) {
//       case 'DG Shipping':
//         router.push('/');
//         break;
//       case 'USA Visa':
//         // Add appropriate routing or modal
//         break;
//       case 'Study Material':
//         // Add appropriate routing or modal
//         break;
//       case 'Contact':
//         router.push('/contact');
//         break;
//     }
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar sx={{ justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
//           {/* Dropdown only for mobile screens */}
//           <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
//             <FormControl variant="outlined" size="small" fullWidth>
//               <InputLabel>visit on</InputLabel>
//               <Select
//                 value={selectedNavItem}
//                 label="visit on"
//                 onChange={handleNavItemChange}
//                 fullWidth
//               >
//                 <MenuItem value="DG Shipping">DG Shipping</MenuItem>
//                 <MenuItem disabled value="Visa Applications">Visa Applications</MenuItem>
//                 <MenuItem disabled value="Study Material">Study Material</MenuItem>
//                 <MenuItem value="Contact">Contact Us</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           {/* Desktop view links */}
//           <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//             <Link href="/" passHref style={{ textDecoration: 'none' }}>
//               <Button 
//                 color="inherit" 
//                 sx={{ fontWeight: pathname === '/' ? 'bold' : 'normal' }}
//               >
//                 DG Shipping
//               </Button>
//             </Link>
//             <Button color="inherit" disabled>
//                Visa Applications
//             </Button>
//             <Button color="inherit" disabled>
//               Study Material
//             </Button>
//             <Link href="/contact" passHref style={{ textDecoration: 'none' }}>
//               <Button 
//                 color="inherit" 
//                 sx={{ fontWeight: pathname === '/contact' ? 'bold' : 'normal' }}
//               >
//                 Contact Us
//               </Button>
//             </Link>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           {isLoggedIn ? (
//             <>
//               <Avatar 
//                 src={userProfile?.profile_picture || undefined}
//                 onClick={handleProfileMenuOpen}
//                 sx={{ cursor: 'pointer' }}
//               />
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleProfileMenuClose}
//               >
//                 <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//                   <MenuItem>
//                     <PersonIcon sx={{ mr: 1 }} /> Profile
//                   </MenuItem>
//                 </Link>
//                 <MenuItem disabled>
//                   <SettingsIcon sx={{ mr: 1 }} /> Settings
//                  </MenuItem>
//                 <MenuItem onClick={handleLogout}>
//                   <LogoutIcon sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//               </Menu>
//             </>
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
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { supabase } from '../supabase'; // Adjust the path as needed

// Styled components
const ThemeToggleSwitch = styled('button')(({ theme }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '0 20px 20px 0',
    border: 'none',
  },
}));

const drawerItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  { text: "Contact", icon: <PersonIcon />, path: "/contact" }
];

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Theme creation
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#90caf9' : '#1976d2',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f5f5f5',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' 
                ? 'rgba(30, 30, 30, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
      },
    }),
    [mode]
  );

  // Authentication and mode persistence
  useEffect(() => {
    // Check localStorage for color mode
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode) {
      setMode(savedMode);
    }

    // Check authentication status
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
  }, []);

  // Toggle color mode
  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('colorMode', newMode);
  };

  // Drawer toggle
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    setAnchorEl(null);
  };

  return (
    <html lang="en">
      <head>
        <title>Marine Resources</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                MARINE RESOURCES
              </Typography>

              {isLoggedIn ? (
                <Avatar 
                  variant="square"
                  src={userProfile?.profile_picture || undefined}
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: 2,
                    width: 40,
                    height: 40 
                  }}
                />
              ) : (
                <ThemeToggleSwitch onClick={toggleColorMode}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </ThemeToggleSwitch>
              )}
            </Toolbar>
          </AppBar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <MenuItem>
                <PersonIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
            </Link>
            <MenuItem disabled>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>

          <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 280, pt: 8 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {drawerItems.map((item) => (
                  <Link 
                    key={item.text} 
                    href={item.path} 
                    passHref 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem button>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </Link>
                ))}
                
                <ListItem>
                  <ListItemIcon>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </ListItemIcon>
                  <ListItemText primary="Toggle Dark Mode" />
                  <ThemeToggleSwitch onClick={toggleColorMode}>
                    {mode === 'dark' ? 'Light' : 'Dark'}
                  </ThemeToggleSwitch>
                </ListItem>
              </List>
            </Box>
          </StyledDrawer>

          <Box sx={{ marginTop: '64px' }}>
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}