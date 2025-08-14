import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function CreateForm() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [isFieldDeleted, setIsFieldDeleted] = useState(false);

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
      } catch (err) {
        console.error("Failed to load fields:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, [isFieldDeleted]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(fields);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const reorderedWithOrder = reordered.map((field, index) => ({
      ...field,
      order: index + 1,
    }));

    setFields(reorderedWithOrder);
  };

  const handleAddField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      name: "",
      field_type: "str",
      order: fields.length + 1,
    };
    setFields([...fields, newField]);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleRemoveField = async (id, index) => {
    if (id.startsWith("field-")) {
      const updated = [...fields];
      updated.splice(index, 1);
      const reordered = updated.map((field, i) => ({ ...field, order: i + 1 }));
      setFields(reordered);
    } else {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        await axios.delete(`http://127.0.0.1:8000/form/${id}/`, { headers });
        setIsFieldDeleted(!isFieldDeleted);
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Saved Form Schema:", fields);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const res = await axios.post("http://127.0.0.1:8000/form/", fields, {
        headers,
      });
      setApiError("");
      console.log("Form updated:", res.data);
    } catch (error) {
      console.error("Failed to update form:", error);
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

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Form
      </Typography>
      {apiError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                          <Typography variant="h6">{index + 1}.</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Label"
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(index, "name", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            select
                            fullWidth
                            label="Input Type"
                            value={field.field_type || "str"}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "field_type",
                                e.target.value,
                              )
                            }
                          >
                            <MenuItem value="str">String</MenuItem>
                            <MenuItem value="int">Integer</MenuItem>
                            <MenuItem value="float">Float</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={2} textAlign="right">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveField(field.id, index)}
                            aria-label="delete field"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddField}
        sx={{ mt: 2 }}
      >
        Add Field
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2, ml: 2 }}
      >
        Save Form
      </Button>
    </Box>
  );
}
