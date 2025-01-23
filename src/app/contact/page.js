// src/app/contact/page.js
'use client';
import { Container, Typography, Box } from '@mui/material';

export default function Contact() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact / suggestions
      </Typography>
      <Typography variant="body1">
        Email us at rajyavardhansrm@gmail.com
      </Typography>
    </Container>
  );
}