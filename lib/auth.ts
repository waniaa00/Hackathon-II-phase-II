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
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
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
