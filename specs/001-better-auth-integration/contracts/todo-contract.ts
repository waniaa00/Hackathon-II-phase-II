/**
 * Todo API Contract
 *
 * Feature: 001-better-auth-integration
 * Date: 2026-01-12
 *
 * This contract defines the todo API endpoints with authorization,
 * request/response schemas, and user-scoped data access patterns.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Todo status values
 */
export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Todo priority levels
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Recurrence frequency for recurring tasks
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Create todo request payload
 */
export interface CreateTodoRequest {
  /**
   * Todo title (required)
   * @minLength 1
   * @maxLength 255
   * @example "Complete project documentation"
   */
  title: string;

  /**
   * Detailed description (optional)
   * @maxLength 10000
   * @example "Write comprehensive docs for the authentication feature"
   */
  description?: string;

  /**
   * Priority level (defaults to 'medium')
   * @default "medium"
   * @example "high"
   */
  priority?: TodoPriority;

  /**
   * Due date and time (ISO 8601 format, optional)
   * @format date-time
   * @example "2026-01-15T17:00:00Z"
   */
  due_date?: string;

  /**
   * Array of tags for categorization (optional)
   * @maxItems 20
   * @example ["work", "documentation", "urgent"]
   */
  tags?: string[];

  /**
   * Whether this is a recurring task
   * @default false
   * @example true
   */
  is_recurring?: boolean;

  /**
   * Recurrence frequency (required if is_recurring=true)
   * @example "weekly"
   */
  frequency?: RecurrenceFrequency;

  /**
   * Recurrence interval (e.g., every 2 weeks)
   * Required if is_recurring=true
   * @minimum 1
   * @maximum 100
   * @example 2
   */
  interval?: number;
}

/**
 * Update todo request payload (all fields optional)
 */
export interface UpdateTodoRequest {
  /**
   * Updated title
   * @minLength 1
   * @maxLength 255
   */
  title?: string;

  /**
   * Updated description
   * @maxLength 10000
   */
  description?: string;

  /**
   * Updated status
   */
  status?: TodoStatus;

  /**
   * Updated priority
   */
  priority?: TodoPriority;

  /**
   * Updated due date (null to clear)
   * @format date-time
   */
  due_date?: string | null;

  /**
   * Updated tags
   * @maxItems 20
   */
  tags?: string[];

  /**
   * Updated recurring status
   */
  is_recurring?: boolean;

  /**
   * Updated frequency (null to clear)
   */
  frequency?: RecurrenceFrequency | null;

  /**
   * Updated interval (null to clear)
   * @minimum 1
   * @maximum 100
   */
  interval?: number | null;
}

/**
 * Query parameters for filtering todos
 */
export interface GetTodosQueryParams {
  /**
   * Filter by status
   * @example "pending"
   */
  status?: TodoStatus;

  /**
   * Filter by priority
   * @example "high"
   */
  priority?: TodoPriority;

  /**
   * Filter by tag (exact match)
   * @example "work"
   */
  tag?: string;

  /**
   * Sort field
   * @default "created_at"
   * @example "due_date"
   */
  sort_by?: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'status';

  /**
   * Sort direction
   * @default "desc"
   * @example "asc"
   */
  sort_order?: 'asc' | 'desc';

  /**
   * Page number (for pagination)
   * @minimum 1
   * @default 1
   * @example 1
   */
  page?: number;

  /**
   * Items per page (for pagination)
   * @minimum 1
   * @maximum 100
   * @default 50
   * @example 20
   */
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Todo response (single todo)
 */
export interface TodoResponse {
  /**
   * Unique todo identifier
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * Owner user ID (automatically set from session)
   * @format uuid
   * @example "660e8400-e29b-41d4-a716-446655440000"
   */
  user_id: string;

  /**
   * Todo title
   * @example "Complete project documentation"
   */
  title: string;

  /**
   * Detailed description
   * @example "Write comprehensive docs for the authentication feature"
   */
  description: string | null;

  /**
   * Current status
   * @example "in_progress"
   */
  status: TodoStatus;

  /**
   * Priority level
   * @example "high"
   */
  priority: TodoPriority;

  /**
   * Due date and time
   * @format date-time
   * @example "2026-01-15T17:00:00Z"
   */
  due_date: string | null;

