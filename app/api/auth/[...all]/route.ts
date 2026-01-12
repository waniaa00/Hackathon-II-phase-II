/**
 * Better-Auth API Route Handler
 *
 * This catch-all route handles all Better-Auth authentication endpoints:
 * - POST /api/auth/signup - User registration
 * - POST /api/auth/login - User login
 * - POST /api/auth/logout - User logout
 * - GET /api/auth/session - Get current session
 *
 * Better-Auth automatically provides these endpoints when configured.
 */

import { auth } from "@/lib/auth-server"

// Create handlers for Next.js App Router
export const GET = async (request: Request) => {
  return auth.handler(request);
};

export const POST = async (request: Request) => {
  return auth.handler(request);
};
