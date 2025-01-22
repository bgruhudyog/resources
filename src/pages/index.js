// pages/index.js
import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import { supabase } from './_app';

export default function Home({ darkMode, setDarkMode }) {
  const [content, setContent] = useState({ text: '', link: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data, error } = await supabase
      .from('dg_shipping')
      .select('*')
      .single();
    
    if (data) setContent(data);
  }

  return (
    <Box>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography 
          variant="body1" 
          component="a" 
          href={content.link}
          target="_blank"
          sx={{ 
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          {content.text}
        </Typography>
      </Container>
    </Box>
  );
}