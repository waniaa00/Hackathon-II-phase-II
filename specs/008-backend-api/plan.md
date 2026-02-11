# Implementation Plan: Todo App Backend & API

**Branch**: `008-backend-api` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Dependency**: `007-db-integration` (database models, connection, migrations)
**Input**: Feature specification from `/specs/008-backend-api/spec.md`

## Summary

Implement a secure RESTful API layer for the Todo app using FastAPI. This feature builds on top of 007-db-integration (database models and connection) to provide authenticated endpoints for task management. Key capabilities include JWT authentication via Better Auth JWKS, task CRUD operations, filtering, sorting, pagination, and consistent error handling.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.115+, PyJWT 2.8+, cryptography (for JWKS), SQLModel 0.0.24+
**Storage**: Uses database layer from 007-db-integration
**Testing**: pytest with httpx for API testing, pytest-asyncio for async tests
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web application (API layer)
**Performance Goals**: <500ms for CRUD operations, <1s for list with 100 tasks, <100ms auth overhead
**Constraints**: Must validate all requests against Better Auth JWKS endpoint
**Scale/Scope**: 100 concurrent requests, 100+ users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following spec.md requirements, depends on 007 |
| II. Security First | ✅ PASS | JWT validation via JWKS, user isolation enforced |
| III. Accuracy & Completeness | ✅ PASS | All 35 FRs mapped to implementation |
| IV. Usability & Responsiveness | N/A | Backend feature |
| V. Incremental Feature Growth | ✅ PASS | P1 (auth, CRUD) before P2 (filtering), P3 (tags) |
| VI. RESTful API Standards | ✅ PASS | Endpoints follow REST conventions |
| VII. JWT Authentication Enforcement | ✅ PASS | Middleware validates all protected routes |
| VIII. Database Integrity | ✅ PASS | Uses 007's models with proper constraints |
| IX. Code Traceability | ✅ PASS | PHRs created, tasks will reference spec |
| X. Frontend Standards | N/A | Backend feature |
| XI. Backend Standards | ✅ PASS | FastAPI + async + Pydantic validation |
| XII. Task Feature Compliance | ✅ PASS | Basic + Intermediate features supported |

**Gate Result**: PASS - No violations. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/008-backend-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (API-specific entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.yaml     # Extended API specification
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (extends 007 structure)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration (from 007)
│   ├── database.py          # Database connection (from 007)
│   ├── models/              # SQLModel tables (from 007)
│   │   └── ...
│   ├── schemas/             # Pydantic request/response (from 007)
│   │   └── ...
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies: auth, session, user validation
│   │   ├── exceptions.py    # Custom exception handlers
│   │   ├── middleware.py    # CORS, logging, request ID middleware
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py    # API router aggregator
│   │       ├── tasks.py     # Task CRUD + filtering + sorting
│   │       ├── tags.py      # Tag CRUD
│   │       └── priorities.py # Priority listing
│   ├── services/            # Business logic (from 007, extended)
│   │   ├── __init__.py
│   │   ├── auth_service.py  # JWT verification, user extraction
│   │   ├── task_service.py  # Task operations with filtering/sorting
│   │   ├── tag_service.py   # Tag operations
│   │   └── priority_service.py # Priority operations
│   └── core/
│       ├── __init__.py
│       ├── security.py      # JWT verification via JWKS
│       └── logging.py       # Structured logging with correlation IDs
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures, mock JWT
│   ├── test_auth.py         # Authentication tests
│   └── test_api/
│       ├── test_tasks.py    # Task endpoint tests
│       ├── test_tags.py     # Tag endpoint tests
│       └── test_priorities.py # Priority endpoint tests
└── ...
```

**Structure Decision**: Builds on 007-db-integration structure. Adds `core/` for security utilities, extends `api/` with middleware and exception handlers.

## Dependency on 007-db-integration

This feature assumes the following from 007:
- Database connection (`database.py`) with session management
- SQLModel models (`models/`) for User, Task, Tag, Priority, TaskTag
- Pydantic schemas (`schemas/`) for request/response validation
- Base configuration (`config.py`) with environment variables
- Alembic migrations applied

## Architecture Decisions

### 1. Authentication Flow

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Client        │       │   FastAPI       │       │   Better Auth   │
│   (Frontend)    │       │   Backend       │       │   (Frontend)    │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         │  1. Login               │                         │
         │────────────────────────────────────────────────▶│
         │                         │                         │
         │  2. JWT Token           │                         │
         │◀────────────────────────────────────────────────│
         │                         │                         │
         │  3. API Request         │                         │
         │  Authorization: Bearer  │                         │
         │────────────────────────▶│                         │
         │                         │                         │
         │                         │  4. Fetch JWKS          │
         │                         │────────────────────────▶│
         │                         │                         │
         │                         │  5. Public Keys         │
         │                         │◀────────────────────────│
         │                         │                         │
         │                         │  6. Verify JWT          │
         │                         │  (cached keys)          │
         │                         │                         │
         │  7. API Response        │                         │
         │◀────────────────────────│                         │
```

### 2. Request Processing Pipeline

```
HTTP Request
    │
    ▼
┌──────────────────┐
│  CORS Middleware │  ← Allow frontend origin
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Logging         │  ← Generate correlation ID
│  Middleware      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Auth Dependency │  ← Verify JWT, extract user
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  User Validation │  ← Match JWT user_id with path {user_id}
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Route Handler   │  ← Business logic
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Exception       │  ← Convert to consistent JSON errors
│  Handler         │
└────────┬─────────┘
         │
         ▼
HTTP Response
```

### 3. Error Handling Strategy

All errors return consistent JSON format:
```json
{
    "detail": "Human-readable error message",
    "code": "ERROR_CODE"
}
```

| HTTP Status | Code | Usage |
|-------------|------|-------|
| 400 | VALIDATION_ERROR | Invalid request body/params |
| 401 | UNAUTHORIZED | Missing/invalid token |
| 403 | FORBIDDEN | User mismatch or access denied |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Duplicate resource (e.g., tag name) |
| 500 | INTERNAL_ERROR | Unexpected server error |
| 503 | SERVICE_UNAVAILABLE | Database unavailable |

### 4. Filtering and Sorting Implementation

Query parameters processed in service layer:
- `status`: Enum filter (pending/completed)
- `priority_id`: UUID foreign key filter
- `tag_id`: Join through task_tag junction
- `due_before`, `due_after`: Date range filter
- `search`: ILIKE on title and description
- `sort_by`: Column name (validated)
- `sort_order`: asc/desc (default: desc)
- `page`, `page_size`: Offset pagination

## Complexity Tracking

No constitution violations to justify.

## Risk Analysis

| Risk | Mitigation |
|------|------------|
| JWKS endpoint unavailable | Cache keys with 1hr TTL, graceful degradation |
| High latency on token verification | Cache PyJWKClient, verify per-request |
| SQL injection via search | Use parameterized queries (SQLAlchemy handles) |
| Cross-user data access | Validate user_id match in dependency |

## Next Steps

1. Generate `tasks.md` via `/sp.tasks`
2. Implement authentication middleware (depends on 007 completion)
3. Implement task endpoints with filtering/sorting
4. Implement tag and priority endpoints
5. Add comprehensive API tests
