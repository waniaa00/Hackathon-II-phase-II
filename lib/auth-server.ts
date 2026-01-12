/**
 * Better-Auth Server Configuration
 *
 * This file configures Better-Auth for Next.js App Router server-side usage.
 * It handles authentication, session management, and database integration.
 */

import { betterAuth } from "better-auth"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Configure Neon for serverless environments (Vercel Edge)
if (typeof process !== 'undefined' && !process.env.VERCEL_ENV) {
  // Local development - use WebSocket polyfill
  neonConfig.webSocketConstructor = ws
}

// Verify environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set")
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL environment variable is not set")
}

// Database connection pool for Better-Auth (Neon serverless)
// Note: Neon uses WebSockets for connections in serverless environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
    updateAge: 60 * 60 * 24, // Update session every 24 hours (in seconds)
  },

  // Security configuration
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // Trusted origins for CORS
  trustedOrigins: [
    "https://hackathon-ii-phase-ii-ashy.vercel.app",
    "http://localhost:3000",
  ],
})