  /**
   * Tags array
   * @example ["work", "documentation"]
   */
  tags: string[] | null;

  /**
   * Is this a recurring task
   * @example true
   */
  is_recurring: boolean;

  /**
   * Recurrence frequency
   * @example "weekly"
   */
  frequency: RecurrenceFrequency | null;

  /**
   * Recurrence interval
   * @example 2
   */
  interval: number | null;

  /**
   * Creation timestamp
   * @format date-time
   * @example "2026-01-12T10:30:00Z"
   */
  created_at: string;

  /**
   * Last update timestamp
   * @format date-time
   * @example "2026-01-12T11:45:00Z"
   */
  updated_at: string;
}

/**
 * Paginated todos list response
 */
export interface TodoListResponse {
  /**
   * Array of todos
   */
  items: TodoResponse[];

  /**
   * Total count of todos (across all pages)
   * @example 47
   */
  total: number;

  /**
   * Current page number
   * @example 1
   */
  page: number;

  /**
   * Items per page
   * @example 20
   */
  limit: number;

  /**
   * Total number of pages
   * @example 3
   */
  total_pages: number;
}

/**
 * Todo deletion success response
 */
export interface DeleteTodoResponse {
  /**
   * Success message
   * @example "Todo deleted successfully"
   */
  message: string;

  /**
   * ID of deleted todo
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  deleted_id: string;
}

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Error response structure (consistent with auth-contract.ts)
 */
export interface ErrorResponse {
  /**
   * Error message (user-friendly, no sensitive info)
   * @example "Forbidden: You don't own this todo"
   */
  detail: string;

