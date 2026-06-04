import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { TaskInput, TaskPriority, TaskStatus } from "../types";

interface TaskFormProps {
  initialValues?: TaskInput | null;
  onSubmit: (formData: TaskInput) => void;
  onCancel?: () => void;
  availableAssignees: string[];
  onAddMember: (name: string) => Promise<void>;
}

export default function TaskForm({ initialValues, onSubmit, onCancel, availableAssignees = [], onAddMember }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [dueDate, setDueDate] = useState("");
  const defaultAssignee = availableAssignees[0] || "Aarav Sharma";
  const [assigneeName, setAssigneeName] = useState(defaultAssignee);
  const [error, setError] = useState("");

  const [newMemberName, setNewMemberName] = useState("");
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");

  useEffect(() => {
    const defAssignee = availableAssignees[0] || "Aarav Sharma";
    if (initialValues) {
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setPriority(initialValues.priority || "Medium");
      setStatus(initialValues.status || "Pending");
      setDueDate(initialValues.dueDate || new Date().toISOString().slice(0, 10));
      setAssigneeName(initialValues.assigneeName || defAssignee);
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Pending");
      setDueDate(new Date().toISOString().slice(0, 10));
      setAssigneeName(defAssignee);
    }
    setError("");
  }, [initialValues, availableAssignees]);

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

        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="task-assignee-label">Assignee</InputLabel>
            <Select
              labelId="task-assignee-label"
              id="task-assignee-select"
              value={availableAssignees.includes(assigneeName) ? assigneeName : (availableAssignees[0] || "")}
              onChange={(e) => setAssigneeName(e.target.value)}
              label="Assignee"
              disabled={availableAssignees.length === 0}
            >
              {availableAssignees.map((name) => (
                <MenuItem key={name} value={name}>
                  👤 {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            id="btn-add-member-form"
            variant="outlined"
            onClick={() => setAddMemberDialogOpen(true)}
            sx={{
              textTransform: "none",
              minWidth: "120px",
              borderRadius: "8px",
              borderColor: "#c7d2fe",
              color: "#4f46e5",
              "&:hover": { bgcolor: "#f5f3ff", borderColor: "#818cf8" }
            }}
          >
            + Add Member
          </Button>
        </Box>
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

      <Dialog
        open={addMemberDialogOpen}
        onClose={() => {
          setAddMemberDialogOpen(false);
          setNewMemberName("");
          setAddMemberError("");
        }}
        slotProps={{ paper: { sx: { borderRadius: "12px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>Add New Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "14px", mb: 2, color: "#475569" }}>
            Type the name of the new member to add to the assignee list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-member-name-input"
            label="Member Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newMemberName}
            onChange={(e) => {
              setNewMemberName(e.target.value);
              if (e.target.value.trim()) {
                setAddMemberError("");
              }
            }}
            error={!!addMemberError}
            helperText={addMemberError}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setAddMemberDialogOpen(false);
              setNewMemberName("");
              setAddMemberError("");
            }}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const name = newMemberName.trim();
              if (!name) {
                setAddMemberError("Name is required");
                return;
              }
              if (availableAssignees.includes(name)) {
                setAddMemberError("Member already exists");
                return;
              }
              try {
                await onAddMember(name);
                setAssigneeName(name);
                setAddMemberDialogOpen(false);
                setNewMemberName("");
                setAddMemberError("");
              } catch (err: any) {
                setAddMemberError(err.response?.data?.error || "Failed to add member");
              }
            }}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              bgcolor: "#6366f1",
              "&:hover": { bgcolor: "#4f46e5" }
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
