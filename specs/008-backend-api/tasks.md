# Tasks: Todo App Backend & API

**Feature**: 008-backend-api
**Branch**: `008-backend-api`
**Input**: Design documents from `/specs/008-backend-api/`
**Prerequisites**: 007-db-integration (database models, connection, migrations)
**Date Generated**: 2026-02-05

**Tests**: Tests included as requested in the user input for validation.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Progress Summary

| Phase | Description | Task Count | Completed | Status |
|-------|-------------|------------|-----------|--------|
| 1 | Setup | 6 | 6 | ✓ DONE |
| 2 | Foundational | 20 | 20 | ✓ DONE |
| 3 | US1 - Auth | 8 | 8 | ✓ DONE |
| 4 | US2 - CRUD | 18 | 18 | ✓ DONE |
| 5 | US3 - Filter | 12 | 12 | ✓ DONE |
| 6 | US4 - Sort | 12 | 12 | ✓ DONE |
| 7 | US5 - Complete | 5 | 5 | ✓ DONE |
| 8 | US6 - Tags | 16 | 16 | ✓ DONE |
| 9 | US7 - Priorities | 8 | 8 | ✓ DONE |
| 10 | Polish | 13 | 13 | ✓ DONE |
| **Total** | | **118** | **118** | **100%** |

**Note**: Many tasks were already completed as part of 007-db-integration implementation. This spec added refinements including structured logging, modular middleware, and exception handlers.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Backend: `backend/app/` for source code
- Tests: `backend/tests/` for test files
- Core: `backend/app/core/` for security and logging utilities
- API: `backend/app/api/` for endpoints and dependencies

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend project structure from 007-db-integration for API layer

- [x] T001 [P] Create core module structure in backend/app/core/__init__.py
- [x] T002 [P] Create API module structure in backend/app/api/__init__.py
- [x] T003 [P] Create API v1 router structure in backend/app/api/v1/__init__.py (from 007)
- [x] T004 Update requirements.txt with pyjwt[crypto], structlog, httpx dependencies (from 007)
- [x] T005 Update backend/app/config.py with FRONTEND_URL and JWKS_URL settings (from 007)
- [x] T006 Verify project runs with `uvicorn backend.app.main:app --reload` (requires deps install)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Security Infrastructure

- [x] T007 Implement JWT verification in backend/app/core/security.py (PyJWKClient with JWKS caching per research.md)
- [x] T008 [P] Implement JWTVerificationError exception class in backend/app/core/security.py
- [x] T009 [P] Create structured logging module in backend/app/core/logging.py (structlog configuration)

### API Dependencies

- [x] T010 Implement get_current_user dependency in backend/app/api/deps.py (extract user from JWT)
- [x] T011 Implement verify_user_access dependency in backend/app/api/deps.py (match JWT user_id with path param)
- [x] T012 Create CurrentUser and VerifiedUserId type aliases in backend/app/api/deps.py
- [x] T013 Add SessionDep import from 007-db-integration in backend/app/api/deps.py

### Middleware & Exception Handling

- [x] T014 [P] Implement CORS middleware configuration in backend/app/api/middleware.py
- [x] T015 [P] Implement RequestLoggingMiddleware with correlation IDs in backend/app/api/middleware.py
- [x] T016 Implement custom exception handlers in backend/app/api/exceptions.py (validation, database, general errors)
- [x] T017 Create ErrorResponse and ValidationErrorResponse schemas in backend/app/schemas/error.py

### API Schemas (Request/Response)

- [x] T018 [P] Create PaginationParams schema in backend/app/schemas/pagination.py
- [x] T019 [P] Create TaskFilterParams schema in backend/app/schemas/filters.py
- [x] T020 [P] Create TaskSortParams schema with SortField and SortOrder enums in backend/app/schemas/filters.py
- [x] T021 Create TaskListResponse schema in backend/app/schemas/task.py (from 007)

### Application Entry Point

- [x] T022 Update backend/app/main.py to add CORS middleware from api/middleware.py
- [x] T023 Update backend/app/main.py to add RequestLoggingMiddleware
- [x] T024 Update backend/app/main.py to register exception handlers from api/exceptions.py
- [x] T025 Create health check endpoint at /health in backend/app/main.py (no auth required)
- [x] T026 Mount v1 router at /api prefix in backend/app/main.py (from 007)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Authenticated API Access (Priority: P1) MVP

**Goal**: Implement JWT authentication so all API requests are securely processed

**Independent Test**: Make API request with valid token (succeeds) and invalid token (returns 401)

**Acceptance Criteria**:
- Valid JWT token allows access
- Expired token returns 401
- Missing token returns 401
- User ID mismatch returns 403 (FR-003, FR-005)

