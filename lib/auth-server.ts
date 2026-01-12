/**
 * Better-Auth Server Configuration
 *
 * This file configures Better-Auth for Next.js App Router server-side usage.
 * It handles authentication, session management, and database integration.
 */

import { betterAuth } from "better-auth"
import { Pool } from "pg"

// Database connection pool for Better-Auth
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration for serverless (Neon PostgreSQL)
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

/**
 * Better-Auth configuration following official documentation
 *
 * Features:
 * - Email and password authentication
 * - Session management with 7-day expiration
 * - Session renewal every 24 hours
 * - PostgreSQL session storage via Neon
 * - Secure cookie configuration (HTTP-only, Secure in production)
 */
export const auth = betterAuth({
  // Database adapter - Better-Auth uses this to store users and sessions
  database: pool,

  // Email and password authentication provider
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Password requirements enforced by Better-Auth:
    // - Minimum 8 characters
    // - Must contain uppercase letter
    // - Must contain digit
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
    updateAge: 60 * 60 * 24, // Update session every 24 hours (in seconds)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  // Security configuration
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // Trusted origins for CORS
  trustedOrigins: [
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:3001",
  ],

  // Advanced configuration
  advanced: {
    // Cookie settings
    cookiePrefix: "better-auth",
    // Secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
