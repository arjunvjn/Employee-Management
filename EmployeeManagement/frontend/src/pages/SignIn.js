import { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn({ setIsAuthenticated }) {
  const nav = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [inputChnage, setInputChange] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {}, [inputChnage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const errors = {};

    ["username", "password"].forEach((field) => {
      if (!values[field]) {
        errors[field] = "This field is required";
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length == 0) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/user/login",
          values,
        );
        console.log("Signup successful:", response.data);
        setApiError("");
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        setIsAuthenticated(true);
        nav("/");
      } catch (error) {
        console.log(error.response.data);
        let errorMsg = error.response.data.detail;
        if (!errorMsg) {
          errorMsg = "Signin failed. Please try again.";
        }
        setApiError(errorMsg);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {apiError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {apiError}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={formErrors.username}
            helperText={formErrors.username}
            onChange={() => {
              delete formErrors.username;
              setInputChange(!inputChnage);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={formErrors.password}
            helperText={formErrors.password}
            onChange={() => {
              delete formErrors.password;
              setInputChange(!inputChnage);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
