"use client";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);
  }, []);

  // Fetch user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("email, full_name")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setUserData(data);
          setFormData((prev) => ({
            ...prev,
            name: data.full_name,
            email: data.email,
          }));
        }
      }
    };

    fetchUserData();
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate form before submission
  const validateForm = () => {
    let tempErrors = { name: "", email: "", subject: "", message: "" };
    let formIsValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      formIsValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      formIsValid = false;
    } else if (!validateEmail(formData.email)) {
      tempErrors.email = "Invalid email format";
      formIsValid = false;
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = "Subject is required";
      formIsValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Send email to admin
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN,
        {
          to_email: "rajyavardhansrm@gmail.com",
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );

      // Optional: Uncomment to send user confirmation
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_USER,
        {
          to_email: formData.email,
          from_name: "Your Application Name",
          subject: "We've Received Your Message",
          message: `Thank you for contacting us, ${formData.name}! We've received your message and will get back to you soon.`,
        }
      );

      setSnackbar({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ fontFamily: "Roboto, sans-serif", py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Contact Us
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={!!userData?.email}
            />

            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              error={!!errors.subject}
              helperText={errors.subject}
              required
            />

            <TextField
              fullWidth
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              error={!!errors.message}
              helperText={errors.message}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? <CircularProgress size={24} /> : "Send Message"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}