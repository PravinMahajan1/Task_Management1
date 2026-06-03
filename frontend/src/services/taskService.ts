import axios from "axios";
import { Task, TaskInput } from "../types";

const BASE_URL = (import.meta as any).env.VITE_API_URL || "/api/tasks";

const api = axios.create({
  baseURL: BASE_URL,
});

let useLocalStorageFallback = false;

const DEFAULT_MEMBERS = [
  "Aarav Sharma",
  "Ananya Patel",
  "Chirag Mehta",
  "Harsha Reddy",
  "Manish Verma"
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "0691ecf8-b4c0-41f1-a1d0-ae445b987656",
    title: "Solutions Pages",
    description: "Design the checkout flow and alternative pricing layouts for enterprise clients.",
    completed: false,
    priority: "Low",
    status: "Pending",
    dueDate: "2026-06-17",
    assigneeName: "Ananya Patel",
    comments: []
  },
  {
    id: "14befe9b-1ad3-4ffb-8329-e2fd718bbced",
    title: "Order Flow Architecture",
    description: "Map user states and transition paths across premium API products.",
    completed: false,
    priority: "High",
    status: "In Progress",
    dueDate: "2026-06-01",
    assigneeName: "Aarav Sharma",
    comments: []
  },
  {
    id: "e0959523-3c2e-4baf-8434-79dcaee4c876",
    title: "About Us Illustration",
    description: "Beautiful line art of team members collaborating in workspace.",
    completed: true,
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-06-17",
    assigneeName: "Harsha Reddy",
    comments: []
  },
  {
    id: "379922ec-f7f7-4577-91f9-1a55b5838135",
    title: "Hero Banner Redesign",
    description: "Modern vector graphics pairing Space Grotesk styling with purple highlights.",
    completed: true,
    priority: "Low",
    status: "Launched",
    dueDate: "2026-06-25",
    assigneeName: "Manish Verma",
    comments: []
  }
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + "-" + Math.random().toString(36).substring(2, 9);
}

function getLocalTasks(): Task[] {
  const data = localStorage.getItem("tasks");
  if (!data) {
    localStorage.setItem("tasks", JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_TASKS;
  }
}

function setLocalTasks(tasks: Task[]) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLocalMembers(): string[] {
  const data = localStorage.getItem("members");
  if (!data) {
    localStorage.setItem("members", JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_MEMBERS;
  }
}

function setLocalMembers(members: string[]) {
  localStorage.setItem("members", JSON.stringify(members));
}

export async function getAllTasks(): Promise<Task[]> {
  if (useLocalStorageFallback) {
    return getLocalTasks();
  }
  try {
    const response = await api.get<Task[]>("");
    if (typeof response.data === "string" && (response.data as string).includes("<!doctype html>")) {
      throw new Error("Invalid API response (received HTML)");
    }
    return response.data;
  } catch (err) {
    console.warn("Backend server not reached. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return getLocalTasks();
  }
}

export async function createTask(data: TaskInput): Promise<Task> {
  if (useLocalStorageFallback) {
    const tasks = getLocalTasks();
    const newTask: Task = {
      ...data,
      id: generateId(),
      comments: []
    };
    tasks.push(newTask);
    setLocalTasks(tasks);
    return newTask;
  }
  try {
    const response = await api.post<Task>("", data);
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return createTask(data);
  }
}

export async function updateTask(id: string, data: Partial<TaskInput>): Promise<Task> {
  if (useLocalStorageFallback) {
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Task not found");
    const updatedTask = { ...tasks[index], ...data };
    tasks[index] = updatedTask;
    setLocalTasks(tasks);
    return updatedTask;
  }
  try {
    const response = await api.put<Task>(`/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return updateTask(id, data);
  }
}

export async function deleteTask(id: string): Promise<any> {
  if (useLocalStorageFallback) {
    const tasks = getLocalTasks();
    const filtered = tasks.filter(t => t.id !== id);
    setLocalTasks(filtered);
    return { success: true };
  }
  try {
    const response = await api.delete<any>(`/${id}`);
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return deleteTask(id);
  }
}

export async function addComment(taskId: string, text: string): Promise<{ comment: any; task: Task }> {
  if (useLocalStorageFallback) {
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error("Task not found");
    const newComment = {
      id: generateId(),
      text,
      createdAt: new Date().toISOString()
    };
    if (!tasks[index].comments) tasks[index].comments = [];
    tasks[index].comments!.push(newComment);
    setLocalTasks(tasks);
    return { comment: newComment, task: tasks[index] };
  }
  try {
    const response = await api.post<{ comment: any; task: Task }>(`/${taskId}/comments`, { text });
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return addComment(taskId, text);
  }
}

export async function deleteComment(taskId: string, commentId: string): Promise<{ success: boolean; task: Task }> {
  if (useLocalStorageFallback) {
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error("Task not found");
    if (tasks[index].comments) {
      tasks[index].comments = tasks[index].comments!.filter(c => c.id !== commentId);
    }
    setLocalTasks(tasks);
    return { success: true, task: tasks[index] };
  }
  try {
    const response = await api.delete<{ success: boolean; task: Task }>(`/${taskId}/comments/${commentId}`);
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return deleteComment(taskId, commentId);
  }
}

export async function getAllMembers(): Promise<string[]> {
  if (useLocalStorageFallback) {
    return getLocalMembers();
  }
  try {
    const response = await axios.get<string[]>("/api/members");
    if (typeof response.data === "string" && (response.data as string).includes("<!doctype html>")) {
      throw new Error("Invalid API response (received HTML)");
    }
    return response.data;
  } catch (err) {
    console.warn("Backend server not reached. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return getLocalMembers();
  }
}

export async function addMember(name: string): Promise<string[]> {
  if (useLocalStorageFallback) {
    const members = getLocalMembers();
    if (!members.includes(name)) {
      members.push(name);
      setLocalMembers(members);
    }
    return members;
  }
  try {
    const response = await axios.post<string[]>("/api/members", { name });
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return addMember(name);
  }
}

export async function deleteMember(name: string): Promise<string[]> {
  if (useLocalStorageFallback) {
    const members = getLocalMembers();
    const filtered = members.filter(m => m !== name);
    setLocalMembers(filtered);
    return filtered;
  }
  try {
    const response = await axios.delete<string[]>(`/api/members/${encodeURIComponent(name)}`);
    return response.data;
  } catch (err) {
    console.warn("API write failed. Falling back to local storage.", err);
    useLocalStorageFallback = true;
    return deleteMember(name);
  }
}

export default {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  getAllMembers,
  addMember,
  deleteMember,
};
