import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  width: 300,
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newpw: "" });
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        const res = await axios.get("http://127.0.0.1:8000/user/get_info", {
          headers,
        });
        const userData = res.data.data;

        setUser(userData);
        setForm({
          name: userData.name || "",
          email: userData.email || "",
          username: userData.username || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const res = await axios.put(
        "http://127.0.0.1:8000/user/update_info/",
        form,
        { headers },
      );
      setApiError("");
      console.log("Profile updated:", res.data);
    } catch (error) {
      console.error("Failed to update profile:", error.response.data.data);
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
        errorMsg = "Update Failed. Please try again.";
      }
      setApiError(errorMsg);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    try {
      const body = {
        current_password: passwordForm.current,
        new_password: passwordForm.newpw,
      };
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const res = await axios.patch(
        "http://127.0.0.1:8000/user/update_password/",
        body,
        { headers },
      );
      console.log("Password changed:", res.data);
      setApiError("");
      setOpen(false);
      setPasswordForm({ current: "", newpw: "" });
    } catch (err) {
      console.error("Password change failed:", err.response.data.message);
      setApiError(err.response.data.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{ p: 3, maxWidth: 500, mx: "auto" }}
      >
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        {apiError && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {apiError}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2, ml: 2 }}
          onClick={() => setOpen(true)}
        >
          Change Password
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handlePwChange} sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          {apiError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {apiError}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            name="current"
            value={passwordForm.current}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, current: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            name="newpw"
            value={passwordForm.newpw}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newpw: e.target.value }))
            }
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
