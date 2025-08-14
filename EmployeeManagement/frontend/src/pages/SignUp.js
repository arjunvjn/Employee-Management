import { useState, useEffect } from "react";
import {
  Container,
  Link,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const nav = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [inputChnage, setInputChange] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {}, [inputChnage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const errors = {};

    ["username", "newPassword", "confirmPassword"].forEach((field) => {
      if (!values[field]) {
        errors[field] = "This field is required";
      }
    });

    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword != values.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length == 0) {
      const data = {
        username: values.username,
        email: values.email,
        name: values.name,
        password: values.newPassword,
      };
      try {
        const response = await axios.post("http://127.0.0.1:8000/user/", data);
        console.log("Signup successful:", response.data);
        setApiError("");
        nav("/signin");
      } catch (error) {
        console.log(error.response.data.data);
        let errorMsg = "";
        for (let err in error.response.data.data) {
          let errMsg = error.response.data.data[err][0];
          if (errorMsg) {
            errorMsg += "\n" + err + " : " + errMsg;
          } else {
            errorMsg = err + " : " + errMsg;
          }
        }
        if (!errorMsg) {
          errorMsg = "Signup failed. Please try again.";
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {apiError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {apiError}
            </Typography>
          )}
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            error={formErrors.username}
            helperText={formErrors.username}
            onChange={() => {
              delete formErrors.username;
              setInputChange(!inputChnage);
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="Password"
            type="password"
            name="newPassword"
            error={formErrors.newPassword}
            helperText={formErrors.newPassword}
            onChange={() => {
              delete formErrors.newPassword;
              setInputChange(!inputChnage);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            error={formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            onChange={() => {
              delete formErrors.confirmPassword;
              setInputChange(!inputChnage);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2">
            <Link href="/signin">Already have an account? Sign in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
