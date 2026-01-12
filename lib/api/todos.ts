/**
 * Todo API Client - Better-Auth Integration
 *
 * Tasks implemented: T061, T096
 * - T061: Update frontend API client to include credentials: 'include' in all fetch requests
 * - T096: Implement network error handling (fetch failures, timeouts) in auth forms with retry option
 */

// Define TypeScript interfaces for Todo data
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: string;
  updatedAt: string;
  user_id: number;
}

interface CreateTodoData {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Base fetch function with credentials inclusion and network error handling
async function apiFetch(url: string, options: RequestInit = {}, maxRetries: number = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1${url}`, {
        ...options,
        credentials: 'include', // T061: Include credentials (cookies) in all requests for Better-Auth session
        // Add timeout-like behavior with AbortController
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        // Handle different response statuses
        if (response.status >= 500) {
          // Server error - might be temporary, so throw for retry
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        } else {
          // Client error - don't retry, return the error
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `API request failed: ${response.status} ${response.statusText}`);
        }
      }

      // Success response
      return await response.json();
    } catch (error: unknown) {
      lastError = error;

      // Don't retry on network errors if max retries reached
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if it's a network error or timeout
      if (error instanceof TypeError || (error instanceof Error && (error.message.includes('timeout') || error.name === 'AbortError'))) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }

      // For other errors, don't retry
      throw error;
    }
  }

  // This shouldn't be reached, but TypeScript needs it
  throw lastError;
}

// Todo API functions
export const todoApi = {
  // Get all todos for current user
  async getTodos(): Promise<Todo[]> {
    return apiFetch('/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Get a specific todo by ID
  async getTodoById(id: number): Promise<Todo> {
    return apiFetch(`/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Create a new todo
  async createTodo(todoData: CreateTodoData): Promise<Todo> {
    return apiFetch('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
  },

  // Update a todo by ID
  async updateTodo(id: number, todoData: UpdateTodoData): Promise<Todo> {
    return apiFetch(`/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
  },

  // Delete a todo by ID
  async deleteTodo(id: number): Promise<void> {
    await apiFetch(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};