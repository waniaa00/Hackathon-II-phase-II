# Implementation Plan: Better-Auth Integration for Todo Application

**Branch**: `001-better-auth-integration` | **Date**: 2026-01-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-better-auth-integration/spec.md`
**Status**: ✅ **APPROVED - Constitution v3.0.0 Compliant**

## Summary

This feature integrates Better-Auth authentication with backend (FastAPI) and frontend (Next.js), including:
- User registration and login flows
- Session management and persistence
- Protected routes and authorization
- Database integration with Neon PostgreSQL
- User-scoped todo access

**Constitution Status**: Approved under constitution v3.0.0 which expanded scope to include backend services, APIs, authentication, and database integration.

## Constitutional Compliance

### Constitution v3.0.0 (Amended 2026-01-12)

The constitution was amended from v2.0.0 → v3.0.0 (MAJOR version bump) to expand project scope from "Frontend Only" to "Full-Stack Application".

**Now In Scope (Added in v3.0.0):**
- Backend services & APIs ✅
- Authentication & authorization ✅
- Server-side persistence ✅
- Database design & management ✅
- RESTful API endpoints ✅
- Session management ✅
- User data isolation ✅

**Frontend (Existing):**
- Frontend UI & UX ✅
- Client-side state management ✅
- Responsive, accessible design ✅

**Technology Stack (Added in v3.0.0):**
- **Backend Framework**: FastAPI ✅
- **Backend Language**: Python 3.11+ ✅
- **Database**: PostgreSQL (Neon-hosted) ✅
- **ORM**: SQLModel ✅
- **Authentication**: Better-Auth ✅
- **Session Storage**: PostgreSQL (via Better-Auth) ✅

### Feature Requirements vs Constitution

All feature requirements are now constitutionally compliant:
1. **Backend authentication** (FastAPI + Better-Auth) - ✅ **IN SCOPE (v3.0.0)**
2. **Database integration** (Neon PostgreSQL) - ✅ **IN SCOPE (v3.0.0)**
3. **API endpoints** (auth, session, todos) - ✅ **IN SCOPE (v3.0.0)**
4. **Server-side sessions** - ✅ **IN SCOPE (v3.0.0)**
5. **Frontend auth UI** (login, signup pages) - ✅ **IN SCOPE**
6. **Protected route guards** (client-side) - ✅ **IN SCOPE**
7. **Auth state management** (React Context) - ✅ **IN SCOPE**

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 14+ (App Router), React 18+, Better-Auth client 1.1+, TanStack Query
- Backend: FastAPI 0.104+, Better-Auth 1.1+, SQLModel 0.0.14+, psycopg2-binary

**Database**:
- Provider: Neon PostgreSQL (serverless)
- Connection: Already configured via DATABASE_URL environment variable
- Tables: Users, sessions, todos (Better-Auth managed + application tables)

**Authentication**:
- Library: Better-Auth 1.1+
- Session Storage: PostgreSQL via Better-Auth
- Session Duration: 7 days with daily update age
- Token Storage: HTTP-only secure cookies

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, httpx (async client)

**Target Platform**: Full-stack web application
- Frontend: Vercel (already deployed)
- Backend: Render (already deployed)

**Project Type**: Multi-user web application with authentication

**Performance Goals**:
- Login/signup: < 10 seconds
- Session validation: < 100ms
- Todo queries: < 200ms
- Page load: < 3 seconds

**Constraints**:
- HTTPS required for secure cookies (production)
- 7-day session persistence
- 100% authorization enforcement on all todo endpoints
- CORS configured for specific origins only
- User data isolation enforced at database query level

**Scale/Scope**:
- Multi-user system
- 40 functional requirements (FR-001 to FR-040)
- 6 user stories (P1/P2 prioritized)
- 10 measurable success criteria
- Backend + Frontend integration
- Full security implementation

## Constitution Check

### Gates

**Gate 1: Authoritative Documentation Sources**
- **Status**: ✅ **PASS**
- **Required Sources**: Context7 MCP for Better-Auth, FastAPI, PostgreSQL, SQLModel, Next.js, React
- **Plan**: All implementation patterns will be derived from official documentation via Context7 MCP
- **Documentation Priority**:
  1. Better-Auth official docs (authentication patterns)
  2. FastAPI docs (API design, dependencies)
  3. SQLModel docs (ORM patterns)
  4. Neon PostgreSQL docs (connection, pooling)
  5. Next.js App Router docs (routing, middleware)
  6. React docs (Context API, hooks)

**Gate 2: Scope Compliance**
- **Status**: ✅ **PASS**
- **Constitution Version**: v3.0.0 (amended 2026-01-12)
- **Feature Requirements**: Backend authentication, APIs, database, frontend UI
- **Constitution Scope**: Now includes backend services, APIs, authentication, database, frontend
- **Compliance**: All requirements are constitutionally valid under v3.0.0

**Gate 3: Technology Constraints**
- **Status**: ✅ **PASS**
- **Frontend Stack**: Next.js 14+ App Router ✅, TypeScript 5+ ✅, React 18+ ✅, Tailwind CSS ✅
- **Backend Stack**: FastAPI ✅, Python 3.11+ ✅, SQLModel ✅, PostgreSQL ✅, Better-Auth ✅
- **All Technologies**: Explicitly approved in constitution v3.0.0 § 3 (Frontend) and § 13-15 (Backend)

**Gate 4: Quality Standards**
- **Status**: ✅ **PASS**
- **Documentation-First**: All patterns from Context7 MCP official sources
- **Spec-Driven Development**: Feature spec complete and validated (specs/001-better-auth-integration/spec.md)
- **Type Safety**: TypeScript frontend, Python type hints backend
- **Testing Requirements**: Jest (frontend), pytest (backend)
- **Security Standards**: HTTPS, HTTP-only cookies, authorization enforcement, input validation

### Summary

**✅ ALL GATES PASSING** - Plan can proceed to Phase 0 (Research) and Phase 1 (Design)

Constitution v3.0.0 provides full authorization for this feature's scope and technology stack.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-better-auth-integration/
├── plan.md              # This file (status: APPROVED)
├── research.md          # Phase 0 output (in progress)
├── data-model.md        # Phase 1 output (pending)
├── quickstart.md        # Phase 1 output (pending)
├── contracts/           # Phase 1 output (pending)
│   ├── auth-contract.ts
│   └── todo-contract.ts
├── checklists/
│   └── requirements.md  # Spec validation (completed)
└── tasks.md             # Phase 2 output (pending /sp.tasks)
```

