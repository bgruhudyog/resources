"use client";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      setUserData(userData);
      setEditedData({
        full_name: userData.full_name,
        mobile: userData.mobile.replace("+91", ""),
        rank: userData.rank,
      });
    };

    fetchUserData();
  }, [router]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Previous update profile logic remains the same
      let profilePictureUrl = userData.profile_picture;
      if (profilePicture) {
        const fileExt = profilePicture.name.split(".").pop();
        const fileName = `${userData.user_id}_profile.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(fileName, profilePicture, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("profile_pictures")
          .getPublicUrl(fileName);

        profilePictureUrl = urlData.publicUrl;
      }

      // Update user details
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: editedData.full_name,
          mobile: "+91" + editedData.mobile,
          rank: editedData.rank,
          profile_picture: profilePictureUrl,
        })
        .eq("email", userData.email);

      if (updateError) throw updateError;

      // Refresh user data
      setUserData((prev) => ({
        ...prev,
        full_name: editedData.full_name,
        mobile: "+91" + editedData.mobile,
        rank: editedData.rank,
        profile_picture: profilePictureUrl,
      }));

      setProfilePicture(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      return;
    }

    try {
      // Reauthenticate user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.oldPassword,
      });

      if (reauthError) {
        setSnackbar({
          open: true,
          message: "Incorrect current password",
          severity: "error",
        });
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        setSnackbar({
          open: true,
          message: "Failed to update password",
          severity: "error",
        });
        return;
      }

      // Reset password dialog and show success
      setPasswordDialogOpen(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setSnackbar({
        open: true,
        message: "Password successfully changed",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Rest of the component remains the same as previous implementation */}
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box
        component="form"
        onSubmit={handleUpdateProfile}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Avatar
          src={userData.profile_picture || undefined}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Button variant="contained" component="label">
          Update Profile Picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {profilePicture && (
          <Typography variant="body2">{profilePicture.name}</Typography>
        )}
        <TextField
          fullWidth
          label="Full Name"
          name="full_name"
          value={editedData.full_name}
          onChange={handleDataChange}
          required
        />
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
        >
          <TextField value="+91" disabled sx={{ width: "80px" }} />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={editedData.mobile}
            onChange={handleDataChange}
            inputProps={{ pattern: "[0-9]*" }}
            required
          />
        </Box>
        <TextField
          fullWidth
          label="Rank"
          name="rank"
          value={userData.rank}
          onChange={handleDataChange}
          required
        />
        <TextField fullWidth label="Email" value={userData.email} disabled />
        <Button variant="contained" color="primary" type="submit">
          Update Profile
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setPasswordDialogOpen(true)}
        >
          Change Password
        </Button>
      </Box>

      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handlePasswordChange}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }))
              }
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmNewPassword: e.target.value,
                }))
              }
              required
            />
            <DialogActions>
              <Button onClick={() => setPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Change Password
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
