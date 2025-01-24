// 'use client';
// import { ThemeProvider, createTheme } from '@mui/material';
// import { useState } from 'react';
// import Navbar from '@/components/Navbar';

// export default function RootLayout({ children }) {
//   const [darkMode, setDarkMode] = useState(false);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? 'dark' : 'light',
//       primary: {
//         main: darkMode ? '#90caf9' : '#1976d2',
//         dark: darkMode ? '#648dae' : '#1565c0',
//         light: darkMode ? '#a6d4fa' : '#42a5f5',
//       },
//       secondary: {
//         main: darkMode ? '#ce93d8' : '#9c27b0',
//         dark: darkMode ? '#8e6c9c' : '#7b1fa2',
//         light: darkMode ? '#dea1e6' : '#ba68c8',
//       },
//       error: {
//         main: darkMode ? '#f48fb1' : '#d32f2f',
//       },
//       background: {
//         default: darkMode ? '#121212' : '#f5f5f5',
//         paper: darkMode ? '#1e1e1e' : '#ffffff',
//       },
//       text: {
//         primary: darkMode ? '#ffffff' : '#1e1e1e',
//         secondary: darkMode ? '#b0b0b0' : '#666666',
//       },
//     },
//     components: {
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             backgroundImage: 'none',
//           },
//         },
//       },
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
//             color: darkMode ? '#ffffff' : '#1e1e1e',
//             boxShadow: darkMode ? '0 1px 3px rgba(255, 255, 255, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             textTransform: 'none',
//             borderRadius: 8,
//           },
//         },
//       },
//     },
//     shape: {
//       borderRadius: 12,
//     },
//     typography: {
//       fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//       button: {
//         textTransform: 'none',
//       },
//     },
//   });

//   return (
//     <html lang="en">
//       <head>
//         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
//       </head>
//       <body style={{ margin: 0, backgroundColor: theme.palette.background.default }}>
//         <ThemeProvider theme={theme}>
//           <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import { 
//   ThemeProvider, 
//   createTheme, 
//   CssBaseline, 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   Box, 
//   IconButton, 
//   Drawer, 
//   List, 
//   ListItem, 
//   ListItemIcon, 
//   ListItemText, 
//   Avatar,
//   Menu,
//   MenuItem,
//   Button,
//   Switch
// } from '@mui/material';
// import { styled } from '@mui/system';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import HomeIcon from '@mui/icons-material/Home';
// import SettingsIcon from '@mui/icons-material/Settings';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';
// import Link from 'next/link';
// import { supabase } from '../supabase'; // Adjust path as needed

