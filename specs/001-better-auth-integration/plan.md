# Implementation Plan: Better-Auth Integration for Todo Application

**Branch**: `001-better-auth-integration` | **Date**: 2026-01-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-better-auth-integration/spec.md`

**⚠️ CRITICAL CONSTITUTIONAL VIOLATION DETECTED ⚠️**

## Summary

This feature requests integration of Better-Auth authentication with backend (FastAPI) and frontend (Next.js), including:
- User registration and login flows
- Session management and persistence
- Protected routes and authorization
- Database integration with Neon PostgreSQL
- User-scoped todo access

**HOWEVER**: This directly violates the project constitution (version 2.0.0, Section 1).

## Constitutional Conflict Analysis

### Constitution States (v2.0.0, Section 1)

**Explicitly Out of Scope:**
- Backend services ❌
- APIs ❌
- Authentication ❌
- Server-side persistence ❌
- Database or cloud integrations ❌

**In Scope:**
- Frontend UI & UX ✅
- Client-side state management ✅
- Mock data & UI logic ✅
- Responsive, accessible design ✅

### Feature Spec Requests

The specification requires:
1. **Backend authentication** (FastAPI + Better-Auth) - ❌ **OUT OF SCOPE**
2. **Database integration** (Neon PostgreSQL) - ❌ **OUT OF SCOPE**
3. **API endpoints** (auth, session, todos) - ❌ **OUT OF SCOPE**
4. **Server-side sessions** - ❌ **OUT OF SCOPE**
5. **Frontend auth UI** (login, signup pages) - ✅ **IN SCOPE**
6. **Protected route guards** (client-side) - ✅ **IN SCOPE**
7. **Auth state management** (React Context) - ✅ **IN SCOPE**

### Violation Assessment

**Severity**: **CRITICAL** - The feature fundamentally requires backend services, which are constitutionally forbidden.

**Options**:

1. **Option A: Amend Constitution** (Recommended)
   - Update constitution v2.0.0 → v3.0.0 (MAJOR version bump)
   - Add "Backend Services" to "In Scope"
   - Add authentication, APIs, database to allowed scope
   - Update all dependent templates
   - Requires explicit approval and migration plan
   - **Then proceed with this plan**

2. **Option B: Reframe as Frontend-Only Mock Auth**
   - Remove all backend/API/database requirements
   - Implement mock authentication (localStorage-based)
   - Simulate login/logout flows without server
   - Implement client-side "session" simulation
   - Keep UI patterns backend-integration ready
   - **Complies with constitution but doesn't meet original feature intent**

3. **Option C: Reject Feature**
   - Feature is constitutionally invalid
   - Return to specification phase
   - Redesign within constitutional boundaries
   - **Blocks progress on this feature**

## ⚠️ GATE FAILURE: Planning Cannot Proceed

Per `.specify/templates/commands/plan.md`:
> **Constitution Check**: *GATE: Must pass before Phase 0 research*

This feature **FAILS** the constitutional gate because it requires backend services explicitly excluded by the constitution.

### Required Actions Before Proceeding

**Choice 1: Amend Constitution** (if backend integration is desired):
1. Create constitutional amendment proposal
2. Document rationale for scope expansion
3. Update version 2.0.0 → 3.0.0
4. Update dependent templates
5. Get explicit approval
6. **Then resume `/sp.plan`**

**Choice 2: Redesign Feature** (to comply with constitution):
1. Remove all backend/API/database requirements from spec
2. Redesign as mock authentication with localStorage
3. Update spec.md to reflect frontend-only approach
4. **Then resume `/sp.plan`**

## Technical Context (Conditional - depends on constitutional resolution)

**If Option A (Amend Constitution) is chosen:**

**Language/Version**: TypeScript 5+, Python 3.11+
**Primary Dependencies**:
- Frontend: Next.js 14+, React 18+, Better-Auth client 1.1+
- Backend: FastAPI 0.104+, Better-Auth 1.1+, SQLModel, Neon PostgreSQL
**Storage**: Neon PostgreSQL (for users, sessions, todos)
**Testing**: Jest/React Testing Library (frontend), pytest (backend)
**Target Platform**: Web (Next.js) + REST API (FastAPI)
**Project Type**: Web application (frontend + backend)
**Performance Goals**:
- Login/signup < 10 seconds
- Session validation < 100ms
- Todo queries < 200ms
**Constraints**:
- HTTPS required for secure cookies
- 7-day session persistence
- 100% authorization enforcement
**Scale/Scope**:
- Multi-user system
- 40 functional requirements
- 6 user stories
- Backend + Frontend integration

**If Option B (Mock Auth) is chosen:**

**Language/Version**: TypeScript 5+
**Primary Dependencies**: Next.js 14+, React 18+, localStorage API
**Storage**: Browser localStorage (mock sessions)
**Testing**: Jest, React Testing Library
**Target Platform**: Web (client-side only)
**Project Type**: Single-page application (frontend only)
**Performance Goals**: Instant auth state changes (no network)
**Constraints**: No server-side validation, mock data only
**Scale/Scope**: Single-user demonstration, UI patterns only

## Constitution Check

### Gates

**Gate 1: Authoritative Documentation Sources**
- **Status**: ⚠️ **CONDITIONAL PASS**
- **If backend allowed**: Must use Context7 MCP for Better-Auth, FastAPI, PostgreSQL docs
- **If frontend only**: Must use Context7 MCP for Next.js, React, Browser APIs only
- **Current Plan**: Pending constitutional decision

**Gate 2: Scope Compliance**
- **Status**: ❌ **FAILED**
- **Violation**: Feature spec requests backend services (authentication, APIs, database)
- **Constitution**: "Explicitly Out of Scope: Backend services, APIs, Authentication, Server-side persistence, Database"
- **Blocker**: **YES** - Cannot proceed with Phase 0 research until resolved

**Gate 3: Technology Constraints**
- **Status**: ⚠️ **CONDITIONAL PASS**
- **Frontend**: Next.js App Router ✅, TypeScript ✅, React ✅, Tailwind CSS ✅
- **Backend**: Not addressed in current constitution (v2.0.0 is frontend-only)
- **Current Plan**: Pending constitutional decision

**Gate 4: Quality Standards**
- **Status**: ⚠️ **PENDING**
- **Cannot evaluate**: Until scope conflict is resolved
- **Will require**: Documentation-first correctness, spec-driven development

### Summary

**GATE FAILURE**: This plan cannot proceed to Phase 0 (Research) until the constitutional conflict is resolved.

**Required Decision**: Choose Option A (Amend Constitution) or Option B (Redesign as Mock Auth)

---

## Project Structure (Conditional)

### Documentation (this feature)

```text
specs/001-better-auth-integration/
├── plan.md              # This file (current status: BLOCKED)
├── research.md          # Phase 0 output (BLOCKED until gate passes)
├── data-model.md        # Phase 1 output (BLOCKED)
├── quickstart.md        # Phase 1 output (BLOCKED)
├── contracts/           # Phase 1 output (BLOCKED)
└── tasks.md             # Phase 2 output (BLOCKED)
```

### Source Code (if Option A - Backend Integration)

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

### Source Code (if Option B - Mock Auth Only)

```text
app/                     # Next.js App Router
├── login/
│   └── page.tsx         # Mock login UI
├── signup/
│   └── page.tsx         # Mock signup UI
├── dashboard/
│   └── page.tsx         # Protected (mock) dashboard
├── todos/
│   └── page.tsx         # Protected (mock) todos
├── components/
│   ├── auth/
│   │   ├── MockAuthProvider.tsx   # Mock auth context
│   │   ├── ProtectedRoute.tsx     # Client-side guard
│   │   ├── LoginForm.tsx          # Mock login form
│   │   └── SignupForm.tsx         # Mock signup form
│   └── todos/
│       └── TaskForm.tsx            # Existing form
├── lib/
│   └── mock-auth.ts     # localStorage-based auth
└── context/
    └── MockAuthContext.tsx  # Mock auth state
