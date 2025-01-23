'use client';
import { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link as MUILink 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if user is in users table and get admin status
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      // Set admin status in session storage
      sessionStorage.setItem('isAdminLoggedIn', userData.is_admin.toString());
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          Don't have an account? {' '}
          <MUILink href="/register" color="primary">
            Register here
          </MUILink>
        </Typography>
      </Box>
    </Container>
  );
}