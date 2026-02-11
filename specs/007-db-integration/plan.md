# Implementation Plan: Todo App Database & Integration

**Branch**: `007-db-integration` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-db-integration/spec.md`

## Summary

Implement a secure, reliable database foundation for the Todo app using Neon Serverless PostgreSQL with SQLModel ORM. This includes schema design for users, tasks, tags, and priorities with proper relationships, foreign key constraints, and indexes for query performance. The backend will connect via FastAPI with environment-based configuration for secrets.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.115+, SQLModel 0.0.24+, psycopg2-binary (PostgreSQL driver), python-dotenv
**Storage**: Neon Serverless PostgreSQL (cloud-hosted)
**Testing**: pytest with pytest-asyncio for async tests
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web application (backend focus for this feature)
**Performance Goals**: <500ms for CRUD operations, <5s connection establishment
**Constraints**: <100 concurrent connections (Neon free tier), SSL required
**Scale/Scope**: 100+ users, 1000+ tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following spec.md requirements |
| II. Security First | ✅ PASS | JWT via Better Auth, password hashing, env vars for secrets |
| III. Accuracy & Completeness | ✅ PASS | All 29 FRs mapped to implementation |
| IV. Usability & Responsiveness | N/A | Backend feature |
| V. Incremental Feature Growth | ✅ PASS | P1 stories first (connection, users, tasks) |
| VI. RESTful API Standards | ✅ PASS | Endpoints defined in contracts/ |
| VII. JWT Authentication Enforcement | ✅ PASS | Middleware planned for all protected routes |
| VIII. Database Integrity | ✅ PASS | FKs, cascades, constraints in schema |
| IX. Code Traceability | ✅ PASS | PHRs created, tasks will reference spec |
| X. Frontend Standards | N/A | Backend feature |
| XI. Backend Standards | ✅ PASS | FastAPI + SQLModel + async patterns |
| XII. Task Feature Compliance | ✅ PASS | Basic + Intermediate features supported |

**Gate Result**: PASS - No violations. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/007-db-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.yaml     # API specification
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   ├── task.py          # Task SQLModel
│   │   ├── tag.py           # Tag SQLModel
│   │   ├── priority.py      # Priority SQLModel
│   │   └── task_tag.py      # TaskTag junction table
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # User Pydantic schemas
│   │   ├── task.py          # Task Pydantic schemas
│   │   ├── tag.py           # Tag Pydantic schemas
│   │   └── priority.py      # Priority Pydantic schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependency injection (session, auth)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py    # API router aggregator
│   │       ├── tasks.py     # Task endpoints
│   │       ├── tags.py      # Tag endpoints
│   │       └── priorities.py # Priority endpoints
│   └── services/
│       ├── __init__.py
│       ├── task_service.py  # Task business logic
│       ├── tag_service.py   # Tag business logic
│       └── priority_service.py # Priority business logic
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   ├── test_database.py     # Connection tests
│   ├── test_models.py       # Model tests
│   └── test_api/
│       ├── test_tasks.py    # Task API tests
│       ├── test_tags.py     # Tag API tests
│       └── test_priorities.py # Priority API tests
├── alembic/                 # Database migrations
│   ├── env.py
│   ├── versions/
│   └── alembic.ini
├── requirements.txt
├── .env.example
└── pyproject.toml
```

**Structure Decision**: Web application structure with dedicated backend directory. Models separated from schemas (SQLModel tables vs Pydantic request/response). Services layer for business logic isolation.

## Complexity Tracking

No constitution violations to justify.
