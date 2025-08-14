import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Header({ setIsAuthenticated }) {
  const nav = useNavigate();
  const location = useLocation();

  const page = location.pathname;
  let button1Label = "Create Form";
  let button1Path = "/create-form";
  let button2Label = "Profile";
  let button2Path = "/profile";
  if (page == "/create-form") {
    button1Label = "Home";
    button1Path = "/";
  } else if (page == "/profile") {
    button2Label = "Home";
    button2Path = "/";
  }

  const handleLogout = async () => {
    try {
      const body = { refresh_token: localStorage.getItem("refreshToken") };
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      await axios.post("http://127.0.0.1:8000/user/logout", body, headers);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      nav("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Button color="inherit" onClick={() => nav(button1Path)}>
          {button1Label}
        </Button>
        <Button color="inherit" onClick={() => nav(button2Path)}>
          {button2Label}
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
