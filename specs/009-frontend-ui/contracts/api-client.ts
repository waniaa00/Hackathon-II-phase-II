/**
 * API Client Contract for Todo App Frontend
 *
 * This file defines the TypeScript interface for the API client
 * that connects to the backend (008-backend-api).
 *
 * Base URL: NEXT_PUBLIC_API_URL (e.g., http://localhost:8000)
 * All endpoints require JWT authentication via Authorization header.
 */

import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskQueryParams,
  Tag,
  TagCreate,
  TagUpdate,
  Priority,
} from "../data-model.md";

// ============================================
// API Client Interface
// ============================================

export interface TasksAPI {
  /**
   * GET /api/{user_id}/tasks
   * List all tasks for the authenticated user with optional filters
   */
  list(params?: Partial<TaskQueryParams>): Promise<TaskListResponse>;

  /**
   * GET /api/{user_id}/tasks/{task_id}
   * Get a single task by ID
   */
  get(taskId: string): Promise<Task>;

  /**
   * POST /api/{user_id}/tasks
   * Create a new task
   */
  create(data: TaskCreate): Promise<Task>;

  /**
   * PUT /api/{user_id}/tasks/{task_id}
   * Update an existing task
   */
  update(taskId: string, data: TaskUpdate): Promise<Task>;

  /**
   * DELETE /api/{user_id}/tasks/{task_id}
   * Delete a task (returns 204 No Content)
   */
  delete(taskId: string): Promise<void>;

  /**
   * PATCH /api/{user_id}/tasks/{task_id}/complete
   * Toggle task completion status
   */
  toggleComplete(taskId: string): Promise<Task>;
}

export interface TagsAPI {
  /**
   * GET /api/{user_id}/tags
   * List all tags for the authenticated user
   */
  list(): Promise<Tag[]>;

  /**
   * POST /api/{user_id}/tags
   * Create a new tag
   */
  create(data: TagCreate): Promise<Tag>;

  /**
   * PUT /api/{user_id}/tags/{tag_id}
   * Update an existing tag
   */
  update(tagId: string, data: TagUpdate): Promise<Tag>;

  /**
   * DELETE /api/{user_id}/tags/{tag_id}
   * Delete a tag (returns 204 No Content)
   */
  delete(tagId: string): Promise<void>;
}

export interface PrioritiesAPI {
  /**
   * GET /api/{user_id}/priorities
   * List all priorities for the authenticated user
   * (auto-creates defaults on first access: high, medium, low)
   */
  list(): Promise<Priority[]>;
}

// ============================================
// API Client Implementation Contract
// ============================================

export interface APIClient {
  tasks: TasksAPI;
  tags: TagsAPI;
  priorities: PrioritiesAPI;
}

// ============================================
// Error Response Types
// ============================================

export interface APIErrorResponse {
  detail: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: string;
  type: "validation_error";
  errors: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

// ============================================
// Request Configuration
// ============================================

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

// ============================================
// API Endpoints Reference
// ============================================

/**
 * Endpoint patterns (user_id is extracted from JWT session):
 *
 * Tasks:
 *   GET    /api/{user_id}/tasks                    → TaskListResponse
 *   POST   /api/{user_id}/tasks                    → Task
 *   GET    /api/{user_id}/tasks/{task_id}          → Task
 *   PUT    /api/{user_id}/tasks/{task_id}          → Task
 *   DELETE /api/{user_id}/tasks/{task_id}          → 204 No Content
 *   PATCH  /api/{user_id}/tasks/{task_id}/complete → Task
 *
 * Tags:
 *   GET    /api/{user_id}/tags                     → Tag[]
 *   POST   /api/{user_id}/tags                     → Tag
 *   PUT    /api/{user_id}/tags/{tag_id}            → Tag
 *   DELETE /api/{user_id}/tags/{tag_id}            → 204 No Content
 *
 * Priorities:
 *   GET    /api/{user_id}/priorities               → Priority[]
 *
 * Query Parameters for GET /tasks:
 *   - status: "pending" | "completed"
 *   - priority_id: string (UUID)
 *   - tag_id: string (UUID)
 *   - due_before: string (ISO 8601 date)
 *   - due_after: string (ISO 8601 date)
 *   - search: string
 *   - sort_by: "created_at" | "due_date" | "title" | "priority"
 *   - sort_order: "asc" | "desc"
 *   - page: number (default: 1)
 *   - page_size: number (default: 20, max: 100)
 */

// ============================================
// Response Status Codes
// ============================================

/**
 * Expected HTTP status codes:
 *
 * 200 OK              - Successful GET, PUT, PATCH
 * 201 Created         - Successful POST
 * 204 No Content      - Successful DELETE
 * 400 Bad Request     - Validation error
 * 401 Unauthorized    - Missing or invalid JWT
 * 403 Forbidden       - User ID mismatch
 * 404 Not Found       - Resource doesn't exist
 * 409 Conflict        - Duplicate resource (e.g., tag name)
 * 500 Internal Error  - Server error
 */
