import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Stack,
  CircularProgress,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const nav = useNavigate();

  const [employeeList, setEmployeeList] = useState([]);
  const [fields, setFields] = useState([]);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecordsUpdated, setIsRecordsUpdated] = useState(false);

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };
        const res = await axios.get(
          `http://127.0.0.1:8000/employee/?filterField=${filterField}&search=${search}`,
          { headers },
        );
        setEmployeeList(res.data.data);
        setFields(res.data.field_names);
        if (!filterField) {
          setFilterField(res.data.field_names[0]);
        }
      } catch (err) {
        console.error("Failed to load fields:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeList();
  }, [isRecordsUpdated]);

  const handleDelete = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      await axios.delete(`http://127.0.0.1:8000/employee/${id}/`, { headers });
      setIsRecordsUpdated(!isRecordsUpdated);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleFilter = () => {
    setIsRecordsUpdated(!isRecordsUpdated);
  };

  const handleReset = () => {
    setSearch("");
    setFilterField(fields[0]);
    setIsRecordsUpdated(!isRecordsUpdated);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Home!
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 180 }}
        />
        <Select
          value={filterField}
          size="small"
          onChange={(e) => setFilterField(e.target.value)}
          sx={{ width: 140 }}
        >
          {fields.map((field, index) => (
            <MenuItem key={index} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "#555",
            borderColor: "#bbb",
            "&:hover": { borderColor: "#888", backgroundColor: "#f5f5f5" },
          }}
          size="small"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => nav("/create-employee")}
        >
          Create Record
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {fields.map((field, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {field}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeList.map((employee) => (
              <TableRow key={employee.id} hover>
                {fields.map((field, index) => (
                  <TableCell key={index}>{employee.data[field]}</TableCell>
                ))}
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      nav("/create-employee", { state: { employee } })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
