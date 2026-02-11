# Feature Specification: Todo App Backend & API

**Feature Branch**: `008-backend-api`
**Created**: 2026-02-04
**Status**: Draft
**Dependency**: `007-db-integration` (database models, connection, migrations)
**Input**: User description: "RESTful API, JWT authentication, CRUD operations, filtering, sorting, search, recurring tasks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated API Access (Priority: P1)

As an authenticated user, I can access the API with my JWT token so that all my requests are securely processed and my data is protected.

**Why this priority**: Without authentication, no API operation can be performed securely. This is the gateway to all functionality.

**Independent Test**: Can be verified by making an API request with a valid token (succeeds) and an invalid token (returns 401).

**Acceptance Scenarios**:

1. **Given** a valid JWT token, **When** the user makes any API request with Authorization header, **Then** the request is processed and returns appropriate data
2. **Given** an expired JWT token, **When** the user makes an API request, **Then** the system returns 401 Unauthorized with a clear message
3. **Given** no token provided, **When** the user makes an API request to a protected endpoint, **Then** the system returns 401 Unauthorized
4. **Given** a token for user A, **When** user A tries to access user B's tasks via path parameter, **Then** the system returns 403 Forbidden

---

### User Story 2 - Task Management API (Priority: P1)

As an authenticated user, I can create, read, update, and delete tasks through the API so that I can manage my to-do items programmatically.

**Why this priority**: Task CRUD is the core API functionality that all other features depend on.

**Independent Test**: Can be verified by creating a task via POST, reading via GET, updating via PUT, and deleting via DELETE.

**Acceptance Scenarios**:

1. **Given** authenticated user, **When** POST /api/{user_id}/tasks with valid title, **Then** task is created with 201 status and returned with ID
2. **Given** authenticated user with tasks, **When** GET /api/{user_id}/tasks, **Then** returns paginated list of only that user's tasks
3. **Given** existing task, **When** GET /api/{user_id}/tasks/{id}, **Then** returns task details with priority and tags
4. **Given** existing task, **When** PUT /api/{user_id}/tasks/{id} with updates, **Then** task is updated and updated_at refreshed
5. **Given** existing task, **When** DELETE /api/{user_id}/tasks/{id}, **Then** task is removed with 204 status
6. **Given** non-existent task, **When** any operation on /api/{user_id}/tasks/{id}, **Then** returns 404 Not Found

---

### User Story 3 - Task Filtering and Search (Priority: P2)

As an authenticated user, I can filter and search my tasks so that I can quickly find what I need.

**Why this priority**: Filtering enhances usability but requires basic task CRUD to be functional first.

**Independent Test**: Can be verified by creating multiple tasks with different statuses/priorities, then filtering and searching.

**Acceptance Scenarios**:

1. **Given** tasks with mixed statuses, **When** GET /api/{user_id}/tasks?status=pending, **Then** only pending tasks are returned
2. **Given** tasks with different priorities, **When** GET /api/{user_id}/tasks?priority_id={id}, **Then** only tasks with that priority are returned
3. **Given** tasks with various tags, **When** GET /api/{user_id}/tasks?tag_id={id}, **Then** only tasks with that tag are returned
4. **Given** tasks with due dates, **When** GET /api/{user_id}/tasks?due_before={date}, **Then** only tasks due before that date are returned
5. **Given** tasks with titles containing "meeting", **When** GET /api/{user_id}/tasks?search=meeting, **Then** tasks with "meeting" in title or description are returned

---

### User Story 4 - Task Sorting and Pagination (Priority: P2)

As an authenticated user, I can sort and paginate my task list so that I can view tasks in a meaningful order.

**Why this priority**: Sorting and pagination improve UX for users with many tasks.

**Independent Test**: Can be verified by creating multiple tasks and requesting sorted/paginated results.

**Acceptance Scenarios**:

