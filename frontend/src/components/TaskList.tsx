import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Avatar,
  Tooltip,
  TableSortLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InputIcon from "@mui/icons-material/Input";

import { Task } from "../types";
import { isTaskOverdue, formatDate, getAssigneeMeta } from "../utils/taskHelpers";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [sortField, setSortField] = useState<"title" | "priority" | "status" | "dueDate" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };
  const STATUS_ORDER = { Pending: 0, "In Progress": 1, Completed: 2, Launched: 3 };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "title") cmp = a.title.localeCompare(b.title);
    else if (sortField === "priority") cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    else if (sortField === "status") cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    else if (sortField === "dueDate") cmp = (a.dueDate || "").localeCompare(b.dueDate || "");
    return sortDir === "asc" ? cmp : -cmp;
  });
  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: "16px",
          border: "1px dashed #cbd5e1"
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }} gutterBottom>
          No tasks match the active filters
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try resetting filters or click "+ Add New" to create a new task!
        </Typography>
      </Box>
    );
  }

  return (
    <>

      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 2 }}>
        {sortedTasks.map((task) => {
          const isCompleted = task.status === "Completed" || task.status === "Launched";
          const mate = getAssigneeMeta(task.assigneeName);
          const isOverdue = isTaskOverdue(task.dueDate, task.status);

          return (
            <Paper
              key={task.id}
              id={`task-mobile-card-${task.id}`}
              onClick={() => onEdit(task)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                bgcolor: isCompleted ? "#f8fafc" : "#ffffff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": { borderColor: "#cbd5e1" },
                position: "relative"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1 }}>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "14.5px",
                    textDecoration: isCompleted ? "line-through" : "none"
                  }}
                >
                  {task.title}
                </Typography>

                <Box
                  sx={{
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "99px",
                    bgcolor: task.priority === "High" ? "#fee2e2" : task.priority === "Low" ? "#dbeafe" : "#fef3c7",
                    color: task.priority === "High" ? "#ef4444" : task.priority === "Low" ? "#3b82f6" : "#f59e0b",
                    fontSize: "10px",
                    fontWeight: 700,
                    whiteSpace: "nowrap"
                  }}
                >
                  {task.priority || "Medium"}
                </Box>
              </Box>

              {task.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "12.5px",
                    mb: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4
                  }}
                >
                  {task.description}
                </Typography>
              )}

              <Box sx={{ borderBottom: "1px dashed #e2e8f0", my: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Avatar sx={{ width: 22, height: 22, fontSize: "10px", fontWeight: "bold", bgcolor: mate.bg }}>
                      {mate.initials}
                    </Avatar>
                    <Typography variant="caption" sx={{ color: "#334155", fontWeight: 650, fontSize: "12px" }}>
                      {task.assigneeName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                    <CalendarMonthIcon sx={{ fontSize: "13px", color: isOverdue ? "#ef4444" : "#94a3b8" }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: isOverdue ? "#ef4444" : "#64748b"
                      }}
                    >
                      {formatDate(task.dueDate)} {isOverdue && <span style={{ color: "#ef4444", fontWeight: 700 }}>(Overdue)</span>}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

                  {task.status === "Completed" ? (
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 text-xs font-bold">Done</span>
                  ) : task.status === "Launched" ? (
                    <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 text-xs font-bold">Launched</span>
                  ) : task.status === "In Progress" ? (
                    <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 text-xs font-bold">Progress</span>
                  ) : (
                    <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-2.5 py-1 text-xs font-bold">Pending</span>
                  )}

                  <Box sx={{ display: "flex", gap: 0.75 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(task)}
                      sx={{ p: 0.75, color: "#4f46e5", bgcolor: "#f5f3ff", "&:hover": { bgcolor: "#ede9fe" } }}
                    >
                      <EditIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(task.id)}
                      sx={{ p: 0.75, color: "#ef4444", bgcolor: "#fef2f2", "&:hover": { bgcolor: "#fee2e2" } }}
                    >
                      <DeleteIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </Box>

              </Box>
            </Paper>
          );
        })}
      </Box>

      <TableContainer
        component={Paper}
        id="task-list-table-container"
        sx={{
          display: { xs: "none", md: "block" },
          overflowX: "auto",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0"
        }}
      >
      <Table aria-label="task list table" sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: "#f8fafc" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              <TableSortLabel
                active={sortField === "title"}
                direction={sortField === "title" ? sortDir : "asc"}
                onClick={() => handleSort("title")}
              >
                Task Title
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Description / Notes</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              <TableSortLabel
                active={sortField === "priority"}
                direction={sortField === "priority" ? sortDir : "asc"}
                onClick={() => handleSort("priority")}
              >
                Priority
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              <TableSortLabel
                active={sortField === "status"}
                direction={sortField === "status" ? sortDir : "asc"}
                onClick={() => handleSort("status")}
              >
                Status Phase
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              <TableSortLabel
                active={sortField === "dueDate"}
                direction={sortField === "dueDate" ? sortDir : "asc"}
                onClick={() => handleSort("dueDate")}
              >
                Due Date
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Assignee</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569", textAlign: "right" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTasks.map((task) => {
            const isCompleted = task.status === "Completed" || task.status === "Launched";
            const mate = getAssigneeMeta(task.assigneeName);
            const isOverdue = isTaskOverdue(task.dueDate, task.status);

            return (
              <TableRow
                key={task.id}
                id={`task-row-${task.id}`}
                className={isCompleted ? "completed-task" : ""}
                sx={{
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: isCompleted ? "#f8fafc" : "#faf5ff",
                  },
                }}
              >

                <TableCell sx={{ fontWeight: 700, color: "#1e293b", cursor: "pointer", maxWidth: 200 }} onClick={() => onEdit(task)}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ textDecoration: isCompleted ? "line-through" : "none" }}>{task.title}</span>
                  </Box>
                </TableCell>

                <TableCell sx={{ color: "#64748b", maxWidth: 280 }}>
                  <Typography variant="body2" noWrap title={task.description}>
                    {task.description || <span style={{ fontStyle: "italic", opacity: 0.5 }}>No description</span>}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FlagIcon
                      sx={{
                        fontSize: "15px",
                        color: task.priority === "High" ? "#ef4444" : task.priority === "Low" ? "#3b82f6" : "#eab308"
                      }}
                    />
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {task.priority || "Medium"}
                    </span>
                  </Box>
                </TableCell>

                <TableCell>
                  {task.status === "Completed" ? (
                    <Chip
                      icon={<CheckCircleIcon fontSize="small" style={{ color: "#16a34a" }} />}
                      label="Completed"
                      color="success"
                      variant="filled"
                      size="small"
                      id={`status-chip-completed-${task.id}`}
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : task.status === "Launched" ? (
                    <Chip
                      icon={<InputIcon fontSize="small" style={{ color: "#2563eb" }} />}
                      label="Launched"
                      color="primary"
                      variant="filled"
                      size="small"
                      id={`status-chip-launched-${task.id}`}
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : task.status === "In Progress" ? (
                    <Chip
                      icon={<ScheduleIcon fontSize="small" style={{ color: "#ca8a04" }} />}
                      label="In Progress"
                      color="warning"
                      variant="filled"
                      size="small"
                      id={`status-chip-progress-${task.id}`}
                      sx={{ fontWeight: "bold" }}
                    />
                  ) : (
                    <Chip
                      icon={<PendingActionsIcon fontSize="small" style={{ color: "#64748b" }} />}
                      label="Pending"
                      variant="outlined"
                      size="small"
                      id={`status-chip-pending-${task.id}`}
                      sx={{ fontWeight: "bold" }}
                    />
                  )}
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: "14px", color: isOverdue ? "#ef4444" : "#64748b" }} />
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 550,
                        color: isOverdue ? "#ef4444" : "#334155"
                      }}
                    >
                      {formatDate(task.dueDate)}
                      {isOverdue && (
                        <span style={{ color: "#ef4444", fontWeight: 700, marginLeft: "4px" }}>
                          (Overdue)
                        </span>
                      )}
                    </span>
                  </Box>
                </TableCell>

                <TableCell>
                  <Tooltip title={task.assigneeName}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          fontSize: "11px",
                          fontWeight: "bold",
                          bgcolor: mate.bg
                        }}
                      >
                        {mate.initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: "#334155", fontSize: "13px", fontWeight: 500 }}>
                        {task.assigneeName}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <IconButton
                    id={`btn-edit-task-${task.id}`}
                    color="primary"
                    size="small"
                    aria-label="edit task"
                    onClick={() => onEdit(task)}
                    sx={{ mr: 1, p: 0.75, transition: "color 0.1s", "&:hover": { color: "#4f46e5" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    id={`btn-delete-task-${task.id}`}
                    color="error"
                    size="small"
                    aria-label="delete task"
                    onClick={() => onDelete(task.id)}
                    sx={{ p: 0.75 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
