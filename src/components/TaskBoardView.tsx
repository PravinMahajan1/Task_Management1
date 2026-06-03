import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Paper,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion, AnimatePresence } from "motion/react";

import { Task, TaskStatus } from "../types";
import { isTaskOverdue, formatDate, getAssigneeMeta } from "../utils/taskHelpers";

interface TaskBoardViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onAddTaskToStatus?: (status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { id: "Pending", label: "Pending", color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" },
  { id: "In Progress", label: "In Progress", color: "#ca8a04", bg: "#fef9c3", dot: "#eab308" },
  { id: "Completed", label: "Completed", color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
  { id: "Launched", label: "Launched", color: "#2563eb", bg: "#dbeafe", dot: "#3b82f6" }
];

export default function TaskBoardView({
  tasks,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddTaskToStatus
}: TaskBoardViewProps) {

  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = React.useState<TaskStatus | null>(null);

  const moveTask = (task: Task, direction: "back" | "forward") => {
    const statusOrder: TaskStatus[] = ["Pending", "In Progress", "Completed", "Launched"];
    const currentIndex = statusOrder.indexOf(task.status);
    if (direction === "forward" && currentIndex < statusOrder.length - 1) {
      onUpdateStatus(task.id, statusOrder[currentIndex + 1]);
    } else if (direction === "back" && currentIndex > 0) {
      onUpdateStatus(task.id, statusOrder[currentIndex - 1]);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setHoveredColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (hoveredColumnId !== status) {
      setHoveredColumnId(status);
    }
  };

  const handleDragLeave = () => {
    setHoveredColumnId(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (taskId) {
      onUpdateStatus(taskId, status);
    }
    setDraggedTaskId(null);
    setHoveredColumnId(null);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 3,
        mt: 2
      }}
    >
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <Paper
            key={column.id}
            id={`kanban-column-${column.id.replace(/\s+/g, '-').toLowerCase()}`}
            elevation={0}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            sx={{
              bgcolor: hoveredColumnId === column.id ? `${column.bg}60` : "#f8fafc",
              border: hoveredColumnId === column.id
                ? `2px dashed ${column.dot}`
                : draggedTaskId !== null
                  ? "2px dashed #cbd5e1"
                  : "1px solid #e2e8f0",
              borderRadius: "16px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "550px",
              transition: "all 0.2s ease-in-out"
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
                pb: 1,
                borderBottom: "2px solid",
                borderColor: column.dot
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    bgcolor: column.dot
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "Inter, sans-serif" }}
                >
                  {column.label}
                </Typography>
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.2,
                    borderRadius: "99px",
                    bgcolor: "#e2e8f0",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#475569"
                  }}
                >
                  {columnTasks.length}
                </Box>
              </Box>

              {onAddTaskToStatus && (
                <IconButton
                  size="small"
                  onClick={() => onAddTaskToStatus(column.id)}
                  sx={{
                    color: "#64748b",
                    p: 0.5,
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "#f1f5f9" }
                  }}
                  title={`Add task to ${column.label}`}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold", px: 0.5 }}>+</Typography>
                </IconButton>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
                overflowY: "auto"
              }}
            >
              <AnimatePresence mode="popLayout">
                {columnTasks.length === 0 ? (
                  <motion.div
                    key={`${column.id}-empty`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        py: 4,
                        textAlign: "center",
                        border: "1px dashed #cbd5e1",
                        borderRadius: "12px",
                        bgcolor: "#fafafa"
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No tasks here
                      </Typography>
                    </Box>
                  </motion.div>
                ) : (
                  columnTasks.map((task) => {
                    const mate = getAssigneeMeta(task.assigneeName);
                    const isOverdue = isTaskOverdue(task.dueDate, task.status);

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        layoutId={task.id}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -15 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                          layout: { type: "spring", stiffness: 350, damping: 28 }
                        }}
                        style={{ width: "100%" }}
                      >
                        <Card
                          id={`kanban-card-${task.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          sx={{
                            borderRadius: "12px",
                            border: "1px solid",
                            borderColor: draggedTaskId === task.id ? column.dot : "#e2e8f0",
                            boxShadow: draggedTaskId === task.id ? "none" : "0 1px 3px rgba(0,0,0,0.02)",
                            transition: "all 0.2s ease-in-out",
                            position: "relative",
                            opacity: draggedTaskId === task.id ? 0.35 : 1,
                            cursor: draggedTaskId === task.id ? "grabbing" : "grab",
                            "&:hover": {
                              boxShadow: "0 6px 12px -2px rgba(50,50,93,0.06), 0 3px 7px -3px rgba(0,0,0,0.04)",
                              transform: draggedTaskId === task.id ? "none" : "translateY(-2px)",
                              borderColor: draggedTaskId === task.id ? column.dot : "#cbd5e1"
                            },
                            "&:active": {
                              cursor: "grabbing"
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <FlagIcon
                                  sx={{
                                    fontSize: "12px",
                                    color: task.priority === "High" ? "#ef4444" : task.priority === "Low" ? "#3b82f6" : "#eab308"
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "11px",
                                    color: task.priority === "High" ? "#b91c1c" : task.priority === "Low" ? "#1d4ed8" : "#854d0e"
                                  }}
                                >
                                  {task.priority || "Medium"} Priority
                                </Typography>
                                {isOverdue && (
                                  <Tooltip title="This task is overdue!">
                                    <AccessTimeIcon
                                      sx={{
                                        fontSize: "14px",
                                        color: "#ef4444",
                                        ml: 1,
                                        verticalAlign: "middle"
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>

                              <Box sx={{ display: "inline-flex", gap: 0.25 }}>
                                <Tooltip title="Move stage back">
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={task.status === "Pending"}
                                      onClick={() => moveTask(task, "back")}
                                      sx={{ p: 0.25, color: "#94a3b8" }}
                                    >
                                      <ArrowBackIcon sx={{ fontSize: "14px" }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Move stage forward">
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={task.status === "Launched"}
                                      onClick={() => moveTask(task, "forward")}
                                      sx={{ p: 0.25, color: "#94a3b8" }}
                                    >
                                      <ArrowForwardIcon sx={{ fontSize: "14px" }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Box>
                            </Box>

                            <Typography
                              onClick={() => onEdit(task)}
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: "#1e293b",
                                fontSize: "14px",
                                lineHeight: "1.25",
                                cursor: "pointer",
                                "&:hover": { color: "#4f46e5" }
                              }}
                            >
                              {task.title}
                            </Typography>

                            {task.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  fontSize: "12.5px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical"
                                }}
                              >
                                {task.description}
                              </Typography>
                            )}

                            <Box sx={{ my: 1.5, borderTop: "1px dashed #e2e8f0" }} />

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <CalendarMonthIcon sx={{ fontSize: "14px", color: isOverdue ? "#ef4444" : "#94a3b8" }} />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "11.5px",
                                    fontWeight: 550,
                                    color: isOverdue ? "#ef4444" : "#64748b"
                                  }}
                                >
                                  {formatDate(task.dueDate)}
                                  {isOverdue && (
                                    <Box component="span" sx={{ color: "#ef4444", fontWeight: 700, ml: 0.5 }}>
                                      Overdue
                                    </Box>
                                  )}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                <Box sx={{ display: "inline-flex", gap: 0.5 }}>
                                  <IconButton
                                    size="small"
                                    aria-label="Edit task"
                                    onClick={() => onEdit(task)}
                                    sx={{ p: 0.25, color: "#64748b", "&:hover": { color: "#4f46e5" } }}
                                  >
                                    <EditIcon sx={{ fontSize: "14px" }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    aria-label="Delete task"
                                    onClick={() => onDelete(task.id)}
                                    sx={{ p: 0.25, color: "#64748b", "&:hover": { color: "#ef4444" } }}
                                  >
                                    <DeleteIcon sx={{ fontSize: "14px" }} />
                                  </IconButton>
                                </Box>

                                <Tooltip title={`Assignee: ${task.assigneeName}`}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                      bgcolor: mate.bg
                                    }}
                                  >
                                    {mate.initials}
                                  </Avatar>
                                </Tooltip>
                              </Box>

                            </Box>

                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