```

**Structure Decision**: **BLOCKED** - Cannot determine structure until constitutional conflict is resolved.

## Complexity Tracking

### Constitutional Violation Justification

**Violation**: Requesting backend services in a frontend-only project

**Justification Options**:

**Option A (Amend Constitution)**:
- **Business Need**: Multi-user system requires real authentication and data isolation
- **Technical Need**: Browser localStorage insufficient for production security
- **User Value**: Secure, persistent user accounts and data privacy
- **Migration Plan**: Expand scope to include backend services, update all templates
- **Approval Required**: Yes - MAJOR version bump (2.0.0 → 3.0.0)

**Option B (Comply with Constitution)**:
- **No Justification Needed**: Redesign feature to be frontend-only
- **Trade-off**: Mock authentication only, no real security or persistence
- **User Value**: Demonstrates UI/UX patterns for future backend integration
- **Migration Plan**: None - stays within current constitution

## Phase 0: Research (BLOCKED)

**Status**: Cannot proceed until Gate 2 (Scope Compliance) passes

**Pending Research Questions** (if Option A chosen):
1. Better-Auth integration patterns with Next.js App Router
2. Better-Auth FastAPI adapter configuration
3. Neon PostgreSQL connection with SQLModel
4. Secure session cookie handling in Next.js
5. Protected API route patterns with FastAPI dependencies
6. Frontend-backend CORS configuration for credentials
7. Better-Auth database schema requirements

**Alternative Research Questions** (if Option B chosen):
1. localStorage API security best practices
2. Client-side session simulation patterns
3. Mock authentication UI patterns
4. Frontend-only protected route guards
5. Backend-ready data structures without backend

**Output**: `research.md` (blocked until constitutional decision)

## Phase 1: Design & Contracts (BLOCKED)

**Status**: Cannot proceed until Phase 0 completes

**Pending Design Artifacts**:
- `data-model.md` - User, Session, Todo entities
- `contracts/` - API contracts (if backend) or mock interfaces (if frontend-only)
- `quickstart.md` - Setup instructions

**Output**: Design artifacts (blocked)

---

## Recommendations

### Immediate Actions Required

1. **Review Constitutional Conflict**: Understand the scope mismatch
2. **Make Strategic Decision**: Choose Option A (amend) or Option B (redesign)
3. **If Option A**: Draft constitutional amendment proposal
4. **If Option B**: Update spec.md to remove backend requirements
5. **Resume Planning**: Rerun `/sp.plan` after resolution

### Long-Term Considerations

If the project needs backend capabilities:
- Consider updating the constitution to reflect full-stack scope
- This would be a strategic shift from "frontend-only demo" to "production application"
- Requires broader architectural decisions beyond this single feature

---

## Status Summary

**Planning Status**: ❌ **BLOCKED - GATE FAILURE**
**Blocking Issue**: Constitutional scope violation (backend services requested but forbidden)
**Next Step**: Resolve constitutional conflict via Option A or Option B
**Resume Command**: `/sp.plan` (after resolution)

**This plan cannot proceed to Phase 0 (Research) until the constitutional gate passes.**

---

**Plan Created**: 2026-01-12
**Plan Status**: BLOCKED PENDING CONSTITUTIONAL RESOLUTION
**Last Updated**: 2026-01-12
