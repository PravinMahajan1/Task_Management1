var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_uuid = require("uuid");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
var TASKS_FILE = import_path.default.join(process.cwd(), "tasks.json");
if (!import_fs.default.existsSync(TASKS_FILE)) {
  import_fs.default.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2), "utf8");
}
function readTasks() {
  try {
    const data = import_fs.default.readFileSync(TASKS_FILE, "utf8");
    const parsed = JSON.parse(data);
    return parsed.map((t) => {
      const priority = t.priority === "Low" || t.priority === "Medium" || t.priority === "High" ? t.priority : "Medium";
      const completed = typeof t.completed === "boolean" ? t.completed : false;
      let status = t.status;
      if (!status || !["Pending", "In Progress", "Completed", "Launched"].includes(status)) {
        status = completed ? "Completed" : "Pending";
      }
      const formattedDueDate = t.dueDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const assigneeName = t.assigneeName || "Alex Rivera";
      return {
        id: t.id,
        title: t.title || "Untitled Task",
        description: t.description || "",
        completed: status === "Completed" || status === "Launched",
        priority,
        status,
        dueDate: formattedDueDate,
        assigneeName,
        comments: Array.isArray(t.comments) ? t.comments : []
      };
    });
  } catch (err) {
    console.error("Error reading tasks file:", err);
    return [];
  }
}
function writeTasks(tasks) {
  try {
    import_fs.default.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to tasks file:", err);
  }
}
var MEMBERS_FILE = import_path.default.join(process.cwd(), "members.json");
var DEFAULT_MEMBERS = [
  "Aarav Sharma",
  "Ananya Patel",
  "Chirag Mehta",
  "Harsha Reddy",
  "Manish Verma"
];
if (!import_fs.default.existsSync(MEMBERS_FILE)) {
  import_fs.default.writeFileSync(MEMBERS_FILE, JSON.stringify(DEFAULT_MEMBERS, null, 2), "utf8");
}
function readMembers() {
  try {
    const data = import_fs.default.readFileSync(MEMBERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading members file:", err);
    return DEFAULT_MEMBERS;
  }
}
function writeMembers(members) {
  try {
    import_fs.default.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to members file:", err);
  }
}
var registerTaskRoutes = (routePrefix) => {
  app.get(`${routePrefix}`, (req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
  });
  app.post(`${routePrefix}`, (req, res) => {
    const { title, description, priority, status, dueDate, assigneeName } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required and must be a string" });
    }
    let taskPriority = "Medium";
    if (priority === "Low" || priority === "Medium" || priority === "High") {
      taskPriority = priority;
    }
    let taskStatus = "Pending";
    if (status === "Pending" || status === "In Progress" || status === "Completed" || status === "Launched") {
      taskStatus = status;
    }
    const defaultDueDate = dueDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const defaultAssignee = assigneeName || "Alex Rivera";
    const tasks = readTasks();
    const newTask = {
      id: (0, import_uuid.v4)(),
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      completed: taskStatus === "Completed" || taskStatus === "Launched",
      priority: taskPriority,
      status: taskStatus,
      dueDate: defaultDueDate,
      assigneeName: defaultAssignee
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  });
  app.put(`${routePrefix}/:id`, (req, res) => {
    const { id } = req.params;
    const { title, description, completed, priority, status, dueDate, assigneeName } = req.body;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    const updatedTask = { ...tasks[taskIndex] };
    if (title !== void 0) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title must be a non-empty string" });
      }
      updatedTask.title = title.trim();
    }
    if (description !== void 0) {
      updatedTask.description = typeof description === "string" ? description.trim() : "";
    }
    if (status !== void 0) {
      if (["Pending", "In Progress", "Completed", "Launched"].includes(status)) {
        updatedTask.status = status;
        updatedTask.completed = status === "Completed" || status === "Launched";
      } else {
        return res.status(400).json({ error: "Status must be 'Pending', 'In Progress', 'Completed', or 'Launched'" });
      }
    } else if (completed !== void 0) {
      updatedTask.completed = !!completed;
      if (updatedTask.completed) {
        if (updatedTask.status === "Pending" || updatedTask.status === "In Progress") {
          updatedTask.status = "Completed";
        }
      } else {
        if (updatedTask.status === "Completed" || updatedTask.status === "Launched") {
          updatedTask.status = "Pending";
        }
      }
    }
    if (priority !== void 0) {
      if (priority === "Low" || priority === "Medium" || priority === "High") {
        updatedTask.priority = priority;
      } else {
        return res.status(400).json({ error: "Priority must be 'Low', 'Medium', or 'High'" });
      }
    }
    if (dueDate !== void 0) {
      updatedTask.dueDate = String(dueDate);
    }
    if (assigneeName !== void 0) {
      updatedTask.assigneeName = String(assigneeName);
    }
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.status(200).json(updatedTask);
  });
  app.post(`${routePrefix}/:id/comments`, (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required and must be a string" });
    }
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    const newComment = {
      id: (0, import_uuid.v4)(),
      text: text.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!tasks[taskIndex].comments) {
      tasks[taskIndex].comments = [];
    }
    tasks[taskIndex].comments.push(newComment);
    writeTasks(tasks);
    res.status(201).json({ comment: newComment, task: tasks[taskIndex] });
  });
  app.delete(`${routePrefix}/:id/comments/:commentId`, (req, res) => {
    const { id, commentId } = req.params;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    const task = tasks[taskIndex];
    if (task.comments) {
      const commentIndex = task.comments.findIndex((c) => c.id === commentId);
      if (commentIndex !== -1) {
        task.comments.splice(commentIndex, 1);
        writeTasks(tasks);
        return res.status(200).json({ success: true, task });
      }
    }
    res.status(404).json({ error: "Comment not found" });
  });
  app.delete(`${routePrefix}/:id`, (req, res) => {
    const { id } = req.params;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.status(200).json({ success: true, message: "Task deleted successfully", id });
  });
};
var registerMemberRoutes = (routePrefix) => {
  app.get(`${routePrefix}`, (req, res) => {
    const members = readMembers();
    res.status(200).json(members);
  });
  app.post(`${routePrefix}`, (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Member name is required" });
    }
    const trimmedName = name.trim();
    const members = readMembers();
    if (members.includes(trimmedName)) {
      return res.status(400).json({ error: "Member already exists" });
    }
    members.push(trimmedName);
    writeMembers(members);
    res.status(201).json(members);
  });
  app.delete(`${routePrefix}/:name`, (req, res) => {
    const { name } = req.params;
    const members = readMembers();
    const index = members.indexOf(name);
    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    members.splice(index, 1);
    writeMembers(members);
    res.status(200).json(members);
  });
};
registerTaskRoutes("/api/tasks");
registerTaskRoutes("/tasks");
registerMemberRoutes("/api/members");
registerMemberRoutes("/members");
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
