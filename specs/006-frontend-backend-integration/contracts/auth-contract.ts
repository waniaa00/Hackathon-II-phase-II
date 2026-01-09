/**
 * Auth API Contract
 * Defines the interface between frontend and backend authentication endpoints
 */

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
  refreshToken?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignupResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

// Auth API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/me',
} as const;

export type AuthEndpoint = typeof AUTH_ENDPOINTS[keyof typeof AUTH_ENDPOINTS];