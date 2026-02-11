---
id: 001
title: Initial Todo App Constitution
stage: constitution
date: 2026-02-04
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 006-better-auth-integration
user: wania
command: /sp.constitution
labels: ["constitution", "governance", "hackathon", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

Project: Full-Stack Todo App Hackathon using Spec-Kit Plus

Core Principles:
- Spec-Driven Development: All implementation follows generated specs; no manual coding outside Claude Code.
- Security First: User authentication and task data isolation via JWT and Better Auth.
- Accuracy & Completeness: All API endpoints and frontend features must work as specified.
- Usability & Responsiveness: Intuitive UI and seamless multi-device support.
- Incremental Feature Growth: Core features first, then intermediate, then advanced enhancements.

Key Standards:
- RESTful API: All endpoints must adhere to REST conventions.
- JWT Authentication: Every request must include a valid token; invalid requests return 401 Unauthorized.
- Database Integrity: Task operations must enforce user ownership and data consistency in Neon PostgreSQL.
- Code Traceability: All specs, plans, and tasks must be documented and reviewable in the Claude Code + Spec-Kit Plus workflow.
- Frontend Standards: Next.js 16+ App Router with responsive design and proper error handling.
- Backend Standards: FastAPI with SQLModel ORM; middleware to verify JWT and extract user info.
- Task Feature Compliance: Must implement all Basic Level features; Intermediate and Advanced features are optional but encouraged.

Constraints:
- Development Approach: Spec → Plan → Tasks → Claude Code Implementation (no manual coding)
- Technology Stack Fixed: Next.js frontend, FastAPI backend, SQLModel ORM, Neon PostgreSQL, Better Auth for authentication
- API Endpoints Must Include:
  - GET /api/{user_id}/tasks
  - POST /api/{user_id}/tasks
  - GET /api/{user_id}/tasks/{id}
  - PUT /api/{user_id}/tasks/{id}
  - DELETE /api/{user_id}/tasks/{id}
  - PATCH /api/{user_id}/tasks/{id}/complete
- JWT Secret: Shared via environment variable `BETTER_AUTH_SECRET` between frontend and backend
- Task Ownership: All queries must filter by authenticated user ID
- UI Constraints: Responsive design, accessibility best practices, and task filtering/sorting/search features for Intermediate Level

Success Criteria:
- Full functionality of Basic Level features verified via API and frontend tests
- JWT authentication enforced across all endpoints
- Database correctly stores and isolates tasks per user
- Frontend UI works across desktop and mobile devices
- All specs, plans, and task iterations documented for review
- Optional Advanced features implemented demonstrate recurring tasks, due dates, and reminders

## Response snapshot

Created constitution v1.0.0 for the Full-Stack Todo App Hackathon project with 12 core principles:

1. Spec-Driven Development - All implementation follows generated specs
2. Security First - JWT and Better Auth for user isolation
3. Accuracy & Completeness - All features work as specified
4. Usability & Responsiveness - Multi-device support required
5. Incremental Feature Growth - Basic → Intermediate → Advanced
6. RESTful API Standards - Proper HTTP methods and status codes
7. JWT Authentication Enforcement - 401 on invalid tokens
8. Database Integrity - User ownership and data consistency
9. Code Traceability - PHRs and ADRs for documentation
10. Frontend Standards - Next.js 16+ App Router
11. Backend Standards - FastAPI with SQLModel ORM
12. Task Feature Compliance - Basic Level required, others encouraged

Also defined Technology Stack table, Development Workflow with Spec-Kit Plus flow, Quality Gates, Branch Strategy, and Governance section with amendment process and versioning policy.

## Outcome

- Impact: Established foundational governance document for the hackathon project
- Tests: N/A (governance document)
- Files: `.specify/memory/constitution.md` created
- Next prompts: `/sp.specify` to create first feature specification
- Reflection: Constitution successfully captures all user requirements across 12 principles with clear MUST/SHOULD language

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual review PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
