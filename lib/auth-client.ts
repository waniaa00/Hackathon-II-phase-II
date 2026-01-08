'use client'

import { apiClient } from './api-client';

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  created_at?: string;
}

export interface Session {
  user: User;
  token: string;
}

export const authClient = {
  // Sign up
  signUp: async (data: { email: string; password: string; name: string }) => {
    try {
      const result = await apiClient.auth.register(data);

      // Get user info after registration
      const user = await apiClient.auth.me();

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          name: data.name,
          displayName: data.name,
          created_at: user.created_at,
        },
        token: result.access_token,
      };

      return { data: session, error: null };
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  },

  // Sign in
  signIn: async (data: { email: string; password: string }) => {
    try {
      const result = await apiClient.auth.login(data);

      // Get user info after login
      const user = await apiClient.auth.me();

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0], // Use email prefix as name
          displayName: user.email.split('@')[0],
          created_at: user.created_at,
        },
        token: result.access_token,
      };

      return { data: session, error: null };
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  },

  // Sign out
  signOut: async () => {
    apiClient.auth.logout();
    return { data: null, error: null };
  },

  // Get current session
  getSession: async () => {
    try {
      const user = await apiClient.auth.me();

      if (!user) {
        return { data: null, error: null };
      }

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0],
          displayName: user.email.split('@')[0],
          created_at: user.created_at,
        },
        token: '', // Token is stored in apiClient
      };

      return { data: session, error: null };
    } catch (error) {
      return { data: null, error: null };
    }
  },

  // Use session hook (for compatibility)
  useSession: () => {
    return { data: null, isPending: false };
  },
};
