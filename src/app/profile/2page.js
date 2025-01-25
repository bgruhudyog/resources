

"use client";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockResetIcon from '@mui/icons-material/LockReset';

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // State management
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    mobile: false,
    professionalInfo: false
  });
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    rank: '',
    cdcNumber: '',
    indosNumber: '',
    passportNumber: '',
    sidCardNumber: ''
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserData(data);
        setFormData({
          fullName: data.full_name,
          mobile: data.mobile,
          rank: data.rank,
          cdcNumber: data.professional_info?.cdc_number || '',
          indosNumber: data.professional_info?.indos_number || '',
          passportNumber: data.professional_info?.passport_number || '',
          sidCardNumber: data.professional_info?.sid_card_number || ''
        });
      }
    };

    fetchUserData();
  }, [router]);

  // Profile Picture Update
  const handleProfilePictureUpdate = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userData.user_id}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `profile_pictures/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile_pictures')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile_pictures')
          .getPublicUrl(filePath);

        const { error } = await supabase
          .from('users')
          .update({ profile_picture: publicUrl })
          .eq('user_id', userData.user_id);

        if (error) throw error;

        setUserData(prev => ({ ...prev, profile_picture: publicUrl }));
        setSnackbar({ 
          open: true, 
          message: 'Profile picture updated successfully', 
          severity: 'success' 
        });
      } catch (error) {
        setSnackbar({ 
          open: true, 
          message: 'Error updating profile picture', 
          severity: 'error' 
        });
      }
    }
  };

  // Update Name
  const handleNameUpdate = async () => {
    if (formData.fullName !== userData.full_name) {
      const { error } = await supabase
        .from('users')
        .update({ full_name: formData.fullName })
        .eq('user_id', userData.user_id);

      if (!error) {
        setUserData(prev => ({ ...prev, full_name: formData.fullName }));
        setEditMode(prev => ({ ...prev, name: false }));
        setSnackbar({ 
          open: true, 
          message: 'Name updated successfully', 
          severity: 'success' 
        });
      }
    } else {
      setEditMode(prev => ({ ...prev, name: false }));
    }
  };

  // Update Mobile
  const handleMobileUpdate = async () => {
    if (formData.mobile !== userData.mobile) {
      const { error } = await supabase
        .from('users')
        .update({ mobile: formData.mobile })
        .eq('user_id', userData.user_id);

      if (!error) {
        setUserData(prev => ({ ...prev, mobile: formData.mobile }));
        setEditMode(prev => ({ ...prev, mobile: false }));
        setSnackbar({ 
          open: true, 
          message: 'Mobile number updated successfully', 
          severity: 'success' 
        });
      }
    } else {
      setEditMode(prev => ({ ...prev, mobile: false }));
    }
  };

  // Update Professional Info
  const handleProfessionalInfoUpdate = async () => {
    const professionalInfo = {
      cdc_number: formData.cdcNumber,
      indos_number: formData.indosNumber,
      passport_number: formData.passportNumber,
      sid_card_number: formData.sidCardNumber
    };

    const { error } = await supabase
      .from('users')
      .update({ 
        rank: formData.rank, 
        professional_info: professionalInfo 
      })
      .eq('user_id', userData.user_id);

    if (!error) {
      setUserData(prev => ({ 
        ...prev, 
        rank: formData.rank,
        professional_info: professionalInfo 
      }));
      setEditMode(prev => ({ ...prev, professionalInfo: false }));
      setSnackbar({ 
        open: true, 
        message: 'Professional information updated successfully', 
        severity: 'success' 
      });
    }
  };

  // Change Password
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({ 
        open: true, 
        message: 'New passwords do not match', 
        severity: 'error' 
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordDialog(false);
      setSnackbar({ 
        open: true, 
        message: 'Password updated successfully', 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error updating password', 
        severity: 'error' 
      });
    }
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      {/* Personal Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <Box position="relative">
            <Avatar
              src={userData.profile_picture}
              sx={{ width: 120, height: 120, mr: 3 }}
            />
            <input
              accept="image/*"
              type="file"
              id="profile-picture-input"
              style={{ display: 'none' }}
              onChange={handleProfilePictureUpdate}
            />
            <label htmlFor="profile-picture-input">
              <IconButton 
                component="span" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 20, 
                  bgcolor: 'background.paper', 
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              >
                <CameraAltIcon />
              </IconButton>
            </label>
          </Box>
          <Box flexGrow={1}>
            {!editMode.name ? (
              <Box display="flex" alignItems="center">
                <Typography variant="h5">{userData.full_name}</Typography>
                <IconButton onClick={() => setEditMode(prev => ({ ...prev, name: true }))}>
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
                <Button 
                  variant="contained" 
                  onClick={handleNameUpdate}
                  disabled={formData.fullName === userData.full_name}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Contact Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Contact Information</Typography>
        {!editMode.mobile ? (
          <Box display="flex" alignItems="center">
            <Typography>Mobile: {userData.mobile}</Typography>
            <IconButton onClick={() => setEditMode(prev => ({ ...prev, mobile: true }))}>
              <EditIcon />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
            />
            <Button 
              variant="contained" 
              onClick={handleMobileUpdate}
              disabled={formData.mobile === userData.mobile}
            >
              Save
            </Button>
          </Box>
        )}
        <Typography>Email: {userData.email} (Cannot be changed)</Typography>
      </Paper>

      {/* Professional Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Professional Information</Typography>
        {!editMode.professionalInfo ? (
          <>
            <Typography>Rank: {userData.rank}</Typography>
            <Typography>CDC Number: {userData.professional_info?.cdc_number}</Typography>
            <Typography>Indos Number: {userData.professional_info?.indos_number}</Typography>
            <Typography>Passport Number: {userData.professional_info?.passport_number}</Typography>
            <Typography>SID Card Number: {userData.professional_info?.sid_card_number}</Typography>
            <Button 
              startIcon={<EditIcon />} 
              onClick={() => setEditMode(prev => ({ ...prev, professionalInfo: true }))}
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Rank"
              value={formData.rank}
              onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="CDC Number"
              value={formData.cdcNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, cdcNumber: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Indos Number"
              value={formData.indosNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, indosNumber: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Passport Number"
              value={formData.passportNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="SID Card Number"
              value={formData.sidCardNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, sidCardNumber: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={handleProfessionalInfoUpdate}
            >
              Save
            </Button>
          </>
        )}
      </Paper>

      {/* Security */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Security</Typography>
        <Button 
          startIcon={<LockResetIcon />}
          variant="contained" 
          onClick={() => setPasswordDialog(true)}
        >
          Change Password
        </Button>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange}
            disabled={!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