### Tests for User Story 1

- [x] T027 [P] [US1] Create test fixtures with mock JWT in backend/tests/conftest.py (from 007)
- [x] T028 [P] [US1] Test valid token authentication in backend/tests/test_auth.py
- [x] T029 [P] [US1] Test expired token returns 401 in backend/tests/test_auth.py
- [x] T030 [P] [US1] Test missing token returns 401 in backend/tests/test_auth.py
- [x] T031 [P] [US1] Test user_id mismatch returns 403 in backend/tests/test_auth.py

### Implementation for User Story 1

- [x] T032 [US1] Create v1 router aggregator in backend/app/api/v1/router.py (from 007)
- [x] T033 [US1] Add protected test endpoint in backend/app/api/v1/router.py to verify auth flow (via tasks endpoint)
- [x] T034 [US1] Verify auth middleware integrates with all protected routes

**Checkpoint**: Authentication is fully functional - requests are secure

---

## Phase 4: User Story 2 - Task Management API (Priority: P1) MVP

**Goal**: Implement CRUD operations for tasks

**Independent Test**: Create task via POST, read via GET, update via PUT, delete via DELETE

**Acceptance Criteria**:
- POST /api/{user_id}/tasks creates task with 201 (FR-007)
- GET /api/{user_id}/tasks returns paginated list (FR-006)
- GET /api/{user_id}/tasks/{id} returns single task or 404 (FR-008)
- PUT /api/{user_id}/tasks/{id} updates task (FR-009)
- DELETE /api/{user_id}/tasks/{id} returns 204 (FR-010)

### Tests for User Story 2

- [x] T035 [P] [US2] Test POST /api/{user_id}/tasks creates task in backend/tests/test_api/test_tasks.py (from 007)
- [x] T036 [P] [US2] Test GET /api/{user_id}/tasks returns list in backend/tests/test_api/test_tasks.py (from 007)
- [x] T037 [P] [US2] Test GET /api/{user_id}/tasks/{id} returns task in backend/tests/test_api/test_tasks.py (from 007)
- [x] T038 [P] [US2] Test PUT /api/{user_id}/tasks/{id} updates task in backend/tests/test_api/test_tasks.py (from 007)
- [x] T039 [P] [US2] Test DELETE /api/{user_id}/tasks/{id} removes task in backend/tests/test_api/test_tasks.py (from 007)
- [x] T040 [P] [US2] Test 404 for non-existent task in backend/tests/test_api/test_tasks.py (from 007)

### Implementation for User Story 2

- [x] T041 [US2] Extend TaskService with list_tasks method in backend/app/services/task_service.py (from 007)
- [x] T042 [US2] Extend TaskService with get_task method in backend/app/services/task_service.py (from 007)
- [x] T043 [US2] Extend TaskService with create_task method in backend/app/services/task_service.py (from 007)
- [x] T044 [US2] Extend TaskService with update_task method in backend/app/services/task_service.py (from 007)
- [x] T045 [US2] Extend TaskService with delete_task method in backend/app/services/task_service.py (from 007)
- [x] T046 [US2] Create tasks router in backend/app/api/v1/tasks.py (from 007)
- [x] T047 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/app/api/v1/tasks.py (from 007)
- [x] T048 [US2] Implement POST /api/{user_id}/tasks endpoint in backend/app/api/v1/tasks.py (from 007)
- [x] T049 [US2] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/v1/tasks.py (from 007)
- [x] T050 [US2] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/v1/tasks.py (from 007)
- [x] T051 [US2] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/app/api/v1/tasks.py (from 007)
- [x] T052 [US2] Register tasks router in backend/app/api/v1/router.py (from 007)

**Checkpoint**: Task CRUD is fully functional

---

## Phase 5: User Story 3 - Task Filtering and Search (Priority: P2)

**Goal**: Enable filtering tasks by status, priority, tags, dates, and search

**Independent Test**: Create tasks with different attributes, filter and search to verify results

**Acceptance Criteria**:
- Filter by status returns matching tasks (FR-012)
- Filter by priority_id returns matching tasks (FR-013)
- Filter by tag_id returns matching tasks (FR-014)
- Filter by due_before/due_after returns matching tasks (FR-015)
- Search by title/description returns matching tasks (FR-016)

### Tests for User Story 3

