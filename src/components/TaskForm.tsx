import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { TaskInput, TaskPriority, TaskStatus } from "../types";

interface TaskFormProps {
  initialValues?: TaskInput | null;
  onSubmit: (formData: TaskInput) => void;
  onCancel?: () => void;
}

const AVAILABLE_ASSIGNEES = [
  "Aarav Sharma",
  "Ananya Patel",
  "Chirag Mehta",
  "Harsha Reddy",
  "Manish Verma"
];

export default function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [dueDate, setDueDate] = useState("");
  const [assigneeName, setAssigneeName] = useState("Aarav Sharma");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setPriority(initialValues.priority || "Medium");
      setStatus(initialValues.status || "Pending");
      setDueDate(initialValues.dueDate || new Date().toISOString().slice(0, 10));
      setAssigneeName(initialValues.assigneeName || "Aarav Sharma");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Pending");
      setDueDate(new Date().toISOString().slice(0, 10));
      setAssigneeName("Aarav Sharma");
    }
    setError("");
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: status === "Completed" || status === "Launched",
      priority,
      status,
      dueDate,
      assigneeName,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, px: 2, py: 2 }}
    >
      <TextField
        id="task-title"
        label="Task Title"
        required
        fullWidth
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (e.target.value.trim()) {
            setError("");
          }
        }}
        error={!!error}
        helperText={error}
        variant="outlined"
        placeholder="e.g. Solutions Pages"
      />

      <TextField
        id="task-description"
        label="Description / Checklist"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        placeholder="Explain what needs to be done..."
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="task-priority-label">Priority</InputLabel>
          <Select
            labelId="task-priority-label"
            id="task-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            label="Priority"
          >
            <MenuItem value="Low">🟢 Low Priority</MenuItem>
            <MenuItem value="Medium">🟡 Medium Priority</MenuItem>
            <MenuItem value="High">🔴 High Priority</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="task-status-label">Status Stage</InputLabel>
          <Select
            labelId="task-status-label"
            id="task-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            label="Status Stage"
          >
            <MenuItem value="Pending">⚪ Pending</MenuItem>
            <MenuItem value="In Progress">🟡 In Progress</MenuItem>
            <MenuItem value="Completed">🟢 Completed</MenuItem>
            <MenuItem value="Launched">🔵 Launched</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          id="task-due-date"
          label="Due Date"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <FormControl fullWidth variant="outlined">
          <InputLabel id="task-assignee-label">Assignee</InputLabel>
          <Select
            labelId="task-assignee-label"
            id="task-assignee-select"
            value={assigneeName}
            onChange={(e) => setAssigneeName(e.target.value)}
            label="Assignee"
          >
            {AVAILABLE_ASSIGNEES.map((name) => (
              <MenuItem key={name} value={name}>
                👤 {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1, borderTop: "1px solid #e2e8f0", pt: 2 }}>
        {onCancel && (
          <Button
            id="btn-cancel-task"
            onClick={onCancel}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cancel
          </Button>
        )}
        <Button
          id="btn-submit-task"
          type="submit"
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            bgcolor: "#6366f1",
            "&:hover": { bgcolor: "#4f46e5" }
          }}
        >
          {initialValues ? "Save Changes" : "Create Task"}
        </Button>
      </Box>
    </Box>
  );
}