// // Styled Switch similar to previous implementation
// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//   width: 62,
//   height: 34,
//   padding: 7,
//   '& .MuiSwitch-switchBase': {
//     margin: 1,
//     padding: 0,
//     transform: 'translateX(6px)',
//     '&.Mui-checked': {
//       color: '#fff',
//       transform: 'translateX(22px)',
//       '& .MuiSwitch-thumb:before': {
//         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//           '#fff'
//         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//       },
//       '& + .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//       },
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//     width: 32,
//     height: 32,
//     '&:before': {
//       content: "''",
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       left: 0,
//       top: 0,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center',
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//         '#fff'
//       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//     },
//   },
//   '& .MuiSwitch-track': {
//     opacity: 1,
//     backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//     borderRadius: 20 / 2,
//   },
// }));

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   '& .MuiDrawer-paper': {
//     width: 280,
//     backgroundColor: theme.palette.mode === 'dark' 
//       ? 'rgba(30, 30, 30, 0.8)' 
//       : 'rgba(255, 255, 255, 0.8)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '0 20px 20px 0',
//     border: 'none',
//   },
// }));

// export default function RootLayout({ children }) {
//   const [mode, setMode] = useState('light');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   // Theme creation
//   const theme = useMemo(
//     () => createTheme({
//       palette: {
//         mode,
//         primary: {
//           main: mode === 'dark' ? '#90caf9' : '#1976d2',
//         },
//         background: {
//           default: mode === 'dark' ? '#121212' : '#f5f5f5',
//           paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
//         },
//       },
//       components: {
//         MuiAppBar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === 'dark' 
//                 ? 'rgba(30, 30, 30, 0.8)' 
//                 : 'rgba(255, 255, 255, 0.8)',
//               backdropFilter: 'blur(10px)',
//               color: mode === 'dark' ? '#ffffff' : '#000000',
//             },
//           },
//         },
//       },
//     }),
//     [mode]
//   );

//   // Authentication and mode persistence
//   useEffect(() => {
//     // Check localStorage for color mode
//     const savedMode = localStorage.getItem('colorMode');
//     if (savedMode) {
//       setMode(savedMode);
//     }

//     // Check authentication status
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
//   }, []);

//   // Toggle color mode
//   const toggleColorMode = () => {
//     const newMode = mode === 'light' ? 'dark' : 'light';
//     setMode(newMode);
//     localStorage.setItem('colorMode', newMode);
//   };

//   // Drawer toggle
//   const toggleDrawer = (open) => (event) => {
//     if (
//       event.type === "keydown" &&
//       (event.key === "Tab" || event.key === "Shift")
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   // Profile menu handlers
//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsLoggedIn(false);
//     setUserProfile(null);
//     setAnchorEl(null);
//   };

//   return (
//     <html lang="en">
//       <head>
//         <title>Marine Resources</title>
//       </head>
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <AppBar position="fixed">
//             <Toolbar sx={{ justifyContent: 'space-between' }}>
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 aria-label="menu"
//                 onClick={toggleDrawer(true)}
//                 sx={{ mr: 2 }}
//               >
//                 <MenuIcon />
//               </IconButton>
              
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Button color="inherit">DG Shipping</Button>
//                 <Button color="inherit" disabled>Visa Applications</Button>
//                 <Button color="inherit" disabled>Study Materials</Button>
//                 <Button color="inherit">Contact Us</Button>
                
//                 {!isLoggedIn && (
//                   <Link href="/login" passHref>
//                     <Button color="inherit">Login</Button>
//                   </Link>
//                 )}
//               </Box>

//               {isLoggedIn ? (
//                 <Avatar 
//                   variant="square"
//                   src={userProfile?.profile_picture || undefined}
//                   onClick={handleProfileMenuOpen}
//                   sx={{ 
//                     cursor: 'pointer', 
//                     borderRadius: 2,
//                     width: 40,
//                     height: 40 
//                   }}
//                 />
//               ) : (
//                 <MaterialUISwitch
//                   checked={mode === 'dark'}
//                   onChange={toggleColorMode}
//                 />
//               )}
//             </Toolbar>
//           </AppBar>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleProfileMenuClose}
//           >
//             <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//               <MenuItem>
//                 <PersonIcon sx={{ mr: 1 }} /> Profile
//               </MenuItem>
//             </Link>
//             <MenuItem disabled>
//               <SettingsIcon sx={{ mr: 1 }} /> Settings
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>
//               <LogoutIcon sx={{ mr: 1 }} /> Logout
//             </MenuItem>
//           </Menu>

//           <StyledDrawer
//             anchor="left"
//             open={drawerOpen}
//             onClose={toggleDrawer(false)}
//           >
//             <Box
//               sx={{ width: 280, pt: 8 }}
//               role="presentation"
//               onClick={toggleDrawer(false)}
//               onKeyDown={toggleDrawer(false)}
//             >
//               <List>
//                 <ListItem>
//                   <ListItemText primary="DG Shipping" />
//                 </ListItem>
//                 <ListItem disabled>
//                   <ListItemText primary="Visa Applications" />
//                 </ListItem>
//                 <ListItem disabled>
//                   <ListItemText primary="Study Materials" />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemText primary="Contact Us" />
//                 </ListItem>
//                 {!isLoggedIn && (
//                   <Link href="/login" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//                     <ListItem button>
//                       <ListItemText primary="Login" />
//                     </ListItem>
//                   </Link>
//                 )}
//                 <ListItem>
//                   <ListItemIcon>
//                     {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
//                   </ListItemIcon>
//                   <ListItemText primary="Toggle Dark Mode" />
//                   <MaterialUISwitch
//                     checked={mode === 'dark'}
//                     onChange={toggleColorMode}
//                   />
//                 </ListItem>
//               </List>
//             </Box>
//           </StyledDrawer>

//           <Box sx={{ marginTop: '64px' }}>
//             {children}
//           </Box>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import { 
//   ThemeProvider, 
//   createTheme, 
//   CssBaseline, 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   Box, 
//   IconButton, 
//   Drawer, 
//   List, 
//   ListItem, 
//   ListItemIcon, 
//   ListItemText, 
//   Avatar,
//   Menu,
//   MenuItem,
//   Button,
//   Switch
// } from '@mui/material';
// import { styled } from '@mui/system';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import SettingsIcon from '@mui/icons-material/Settings';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { supabase } from '../supabase'; // Adjust path as needed

// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//   width: 62,
//   height: 34,
//   padding: 7,
//   '& .MuiSwitch-switchBase': {
//     margin: 1,
//     padding: 0,
//     transform: 'translateX(6px)',
//     '&.Mui-checked': {
//       color: '#fff',
//       transform: 'translateX(22px)',
//       '& .MuiSwitch-thumb:before': {
//         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//           '#fff'
//         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//       },
//       '& + .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//       },
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//     width: 32,
//     height: 32,
//     '&:before': {
//       content: "''",
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       left: 0,
//       top: 0,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center',
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//         '#fff'
//       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//     },
//   },
//   '& .MuiSwitch-track': {
//     opacity: 1,
//     backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//     borderRadius: 20 / 2,
//   },
// }));

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   '& .MuiDrawer-paper': {
//     width: 280,
//     backgroundColor: theme.palette.mode === 'dark' 
//       ? 'rgba(30, 30, 30, 0.8)' 
//       : 'rgba(255, 255, 255, 0.8)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '0 20px 20px 0',
//     border: 'none',
//   },
// }));

// export default function RootLayout({ children }) {
//   const [mode, setMode] = useState('light');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const router = useRouter();


//   // Theme creation
//   const theme = useMemo(
//     () => createTheme({
//       palette: {
//         mode,
//         primary: {
//           main: mode === 'dark' ? '#90caf9' : '#1976d2',
//         },
//         background: {
//           default: mode === 'dark' ? '#121212' : '#f5f5f5',
//           paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
//         },
//       },
//       components: {
//         MuiAppBar: {
//           styleOverrides: {
//             root: {
//               backgroundColor: mode === 'dark' 
//                 ? 'rgba(30, 30, 30, 0.8)' 
//                 : 'rgba(255, 255, 255, 0.8)',
//               backdropFilter: 'blur(10px)',
//               color: mode === 'dark' ? '#ffffff' : '#000000',
//             },
//           },
//         },
//       },
//     }),
//     [mode]
//   );

//   // Authentication and mode persistence
//   useEffect(() => {
//     // Check localStorage for color mode
//     const savedMode = localStorage.getItem('colorMode');
//     if (savedMode) {
//       setMode(savedMode);
//     }

//     // Check authentication status
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
//   }, []);

//   // Toggle color mode
//   const toggleColorMode = () => {
//     const newMode = mode === 'light' ? 'dark' : 'light';
//     setMode(newMode);
//     localStorage.setItem('colorMode', newMode);
//   };

//   // Drawer toggle
//   const toggleDrawer = (open) => (event) => {
//     if (
//       event.type === "keydown" &&
//       (event.key === "Tab" || event.key === "Shift")
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   // Profile menu handlers
//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setIsLoggedIn(false);
//     setUserProfile(null);
//     setAnchorEl(null);
//     router.push('/');
//   };

//   // Navigation items with click handlers
//   const navItems = [
//     { 
//       text: 'DG Shipping', 
//       onClick: () => router.push('/'),
//       disabled: false
//     },
//     { 
//       text: 'Visa Applications', 
//       onClick: () => {},
//       disabled: true
//     },
//     { 
//       text: 'Study Materials', 
//       onClick: () => {},
//       disabled: true
//     },
//     { 
//       text: 'Contact Us', 
//       onClick: () => router.push('/contact'),
//       disabled: false
//     }
//   ];

//   return (
//     <html lang="en">
//       <head>
//         <title>Marine Resources</title>
//       </head>
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <AppBar position="fixed">
//             <Toolbar sx={{ justifyContent: 'space-between' }}>
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 aria-label="menu"
//                 onClick={toggleDrawer(true)}
//                 sx={{ mr: 2 }}
//               >
//                 <MenuIcon />
//               </IconButton>
              
//               <Typography 
//                 variant="h6" 
//                 component="div" 
//                 sx={{ 
//                   flexGrow: 1, 
//                   cursor: 'pointer' 
//                 }}
//                 onClick={() => router.push('/')}
//               >
//                 MARINE RESOURCES
//               </Typography>

//               <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
//                 {navItems.map((item) => (
//                   <Button 
//                     key={item.text}
//                     color="inherit"
//                     disabled={item.disabled}
//                     onClick={item.onClick}
//                   >
//                     {item.text}
//                   </Button>
//                 ))}
                
//                 {!isLoggedIn && (
//                   <Link href="/login" passHref>
//                     <Button color="inherit">Login</Button>
//                   </Link>
//                 )}
//               </Box>

//               {isLoggedIn ? (
//                 <Avatar 
//                   variant="square"
//                   src={userProfile?.profile_picture || undefined}
//                   onClick={handleProfileMenuOpen}
//                   sx={{ 
//                     cursor: 'pointer', 
//                     borderRadius: 2,
//                     width: 40,
//                     height: 40 
//                   }}
//                 />
//               ) : (
//                 <MaterialUISwitch
//                   checked={mode === 'dark'}
//                   onChange={toggleColorMode}
//                 />
//               )}
//             </Toolbar>
//           </AppBar>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleProfileMenuClose}
//           >
//             <Link href="/profile" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//               <MenuItem>
//                 <PersonIcon sx={{ mr: 1 }} /> Profile
//               </MenuItem>
//             </Link>
//             <MenuItem disabled>
//               <SettingsIcon sx={{ mr: 1 }} /> Settings
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>
//               <LogoutIcon sx={{ mr: 1 }} /> Logout
//             </MenuItem>
//           </Menu>

//           <StyledDrawer
//             anchor="left"
//             open={drawerOpen}
//             onClose={toggleDrawer(false)}
//           >
//             <Box
//               sx={{ width: 280, pt: 8 }}
//               role="presentation"
//               onClick={toggleDrawer(false)}
//               onKeyDown={toggleDrawer(false)}
//             >
//               <List>
//                 {navItems.map((item) => (
//                   <ListItem 
//                     key={item.text}
//                     button 
//                     disabled={item.disabled}
//                     onClick={item.onClick}
//                   >
//                     <ListItemText primary={item.text} />
//                   </ListItem>
//                 ))}
//                 {!isLoggedIn && (
//                   <Link href="/login" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
//                     <ListItem button>
//                       <ListItemText primary="Login" />
//                     </ListItem>
//                   </Link>
//                 )}
//                 <ListItem>
                  
//                   <ListItemText primary=" Dark/Light Mode" />
//                   <MaterialUISwitch
//                     checked={mode === 'dark'}
//                     onChange={toggleColorMode}
//                   />
//                 </ListItem>
//               </List>
//             </Box>
//           </StyledDrawer>

//           <Box sx={{ marginTop: '64px' }}>
//             {children}
//           </Box>
//         </ThemeProvider>
//       </body>
//     </html>
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
  ListItemText, 
  Avatar,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';
import { MaterialUISwitch } from '../utils/MaterialUISwitch';

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

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

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

    // Initial check
    checkAuthStatus();

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkAuthStatus();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });

    // Cleanup listener
    return () => {
      authListener.subscription.unsubscribe();
    };
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
    setAnchorEl(null);  // Add this line to close the menu
    router.push('/');
  };

  // Navigation items with click handlers
  const navItems = [
    { 
      text: 'DG Shipping', 
      onClick: () => router.push('/'),
      disabled: false
    },
    { 
      text: 'Visa Applications', 
      onClick: () => {},
      disabled: true
    },
    { 
      text: 'Study Materials', 
      onClick: () => {},
      disabled: true
    },
    { 
      text: 'Contact Us', 
      onClick: () => router.push('/contact'),
      disabled: false
    }
  ];

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
              
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  cursor: 'pointer' 
                }}
                onClick={() => router.push('/')}
              >
                MARINE RESOURCES
              </Typography>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.text}
                    color="inherit"
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {!isLoggedIn && (
                  <Link href="/login" passHref>
                    <Button color="inherit">Login</Button>
                  </Link>
                )}
              </Box>

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
                <MaterialUISwitch
                  checked={mode === 'dark'}
                  onChange={toggleColorMode}
                />
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
                {navItems.map((item) => (
                  <ListItem 
                    key={item.text}
                    button 
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                {!isLoggedIn && (
                  <Link href="/login" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button>
                      <ListItemText primary="Login" />
                    </ListItem>
                  </Link>
                )}
                <ListItem>
                  <ListItemText primary="Dark/Light Mode" />
                  <MaterialUISwitch
                    checked={mode === 'dark'}
                    onChange={toggleColorMode}
                  />
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