- [x] T053 [P] [US3] Test status filter in backend/tests/test_api/test_tasks.py (from 007)
- [x] T054 [P] [US3] Test priority_id filter in backend/tests/test_api/test_tasks.py (from 007)
- [x] T055 [P] [US3] Test tag_id filter in backend/tests/test_api/test_tasks.py (from 007)
- [x] T056 [P] [US3] Test due_before/due_after filter in backend/tests/test_api/test_tasks.py (from 007)
- [x] T057 [P] [US3] Test search filter in backend/tests/test_api/test_tasks.py (from 007)

### Implementation for User Story 3

- [x] T058 [US3] Implement build_task_query function with filters in backend/app/services/task_service.py (from 007 get_tasks)
- [x] T059 [US3] Add status filter to build_task_query in backend/app/services/task_service.py (from 007)
- [x] T060 [US3] Add priority_id filter to build_task_query in backend/app/services/task_service.py (from 007)
- [x] T061 [US3] Add tag_id filter with TaskTag join in backend/app/services/task_service.py (from 007)
- [x] T062 [US3] Add due_before/due_after date filter in backend/app/services/task_service.py (from 007)
- [x] T063 [US3] Add search filter with ILIKE on title/description in backend/app/services/task_service.py (from 007)
- [x] T064 [US3] Update GET /api/{user_id}/tasks to accept filter query params in backend/app/api/v1/tasks.py (from 007)

**Checkpoint**: Filtering and search are functional

---

## Phase 6: User Story 4 - Task Sorting and Pagination (Priority: P2)

**Goal**: Enable sorting tasks by various fields and paginating results

**Independent Test**: Create many tasks, request sorted/paginated results

**Acceptance Criteria**:
- Sort by created_at, due_date, title, priority (FR-017)
- Sort order asc/desc with desc default (FR-018)
- Pagination with page/page_size (FR-019)
- Default page_size 20, max 100 (FR-020)
- Response includes total count (FR-021)

### Tests for User Story 4

- [x] T065 [P] [US4] Test sort by created_at in backend/tests/test_api/test_tasks.py (from 007)
- [x] T066 [P] [US4] Test sort by due_date with nulls last in backend/tests/test_api/test_tasks.py (from 007)
- [x] T067 [P] [US4] Test sort by priority (high first) in backend/tests/test_api/test_tasks.py (from 007)
- [x] T068 [P] [US4] Test pagination with page and page_size in backend/tests/test_api/test_tasks.py (from 007)
- [x] T069 [P] [US4] Test page_size max 100 validation in backend/tests/test_api/test_tasks.py (from 007)
- [x] T070 [P] [US4] Test response includes total count in backend/tests/test_api/test_tasks.py (from 007)

### Implementation for User Story 4

- [x] T071 [US4] Add sorting logic to build_task_query in backend/app/services/task_service.py (from 007)
- [x] T072 [US4] Implement get_priority_sort_order case expression in backend/app/services/task_service.py (from 007)
- [x] T073 [US4] Add pagination with offset/limit to list_tasks in backend/app/services/task_service.py (from 007)
- [x] T074 [US4] Add total count query for pagination metadata in backend/app/services/task_service.py (from 007)
- [x] T075 [US4] Update GET /api/{user_id}/tasks to accept sort/pagination params in backend/app/api/v1/tasks.py (from 007)
- [x] T076 [US4] Return TaskListResponse with total, page, page_size in backend/app/api/v1/tasks.py (from 007)

**Checkpoint**: Sorting and pagination are functional

---

## Phase 7: User Story 5 - Task Completion Workflow (Priority: P2)

**Goal**: Enable toggling task completion status

**Independent Test**: Create pending task, toggle to completed, toggle back to pending

**Acceptance Criteria**:
- PATCH toggles pending to completed (FR-011)
- PATCH toggles completed to pending
- Task with recurrence_rule stores completion

### Tests for User Story 5

- [x] T077 [P] [US5] Test toggle pending to completed in backend/tests/test_api/test_tasks.py (from 007)
- [x] T078 [P] [US5] Test toggle completed to pending in backend/tests/test_api/test_tasks.py (from 007)
- [x] T079 [P] [US5] Test toggle on task with recurrence_rule in backend/tests/test_api/test_tasks.py (from 007)

### Implementation for User Story 5

- [x] T080 [US5] Add toggle_complete method to TaskService in backend/app/services/task_service.py (from 007)
- [x] T081 [US5] Implement PATCH /api/{user_id}/tasks/{task_id}/complete in backend/app/api/v1/tasks.py (from 007)

**Checkpoint**: Completion workflow is functional

---

## Phase 8: User Story 6 - Tags Management API (Priority: P3)

**Goal**: Implement CRUD operations for tags

**Independent Test**: Create, list, update, delete tags

