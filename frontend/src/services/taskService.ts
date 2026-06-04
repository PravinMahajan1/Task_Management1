import axios from "axios";
import { Task, TaskInput } from "../types";

const BASE_URL = (import.meta as any).env.VITE_API_URL || "/api/tasks";

const api = axios.create({
  baseURL: BASE_URL,
});

export async function getAllTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>("");
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
  const response = await axios.get<string[]>("/api/members");
  return response.data;
}

export async function addMember(name: string): Promise<string[]> {
  const response = await axios.post<string[]>("/api/members", { name });
  return response.data;
}

export async function deleteMember(name: string): Promise<string[]> {
  const response = await axios.delete<string[]>(`/api/members/${encodeURIComponent(name)}`);
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
