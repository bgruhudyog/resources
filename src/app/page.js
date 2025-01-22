'use client';
import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Paper
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../supabase';

export default function Home() {
  const [content, setContent] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({ text: '', link: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchContent();
    const checkAdmin = () => {
      const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
      setIsAdmin(isLoggedIn === 'true');
    };
    
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  async function fetchContent() {
    try {
      const { data, error } = await supabase
        .from('dg_shipping')
        .select('*');
      if (error) throw error;
      if (data) setContent(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from('dg_shipping')
        .insert(newContent);
      if (error) throw error;
      fetchContent();
      setIsAddDialogOpen(false);
      setNewContent({ text: '', link: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('dg_shipping')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchContent();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('dg_shipping')
        .update({
          text: editingItem.text,
          link: editingItem.link
        })
        .eq('id', editingItem.id);
      if (error) throw error;
      fetchContent();
      setEditingItem(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {isAdmin && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddDialogOpen(true)}
            size="large"
          >
            Add New Content
          </Button>
        </Box>
      )}

      {content.map((item) => (
        <Paper
          key={item.id}
          elevation={3}
          onClick={() => handleClick(item.link)}
          sx={{
            mb: 3,
            p: 4,
            borderRadius: 2,
            transition: 'all 0.3s',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6
            }
          }}
        >
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {item.text}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }} onClick={(e) => e.stopPropagation()}>
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={() => handleCopy(item.link)}
              variant="contained"
              size="medium"
              color="secondary"
            >
              Copy Link
            </Button>
            {isAdmin && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditingItem(item)}
                  variant="contained"
                  size="medium"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(item.id)}
                  variant="contained"
                  size="medium"
                  color="error"
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Paper>
      ))}

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Content</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Text"
            value={newContent.text}
            onChange={(e) => setNewContent({ ...newContent, text: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Link"
            value={newContent.link}
            onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editingItem} onClose={() => setEditingItem(null)}>
        <DialogTitle sx={{ mb: 2 }}>Edit Content</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editingItem && (
            <>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Text"
                value={editingItem.text}
                onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Link"
                value={editingItem.link}
                onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditingItem(null)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}