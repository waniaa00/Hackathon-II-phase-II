/**
 * API Client for Backend Communication
 * Handles all HTTP requests to the FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api/v1`;

interface ApiError {
  detail: string;
}

// Helper to get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Helper to set auth token
const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

// Helper to clear auth token
const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
};

// Helper to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
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
  // Auth endpoints
  auth: {
    register: async (data: { email: string; password: string; name: string }) => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const result = await response.json();
      setToken(result.access_token);
      return result;
    },

    login: async (data: { email: string; password: string }) => {
      // FastAPI OAuth2 expects form data
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const result = await response.json();
      setToken(result.access_token);
      return result;
    },

    me: async () => {
      const response = await fetchWithAuth(`${API_BASE}/auth/me`);
      return response.json();
    },

    logout: () => {
      clearToken();
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

export { setToken, getToken, clearToken };
