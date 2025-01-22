// pages/admin.js
import { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography 
} from '@mui/material';
import Navbar from '../components/Navbar';
import { supabase } from './_app';

export default function Admin({ darkMode, setDarkMode }) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState({ text: '', link: '' });
  const [isEditing, setIsEditing] = useState({ text: false, link: false });

  const handleLogin = () => {
    if (password === 'your-secure-password') {
      setIsLoggedIn(true);
      fetchContent();
    }
  };

  async function fetchContent() {
    const { data } = await supabase
      .from('dg_shipping')
      .select('*')
      .single();
    
    if (data) setContent(data);
  }

  async function updateContent(field) {
    await supabase
      .from('dg_shipping')
      .update({ [field]: content[field] })
      .eq('id', 1);
    
    setIsEditing({ ...isEditing, [field]: false });
  }

  if (!isLoggedIn) {
    return (
      <Box>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
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
      </Box>
    );
  }

  return (
    <Box>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          {isEditing.text ? (
            <>
              <TextField
                fullWidth
                multiline
                value={content.text}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
              />
              <Button onClick={() => updateContent('text')}>Update</Button>
            </>
          ) : (
            <>
              <Typography>{content.text}</Typography>
              <Button onClick={() => setIsEditing({ ...isEditing, text: true })}>
                Edit Text
              </Button>
            </>
          )}
        </Box>

        <Box>
          {isEditing.link ? (
            <>
              <TextField
                fullWidth
                value={content.link}
                onChange={(e) => setContent({ ...content, link: e.target.value })}
              />
              <Button onClick={() => updateContent('link')}>Update</Button>
            </>
          ) : (
            <>
              <Typography>{content.link}</Typography>
              <Button onClick={() => setIsEditing({ ...isEditing, link: true })}>
                Edit Link
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}