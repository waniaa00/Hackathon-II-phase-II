/**
 * Better-Auth Configuration
 * Server-side authentication configuration with Neon PostgreSQL
 */

import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Create PostgreSQL connection pool for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const auth = betterAuth({
  database: {
    provider: "postgres",
    type: "postgres",
    pool: pool as any,
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production-min-32-chars-long",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for demo
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  socialProviders: {
    // Can add OAuth providers later (Google, GitHub, etc.)
  },
});

export type Session = typeof auth.$Infer.Session;
