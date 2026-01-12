/**
 * Better-Auth API Route Handler
 *
 * This catch-all route handles all Better-Auth authentication endpoints:
 * - POST /api/auth/sign-up/email - User registration
 * - POST /api/auth/sign-in/email - User login
 * - POST /api/auth/sign-out - User logout
 * - GET /api/auth/get-session - Get current session
 *
 * Better-Auth automatically provides these endpoints when configured.
 */

import { auth } from "@/lib/auth-server"

// Force Node.js runtime (required for database connections)
export const runtime = 'nodejs'

// Disable static optimization for auth routes
export const dynamic = 'force-dynamic'

// Create handlers for Next.js App Router
export const GET = async (request: Request) => {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error('[Better-Auth GET] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST = async (request: Request) => {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error('[Better-Auth POST] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
