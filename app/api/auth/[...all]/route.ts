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

// Export GET and POST handlers from Better-Auth
// Better-Auth handles routing to specific endpoints based on the path
export const { GET, POST } = auth.handler
