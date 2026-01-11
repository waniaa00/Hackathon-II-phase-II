'use client'

/**
 * Better-Auth Client
 * Client-side authentication using Better-Auth SDK
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
});

// Re-export types for compatibility
export type { Session } from "./auth";

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  created_at?: string;
}
