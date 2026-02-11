import { authClient } from "@/lib/auth/client";
import type { APIError } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIClientError extends Error {
  status: number;
  type: string;

  constructor(message: string, status: number, type: string = "api_error") {
    super(message);
    this.name = "APIClientError";
    this.status = status;
    this.type = type;
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    const result = await authClient.$fetch("/token", { method: "GET" });
    return (result.data as { token?: string })?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: APIError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        detail: response.statusText || "An error occurred",
        type: "api_error",
        status: response.status,
      };
    }
    throw new APIClientError(
      errorData.detail,
      response.status,
      errorData.type
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Helper functions for common HTTP methods
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "GET" });
}

export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete(endpoint: string): Promise<void> {
  return apiClient<void>(endpoint, { method: "DELETE" });
}