### Source Code

```text
backend/
├── main.py              # FastAPI app with Better-Auth
├── models/
│   ├── user.py          # User model (SQLModel)
│   └── todo.py          # Todo model with user_id FK
├── dependencies/
│   └── auth.py          # Better-Auth session validation
├── routers/
│   ├── auth.py          # Auth endpoints (if needed)
│   └── todos.py         # Protected todo CRUD
└── tests/
    ├── test_auth.py
    └── test_todos.py

app/                     # Next.js App Router
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts # Better-Auth API route
├── login/
│   └── page.tsx         # Login UI
├── signup/
│   └── page.tsx         # Signup UI
├── dashboard/
│   └── page.tsx         # Protected dashboard
├── todos/
│   └── page.tsx         # Protected todos page
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx    # Auth context
│   │   ├── ProtectedRoute.tsx  # Route guard HOC
│   │   ├── LoginForm.tsx       # Login form
│   │   └── SignupForm.tsx      # Signup form
│   └── todos/
│       └── TaskForm.tsx         # Existing form (already created)
├── lib/
│   ├── auth.ts          # Better-Auth config
│   └── api-client.ts    # API client with auth
└── context/
    └── AuthContext.tsx  # Auth state management
```


## Complexity Tracking

### Scope & Scale

**Feature Complexity**: HIGH
- **Backend**: Authentication system, session management, database integration
- **Frontend**: Auth UI, protected routes, state management
- **Integration**: Frontend-backend coordination, CORS, credentials
- **Security**: Authorization enforcement, secure sessions, data isolation

**Implementation Estimate**:
- 40 functional requirements
- 6 user stories (prioritized P1/P2)
- Multiple components: backend models, API endpoints, frontend UI, state management
- Full security implementation required

**Risk Areas**:
- Better-Auth configuration and integration (new library)
- Session management across frontend/backend
- CORS and credential handling
- Database schema migrations
- Authorization enforcement completeness