  /**
   * HTTP status code
   * @example 403
   */
  status_code: number;
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * GET /api/v1/todos
 *
 * Get all todos for authenticated user (with filtering and pagination)
 *
 * @tags Todos
 * @summary List user's todos
 *
 * @security Cookie (better-auth.session_token)
 * @queryParams {GetTodosQueryParams}
 *
 * @response 200 {TodoListResponse} Todos retrieved successfully
 * @response 401 {ErrorResponse} Not authenticated
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * GET /api/v1/todos?status=pending&sort_by=due_date&sort_order=asc
 * Cookie: better-auth.session_token=<token>
 *
 * @example Success Response (200)
 * {
 *   "items": [
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "user_id": "660e8400-e29b-41d4-a716-446655440000",
 *       "title": "Complete project documentation",
 *       "description": "Write comprehensive docs",
 *       "status": "pending",
 *       "priority": "high",
 *       "due_date": "2026-01-15T17:00:00Z",
 *       "tags": ["work", "documentation"],
 *       "is_recurring": false,
 *       "frequency": null,
 *       "interval": null,
 *       "created_at": "2026-01-12T10:30:00Z",
 *       "updated_at": "2026-01-12T10:30:00Z"
 *     }
 *   ],
 *   "total": 1,
 *   "page": 1,
 *   "limit": 50,
 *   "total_pages": 1
 * }
 */
export type GetTodosEndpoint = {
  method: 'GET';
  path: '/api/v1/todos';
  query: GetTodosQueryParams;
  responses: {
    200: TodoListResponse;
    401: ErrorResponse;
    500: ErrorResponse;
  };
};

/**
 * GET /api/v1/todos/:id
 *
 * Get a single todo by ID (with ownership verification)
 *
 * @tags Todos
 * @summary Get todo by ID
 *
 * @security Cookie (better-auth.session_token)
 * @pathParam {string} id - Todo ID
 *
 * @response 200 {TodoResponse} Todo retrieved successfully
 * @response 401 {ErrorResponse} Not authenticated
 * @response 403 {ErrorResponse} Forbidden (not owner)
 * @response 404 {ErrorResponse} Todo not found
 *
 * @example Request
 * GET /api/v1/todos/550e8400-e29b-41d4-a716-446655440000
 * Cookie: better-auth.session_token=<token>
 *
 * @example Success Response (200)
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "user_id": "660e8400-e29b-41d4-a716-446655440000",
 *   "title": "Complete project documentation",
 *   "description": "Write comprehensive docs",
 *   "status": "in_progress",
 *   "priority": "high",
 *   "due_date": "2026-01-15T17:00:00Z",
 *   "tags": ["work", "documentation"],
 *   "is_recurring": false,
 *   "frequency": null,
 *   "interval": null,
 *   "created_at": "2026-01-12T10:30:00Z",
 *   "updated_at": "2026-01-12T11:45:00Z"
 * }
 *
 * @example Error Response (403)
 * {
 *   "detail": "Forbidden: You don't own this todo",
 *   "status_code": 403
 * }
 */
export type GetTodoEndpoint = {
  method: 'GET';
  path: '/api/v1/todos/:id';
  params: { id: string };
  responses: {
    200: TodoResponse;
    401: ErrorResponse;
    403: ErrorResponse;
    404: ErrorResponse;
  };
};

/**
 * POST /api/v1/todos
 *
 * Create a new todo (automatically associated with authenticated user)
 *
 * @tags Todos
 * @summary Create todo
 *
 * @security Cookie (better-auth.session_token)
 * @requestBody {CreateTodoRequest} application/json
 *
 * @response 201 {TodoResponse} Todo created successfully
 * @response 401 {ErrorResponse} Not authenticated
 * @response 422 {ErrorResponse} Validation error
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * POST /api/v1/todos
 * Cookie: better-auth.session_token=<token>
 * Content-Type: application/json
 *
 * {
 *   "title": "Complete project documentation",
 *   "description": "Write comprehensive docs for the authentication feature",
 *   "priority": "high",
 *   "due_date": "2026-01-15T17:00:00Z",
 *   "tags": ["work", "documentation"],
 *   "is_recurring": false
 * }
 *
 * @example Success Response (201)
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "user_id": "660e8400-e29b-41d4-a716-446655440000",
 *   "title": "Complete project documentation",
 *   "description": "Write comprehensive docs for the authentication feature",
 *   "status": "pending",
 *   "priority": "high",
 *   "due_date": "2026-01-15T17:00:00Z",
 *   "tags": ["work", "documentation"],
 *   "is_recurring": false,
 *   "frequency": null,
 *   "interval": null,
 *   "created_at": "2026-01-12T10:30:00Z",
 *   "updated_at": "2026-01-12T10:30:00Z"
 * }
 */
export type CreateTodoEndpoint = {
  method: 'POST';
  path: '/api/v1/todos';
  request: CreateTodoRequest;
  responses: {
    201: TodoResponse;
    401: ErrorResponse;
    422: ErrorResponse;
    500: ErrorResponse;
  };
};

/**
 * PUT /api/v1/todos/:id
 *
 * Update an existing todo (with ownership verification)
 *
 * @tags Todos
 * @summary Update todo
 *
 * @security Cookie (better-auth.session_token)
 * @pathParam {string} id - Todo ID
 * @requestBody {UpdateTodoRequest} application/json
 *
 * @response 200 {TodoResponse} Todo updated successfully
 * @response 401 {ErrorResponse} Not authenticated
 * @response 403 {ErrorResponse} Forbidden (not owner)
 * @response 404 {ErrorResponse} Todo not found
 * @response 422 {ErrorResponse} Validation error
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * PUT /api/v1/todos/550e8400-e29b-41d4-a716-446655440000
 * Cookie: better-auth.session_token=<token>
 * Content-Type: application/json
 *
 * {
 *   "status": "completed",
 *   "description": "Documentation completed and reviewed"
 * }
 *
 * @example Success Response (200)
 * {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",
 *   "user_id": "660e8400-e29b-41d4-a716-446655440000",
 *   "title": "Complete project documentation",
 *   "description": "Documentation completed and reviewed",
 *   "status": "completed",
 *   "priority": "high",
 *   "due_date": "2026-01-15T17:00:00Z",
 *   "tags": ["work", "documentation"],
 *   "is_recurring": false,
 *   "frequency": null,
 *   "interval": null,
 *   "created_at": "2026-01-12T10:30:00Z",
 *   "updated_at": "2026-01-12T14:22:00Z"
 * }
 */
export type UpdateTodoEndpoint = {
  method: 'PUT';
  path: '/api/v1/todos/:id';
  params: { id: string };
  request: UpdateTodoRequest;
  responses: {
    200: TodoResponse;
    401: ErrorResponse;
    403: ErrorResponse;
    404: ErrorResponse;
    422: ErrorResponse;
    500: ErrorResponse;
  };
};

/**
 * DELETE /api/v1/todos/:id
 *
 * Delete a todo (with ownership verification)
 *
 * @tags Todos
 * @summary Delete todo
 *
 * @security Cookie (better-auth.session_token)
 * @pathParam {string} id - Todo ID
 *
 * @response 200 {DeleteTodoResponse} Todo deleted successfully
 * @response 401 {ErrorResponse} Not authenticated
 * @response 403 {ErrorResponse} Forbidden (not owner)
 * @response 404 {ErrorResponse} Todo not found
 * @response 500 {ErrorResponse} Internal server error
 *
 * @example Request
 * DELETE /api/v1/todos/550e8400-e29b-41d4-a716-446655440000
 * Cookie: better-auth.session_token=<token>
 *
 * @example Success Response (200)
 * {
 *   "message": "Todo deleted successfully",
 *   "deleted_id": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export type DeleteTodoEndpoint = {
  method: 'DELETE';
  path: '/api/v1/todos/:id';
  params: { id: string };
  responses: {
    200: DeleteTodoResponse;
    401: ErrorResponse;
    403: ErrorResponse;
    404: ErrorResponse;
    500: ErrorResponse;
  };
};

// ============================================================================
// API Client Type (for frontend usage)
// ============================================================================

/**
 * Todo API client interface
 */
export interface TodoAPI {
  /**
   * Get all todos for authenticated user
   */
  getTodos(query?: GetTodosQueryParams): Promise<TodoListResponse>;

