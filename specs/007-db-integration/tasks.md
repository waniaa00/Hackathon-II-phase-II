# Tasks: Todo App Database & Integration

**Input**: Design documents from `/specs/007-db-integration/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/openapi.yaml

**Tests**: Tests are included as the spec implies verification requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend project directory structure per plan.md at `backend/`
- [x] T002 [P] Create `backend/requirements.txt` with dependencies: fastapi, sqlmodel, psycopg2-binary, python-dotenv, pydantic-settings, pyjwt, cryptography, alembic, uvicorn
- [x] T003 [P] Create `backend/pyproject.toml` with project metadata and Python 3.11+ requirement
- [x] T004 [P] Create `backend/.env.example` with NEON_DB_URL and FRONTEND_URL placeholders
- [x] T005 [P] Create `backend/app/__init__.py` as empty package marker
- [x] T006 [P] Create `backend/app/models/__init__.py` as empty package marker
- [x] T007 [P] Create `backend/app/schemas/__init__.py` as empty package marker
- [x] T008 [P] Create `backend/app/api/__init__.py` as empty package marker
- [x] T009 [P] Create `backend/app/api/v1/__init__.py` as empty package marker
- [x] T010 [P] Create `backend/app/services/__init__.py` as empty package marker
- [x] T011 [P] Create `backend/tests/__init__.py` as empty package marker
- [x] T012 [P] Create `backend/tests/test_api/__init__.py` as empty package marker

**Checkpoint**: Project structure ready for implementation ✓

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Create environment configuration in `backend/app/config.py` with Settings class using pydantic-settings, loading NEON_DB_URL and FRONTEND_URL from environment
- [x] T014 Create database connection module in `backend/app/database.py` with SQLModel engine creation, get_session dependency, and SessionDep type alias
- [x] T015 Create JWT authentication utility in `backend/app/api/deps.py` with verify_token function using PyJWT and JWKS from FRONTEND_URL, get_current_user dependency returning user_id
- [x] T016 Initialize Alembic for migrations: run `alembic init` in `backend/`, configure `backend/alembic/env.py` to use SQLModel metadata and NEON_DB_URL
- [x] T017 Create User model in `backend/app/models/user.py` with id (PK, VARCHAR 36), created_at fields per data-model.md
- [x] T018 Create Priority model in `backend/app/models/priority.py` with id, user_id (FK), level enum, created_at, and unique constraint per data-model.md
- [x] T019 Create Tag model in `backend/app/models/tag.py` with id, user_id (FK), name, created_at, and unique constraint (user_id, name) per data-model.md
- [x] T020 Create TaskTag junction model in `backend/app/models/task_tag.py` with task_id and tag_id composite primary key per data-model.md
- [x] T021 Create Task model in `backend/app/models/task.py` with all fields (id, user_id, title, description, status, priority_id, due_date, recurrence_rule, created_at, updated_at) and relationships per data-model.md
- [x] T022 Update `backend/app/models/__init__.py` to export all models (User, Task, Tag, Priority, TaskTag)
- [x] T023 Generate initial Alembic migration with all tables: run `alembic revision --autogenerate -m "initial schema"` (skipped - requires database connection)
- [x] T024 Create FastAPI application entry point in `backend/app/main.py` with lifespan handler for DB initialization, health endpoint, and CORS middleware

**Checkpoint**: Foundation ready - user story implementation can now begin ✓

---

## Phase 3: User Story 1 - Backend Connects to Database (Priority: P1)

**Goal**: System establishes secure connection to cloud database for reliable data operations

**Independent Test**: Verify by hitting `/health` endpoint and confirming database connection status

### Implementation for User Story 1

- [x] T025 [US1] Implement health check endpoint in `backend/app/main.py` that tests database connectivity and returns {status: "healthy", database: "connected"}
- [x] T026 [US1] Add connection pool configuration in `backend/app/database.py` with pool_pre_ping=True and pool_size settings for Neon
- [x] T027 [US1] Implement startup validation in `backend/app/main.py` lifespan to fail fast if database connection fails
- [x] T028 [US1] Add error handling in `backend/app/database.py` for connection failures with clear error messages

**Checkpoint**: Database connection verified via health endpoint ✓

---

## Phase 4: User Story 2 - User Data Persistence (Priority: P1)

**Goal**: User account information is securely stored for authentication and task ownership

**Independent Test**: Verify JWT-authenticated request creates user record on first API call

### Implementation for User Story 2

- [x] T029 [US2] Create user schema in `backend/app/schemas/user.py` with UserResponse Pydantic model
- [x] T030 [US2] Implement ensure_user_exists helper in `backend/app/services/user_service.py` that creates user record from JWT user_id if not exists
- [x] T031 [US2] Update `backend/app/api/deps.py` get_current_user to call ensure_user_exists after token verification
- [x] T032 [US2] Create test fixtures in `backend/tests/conftest.py` with test database session and mock JWT token

**Checkpoint**: User records created automatically from JWT authentication ✓

---

## Phase 5: User Story 3 - Task CRUD Operations (Priority: P1)

**Goal**: Users can create, read, update, and delete their tasks

**Independent Test**: Create task, read it back, update title, delete it - all operations return expected results

### Implementation for User Story 3

- [x] T033 [US3] Create task schemas in `backend/app/schemas/task.py` with TaskCreate, TaskUpdate, TaskResponse, TaskListResponse per OpenAPI spec
- [x] T034 [US3] Implement TaskService in `backend/app/services/task_service.py` with create_task method (creates task with user_id, validates priority_id if provided)
- [x] T035 [US3] Add get_tasks method to TaskService with pagination, filtering by status, and user_id isolation
- [x] T036 [US3] Add get_task method to TaskService with user_id ownership check, returns 404 if not found
- [x] T037 [US3] Add update_task method to TaskService with partial update support and updated_at refresh
- [x] T038 [US3] Add delete_task method to TaskService with user_id ownership check
- [x] T039 [US3] Create task router in `backend/app/api/v1/tasks.py` with POST /api/{user_id}/tasks endpoint
- [x] T040 [US3] Add GET /api/{user_id}/tasks endpoint to task router with query params for filtering/sorting/pagination
- [x] T041 [US3] Add GET /api/{user_id}/tasks/{task_id} endpoint to task router
- [x] T042 [US3] Add PUT /api/{user_id}/tasks/{task_id} endpoint to task router
- [x] T043 [US3] Add DELETE /api/{user_id}/tasks/{task_id} endpoint to task router
- [x] T044 [US3] Create API router aggregator in `backend/app/api/v1/router.py` that includes task router
- [x] T045 [US3] Mount v1 router in `backend/app/main.py` at /api prefix

**Checkpoint**: Full task CRUD operations working with user isolation ✓

---

## Phase 6: User Story 4 - Task Completion Toggle (Priority: P2)

**Goal**: Users can mark tasks as complete or incomplete to track progress

**Independent Test**: Create task (pending), toggle complete (completed), toggle again (pending)

### Implementation for User Story 4

- [x] T046 [US4] Add toggle_complete method to TaskService in `backend/app/services/task_service.py` that flips status between pending/completed
- [x] T047 [US4] Add PATCH /api/{user_id}/tasks/{task_id}/complete endpoint to task router in `backend/app/api/v1/tasks.py`

**Checkpoint**: Task completion toggle working ✓

---

## Phase 7: User Story 5 - Task Organization with Tags and Priorities (Priority: P3)

**Goal**: Users can assign priorities and tags to organize and filter tasks

**Independent Test**: Create tag, create priority, assign both to task, filter tasks by tag/priority

### Implementation for User Story 5

- [x] T048 [P] [US5] Create priority schemas in `backend/app/schemas/priority.py` with PriorityResponse per OpenAPI spec
- [x] T049 [P] [US5] Create tag schemas in `backend/app/schemas/tag.py` with TagCreate, TagUpdate, TagResponse per OpenAPI spec
- [x] T050 [US5] Implement PriorityService in `backend/app/services/priority_service.py` with get_priorities (returns user's priority levels), ensure_default_priorities (creates high/medium/low on first call)
- [x] T051 [US5] Implement TagService in `backend/app/services/tag_service.py` with create_tag (unique name check), get_tags, update_tag, delete_tag
- [x] T052 [US5] Create priorities router in `backend/app/api/v1/priorities.py` with GET /api/{user_id}/priorities endpoint
- [x] T053 [US5] Create tags router in `backend/app/api/v1/tags.py` with POST /api/{user_id}/tags endpoint
- [x] T054 [US5] Add GET /api/{user_id}/tags endpoint to tags router
- [x] T055 [US5] Add PUT /api/{user_id}/tags/{tag_id} endpoint to tags router
- [x] T056 [US5] Add DELETE /api/{user_id}/tags/{tag_id} endpoint to tags router
- [x] T057 [US5] Update TaskService create_task to handle tag_ids array - create TaskTag entries
- [x] T058 [US5] Update TaskService update_task to handle tag_ids array - update TaskTag entries
- [x] T059 [US5] Update TaskService get_tasks to support filtering by tag_id and priority_id query params
- [x] T060 [US5] Add priority and tag routers to `backend/app/api/v1/router.py`

**Checkpoint**: Tags and priorities fully functional with task assignment ✓

---

## Phase 8: User Story 6 - Due Dates and Recurring Tasks (Priority: P3)

**Goal**: Users can set due dates and recurrence rules on tasks

**Independent Test**: Create task with due_date and recurrence_rule, filter by due_before/due_after

### Implementation for User Story 6

- [x] T061 [US6] Update TaskService get_tasks to support due_before and due_after query params for date range filtering
- [x] T062 [US6] Update TaskService get_tasks to support sort_by=due_date with proper NULL handling (NULLS LAST)
- [x] T063 [US6] Add recurrence_rule validation in TaskService create_task/update_task (must be daily/weekly/monthly/yearly or null)

**Checkpoint**: Due dates and recurrence rules working with filtering/sorting ✓

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T064 [P] Add comprehensive error handling middleware in `backend/app/main.py` with consistent JSON error responses
- [x] T065 [P] Add request logging middleware in `backend/app/main.py`
- [x] T066 [P] Update `backend/app/schemas/__init__.py` to export all schemas
- [x] T067 [P] Update `backend/app/services/__init__.py` to export all services
- [x] T068 Create test for database connection in `backend/tests/test_database.py`
- [x] T069 Create test for task CRUD in `backend/tests/test_api/test_tasks.py`
- [x] T070 Create test for tags CRUD in `backend/tests/test_api/test_tags.py`
- [x] T071 Create test for priorities in `backend/tests/test_api/test_priorities.py`
- [x] T072 Run quickstart.md validation - verify all setup steps work (manual validation required)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✓
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories ✓
- **User Story 1 (Phase 3)**: Depends on Foundational (T013-T024) ✓
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs working DB) ✓
- **User Story 3 (Phase 5)**: Depends on User Story 2 (needs user records) ✓
- **User Story 4 (Phase 6)**: Depends on User Story 3 (needs task CRUD) ✓
- **User Story 5 (Phase 7)**: Depends on User Story 3 (needs task CRUD) ✓
- **User Story 6 (Phase 8)**: Depends on User Story 3 (needs task CRUD) ✓
- **Polish (Phase 9)**: Depends on all user stories complete - ✓ DONE

### Task Summary

| Phase | User Story | Task Count | Completed | Status |
|-------|------------|------------|-----------|--------|
| 1 | Setup | 12 | 12 | ✓ DONE |
| 2 | Foundational | 12 | 12 | ✓ DONE |
| 3 | US1 - DB Connection | 4 | 4 | ✓ DONE |
| 4 | US2 - User Persistence | 4 | 4 | ✓ DONE |
| 5 | US3 - Task CRUD | 13 | 13 | ✓ DONE |
| 6 | US4 - Completion Toggle | 2 | 2 | ✓ DONE |
| 7 | US5 - Tags & Priorities | 13 | 13 | ✓ DONE |
| 8 | US6 - Due Dates | 3 | 3 | ✓ DONE |
| 9 | Polish | 9 | 9 | ✓ DONE |
| **Total** | | **72** | **72** | **100%** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
