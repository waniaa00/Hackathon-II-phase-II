/**
 * Authentication API Contract
 *
 * Feature: 001-better-auth-integration
 * Date: 2026-01-12
 *
 * This contract defines the authentication API endpoints, request/response schemas,
 * and error handling patterns for Better-Auth integration.
 */

// ============================================================================
// Request Types
// ============================================================================

/**
 * User signup request payload
 */
export interface SignupRequest {
  /**
   * User email address (must be unique)
   * @pattern ^[^\s@]+@[^\s@]+\.[^\s@]+$
   * @example "user@example.com"
   */
  email: string;

  /**
   * User password (min 8 characters, must contain uppercase and digit)
   * @minLength 8
   * @maxLength 100
   * @example "SecurePass123"
   */
  password: string;

  /**
   * Optional user display name
   * @maxLength 255
   * @example "John Doe"
   */
  name?: string;
}

/**
 * User login request payload
 */
export interface LoginRequest {
  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;

  /**
   * User password
   * @example "SecurePass123"
   */
  password: string;
}

/**
 * Session refresh request (no body, uses cookie)
 */
export interface RefreshSessionRequest {
  // Cookie-based, no request body required
  // Adding a minimal property to avoid empty interface lint error
  readonly _?: never;
}

/**
 * Logout request (no body, uses cookie)
 */
export interface LogoutRequest {
  // Cookie-based, no request body required
  // Adding a minimal property to avoid empty interface lint error
  readonly _?: never;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * User data returned in auth responses
 */
export interface UserResponse {
  /**
   * Unique user identifier
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;

  /**
   * User display name (null if not provided)
   * @example "John Doe"
   */
  name: string | null;

  /**
   * Email verification status
   * @example false
   */
  email_verified: boolean;

  /**
   * Account creation timestamp
   * @format date-time
   * @example "2026-01-12T10:30:00Z"
   */
  created_at: string;
}

/**
 * Session data returned in auth responses
 */
export interface SessionResponse {
  /**
   * Session expiration timestamp
   * @format date-time
   * @example "2026-01-19T10:30:00Z"
   */
  expires_at: string;
}

/**
 * Successful authentication response (signup, login)
 */
export interface AuthSuccessResponse {
  /**
   * Authenticated user data
   */
  user: UserResponse;

  /**
   * Session information
   */
  session: SessionResponse;

  /**
   * Success message
   * @example "Login successful"
   */
  message: string;
}

/**
 * Current session/user info response
 */
export interface SessionInfoResponse {
  /**
   * Current authenticated user
   */
  user: UserResponse;

  /**
   * Current session info
   */
  session: SessionResponse;
}

/**
 * Logout success response
 */
export interface LogoutSuccessResponse {
  /**
   * Success message
   * @example "Logout successful"
   */
  message: string;
}

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Validation error detail
 */
export interface ValidationError {
  /**
   * Field name that failed validation
   * @example "email"
   */
  field: string;

  /**
   * Validation error message
   * @example "Invalid email format"
   */
  message: string;
}

/**
 * Error response structure (consistent across all endpoints)
 */
export interface ErrorResponse {
  /**
   * Error message (user-friendly, no sensitive info)
   * @example "Invalid email or password"
   */
  detail: string;

  /**
   * HTTP status code
   * @example 401
   */
  status_code: number;

  /**
   * Optional validation errors (for 422 responses)
   */
  errors?: ValidationError[];
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * POST /api/auth/signup
 *
 * Register a new user account
 *
 * @tags Authentication
 * @summary User registration
 *
 * @requestBody {SignupRequest} application/json
 *
 * @response 201 {AuthSuccessResponse} User created and authenticated
 * @response 400 {ErrorResponse} Email already exists
 * @response 422 {ErrorResponse} Validation error (invalid email, weak password, etc.)
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * POST /api/auth/signup
 * Content-Type: application/json
 *
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123",
 *   "name": "John Doe"
 * }
 *
 * @example Success Response (201)
 * {
 *   "user": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "email_verified": false,
 *     "created_at": "2026-01-12T10:30:00Z"
 *   },
 *   "session": {
 *     "expires_at": "2026-01-19T10:30:00Z"
 *   },
 *   "message": "Signup successful"
 * }
 *
 * Set-Cookie: better-auth.session_token=<token>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
 *
 * @example Error Response (400)
 * {
 *   "detail": "Email already registered",
 *   "status_code": 400
 * }
 */
export type SignupEndpoint = {
  method: 'POST';
  path: '/api/auth/signup';
  request: SignupRequest;
  responses: {
    201: AuthSuccessResponse;
    400: ErrorResponse;
    422: ErrorResponse;
    500: ErrorResponse;
  };
};

