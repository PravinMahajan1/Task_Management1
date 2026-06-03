import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TaskForm from "./TaskForm";
import TaskComments from "./TaskComments";
import { Task, TaskInput } from "../types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskInput) => void;
  task: Task | null;
  onTaskUpdated?: (updatedTask: Task) => void;
  availableAssignees: string[];
  onAddMember: (name: string) => Promise<void>;
}

export default function TaskModal({ open, onClose, onSubmit, task, onTaskUpdated, availableAssignees, onAddMember }: TaskModalProps) {

  const isEditing = !!(task && task.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isEditing ? "md" : "sm"}
      aria-labelledby="task-modal-title"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          overflow: "hidden"
        }
      }}
    >
      <DialogTitle
        id="task-modal-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: 700,
          fontFamily: "Space Grotesk, sans-serif"
        }}
      >
        <span>{task ? "Edit Tasks Details & Activity" : "Create New Task"}</span>
        <IconButton
          id="btn-close-modal"
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {isEditing ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              minHeight: "450px"
            }}
          >

            <Box sx={{ borderRight: { md: "1px solid #e1e8ed" }, p: 1 }}>
              <TaskForm
                initialValues={{
                  title: task!.title,
                  description: task!.description,
                  completed: task!.completed,
                  priority: task!.priority,
                  status: task!.status,
                  dueDate: task!.dueDate,
                  assigneeName: task!.assigneeName
                }}
                onSubmit={onSubmit}
                onCancel={onClose}
                availableAssignees={availableAssignees}
                onAddMember={onAddMember}
              />
            </Box>

            <Box sx={{ p: 1, bgcolor: "#fafafa" }}>
              {onTaskUpdated ? (
                <TaskComments task={task!} onTaskUpdated={onTaskUpdated} />
              ) : (
                <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                  Comments are not available for this view.
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 1 }}>
            <TaskForm
              initialValues={null}
              onSubmit={onSubmit}
              onCancel={onClose}
              availableAssignees={availableAssignees}
              onAddMember={onAddMember}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