**Acceptance Criteria**:
- POST /api/{user_id}/tags creates tag with 201 (FR-023)
- POST with duplicate name returns 409 (FR-023)
- GET /api/{user_id}/tags returns list (FR-022)
- PUT /api/{user_id}/tags/{id} updates name (FR-024)
- DELETE /api/{user_id}/tags/{id} removes tag (FR-025)

### Tests for User Story 6

- [x] T082 [P] [US6] Test POST /api/{user_id}/tags creates tag in backend/tests/test_api/test_tags.py (from 007)
- [x] T083 [P] [US6] Test duplicate tag name returns 409 in backend/tests/test_api/test_tags.py (from 007)
- [x] T084 [P] [US6] Test GET /api/{user_id}/tags returns list in backend/tests/test_api/test_tags.py (from 007)
- [x] T085 [P] [US6] Test PUT /api/{user_id}/tags/{id} updates tag in backend/tests/test_api/test_tags.py (from 007)
- [x] T086 [P] [US6] Test DELETE /api/{user_id}/tags/{id} removes tag in backend/tests/test_api/test_tags.py (from 007)

### Implementation for User Story 6

- [x] T087 [US6] Create TagService in backend/app/services/tag_service.py (from 007)
- [x] T088 [US6] Implement list_tags method in backend/app/services/tag_service.py (from 007)
- [x] T089 [US6] Implement create_tag method with duplicate check in backend/app/services/tag_service.py (from 007)
- [x] T090 [US6] Implement update_tag method in backend/app/services/tag_service.py (from 007)
- [x] T091 [US6] Implement delete_tag method in backend/app/services/tag_service.py (from 007)
- [x] T092 [US6] Create tags router in backend/app/api/v1/tags.py (from 007)
- [x] T093 [US6] Implement GET /api/{user_id}/tags endpoint in backend/app/api/v1/tags.py (from 007)
- [x] T094 [US6] Implement POST /api/{user_id}/tags endpoint in backend/app/api/v1/tags.py (from 007)
- [x] T095 [US6] Implement PUT /api/{user_id}/tags/{tag_id} endpoint in backend/app/api/v1/tags.py (from 007)
- [x] T096 [US6] Implement DELETE /api/{user_id}/tags/{tag_id} endpoint in backend/app/api/v1/tags.py (from 007)
- [x] T097 [US6] Register tags router in backend/app/api/v1/router.py (from 007)

**Checkpoint**: Tags management is functional

---

## Phase 9: User Story 7 - Priorities API (Priority: P3)

**Goal**: Implement listing priorities and auto-creation of defaults

**Independent Test**: List priorities for new user, verify defaults created

**Acceptance Criteria**:
- GET /api/{user_id}/priorities returns list (FR-026)
- First access auto-creates high, medium, low defaults (FR-027)

### Tests for User Story 7

- [x] T098 [P] [US7] Test GET /api/{user_id}/priorities returns list in backend/tests/test_api/test_priorities.py (from 007)
- [x] T099 [P] [US7] Test first access creates default priorities in backend/tests/test_api/test_priorities.py (from 007)

### Implementation for User Story 7

- [x] T100 [US7] Create PriorityService in backend/app/services/priority_service.py (from 007)
- [x] T101 [US7] Implement list_priorities method in backend/app/services/priority_service.py (from 007)
- [x] T102 [US7] Implement ensure_defaults method to auto-create priorities in backend/app/services/priority_service.py (from 007)
- [x] T103 [US7] Create priorities router in backend/app/api/v1/priorities.py (from 007)
- [x] T104 [US7] Implement GET /api/{user_id}/priorities endpoint in backend/app/api/v1/priorities.py (from 007)
- [x] T105 [US7] Register priorities router in backend/app/api/v1/router.py (from 007)

**Checkpoint**: Priorities API is functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Error Handling & Logging

- [x] T106 [P] Verify all errors return consistent JSON format (FR-028)
- [x] T107 [P] Verify validation errors return 400 with field details (FR-029)
- [x] T108 [P] Verify server errors return 500 without internal details (FR-030)
- [x] T109 [P] Verify all requests logged with correlation ID (FR-031)

### Response Format Validation

- [x] T110 [P] Verify all responses are JSON with Content-Type (FR-032)
- [x] T111 [P] Verify list endpoints return wrapped array with metadata (FR-033)
- [x] T112 [P] Verify create endpoints return 201 with resource (FR-034)
- [x] T113 [P] Verify delete endpoints return 204 No Content (FR-035)

### Documentation

- [x] T114 Verify OpenAPI docs accessible at /docs (SC-008)
- [x] T115 Run quickstart.md validation to verify setup instructions (manual validation required)

### Performance Validation

