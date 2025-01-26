"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";
import { MaterialUISwitch } from "../utils/MaterialUISwitch";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(30, 30, 30, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "0 20px 20px 0",
    border: "none",
  },
}));

export default function RootLayout({ children }) {
  const [mode, setMode] = useState("light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  // Theme creation
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#90caf9" : "#1976d2",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(30, 30, 30, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                color: mode === "dark" ? "#ffffff" : "#000000",
              },
            },
          },
        },
      }),
    [mode]
  );

  // Authentication and mode persistence
  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode");
    if (savedMode) {
      setMode(savedMode);
    }

    const checkAuthStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("profile_picture, full_name")
          .eq("email", user.email)
          .single();

        setUserProfile(userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          checkAuthStatus();
        } else if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAnchorEl(null);
    router.push("/");
  };

  const navItems = [
    {
      text: "DG Shipping",
      onClick: () => router.push("/"),
      disabled: false,
    },
    {
      text: "Visa Applications",
      onClick: () => {},
      disabled: true,
    },
    {
      text: "Study Materials",
      onClick: () => {},
      disabled: true,
    },
    {
      text: "Contact Us",
      onClick: () => router.push("/contact"),
      disabled: false,
    },
  ];

  return (
    <html lang="en">
      <head>
        <title>Marine Resources</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push("/")}
                >
                  MARINE RESOURCES
                </Typography>
              </Box>

              {/* Center Section */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 2,
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Right Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {!isLoggedIn && (
                  <Link href="/login" passHref>
                    <Button color="inherit">Login</Button>
                  </Link>
                )}
                {isLoggedIn ? (
                  <Avatar
                    variant="square"
                    src={userProfile?.profile_picture || undefined}
                    onClick={handleProfileMenuOpen}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      width: 40,
                      height: 40,
                      marginLeft: 2,
                    }}
                  />
                ) : (
                  <MaterialUISwitch
                    checked={mode === "dark"}
                    onChange={toggleColorMode}
                  />
                )}
              </Box>
            </Toolbar>
          </AppBar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <Link
              href="/profile"
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleProfileMenuClose}
            >
              <MenuItem>
                <PersonIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
            </Link>
            <MenuItem disabled>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
          <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {/* ... other drawer content ... */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: 1,
              }}
            >
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ textTransform: "uppercase" }}
              >
                Menu
              </Typography>
            </Box>


            <Box
              sx={{ width: 280, pt: 2 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {navItems.map((item) => (
                  <ListItem
                    key={item.text}
                    button={!item.disabled}
                    onClick={!item.disabled ? item.onClick : undefined}
                    disabled={item.disabled}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}

                {!isLoggedIn && (
                  <ListItem
                    button
                    component={Link}
                    href="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText primary="Login" />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemText primary="Dark/Light Mode" />
                  <MaterialUISwitch
                    checked={mode === "dark"}
                    onChange={toggleColorMode}
                  />
                </ListItem>
              </List>
            </Box>
          </StyledDrawer>

          {/* <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: 1,
              }}
            >
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ textTransform: "uppercase" }}
              >
                Menu
              </Typography>
            </Box>

            <Box
              sx={{ width: 280, pt: 2 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {navItems.map((item) => (
                  <ListItem
                    key={item.text}
                    button={!item.disabled}
                    component={!item.disabled ? Link : "div"}
                    href={!item.disabled ? item.href : undefined}
                    onClick={!item.disabled ? item.onClick : undefined}
                    disabled={item.disabled}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}

                {!isLoggedIn && (
                  <ListItem
                    button
                    component={Link}
                    href="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText primary="Login" />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemText primary="Dark/Light Mode" />
                  <MaterialUISwitch
                    checked={mode === "dark"}
                    onChange={toggleColorMode}
                  />
                </ListItem>
              </List>
            </Box>
          </StyledDrawer> */}

          <Box sx={{ marginTop: "64px" }}>{children}</Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
