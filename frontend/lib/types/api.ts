import type { Task } from "./task";

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}

export interface APIError {
  detail: string;
  type: string;
  status: number;
}

export interface ValidationError {
  detail: string;
  type: "validation_error";
  errors: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

export interface ErrorState {
  message: string;
  type: "error" | "warning" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}
