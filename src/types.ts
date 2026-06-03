export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Launched";

export interface TaskComment {
  id: string;
  text: string;
  createdAt: string; // "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // "YYYY-MM-DD"
  assigneeName: string;
  comments?: TaskComment[];
}

export interface TaskInput {
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assigneeName: string;
}
