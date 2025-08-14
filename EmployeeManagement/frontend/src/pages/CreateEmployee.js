import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateEmployee() {
  const nav = useNavigate();
  const location = useLocation();
  const editingEmployee = location.state?.employee || null;

  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        const res = await axios.get("http://127.0.0.1:8000/form", { headers });
        console.log(res.data.data);
        const fetchedFields = res.data.data.map((field, index) => ({
          ...field,
          id: `${field.id}`,
        }));
        setFields(fetchedFields);

        if (editingEmployee) {
          const prefillData = {};
          fetchedFields.forEach((field) => {
            prefillData[field.name] = editingEmployee.data[field.name];
          });
          setFormData(prefillData);
        }
      } catch (err) {
        console.error("Failed to load fields:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form:", formData);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    if (editingEmployee) {
      await axios
        .put(
          `http://127.0.0.1:8000/employee/${editingEmployee.id}/`,
          formData,
          { headers },
        )
        .then((res) => {
          console.log("Submitted successfully:", res);
          setApiError("");
          nav("/");
        })
        .catch((err) => {
          console.error("Submit error:", err.response.data);
          setApiError("Failed. Please try again.");
        });
    } else {
      await axios
        .post("http://127.0.0.1:8000/employee/", formData, { headers })
        .then((res) => {
          console.log("Submitted successfully:", res);
          setApiError("");
          nav("/");
        })
        .catch((err) => {
          console.error("Submit error:", err.response.data);
          setApiError("Failed. Please try again.");
        });
    }
  };

  const getInputProps = (type) => {
    if (type === "float") {
      return { inputProps: { step: "any" } };
    }
    return {};
  };

  const mapFieldType = (type) => {
    if (type == "int" || type == "float") return "number";
    if (type == "str") return "text";
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Record
      </Typography>
      {apiError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}

      {fields.map((field) => {
        const { id, name, field_type, order } = field;

        return (
          <TextField
            key={name}
            label={name}
            type={mapFieldType(field_type)}
            fullWidth
            margin="normal"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            {...getInputProps(field_type)}
          />
        );
      })}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => nav("/")}
        >
          Back
        </Button>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
