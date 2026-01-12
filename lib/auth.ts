/**
 * Better-Auth Client Configuration
 *
 * This file configures Better-Auth client for frontend authentication.
 * Provides hooks and functions for signup, login, logout, and session management.
 */

import { createAuthClient } from "better-auth/react"

/**
 * Better-Auth client instance
 *
 * Automatically handles:
 * - Session cookies (HTTP-only)
 * - Token management
 * - Authentication state
 *
 * Note: baseURL is set to current origin for same-origin requests.
 * This ensures the client makes requests to the Next.js API routes.
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
})

// Export authentication methods and hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient

// Type exports for TypeScript
export type { Session } from "better-auth/types"
