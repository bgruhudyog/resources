'use client';
import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === 'Lee@2026') {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6">Admin Login</Typography>
      <Typography variant="subtitle1">
        Welcome, Rajyavardhan Singh Rathore
      </Typography>
      <TextField
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
}


// 'use client';
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { 
//   Container, 
//   TextField, 
//   Button, 
//   Typography, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel 
// } from '@mui/material';
// import { useRouter } from 'next/navigation';

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL, 
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginMethod, setLoginMethod] = useState('');
//   const [requestEmail, setRequestEmail] = useState('');
//   const [authorizedEmails, setAuthorizedEmails] = useState([]);
//   const router = useRouter();

//   // Fetch authorized admin emails from Supabase
//   useEffect(() => {
//     async function fetchAuthorizedEmails() {
//       const { data, error } = await supabase
//         .from('admin_users')
//         .select('email');
      
//       if (data) {
//         setAuthorizedEmails(data.map(item => item.email));
//       }
//     }
//     fetchAuthorizedEmails();
//   }, []);

//   const handleAdminLogin = async () => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password
//       });

//       if (error) throw error;

//       // Check if the logged-in user is an authorized admin
//       const { data: adminCheck } = await supabase
//         .from('admin_users')
//         .select('email')
//         .eq('email', email)
//         .single();

//       if (adminCheck) {
//         sessionStorage.setItem('isAdminLoggedIn', 'true');
//         router.push('/');
//       } else {
//         alert('You are not authorized to access admin dashboard');
//       }
//     } catch (error) {
//       alert('Login failed: ' + error.message);
//     }
//   };

//   const handleAccessRequest = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('admin_access_requests')
//         .insert({ email: requestEmail });
      
//       if (error) throw error;
      
//       alert('Access request submitted successfully');
//       setRequestEmail('');
//       setLoginMethod('');
//     } catch (error) {
//       alert('Request submission failed: ' + error.message);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Typography variant="h6">Admin Login</Typography>
      
//       <FormControl fullWidth margin="normal">
//         <InputLabel>Login Method</InputLabel>
//         <Select 
//           value={loginMethod}
//           label="Login Method"
//           onChange={(e) => setLoginMethod(e.target.value)}
//         >
//           {authorizedEmails.map(authorizedEmail => (
//             <MenuItem key={authorizedEmail} value={authorizedEmail}>
//               {authorizedEmail}
//             </MenuItem>
//           ))}
//           <MenuItem value="other">Request Access</MenuItem>
//         </Select>
//       </FormControl>

//       {loginMethod && loginMethod !== 'other' && (
//         <>
//           <TextField
//             fullWidth
//             type="password"
//             label="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//           />
//           <Button 
//             variant="contained" 
//             onClick={handleAdminLogin}
//             sx={{ mr: 2 }}
//           >
//             Login
//           </Button>
//           <Button 
//             variant="outlined"
//             onClick={() => setLoginMethod('')}
//           >
//             Cancel
//           </Button>
//         </>
//       )}

//       {loginMethod === 'other' && (
//         <>
//           <TextField
//             fullWidth
//             label="Email for Access Request"
//             value={requestEmail}
//             onChange={(e) => setRequestEmail(e.target.value)}
//             margin="normal"
//           />
//           <Button 
//             variant="contained"
//             onClick={handleAccessRequest}
//           >
//             Request Admin Access
//           </Button>
//         </>
//       )}
//     </Container>
//   );
// }

// // export default AdminLogin;