/**
 * POST /api/auth/login
 *
 * Authenticate user and create session
 *
 * @tags Authentication
 * @summary User login
 *
 * @requestBody {LoginRequest} application/json
 *
 * @response 200 {AuthSuccessResponse} User authenticated successfully
 * @response 401 {ErrorResponse} Invalid credentials
 * @response 422 {ErrorResponse} Validation error
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * POST /api/auth/login
 * Content-Type: application/json
 *
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123"
 * }
 *
 * @example Success Response (200)
 * {
 *   "user": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "email_verified": false,
 *     "created_at": "2026-01-12T10:30:00Z"
 *   },
 *   "session": {
 *     "expires_at": "2026-01-19T10:30:00Z"
 *   },
 *   "message": "Login successful"
 * }
 *
 * Set-Cookie: better-auth.session_token=<token>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
 *
 * @example Error Response (401)
 * {
 *   "detail": "Invalid email or password",
 *   "status_code": 401
 * }
 */
export type LoginEndpoint = {
  method: 'POST';
  path: '/api/auth/login';
  request: LoginRequest;
  responses: {
    200: AuthSuccessResponse;
    401: ErrorResponse;
    422: ErrorResponse;
    500: ErrorResponse;
  };
};

/**
 * GET /api/auth/session
 *
 * Get current authenticated session info
 *
 * @tags Authentication
 * @summary Get session info
 *
 * @security Cookie (better-auth.session_token)
 *
 * @response 200 {SessionInfoResponse} Session is valid
 * @response 401 {ErrorResponse} Not authenticated or session expired
 *
 * @example Request
 * GET /api/auth/session
 * Cookie: better-auth.session_token=<token>
 *
 * @example Success Response (200)
 * {
 *   "user": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "email_verified": false,
 *     "created_at": "2026-01-12T10:30:00Z"
 *   },
 *   "session": {
 *     "expires_at": "2026-01-19T10:30:00Z"
 *   }
 * }
 *
 * @example Error Response (401)
 * {
 *   "detail": "Not authenticated",
 *   "status_code": 401
 * }
 */
export type SessionInfoEndpoint = {
  method: 'GET';
  path: '/api/auth/session';
  request: null;
  responses: {
    200: SessionInfoResponse;
    401: ErrorResponse;
  };
};

/**
 * POST /api/auth/logout
 *
 * End user session and invalidate token
 *
 * @tags Authentication
 * @summary User logout
 *
 * @security Cookie (better-auth.session_token)
 *
 * @response 200 {LogoutSuccessResponse} Logout successful
 * @response 401 {ErrorResponse} Not authenticated
 *
 * @example Request
 * POST /api/auth/logout
 * Cookie: better-auth.session_token=<token>
 *
 * @example Success Response (200)
 * {
 *   "message": "Logout successful"
 * }
 *
 * Set-Cookie: better-auth.session_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
 *
 * @example Error Response (401)
 * {
 *   "detail": "Not authenticated",
 *   "status_code": 401
 * }
 */
export type LogoutEndpoint = {
  method: 'POST';
  path: '/api/auth/logout';
  request: null;
  responses: {
    200: LogoutSuccessResponse;
    401: ErrorResponse;
  };
};

// ============================================================================
// API Client Type (for frontend usage)
// ============================================================================

/**
 * Authentication API client interface
 */
export interface AuthAPI {
  /**
   * Register a new user
   */
  signup(data: SignupRequest): Promise<AuthSuccessResponse>;

  /**
   * Login existing user
   */
  login(data: LoginRequest): Promise<AuthSuccessResponse>;

  /**
   * Get current session info
   */
  getSession(): Promise<SessionInfoResponse>;

  /**
   * Logout current user
   */
  logout(): Promise<LogoutSuccessResponse>;
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export enum AuthStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// ============================================================================
// Error Messages (consistent across frontend/backend)
// ============================================================================

export const AuthErrorMessages = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  NOT_AUTHENTICATED: 'Not authenticated',
  SESSION_EXPIRED: 'Session expired',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase and digit',
  INTERNAL_ERROR: 'An error occurred. Please try again later.',
} as const;

// ============================================================================
// Security Notes
// ============================================================================

/**
 * Security Considerations:
 *
 * 1. Session Tokens:
 *    - Stored in HTTP-only cookies (not accessible to JavaScript)
 *    - Secure flag enabled in production (HTTPS only)
 *    - SameSite=Lax to prevent CSRF attacks
 *    - 7-day expiration with 24-hour renewal
 *
 * 2. Error Messages:
 *    - Generic messages to prevent user enumeration
 *    - "Invalid email or password" instead of specific field errors
 *    - No sensitive information in error responses
 *
 * 3. CORS:
 *    - Backend must specify exact origins (no wildcard with credentials)
 *    - Frontend must use credentials: 'include' in fetch requests
 *
 * 4. Password Security:
 *    - Hashed using Better-Auth (bcrypt or similar)
 *    - Never returned in API responses
 *    - Min 8 characters, must contain uppercase and digit
 *
 * 5. Rate Limiting:
 *    - Login/signup endpoints should be rate-limited (future enhancement)
 *    - Prevent brute-force attacks
 */
