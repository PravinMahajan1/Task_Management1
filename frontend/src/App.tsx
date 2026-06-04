import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tasks.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import {
  Button,
  Snackbar,
  Alert as MuiAlert,
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
  Skeleton
} from "@mui/material";

import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";

import TaskList from "./components/TaskList";
import TaskBoardView from "./components/TaskBoardView";
import TaskModal from "./components/TaskModal";
import { Task, TaskInput, TaskPriority, TaskStatus } from "./types";
import { getAllTasks, createTask, updateTask, deleteTask, getAllMembers, addMember, deleteMember } from "./services/taskService";
import { isTaskOverdue } from "./utils/taskHelpers";

const INITIAL_MOCK_TASKS: Omit<Task, "id" | "completed">[] = [
  {
    title: "Solutions Pages",
    description: "Design the checkout flow and alternative pricing layouts for enterprise clients.",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-06-17",
    assigneeName: "Ananya Patel"
  },
  {
    title: "Order Flow Architecture",
    description: "Map user states and transition paths across premium API products.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-06-01",
    assigneeName: "Aarav Sharma"
  },
  {
    title: "About Us Illustration",
    description: "Beautiful line art of team members collaborating in workspace.",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-06-17",
    assigneeName: "Harsha Reddy"
  },
  {
    title: "Hero Banner Redesign",
    description: "Modern vector graphics pairing Space Grotesk styling with purple highlights.",
    priority: "Low",
    status: "Launched",
    dueDate: "2026-06-25",
    assigneeName: "Manish Verma"
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All");

  const [projectName, setProjectName] = useState("Design Project");
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [newProjectNameInput, setNewProjectNameInput] = useState("Design Project");

  const [activeProjectId, setActiveProjectId] = useState("design");
  const [mainProjectExpanded, setMainProjectExpanded] = useState(true);

  const [activeWorkspace, setActiveWorkspace] = useState("HyperQ");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [members, setMembers] = useState<string[]>([]);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [newTeamMemberName, setNewTeamMemberName] = useState("");
  const [teamMemberError, setTeamMemberError] = useState("");

  const fetchTasksData = async () => {
    setIsLoading(true);
    try {
      setErrorMessage(null);
      const data = await getAllTasks();
      if (data.length === 0) {

        const seeded: Task[] = [];
        for (const mock of INITIAL_MOCK_TASKS) {
          const tInput: TaskInput = {
            title: mock.title,
            description: mock.description,
            completed: mock.status === "Completed" || mock.status === "Launched",
            priority: mock.priority,
            status: mock.status,
            dueDate: mock.dueDate,
            assigneeName: mock.assigneeName
          };
          const res = await createTask(tInput);
          seeded.push(res);
        }
        setTasks(seeded);
      } else {
        setTasks(data);
      }
    } catch (err: any) {
      setErrorMessage("Failed to load tasks from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembersData = async () => {
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  const handleAddNewMember = async (name: string) => {
    const updated = await addMember(name);
    setMembers(updated);
  };

  useEffect(() => {
    fetchTasksData();
    fetchMembersData();
  }, []);

  const triggerNotification = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleOpenAddModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleOpenAddModalWithStatus = (forcedStatus: TaskStatus) => {
    setSelectedTask({
      id: "",
      title: "",
      description: "",
      completed: forcedStatus === "Completed" || forcedStatus === "Launched",
      priority: "Medium",
      status: forcedStatus,
      dueDate: new Date().toISOString().slice(0, 10),
      assigneeName: members[0] || "Aarav Sharma"
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalSubmit = async (formData: TaskInput) => {
    try {
      setErrorMessage(null);
      if (selectedTask && selectedTask.id) {

        const updated = await updateTask(selectedTask.id, formData);
        setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
        triggerNotification("Task details updated successfully", "success");
      } else {

        const created = await createTask(formData);
        setTasks((prev) => [...prev, created]);
        triggerNotification("Task added successfully", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving task:", err);
      const apiErrorMsg = err.response?.data?.error || err.message || "Failed to process task.";
      setErrorMessage(apiErrorMsg);
      triggerNotification(apiErrorMsg, "error");
    }
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      const taskToChange = tasks.find((t) => t.id === id);
      if (!taskToChange) return;

      const updatedPatch: Partial<TaskInput> = {
        status: newStatus,
        completed: newStatus === "Completed" || newStatus === "Launched"
      };

      const updated = await updateTask(id, updatedPatch);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      triggerNotification(`Task moved to ${newStatus}`, "info");
    } catch (err: any) {
      console.error("Error updating status:", err);
      triggerNotification("Failed to update status on server.", "error");
    }
  };

  const handleRequestDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTask(deleteId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      triggerNotification("Task deleted permanently", "success");
    } catch (err: any) {
      console.error("Error deleting item:", err);
      triggerNotification("Failed to delete task.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSaveProjectName = () => {
    if (newProjectNameInput.trim()) {
      setProjectName(newProjectNameInput.trim());
      setIsEditingProjectName(false);
      triggerNotification(`Renamed space to ${newProjectNameInput.trim()}`, "success");
    }
  };

  const selectSidebarProject = (projId: string, projTitle: string) => {
    setActiveProjectId(projId);
    setProjectName(projTitle);
    setNewProjectNameInput(projTitle);
    setMobileSidebarOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    const matchesAssignee =
      assigneeFilter === "All" || task.assigneeName === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f8fafc" }}>

      <Box
        className={`custom-sidebar-container ${mobileSidebarOpen ? "show-mobile" : ""}`}
        sx={{
          width: "280px",
          bgcolor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          position: { xs: "fixed", md: "sticky" },
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1100,
          transform: { xs: mobileSidebarOpen ? "translateX(0)" : "translateX(-100%)", md: "translateX(0)" },
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: { xs: mobileSidebarOpen ? "4px 0 24px rgba(15, 23, 42, 0.15)" : "none", md: "none" }
        }}
      >

        <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>

            <Box sx={{ width: 32, height: 32, bgcolor: "#6366f1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Typography variant="body1" sx={{ fontWeight: 800, fontSize: "15px", fontFamily: "Space Grotesk, sans-serif" }}>T</Typography>
            </Box>
            <Typography variant="h6" className="font-display" sx={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.04em", color: "#1e293b" }}>
              TaskBoard
            </Typography>
          </Box>

          <Button
            onClick={() => setMobileSidebarOpen(false)}
            sx={{ display: { xs: "inline-flex", md: "none" }, minWidth: 0, p: 0.5, color: "#64748b" }}
          >
            &times;
          </Button>
        </Box>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.25,
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Avatar
                variant="rounded"
                sx={{ width: 24, height: 24, fontSize: "11px", fontWeight: "bold", bgcolor: "#dbeafe", color: "#2563eb" }}
              >
                O
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155", fontSize: "13px" }}>
                {activeWorkspace}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 14, color: "#64748b" }} />
          </Box>
        </Box>

        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Button
            id="sidebar-add-new-btn"
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              bgcolor: "#6366f1",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              "&:hover": {
                bgcolor: "#4f46e5"
              }
            }}
          >
            Add New Task
          </Button>
        </Box>

        <Box sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1
            }}
          >
            Projects
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              onClick={() => setMainProjectExpanded(!mainProjectExpanded)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                py: 0.5,
                mt: 0.5,
                borderRadius: "6px",
                cursor: "pointer",
                "&:hover": { bgcolor: "#f8fafc" }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b", display: "flex", alignItems: "center", gap: 0.5 }}>
                📁 Main Project
              </Typography>
              {mainProjectExpanded ? <KeyboardArrowDownIcon sx={{ fontSize: 14, color: "#64748b" }} /> : <KeyboardArrowRightIcon sx={{ fontSize: 14, color: "#64748b" }} />}
            </Box>

            {mainProjectExpanded && (
              <Box
                onClick={() => selectSidebarProject("design", "Design Project")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  ml: 2,
                  p: 1,
                  borderRadius: "8px",
                  bgcolor: activeProjectId === "design" ? "#eef2ff" : "transparent",
                  color: activeProjectId === "design" ? "#4f46e5" : "#64748b",
                  "&:hover": { bgcolor: "#f8fafc", cursor: "pointer" }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "13px" }}>
                  📝 Design Project
                </Typography>
              </Box>
            )}

          </Box>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9", display: "flex", gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setTeamDialogOpen(true)}
            sx={{
              fontSize: "12px",
              textTransform: "none",
              borderRadius: "8px",
              color: "#4f46e5",
              borderColor: "#c7d2fe",
              "&:hover": { bgcolor: "#f5f3ff", borderColor: "#818cf8" }
            }}
          >
            Invite Team
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => triggerNotification("Help guide & quick-start manuals loaded.", "info")}
            sx={{ minWidth: 40, p: 0.5, color: "#64748b" }}
          >
            <HelpOutlineIcon sx={{ fontSize: 18 }} />
          </Button>
        </Box>
      </Box>

      {mobileSidebarOpen && (
        <Box
          onClick={() => setMobileSidebarOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 1050,
            display: { xs: "block", md: "none" }
          }}
        />
      )}

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        <Box
          sx={{
            height: "50px",
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 3 },
            position: "sticky",
            top: 0,
            zIndex: 1000
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, maxWidth: "500px" }}>
            <IconButton
              onClick={() => setMobileSidebarOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" }, p: 0.75, color: "#475569" }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <TextField
              id="global-header-search-input"
              fullWidth
              size="small"
              placeholder="Search anywhere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "99px",
                    bgcolor: "#f1f5f9",
                    border: "none",
                    fontSize: "13.5px",
                    "& fieldset": { border: "none" }
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ color: "#64748b" }}>
              <Badge variant="dot" color="primary">
                <NotificationsIcon sx={{ fontSize: 18 }} />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ flexGrow: 1, pt: { xs: 1.5, md: 2 }, pb: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>

          {errorMessage && (
            <MuiAlert
              severity="error"
              onClose={() => setErrorMessage(null)}
              sx={{ mb: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              id="api-error-alert"
            >
              <strong>Network connection alert:</strong> {errorMessage}
            </MuiAlert>
          )}

          <>
            <Box
              sx={{
                borderBottom: "1px solid #e2e8f0",
                mb: 2,
                mt: 0,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", md: "center" },
                gap: 2,
                pb: { xs: 1.5, md: 0 }
              }}
            >
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>

                <Box
                  onClick={() => navigate("/list")}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "2px solid",
                    borderColor: location.pathname === "/list" ? "#6366f1" : "transparent",
                    color: location.pathname === "/list" ? "#6366f1" : "#64748b",
                    fontWeight: location.pathname === "/list" ? 700 : 500,
                    fontSize: "14.5px",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  <ListIcon sx={{ fontSize: 16 }} />
                  <span>List View</span>
                </Box>

                <Box
                  onClick={() => navigate("/board")}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "2px solid",
                    borderColor: location.pathname === "/board" ? "#6366f1" : "transparent",
                    color: location.pathname === "/board" ? "#6366f1" : "#64748b",
                    fontWeight: location.pathname === "/board" ? 700 : 500,
                    fontSize: "14.5px",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  <ViewWeekIcon sx={{ fontSize: 16 }} />
                  <span>Board View</span>
                </Box>

              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1.5,
                  mb: { xs: 1.5, md: "2px" },
                  mr: { xs: 0, md: 1.5 },
                  alignSelf: { xs: "flex-start", md: "center" }
                }}
              >
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="p-filter-label" sx={{ fontSize: "12px" }}>Priority</InputLabel>
                  <Select
                    labelId="p-filter-label"
                    id="p-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    label="Priority"
                    sx={{ borderRadius: "8px", fontSize: "12.5px", height: "34px" }}
                  >
                    <MenuItem value="All">All Priorities</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="a-filter-label" sx={{ fontSize: "12px" }}>Assignee</InputLabel>
                  <Select
                    labelId="a-filter-label"
                    id="a-filter"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    label="Assignee"
                    sx={{ borderRadius: "8px", fontSize: "12.5px", height: "34px" }}
                  >
                    <MenuItem value="All">All Assignees</MenuItem>
                    {members.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {(priorityFilter !== "All" || assigneeFilter !== "All" || searchQuery !== "") && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setPriorityFilter("All");
                      setAssigneeFilter("All");
                      setSearchQuery("");
                      triggerNotification("Cleared all filtered values", "info");
                    }}
                    sx={{ textTransform: "none", color: "#6366f1", fontWeight: 700, fontSize: "12px", p: 0 }}
                  >
                    Reset
                  </Button>
                )}

                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "11px", ml: 1, display: { xs: "none", lg: "inline" } }}>
                  ({filteredTasks.length}/{tasks.length} tasks)
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
                gap: 1.5,
                mb: 3
              }}
            >
              {[
                { label: "Total Tasks", count: tasks.length, color: "#6366f1", bg: "#eef2ff" },
                { label: "In Progress", count: tasks.filter(t => t.status === "In Progress").length, color: "#ca8a04", bg: "#fef9c3" },
                { label: "Overdue", count: tasks.filter(t => isTaskOverdue(t.dueDate, t.status)).length, color: "#ef4444", bg: "#fee2e2" },
                { label: "Completed", count: tasks.filter(t => t.status === "Completed" || t.status === "Launched").length, color: "#16a34a", bg: "#dcfce7" }
              ].map((stat, idx) => (
                <Box
                  key={idx}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderRadius: "10px",
                    bgcolor: stat.bg,
                    border: "1px solid",
                    borderColor: `${stat.color}20`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, fontSize: "11px" }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: stat.color, fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", lineHeight: 1.2 }}>
                    {stat.count}
                  </Typography>
                </Box>
              ))}
            </Box>

            {isLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1
                    }}
                  >
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                      <Skeleton variant="text" width="20%" height={20} />
                      <Skeleton variant="circular" width={24} height={24} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/list" replace />} />
                <Route path="/list" element={
                  <TaskList
                    tasks={filteredTasks}
                    onEdit={handleOpenEditModal}
                    onDelete={handleRequestDelete}
                  />
                } />
                <Route path="/board" element={
                  <TaskBoardView
                    tasks={filteredTasks}
                    onEdit={handleOpenEditModal}
                    onDelete={handleRequestDelete}
                    onUpdateStatus={handleUpdateTaskStatus}
                    onAddTaskToStatus={handleOpenAddModalWithStatus}
                  />
                } />
              </Routes>
            )}

          </>

        </Container>

      </Box>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        task={selectedTask}
        onTaskUpdated={(updatedTask) => {
          setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
          setSelectedTask(updatedTask);
        }}
        availableAssignees={members}
        onAddMember={handleAddNewMember}
      />

      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="delete-confirm-dialog"
        slotProps={{ paper: { sx: { borderRadius: "12px", p: 1 } } }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, fontFamily: "Space Grotesk" }}>
          {"Delete this task?"}
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          <DialogContentText sx={{ fontSize: "14px", color: "#475569" }}>
            Are you sure you want to delete this task? This action is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined" color="inherit" sx={{ textTransform: "none", borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus id="btn-confirm-delete" sx={{ textTransform: "none", borderRadius: "8px" }}>
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={teamDialogOpen}
        onClose={() => {
          setTeamDialogOpen(false);
          setNewTeamMemberName("");
          setTeamMemberError("");
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", borderBottom: "1px solid #e2e8f0", pb: 2 }}>
          Team Members
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: "250px", overflowY: "auto", mb: 3 }}>
            {members.map((member) => {
              const parts = member.split(" ");
              const initials = parts.map(p => p[0]).join("").substring(0, 2).toUpperCase();
              let sum = 0;
              for (let i = 0; i < member.length; i++) sum += member.charCodeAt(i);
              const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"];
              const bg = colors[sum % colors.length];

              return (
                <Box
                  key={member}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    borderRadius: "8px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#f8fafc"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: "11px", fontWeight: "bold", bgcolor: bg }}>
                      {initials}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {member}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={async () => {
                      const hasActiveTasks = tasks.some(t => t.assigneeName === member && t.status !== "Completed" && t.status !== "Launched");
                      if (hasActiveTasks) {
                        const confirm = window.confirm(`Warning: ${member} has active tasks assigned. Are you sure you want to remove them?`);
                        if (!confirm) return;
                      }
                      try {
                        const updated = await deleteMember(member);
                        setMembers(updated);
                        triggerNotification(`Removed ${member} from team`, "info");
                      } catch (err: any) {
                        triggerNotification(err.response?.data?.error || "Failed to remove member", "error");
                      }
                    }}
                    sx={{ p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Add New Team Member
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. Rahul Sharma"
                value={newTeamMemberName}
                onChange={(e) => {
                  setNewTeamMemberName(e.target.value);
                  if (e.target.value.trim()) setTeamMemberError("");
                }}
                error={!!teamMemberError}
                helperText={teamMemberError}
                slotProps={{ htmlInput: { style: { fontSize: "13px" } } }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={async () => {
                  const name = newTeamMemberName.trim();
                  if (!name) {
                    setTeamMemberError("Name is required");
                    return;
                  }
                  if (members.includes(name)) {
                    setTeamMemberError("Member already exists");
                    return;
                  }
                  try {
                    const updated = await addMember(name);
                    setMembers(updated);
                    setNewTeamMemberName("");
                    setTeamMemberError("");
                    triggerNotification(`Added ${name} to team`, "success");
                  } catch (err: any) {
                    setTeamMemberError(err.response?.data?.error || "Failed to add member");
                  }
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#6366f1",
                  "&:hover": { bgcolor: "#4f46e5" },
                  whiteSpace: "nowrap"
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setTeamDialogOpen(false);
              setNewTeamMemberName("");
              setTeamMemberError("");
            }}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        id="feedback-snackbar"
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px", fontWeight: "600", fontSize: "13.5px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          id="mui-alert-feedback"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

    </Box>
  );
}
