/**
 * Todo API Contract
 * Defines the interface between frontend and backend todo endpoints
 */

// Todo Request/Response Types
export interface TodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
}

export interface TodoResponse {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListResponse {
  todos: TodoResponse[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface TodoUpdateRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
}

// Todo API Endpoints
export const TODO_ENDPOINTS = {
  LIST: '/api/todos',
  CREATE: '/api/todos',
  GET: (id: number | string) => `/api/todos/${id}`,
  UPDATE: (id: number | string) => `/api/todos/${id}`,
  DELETE: (id: number | string) => `/api/todos/${id}`,
} as const;

export type TodoEndpoint = typeof TODO_ENDPOINTS[keyof typeof TODO_ENDPOINTS];