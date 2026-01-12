/**
 * Better-Auth Server Configuration
 *
 * This file configures Better-Auth for Next.js App Router server-side usage.
 * It handles authentication, session management, and database integration.
 */

import { betterAuth } from "better-auth"
import { Pool } from "@neondatabase/serverless"

// Verify environment variables with detailed error messages
if (!process.env.DATABASE_URL) {
  console.error('[Better-Auth] DATABASE_URL is missing')
  throw new Error("DATABASE_URL environment variable is not set. Please add it to your Vercel environment variables.")
}

if (!process.env.BETTER_AUTH_SECRET) {
  console.error('[Better-Auth] BETTER_AUTH_SECRET is missing')
  throw new Error("BETTER_AUTH_SECRET environment variable is not set. Please add it to your Vercel environment variables.")
}

if (!process.env.BETTER_AUTH_URL) {
  console.error('[Better-Auth] BETTER_AUTH_URL is missing')
  throw new Error("BETTER_AUTH_URL environment variable is not set. Please add it to your Vercel environment variables.")
}

console.log('[Better-Auth] Initializing with Neon PostgreSQL...')
console.log('[Better-Auth] Base URL:', process.env.BETTER_AUTH_URL)

// Database connection pool for Better-Auth (Neon serverless)
// Neon serverless driver uses WebSockets automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Test database connection
pool.query('SELECT NOW()').then(() => {
  console.log('[Better-Auth] Database connection successful')
}).catch((error) => {
  console.error('[Better-Auth] Database connection failed:', error)
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
  // Database - Pass the connection string directly for better compatibility
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
