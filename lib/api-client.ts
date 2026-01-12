/**
 * API Client for Backend Communication
 * Handles all HTTP requests to the FastAPI backend using Better-Auth sessions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api/v1`;

interface ApiError {
  detail: string;
}

// Helper to make authenticated requests using Better-Auth cookies
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for Better-Auth session
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: 'An error occurred',
    }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response;
}

export const apiClient = {
  // Auth endpoints - now handled by Better-Auth
  auth: {
    register: async (_data: { email: string; password: string; name: string }) => {
      // Intentionally unused parameter - Better-Auth handles registration
      throw new Error('Use Better-Auth client for registration');
    },

    login: async (_data: { email: string; password: string }) => {
      // Intentionally unused parameter - Better-Auth handles login
      throw new Error('Use Better-Auth client for login');
    },

    me: async () => {
      // Use Better-Auth session to get user info
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include', // Include cookies for Better-Auth session
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || 'Failed to get user info');
      }

      return response.json();
    },

    logout: async () => {
      // This should not be called since Better-Auth handles logout
      throw new Error('Use Better-Auth client for logout');
    },
  },

  // Todo endpoints
  todos: {
    getAll: async (params?: {
      skip?: number;
      limit?: number;
      priority?: string;
      completed?: boolean;
      search?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.priority) queryParams.append('priority', params.priority);
      if (params?.completed !== undefined) queryParams.append('completed', params.completed.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `${API_BASE}/todos${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetchWithAuth(url);
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetchWithAuth(`${API_BASE}/todos/${id}`);
      return response.json();
    },

    create: async (data: {
      title: string;
      description?: string;
      priority?: string;
      completed?: boolean;
      due_date?: string;
      tags?: string[];
      recurrence?: {
        frequency: string;
        interval: number;
      };
    }) => {
      const response = await fetchWithAuth(`${API_BASE}/todos`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: string, data: Partial<{
      title: string;
      description: string;
      priority: string;
      completed: boolean;
      due_date: string;
      tags: string[];
      recurrence: {
        frequency: string;
        interval: number;
      };
    }>) => {
      const response = await fetchWithAuth(`${API_BASE}/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: string) => {
      await fetchWithAuth(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Health check
  health: async () => {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  },
};
