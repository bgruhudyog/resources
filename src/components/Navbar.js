

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

'use client';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNavItem, setSelectedNavItem] = useState('DG Shipping');

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

  const handleNavItemChange = (event) => {
    const selectedItem = event.target.value;
    setSelectedNavItem(selectedItem);

    switch(selectedItem) {
      case 'DG Shipping':
        router.push('/');
        break;
      case 'USA Visa':
        // Add appropriate routing or modal
        break;
      case 'Study Material':
        // Add appropriate routing or modal
        break;
      case 'Contact':
        router.push('/contact');
        break;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          {/* Dropdown only for mobile screens */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Navigation</InputLabel>
              <Select
                value={selectedNavItem}
                label="visit on"
                onChange={handleNavItemChange}
                fullWidth
              >
                <MenuItem value="DG Shipping">DG Shipping</MenuItem>
                <MenuItem disabled value="Visa Applications">Visa Applications</MenuItem>
                <MenuItem disabled value="Study Material">Study Material</MenuItem>
                <MenuItem value="Contact">Contact Us</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Desktop view links */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ fontWeight: pathname === '/' ? 'bold' : 'normal' }}
              >
                DG Shipping
              </Button>
            </Link>
            <Button color="inherit" disabled>
               Visa Applications
            </Button>
            <Button color="inherit" disabled>
              Study Material
            </Button>
            <Link href="/contact" passHref style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ fontWeight: pathname === '/contact' ? 'bold' : 'normal' }}
              >
                Contact Us
              </Button>
            </Link>
          </Box>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}