1. **Given** multiple tasks, **When** GET /api/{user_id}/tasks?sort_by=due_date&sort_order=asc, **Then** tasks are returned sorted by due date ascending (nulls last)
2. **Given** multiple tasks, **When** GET /api/{user_id}/tasks?sort_by=priority, **Then** tasks are returned sorted by priority (high first)
3. **Given** multiple tasks, **When** GET /api/{user_id}/tasks?sort_by=title&sort_order=asc, **Then** tasks are returned alphabetically
4. **Given** 50 tasks, **When** GET /api/{user_id}/tasks?page=1&page_size=20, **Then** first 20 tasks returned with total count and pagination metadata
5. **Given** 50 tasks, **When** GET /api/{user_id}/tasks?page=3&page_size=20, **Then** tasks 41-50 returned

---

### User Story 5 - Task Completion Workflow (Priority: P2)

As an authenticated user, I can toggle task completion status so that I can track my progress.

**Why this priority**: Completion status is essential for task management workflow.

**Independent Test**: Can be verified by creating a pending task, marking complete, then marking incomplete.

**Acceptance Scenarios**:

1. **Given** a pending task, **When** PATCH /api/{user_id}/tasks/{id}/complete, **Then** status changes to "completed"
2. **Given** a completed task, **When** PATCH /api/{user_id}/tasks/{id}/complete, **Then** status changes to "pending"
3. **Given** a task with recurrence_rule, **When** marked complete, **Then** the system stores completion but recurrence logic deferred to application layer

---

### User Story 6 - Tags Management API (Priority: P3)

As an authenticated user, I can manage my tags through the API so that I can organize my tasks effectively.

**Why this priority**: Tags enhance organization but are optional for basic task management.

**Independent Test**: Can be verified by creating, listing, updating, and deleting tags.

**Acceptance Scenarios**:

1. **Given** authenticated user, **When** POST /api/{user_id}/tags with name, **Then** tag is created with 201 status
2. **Given** tag with same name exists, **When** POST /api/{user_id}/tags with duplicate name, **Then** returns 409 Conflict
3. **Given** user has tags, **When** GET /api/{user_id}/tags, **Then** returns list of user's tags
4. **Given** existing tag, **When** PUT /api/{user_id}/tags/{id} with new name, **Then** tag is renamed
5. **Given** existing tag assigned to tasks, **When** DELETE /api/{user_id}/tags/{id}, **Then** tag is deleted and removed from tasks

---

### User Story 7 - Priorities API (Priority: P3)

As an authenticated user, I can view my priority levels through the API so that I can assign priorities to tasks.

**Why this priority**: Priorities are pre-defined per user and provide context for task organization.

**Independent Test**: Can be verified by listing priorities for a user.

**Acceptance Scenarios**:

1. **Given** authenticated user, **When** GET /api/{user_id}/priorities, **Then** returns list of priority levels (high, medium, low)
2. **Given** new user's first API call, **When** priorities are requested, **Then** default priorities are created and returned

---

### Edge Cases

- What happens when request body validation fails? Return 400 Bad Request with detailed field errors
- What happens when database is temporarily unavailable? Return 503 Service Unavailable with retry guidance
- What happens with concurrent updates to the same task? Last-write-wins based on updated_at timestamp
- What happens when user_id in path doesn't match JWT user_id? Return 403 Forbidden
- What happens when page exceeds available data? Return empty list with total count

## Requirements *(mandatory)*

### Functional Requirements

**API Authentication**
- **FR-001**: All API endpoints (except /health) MUST require valid JWT token in Authorization header
- **FR-002**: System MUST validate JWT against JWKS endpoint from authentication provider
- **FR-003**: System MUST extract user_id from JWT and verify it matches path parameter {user_id}
- **FR-004**: Invalid tokens MUST return 401 Unauthorized with error message
- **FR-005**: Mismatched user_id (JWT vs path) MUST return 403 Forbidden

