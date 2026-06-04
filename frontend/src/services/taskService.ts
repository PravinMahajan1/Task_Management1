import axios from "axios";
import { Task, TaskInput } from "../types";

// In production (Vercel), set VITE_API_URL to your full Render backend URL
// e.g. https://your-backend.onrender.com
// In local dev, leave it empty — Vite proxy handles /api/* → localhost:3000
const BACKEND_BASE = ((import.meta as any).env.VITE_API_URL as string | undefined)
  ? String((import.meta as any).env.VITE_API_URL).replace(/\/$/, "")
  : "";

const TASKS_API_URL = `${BACKEND_BASE}/api/tasks`;
const MEMBERS_API_URL = `${BACKEND_BASE}/api/members`;

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
