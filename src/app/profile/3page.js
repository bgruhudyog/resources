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
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  // State management
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    mobile: false,
    professionalInfo: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    rank: "",
    cdcNumber: "",
    indosNumber: "",
    passportNumber: "",
    sidCardNumber: "",
  });
  const [originalFormData, setOriginalFormData] = useState({});
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUserData(data);
        const profileData = {
          fullName: data.full_name,
          mobile: data.mobile,
          email: data.email,
          rank: data.rank,
          cdcNumber: data.professional_info?.cdc_number || "",
          indosNumber: data.professional_info?.indos_number || "",
          passportNumber: data.professional_info?.passport_number || "",
          sidCardNumber: data.professional_info?.sid_card_number || "",
        };
        setFormData(profileData);
        setOriginalFormData(profileData);
      }
    };

    fetchUserData();
  }, [router]);

  // Toggle Edit Mode
  const toggleEditMode = (section) => {
    setEditMode((prev) => {
      const newEditMode = { ...prev, [section]: !prev[section] };
      if (!newEditMode[section]) {
        // Reset form data when cancelling
        setFormData(originalFormData);
      }
      return newEditMode;
    });
  };

  // Updated Name Update Method
  const handleNameUpdate = async () => {
    if (formData.fullName !== originalFormData.fullName) {
      const { error } = await supabase
        .from("users")
        .update({ full_name: formData.fullName })
        .eq("user_id", userData.user_id);

      if (!error) {
        setUserData((prev) => ({ ...prev, full_name: formData.fullName }));
        setOriginalFormData((prev) => ({
          ...prev,
          fullName: formData.fullName,
        }));
        setEditMode((prev) => ({ ...prev, name: false }));
        setSnackbar({
          open: true,
          message: "Name updated successfully",
          severity: "success",
        });
      }
    } else {
      setEditMode((prev) => ({ ...prev, name: false }));
    }
  };

  // Updated Mobile Update Method
  const handleMobileUpdate = async () => {
    if (formData.mobile !== originalFormData.mobile) {
      const { error } = await supabase
        .from("users")
        .update({ mobile: formData.mobile })
        .eq("user_id", userData.user_id);

      if (!error) {
        setUserData((prev) => ({ ...prev, mobile: formData.mobile }));
        setOriginalFormData((prev) => ({ ...prev, mobile: formData.mobile }));
        setEditMode((prev) => ({ ...prev, mobile: false }));
        setSnackbar({
          open: true,
          message: "Mobile number updated successfully",
          severity: "success",
        });
      }
    } else {
      setEditMode((prev) => ({ ...prev, mobile: false }));
    }
  };

  // Updated Professional Info Update Method
  const handleProfessionalInfoUpdate = async () => {
    const professionalInfo = {
      cdc_number: formData.cdcNumber,
      indos_number: formData.indosNumber,
      passport_number: formData.passportNumber,
      sid_card_number: formData.sidCardNumber,
    };

    const { error } = await supabase
      .from("users")
      .update({
        rank: formData.rank,
        professional_info: professionalInfo,
      })
      .eq("user_id", userData.user_id);

    if (!error) {
      setUserData((prev) => ({
        ...prev,
        rank: formData.rank,
        professional_info: professionalInfo,
      }));
      setOriginalFormData((prev) => ({
        ...prev,
        rank: formData.rank,
        cdcNumber: formData.cdcNumber,
        indosNumber: formData.indosNumber,
        passportNumber: formData.passportNumber,
        sidCardNumber: formData.sidCardNumber,
      }));
      setEditMode((prev) => ({ ...prev, professionalInfo: false }));
      setSnackbar({
        open: true,
        message: "Professional information updated successfully",
        severity: "success",
      });
    }
  };

  // Profile Picture Update
  const handleProfilePictureUpdate = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userData.user_id}_${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `profile_pictures/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("profile_pictures").getPublicUrl(filePath);

        const { error } = await supabase
          .from("users")
          .update({ profile_picture: publicUrl })
          .eq("user_id", userData.user_id);

        if (error) throw error;

        setUserData((prev) => ({ ...prev, profile_picture: publicUrl }));
        setSnackbar({
          open: true,
          message: "Profile picture updated successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error updating profile picture",
          severity: "error",
        });
      }
    }
  };



  // Change Password
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match",
        severity: "error",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      setPasswordDialog(false);
      setSnackbar({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating password",
        severity: "error",
      });
    }
  };

  // Utility function to check if form data has changed
  const hasDataChanged = (section) => {
    switch (section) {
      case "name":
        return formData.fullName !== originalFormData.fullName;
      case "mobile":
        return formData.mobile !== originalFormData.mobile;
      case "professionalInfo":
        return (
          formData.rank !== originalFormData.rank ||
          formData.cdcNumber !== originalFormData.cdcNumber ||
          formData.indosNumber !== originalFormData.indosNumber ||
          formData.passportNumber !== originalFormData.passportNumber ||
          formData.sidCardNumber !== originalFormData.sidCardNumber
        );
      default:
        return false;
    }
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ fontFamily: "Roboto, sans-serif" }}>
      {/* Personal Information */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          mb: 3,
          borderRadius: 3,
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
          onClick={() => toggleEditMode("name")}
        >
          <EditIcon />
        </IconButton>

        <Box display="flex" alignItems="center">
          <Box position="relative" mr={3}>
            <Avatar
              variant="square"
              src={userData.profile_picture}
              sx={{
                width: 120,
                height: 120,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 2,
              }}
            />
            <input
              accept="image/*"
              type="file"
              id="profile-picture-input"
              style={{ display: "none" }}
              onChange={handleProfilePictureUpdate}
            />
            <label htmlFor="profile-picture-input">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </label>
          </Box>

          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            {!editMode.name ? (
              <Typography
                variant="h5"
                fontWeight="500"
                sx={{
                  fontSize: isMobile ? "1.2rem" : "2.125rem",
                  wordBreak: "break-word",
                  textAlign: "center", // Center align text if it wraps
                }}
              >
                {userData.full_name}
              </Typography>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                alignItems="center"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => toggleEditMode("name")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNameUpdate}
                    disabled={!hasDataChanged("name")}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
          onClick={() => toggleEditMode("mobile")}
        >
          <EditIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={formData.mobile}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mobile: e.target.value }))
            }
            disabled={!editMode.mobile}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={formData.email}
            disabled
          />
          {editMode.mobile && (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => toggleEditMode("mobile")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleMobileUpdate}
                disabled={!hasDataChanged("mobile")}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Professional Information */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
          onClick={() => toggleEditMode("professionalInfo")}
        >
          <EditIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Professional Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Rank"
            variant="outlined"
            value={formData.rank}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rank: e.target.value }))
            }
            disabled={!editMode.professionalInfo}
          />
          <TextField
            fullWidth
            label="CDC Number"
            variant="outlined"
            value={formData.cdcNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, cdcNumber: e.target.value }))
            }
            disabled={!editMode.professionalInfo}
          />
          <TextField
            fullWidth
            label="Indos Number"
            variant="outlined"
            value={formData.indosNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, indosNumber: e.target.value }))
            }
            disabled={!editMode.professionalInfo}
          />
          <TextField
            fullWidth
            label="Passport Number"
            variant="outlined"
            value={formData.passportNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                passportNumber: e.target.value,
              }))
            }
            disabled={!editMode.professionalInfo}
          />
          <TextField
            fullWidth
            label="SID Card Number"
            variant="outlined"
            value={formData.sidCardNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sidCardNumber: e.target.value,
              }))
            }
            disabled={!editMode.professionalInfo}
          />
          {editMode.professionalInfo && (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => toggleEditMode("professionalInfo")}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleProfessionalInfoUpdate}
                disabled={!hasDataChanged("professionalInfo")}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Security */}
      <Paper elevation={3} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Button
          startIcon={<LockResetIcon />}
          variant="contained"
          onClick={() => setPasswordDialog(true)}
        >
          Change Password
        </Button>
      </Paper>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                oldPassword: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            disabled={
              !passwordForm.newPassword ||
              passwordForm.newPassword !== passwordForm.confirmPassword
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
