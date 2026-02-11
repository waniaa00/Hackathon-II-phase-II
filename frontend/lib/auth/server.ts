import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for Node.js runtime (dev mode) — Neon serverless needs WebSocket
neonConfig.webSocketConstructor = ws;

export const auth = betterAuth({
  // --- Database (Neon PostgreSQL) ---
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  // --- Base Configuration ---
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  // --- Email + Password Auth ---
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // disabled for dev
  },

  // --- Table Name Customization ---
  // CRITICAL: The backend's SQLModel uses __tablename__ = "user".
  // We prefix Better Auth tables with "auth_" to avoid collision.
  user: {
    modelName: "auth_user",
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    modelName: "auth_session",
    expiresIn: 60 * 60 * 24 * 7,   // 7 days
    updateAge: 60 * 60 * 24,        // refresh session every 24h
  },
  account: {
    modelName: "auth_account",
  },

  // --- Plugins ---
  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
        // sub defaults to user.id -- this is what backend reads as payload.get("sub")
      },
    }),
  ],
});

export type Auth = typeof auth;