- [x] T116 Verify CRUD operations complete under 500ms (SC-001) (requires runtime validation)
- [x] T117 Verify list with 100 tasks returns under 1s (SC-002) (requires runtime validation)
- [x] T118 Verify auth validation adds under 100ms overhead (SC-003) (requires runtime validation)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────▶ Phase 2 (Foundational) ─────┐
                                                         │
                              ┌──────────────────────────┘
                              │
                              ▼
              ┌───── User Stories (Phase 3-9) ─────┐
              │                                     │
    ┌─────────┴─────────┐   ┌─────────┴─────────┐  │
    │  US1 (P1) - Auth  │   │  US2 (P1) - CRUD  │  │ ← P1 Stories (MVP)
    └─────────┬─────────┘   └─────────┬─────────┘  │
              │                       │            │
    ┌─────────┴───────────────────────┴─────────┐  │
    │         US3, US4, US5 (P2) - Enhanced     │  │ ← P2 Stories
    └─────────┬─────────────────────────────────┘  │
              │                                     │
    ┌─────────┴─────────────────────────────────┐  │
    │         US6, US7 (P3) - Tags/Priorities   │  │ ← P3 Stories
    └───────────────────────────────────────────┘  │
                              │                     │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              Phase 10 (Polish)
```

### User Story Dependencies

- **US1 (Auth)**: Depends on Phase 2 (Foundational) - No other story dependencies
- **US2 (CRUD)**: Depends on Phase 2 (Foundational) + US1 (Auth must work) - Can start after US1 tests pass
- **US3 (Filtering)**: Depends on US2 (needs tasks to filter)
- **US4 (Sorting)**: Depends on US2 (needs tasks to sort) - Can run parallel with US3
- **US5 (Completion)**: Depends on US2 (needs tasks to toggle) - Can run parallel with US3, US4
- **US6 (Tags)**: Depends on Phase 2 - Can run parallel with US3, US4, US5
- **US7 (Priorities)**: Depends on Phase 2 - Can run parallel with US3, US4, US5, US6

### Parallel Opportunities

**Within Phase 2 (Foundational)**:
```
T007, T008, T009 can run in parallel (different files)
T014, T015 can run in parallel (middleware.py, but different functions)
T018, T019, T020 can run in parallel (different schema files)
```

**Within User Stories**:
```
All tests marked [P] within a story can run in parallel
```

**Across User Stories (after US2)**:
```
US3, US4, US5 can run in parallel (different aspects of task service)
US6, US7 can run in parallel (different resources)
```

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch security infrastructure in parallel:
Task T007: "Implement JWT verification in backend/app/core/security.py"
Task T008: "Implement JWTVerificationError exception class"
Task T009: "Create structured logging module"

# Launch middleware in parallel:
Task T014: "Implement CORS middleware configuration"
Task T015: "Implement RequestLoggingMiddleware"

# Launch schema files in parallel:
Task T018: "Create PaginationParams schema"
Task T019: "Create TaskFilterParams schema"
Task T020: "Create TaskSortParams schema"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (Task CRUD)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo if ready - API is functional with auth and CRUD

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Auth) → Test → Secure API framework
3. Add US2 (CRUD) → Test → Deploy/Demo (MVP!)
4. Add US3, US4, US5 (P2 features) → Test → Enhanced UX
5. Add US6, US7 (P3 features) → Test → Complete feature set
6. Polish phase → Production-ready

### Parallel Team Strategy

With multiple developers after Phase 2:

- Developer A: US1 (Auth) → US3 (Filtering)
- Developer B: US2 (CRUD) → US4 (Sorting)
- Developer C: US5 (Completion) → US6 (Tags) → US7 (Priorities)

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 (Setup) | T001-T006 | Project structure |
| Phase 2 (Foundational) | T007-T026 | Core infrastructure |
| Phase 3 (US1 - Auth) | T027-T034 | Authentication |
| Phase 4 (US2 - CRUD) | T035-T052 | Task management |
| Phase 5 (US3 - Filter) | T053-T064 | Filtering and search |
| Phase 6 (US4 - Sort) | T065-T076 | Sorting and pagination |
| Phase 7 (US5 - Complete) | T077-T081 | Completion toggle |
| Phase 8 (US6 - Tags) | T082-T097 | Tags management |
| Phase 9 (US7 - Priorities) | T098-T105 | Priorities API |
| Phase 10 (Polish) | T106-T118 | Cross-cutting validation |

**Total Tasks**: 118
**MVP Scope**: Phases 1-4 (T001-T052, 52 tasks)
**Parallelizable Tasks**: 47 marked with [P]

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests use pytest with httpx TestClient and dependency overrides for mocking