  /**
   * Get single todo by ID
   */
  getTodo(id: string): Promise<TodoResponse>;

  /**
   * Create new todo
   */
  createTodo(data: CreateTodoRequest): Promise<TodoResponse>;

  /**
   * Update existing todo
   */
  updateTodo(id: string, data: UpdateTodoRequest): Promise<TodoResponse>;

  /**
   * Delete todo
   */
  deleteTodo(id: string): Promise<DeleteTodoResponse>;
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export enum TodoStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// ============================================================================
// Error Messages (consistent across frontend/backend)
// ============================================================================

export const TodoErrorMessages = {
  NOT_AUTHENTICATED: 'Not authenticated',
  NOT_FOUND: 'Todo not found',
  FORBIDDEN: "Forbidden: You don't own this todo",
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title must be 255 characters or less',
  DESCRIPTION_TOO_LONG: 'Description must be 10000 characters or less',
  INVALID_STATUS: 'Invalid status value',
  INVALID_PRIORITY: 'Invalid priority value',
  INVALID_DUE_DATE: 'Invalid due date format',
  TOO_MANY_TAGS: 'Maximum 20 tags allowed',
  TAG_TOO_LONG: 'Each tag must be 50 characters or less',
  RECURRING_MISSING_FIELDS: 'Frequency and interval required for recurring tasks',
  INVALID_INTERVAL: 'Interval must be between 1 and 100',
  INTERNAL_ERROR: 'An error occurred. Please try again later.',
} as const;

// ============================================================================
// Authorization Notes
// ============================================================================

/**
 * Authorization Pattern:
 *
 * ALL todo endpoints require authentication via session cookie.
 *
 * Authorization is enforced at two levels:
 *
 * 1. FastAPI Dependency Level:
 *    - `get_current_user` dependency extracts user_id from session
 *    - Returns 401 if session is invalid or expired
 *
 * 2. Route Handler Level:
 *    - GET /todos: Automatically filtered by user_id
 *    - GET /todos/:id: Verify todo.user_id == current_user.id before returning
 *    - POST /todos: Automatically set user_id from current_user
 *    - PUT /todos/:id: Verify ownership before updating
 *    - DELETE /todos/:id: Verify ownership before deleting
 *
 * User Isolation Guarantees:
 * - Users can ONLY see their own todos
 * - Users can ONLY modify their own todos
 * - Cross-user access attempts return 403 Forbidden
 * - Database queries ALWAYS filter by user_id
 *
 * Security Notes:
 * - Never trust user_id from request body
 * - Always use user_id from validated session
 * - Return 403 (not 404) for unauthorized access to existing todos
 * - Generic error messages prevent user enumeration
 */
