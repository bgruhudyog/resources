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