'use client';
import { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  MenuItem 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import { v4 as uuidv4 } from 'uuid';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    rank: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create user authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;

      // Generate unique filename
      let profilePictureUrl = null;
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `${authData.user.id}_${uuidv4()}.${fileExt}`;
        
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile_pictures')
          .upload(fileName, profilePicture);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile_pictures')
          .getPublicUrl(fileName);

        profilePictureUrl = urlData.publicUrl;
      }

      // Insert user details
      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          mobile: '+91' + formData.mobile,
          rank: formData.rank,
          profile_picture: profilePictureUrl,
          is_admin: false
        });

      if (userError) throw userError;

      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            value="+91"
            disabled
            sx={{ width: '80px' }}
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            inputProps={{ pattern: "[0-9]*" }}
            required
          />
        </Box>
        <TextField
          fullWidth
          label="Rank"
          name="rank"
          select
          value={formData.rank}
          onChange={handleChange}
          required
        >
          <MenuItem value="Junior">Junior</MenuItem>
          <MenuItem value="Mid-Level">Mid-Level</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
        </TextField>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Profile Picture
          <input 
            type="file" 
            hidden 
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {profilePicture && (
          <Typography variant="body2">
            {profilePicture.name}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}