**Task API Endpoints**
- **FR-006**: GET /api/{user_id}/tasks MUST return paginated list of user's tasks
- **FR-007**: POST /api/{user_id}/tasks MUST create task with provided data and return 201
- **FR-008**: GET /api/{user_id}/tasks/{id} MUST return single task or 404 if not found/not owned
- **FR-009**: PUT /api/{user_id}/tasks/{id} MUST update task and refresh updated_at
- **FR-010**: DELETE /api/{user_id}/tasks/{id} MUST remove task and return 204
- **FR-011**: PATCH /api/{user_id}/tasks/{id}/complete MUST toggle task status

**Task Filtering**
- **FR-012**: System MUST support filtering by status (pending/completed)
- **FR-013**: System MUST support filtering by priority_id
- **FR-014**: System MUST support filtering by tag_id
- **FR-015**: System MUST support filtering by due_before and due_after date range
- **FR-016**: System MUST support search across title and description fields

**Task Sorting and Pagination**
- **FR-017**: System MUST support sorting by created_at, due_date, title, priority
- **FR-018**: System MUST support sort_order (asc/desc) with desc as default
- **FR-019**: System MUST support pagination with page and page_size parameters
- **FR-020**: Default page_size MUST be 20, maximum MUST be 100
- **FR-021**: Response MUST include total count for pagination metadata

**Tags API**
- **FR-022**: GET /api/{user_id}/tags MUST return all user's tags
- **FR-023**: POST /api/{user_id}/tags MUST create tag or return 409 if duplicate name
- **FR-024**: PUT /api/{user_id}/tags/{id} MUST update tag name
- **FR-025**: DELETE /api/{user_id}/tags/{id} MUST delete tag and remove from tasks

**Priorities API**
- **FR-026**: GET /api/{user_id}/priorities MUST return user's priority levels
- **FR-027**: System MUST auto-create default priorities (high, medium, low) on first access

**Error Handling**
- **FR-028**: All errors MUST return consistent JSON format with detail and code fields
- **FR-029**: Validation errors MUST return 400 with field-level error details
- **FR-030**: Server errors MUST return 500 without exposing internal details
- **FR-031**: All requests MUST be logged with correlation ID for debugging

**Response Format**
- **FR-032**: All responses MUST be JSON with Content-Type: application/json
- **FR-033**: List endpoints MUST return array wrapped in object with metadata
- **FR-034**: Create endpoints MUST return created resource with 201 status
- **FR-035**: Delete endpoints MUST return 204 No Content

### Key Entities

- **API Request**: Incoming HTTP request with method, path, headers, body. Requires Authorization header for protected endpoints.

- **API Response**: Outgoing HTTP response with status code, headers, JSON body. Follows consistent format for success and error cases.

- **Authentication Context**: Extracted from JWT token. Contains user_id used for authorization and data isolation.

- **Pagination**: Controls list output with page number, page size, and provides total count for client pagination.

- **Filter Parameters**: Query parameters that narrow task results by status, priority, tags, dates, or search terms.

## Assumptions

- **Dependency**: Database models, connection, and migrations are provided by 007-db-integration
- **Token Format**: JWT tokens are issued by Better Auth on the frontend with user_id in 'sub' claim
- **JWKS Caching**: Public keys from JWKS endpoint can be cached for performance
- **Search Implementation**: Full-text search uses case-insensitive ILIKE for simplicity
- **Recurrence Logic**: Backend stores recurrence_rule but calculation of next occurrence is application-layer responsibility
- **Rate Limiting**: Deferred to infrastructure layer (API gateway or reverse proxy)
- **CORS**: Configured at application level to allow frontend origin

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All CRUD operations complete in under 500 milliseconds for individual resources
- **SC-002**: List endpoints with up to 100 tasks return in under 1 second
- **SC-003**: Authentication validation adds no more than 100ms overhead per request
- **SC-004**: 100% of requests with invalid tokens return 401 within 200ms
- **SC-005**: 100% of cross-user access attempts return 403 Forbidden
- **SC-006**: System handles 100 concurrent API requests without errors
- **SC-007**: All error responses include actionable error messages
- **SC-008**: API documentation is auto-generated and accessible at /docs
- **SC-009**: All endpoints return consistent JSON structure
- **SC-010**: Search returns relevant results for partial title matches
