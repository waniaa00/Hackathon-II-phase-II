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
  advanced: {
    generateId: () => {
      // Use timestamp-based IDs
      return Date.now().toString();
    },
  },
});

export type Session = typeof auth.$Infer.Session;
