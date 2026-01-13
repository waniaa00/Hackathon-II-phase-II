-- Better-Auth Database Schema Initialization
-- Run this script on your Neon PostgreSQL database to create the required tables

-- Create users table (Better-Auth managed)
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "name" TEXT,  -- Made nullable to allow signup without name
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "image" TEXT
);

-- Create sessions table (Better-Auth managed)
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT
);

-- Create accounts table (for OAuth providers, if needed)
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create verification table (for email verification)
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session"("token");
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");

-- Note: Make sure your todos table has a user_id column that references the user table
-- If you already have a todos table, you might need to add this column:
-- ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES "user"("id") ON DELETE CASCADE;
