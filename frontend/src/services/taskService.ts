import axios from "axios";
import { Task, TaskInput } from "../types";

const VITE_API_URL = (import.meta as any).env.VITE_API_URL || "";

// Determine the root backend URL from VITE_API_URL or default to origin
let backendBaseUrl = "";
if (VITE_API_URL) {
  try {
    const url = new URL(VITE_API_URL, window.location.origin);
    // If VITE_API_URL has a pathname (like /api/tasks), get the base origin
    backendBaseUrl = url.origin;
  } catch {
    backendBaseUrl = VITE_API_URL;
  }
}

// Ensure backendBaseUrl doesn't end with a slash for consistent joining
if (backendBaseUrl.endsWith("/")) {
  backendBaseUrl = backendBaseUrl.slice(0, -1);
}

// Base URLs for tasks and members
const TASKS_API_URL = backendBaseUrl ? `${backendBaseUrl}/api/tasks` : "/api/tasks";
const MEMBERS_API_URL = backendBaseUrl ? `${backendBaseUrl}/api/members` : "/api/members";

const api = axios.create({
  baseURL: TASKS_API_URL,
});

export async function getAllTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>("");
  if (!Array.isArray(response.data)) {
    console.error("API response is not an array:", response.data);
    return [];
  }
  return response.data;
}

export async function getTask(id: string): Promise<Task> {
  const response = await api.get<Task>(`/${id}`);
  return response.data;
}

export async function createTask(data: TaskInput): Promise<Task> {
  const response = await api.post<Task>("", data);
  return response.data;
}

export async function updateTask(id: string, data: Partial<TaskInput>): Promise<Task> {
  const response = await api.put<Task>(`/${id}`, data);
  return response.data;
}

export async function deleteTask(id: string): Promise<any> {
  const response = await api.delete<any>(`/${id}`);
  return response.data;
}

export async function addComment(taskId: string, text: string): Promise<{ comment: any; task: Task }> {
  const response = await api.post<{ comment: any; task: Task }>(`/${taskId}/comments`, { text });
  return response.data;
}

export async function deleteComment(taskId: string, commentId: string): Promise<{ success: boolean; task: Task }> {
  const response = await api.delete<{ success: boolean; task: Task }>(`/${taskId}/comments/${commentId}`);
  return response.data;
}

export async function getAllMembers(): Promise<string[]> {
  const response = await axios.get<string[]>(MEMBERS_API_URL);
  if (!Array.isArray(response.data)) {
    console.error("API response is not an array:", response.data);
    return [];
  }
  return response.data;
}

export async function addMember(name: string): Promise<string[]> {
  const response = await axios.post<string[]>(MEMBERS_API_URL, { name });
  if (!Array.isArray(response.data)) {
    console.error("API response is not an array:", response.data);
    return [];
  }
  return response.data;
}

export async function deleteMember(name: string): Promise<string[]> {
  const response = await axios.delete<string[]>(`${MEMBERS_API_URL}/${encodeURIComponent(name)}`);
  if (!Array.isArray(response.data)) {
    console.error("API response is not an array:", response.data);
    return [];
  }
  return response.data;
}

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  getAllMembers,
  addMember,
  deleteMember,
};