## Phase 0: Research

**Status**: ✅ **READY TO EXECUTE**

### Research Questions

The following areas require documentation research via Context7 MCP:

1. **Better-Auth Integration with Next.js App Router**
   - How to configure Better-Auth client in Next.js 14+ App Router
   - API route setup for Better-Auth handlers
   - Session management patterns
   - Client-side session access patterns

2. **Better-Auth FastAPI Integration**
   - FastAPI adapter/middleware configuration
   - Session validation in FastAPI dependencies
   - Database adapter setup for PostgreSQL
   - Authentication flow coordination

3. **Neon PostgreSQL Connection**
   - Connection string format and pooling
   - SQLModel integration patterns
   - Migration strategies
   - Connection management best practices

4. **Secure Session Handling**
   - HTTP-only cookie configuration
   - CORS setup for credentials
   - Session expiration and renewal
   - Cross-origin session sharing

5. **Protected API Routes**
   - FastAPI dependency injection for auth
   - Session validation middleware
   - Authorization patterns (user-scoped data)
   - Error handling for auth failures

6. **Frontend-Backend CORS**
   - Credential-enabled CORS setup
   - Origin configuration
   - Preflight request handling
   - Cookie transmission requirements

7. **Better-Auth Database Schema**
   - Required tables and columns
   - Migration setup
   - Relationships with application tables
   - Index requirements

**Output**: `research.md` (documenting findings from Context7 MCP queries)

## Phase 1: Design & Contracts

**Status**: ⏳ **PENDING** (after Phase 0 research.md completion)

### Design Artifacts to Generate

1. **data-model.md**
   - User entity (fields, relationships, constraints)
   - Session entity (Better-Auth managed)
   - Todo entity (enhanced with user_id foreign key)
   - Entity relationships diagram
   - Database schema definition

2. **contracts/auth-contract.ts**
   - Authentication endpoints (login, signup, logout)
   - Request/response interfaces
   - Error response schemas
   - Session validation endpoints

3. **contracts/todo-contract.ts**
   - Todo CRUD endpoints (with authorization)
   - Request/response interfaces
   - Error handling patterns
   - User-scoped filtering

4. **quickstart.md**
   - Environment setup (DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET)
   - Database initialization steps
   - Better-Auth configuration
   - Development server setup
   - Testing instructions

**Output**: Design artifacts ready for implementation

---

## Recommendations

### Implementation Priorities

**P1 - Critical Path** (User Stories 1, 2, 3, 5):
1. Database schema setup (User, Session, Todo tables)
2. Backend Better-Auth configuration
3. Backend session validation dependency
4. Frontend auth UI (login, signup)
5. Frontend auth state management (Context API)
6. Todo API authorization enforcement
7. Protected route guards (frontend)

**P2 - Enhanced UX** (User Stories 4, 6):
1. Logout functionality
2. Auth state display in UI
3. Session expiration handling
4. Error messaging and feedback

### Security Implementation Checklist

- [ ] HTTP-only cookies for session tokens
- [ ] CORS configured with specific origins (no wildcard)
- [ ] Authorization enforced at FastAPI dependency level
- [ ] User ownership validated before all todo operations
- [ ] Input validation on all form fields
- [ ] SQL injection prevention via ORM
- [ ] No sensitive data in error messages
- [ ] HTTPS in production

### Testing Strategy

- **Backend**: pytest for auth flows, authorization, session management
- **Frontend**: Jest + React Testing Library for UI components, forms, protected routes
- **Integration**: End-to-end auth flows (signup → login → todo access → logout)
- **Security**: Attempt unauthorized access, session tampering, cross-user access

---

## Status Summary

**Planning Status**: ✅ **APPROVED - READY FOR PHASE 0 & PHASE 1**
**Constitutional Status**: Compliant with constitution v3.0.0
**Next Steps**:
1. Generate `research.md` (Phase 0)
2. Generate design artifacts (Phase 1: data-model.md, contracts/, quickstart.md)
3. Update agent context
4. Proceed to `/sp.tasks` for task generation

---

**Plan Created**: 2026-01-12
**Plan Status**: ✅ APPROVED - Constitution v3.0.0 Compliant
**Last Updated**: 2026-01-12
