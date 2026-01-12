<!--
Sync Impact Report:
Version Change: 2.0.0 → 3.0.0
Modified Principles:
  - § 1. Purpose & Scope: MAJOR expansion - Backend services now IN SCOPE
  - § 2. Authoritative Sources: Expanded to include backend documentation sources
  - § 4. Technology Constraints: Added backend stack requirements
  - § 13. Backend Services (NEW): Comprehensive backend development principles
Added Sections:
  - § 13. Backend Services & APIs (complete backend governance)
  - § 14. Database & Persistence (data layer standards)
  - § 15. Authentication & Authorization (security principles)
  - § 16. Backend Quality Gates (backend-specific completion criteria)
Modified Sections:
  - § 1: Removed backend from "Out of Scope", added to "In Scope"
  - § 2: Added Better-Auth, FastAPI, PostgreSQL, SQLModel to authorized sources
  - § 4: Added backend technology stack (Python, FastAPI, PostgreSQL)
  - § 11: Clarified as transition section (mock → real backend)
Removed Sections: None
Templates Requiring Updates:
  - ⏳ plan-template.md - Add backend structure options and constitution checks
  - ⏳ spec-template.md - Add backend requirement sections
  - ⏳ tasks-template.md - Add backend task categories
Follow-up TODOs:
  - Update all feature templates to support backend development
  - Review existing frontend-only features for backend integration opportunities
Rationale for MAJOR version bump (2.0.0 → 3.0.0):
  - Backward incompatible change: Previously forbidden backend services now required capability
  - Fundamental scope expansion: "Frontend Only" → "Full-Stack Application"
  - New governance sections: Backend-specific quality gates and architectural principles
  - Strategic shift: From demo/prototype to production-ready multi-user application
  - Affects all future development: Authentication, APIs, database now standard capabilities
-->

# AI / Spec-Driven Todo App — Full-Stack Application

**Version**: 3.0.0
**Ratified**: 2026-01-04
**Last Amended**: 2026-01-12

---

## 1. Purpose & Scope

This constitution defines the **non-negotiable rules, constraints, and quality standards** for building a **modern, production-ready Full-Stack Todo Application**.

### In Scope

**Frontend:**
- Frontend UI & UX
- Client-side state management
- Responsive, accessible design
- Spec-driven, AI-assisted development

**Backend (Added in v3.0.0):**
- Backend services & APIs
- Authentication & authorization
- Server-side persistence
- Database design & management
- RESTful API endpoints
- Session management
- User data isolation

### Explicitly Out of Scope

- Mobile native applications (iOS/Android apps)
- Real-time collaboration features (WebSockets, operational transforms)
- Third-party OAuth providers (unless documented in Better-Auth Context7 docs)
- Content delivery networks (CDN)
- Microservices architecture
- Message queues or event streaming

---

## 2. Authoritative Sources (Single Source of Truth)

All technical and architectural decisions **MUST** be derived **only** from **official documentation** retrieved via:

> **Context7 MCP**

### Allowed Documentation Sources

**Frontend:**
- Next.js (App Router)
- React
- Tailwind CSS
- Browser APIs (MDN)

**Backend (Added in v3.0.0):**
- Better-Auth (authentication)
- FastAPI (backend framework)
- PostgreSQL (database)
- SQLModel (ORM)
- Python standard library
- Neon (PostgreSQL hosting - configuration only)

⚠️ **Hard Rule**

No blog posts, tutorials, StackOverflow answers, or undocumented patterns are permitted.

If documentation is unavailable or unclear:

- The limitation **must be explicitly stated**
- A **documented alternative** must be proposed

**Rationale**: Guarantees production-ready code quality and prevents implementation drift from official standards. Ensures all patterns are maintainable and traceable to authoritative sources.

---

## 3. Architectural Principles

### 3.1 Spec-Driven Development

- Specs come **before** implementation
- Code must be traceable to a written spec
- No speculative or intuition-based coding

**Rationale**: Ensures predictable outcomes, facilitates AI-assisted development, and maintains clear requirements traceability throughout the development lifecycle.

### 3.2 UI-First Design

- UX and interaction flows define structure
- State exists to serve UI needs
- Backend exists to persist and validate UI state

**Rationale**: Focuses development on user value delivery while maintaining clean separation between presentation and business logic.

### 3.3 Deterministic Behavior

- All state transitions must be predictable (frontend and backend)
- No hidden side effects
- System must behave identically given the same inputs

**Rationale**: Ensures testability, debuggability, and reliable user experience across all interactions.

### 3.4 Secure by Default (Added in v3.0.0)

- Authentication required for all user data access
- Authorization enforced at the backend layer
- No trust in frontend validation
- Secure session management following Better-Auth standards

**Rationale**: Protects user data and ensures production-ready security posture.

---

## 4. Technology Constraints

### Required Stack

**Frontend:**
- **Framework:** Next.js (App Router only)
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **State:** React state, Context API, or lightweight documented solutions

**Backend (Added in v3.0.0):**
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Database:** PostgreSQL (Neon-hosted)
- **ORM:** SQLModel
- **Authentication:** Better-Auth
- **Session Storage:** PostgreSQL (via Better-Auth)

### Forbidden

**Frontend:**
- Pages Router
- CSS frameworks other than Tailwind
- Unofficial UI libraries
- Direct DOM manipulation (unless explicitly allowed by React docs)

**Backend (Added in v3.0.0):**
- Raw SQL queries (use SQLModel ORM)
- Custom authentication implementations (use Better-Auth)
- Storing passwords in plain text
- Session management outside Better-Auth
- Undocumented FastAPI patterns

---

## 5. Frontend Specification Requirements

A **frontend specification MUST define**:

### 5.1 UI Components

- Task input form
- Task list (list or card)
- Task item
- Edit task modal / inline editor
- Delete confirmation dialog
- Filters, search, sorting controls
- Recurring task UI
- Date & time pickers
- **Authentication UI (Added in v3.0.0):** Login, signup, logout controls

### 5.2 Page Layouts

- Main dashboard layout
- Empty state layout
- Mobile vs desktop adaptations
- **Protected page layouts (Added in v3.0.0):** Authentication-required pages

### 5.3 State Flows

- Task creation lifecycle
- Edit → preview → confirm flows
- Completion toggling
- Filtered & sorted derived state
- Recurring task previews
- **Authentication flows (Added in v3.0.0):** Login, logout, session persistence

### 5.4 User Interactions

- Keyboard accessibility
- Focus management
- Form validation feedback
- Destructive action confirmations
- **Authentication feedback (Added in v3.0.0):** Loading states, error messages

### 5.5 Edge Cases

- Empty task list
- Overdue tasks
- Duplicate titles
- Invalid dates
- Rapid add/edit/delete actions
- **Auth edge cases (Added in v3.0.0):** Session expiration, network failures

---

## 6. Core Todo MVP Rules

### 6.1 Add Task

Each task **MUST support**:

- Title (required)
- Description (optional)
- Priority (low / medium / high)
- Due date
- Tags / categories
- **User ownership (Added in v3.0.0):** Associated with authenticated user

**Rules**:

- Controlled React inputs only
- Validation feedback must be visible
- Tailwind utility classes only
- **Backend validation (Added in v3.0.0):** Server-side validation required

---

### 6.2 View Tasks

- Responsive list or card layout
- Clear visual hierarchy
- Accessible semantics (`ul`, `li`, `button`, `label`)
- **User-scoped data (Added in v3.0.0):** Users see only their own tasks

---

### 6.3 Update Task

- Inline edit or modal dialog (documented pattern)
- Shared form logic with "Add Task"
- Smooth transitions using Tailwind utilities
- **Authorization (Added in v3.0.0):** Users can only edit their own tasks

---

### 6.4 Delete Task

- Confirmation required
- Clear destructive action styling
- Undo is optional but must be documented if added
- **Authorization (Added in v3.0.0):** Users can only delete their own tasks

---

### 6.5 Mark as Complete

- Toggle interaction
- Visual distinction for completed tasks
- Conditional Tailwind styling only
- **Persistence (Added in v3.0.0):** State persisted to database

---

## 7. Advanced Task Management

### 7.1 Priorities & Tags

- Color semantics must be consistent
- Priority must affect visual prominence
- Dynamic Tailwind classes allowed only via documented patterns
- **Backend storage (Added in v3.0.0):** Stored in database, not just client state

---

### 7.2 Search & Filters

**Supported filters**:

- Keyword
- Completion status
- Priority
- Due date

**Rules**:

- Client-side filtering for UX (instant feedback)
- **Backend queries (Added in v3.0.0):** Server-side filtering for data integrity
- Derived state (no duplicated sources of truth)
- Debounce inputs using documented browser/React APIs

---

### 7.3 Sorting

**Supported sorting**:

- Due date
- Priority
- Alphabetical

**Rules**:

- Stable sorting
- Explicit comparator functions
- UI must reflect active sort state
- **Database queries (Added in v3.0.0):** ORDER BY clauses for consistent results

---

## 8. Productivity Enhancements

### 8.1 Recurring Tasks

- UI controls for daily / weekly / monthly
- Preview upcoming occurrences
- **Backend storage (Added in v3.0.0):** Recurrence rules stored in database

---

### 8.2 Due Dates & Reminders

- Native browser date/time inputs
- Visual urgency indicators (overdue, upcoming)
- **Persistence (Added in v3.0.0):** Due dates persisted to database
- No notifications or alarms (out of scope)

---

## 9. State Management Strategy

**Frontend:**

**Allowed**:

- `useState`
- `useReducer`
- React Context
- Lightweight documented state libraries (if justified)

**Rules**:

- Single source of truth for UI state
- Derived views must not mutate base state
- Clear separation between UI state and domain state
- **Sync with backend (Added in v3.0.0):** Server state is source of truth for persisted data

**Backend (Added in v3.0.0):**

**Allowed**:

- SQLModel ORM for data persistence
- Better-Auth for session state
- FastAPI dependency injection for request-scoped state

**Rules**:

- Database is single source of truth for persisted data
- No in-memory state for user data (use database)
- Stateless API endpoints (except session state via Better-Auth)

---

## 10. Responsiveness & Accessibility

### Required

- Mobile-first design
- Tablet & desktop breakpoints
- Keyboard navigability
- ARIA attributes where documented
- Color contrast compliance
- **Loading states (Added in v3.0.0):** Visual feedback during API calls

---

## 11. Mock Data & Backend Readiness (Transition Section)

**Note**: This section is retained for reference but is now superseded by real backend implementation (v3.0.0+). New features should use real backend services.

**Legacy Guidance** (for frontend-only prototypes):
- Use realistic mock task objects
- Shape must be API-ready
- No hard-coded UI assumptions tied to backend logic

**Current Standard** (v3.0.0+):
- Use real backend APIs for all data operations
- Mock data only for development/testing when backend unavailable
- API contracts define data shapes

**Task Shape** (Unchanged - compatible with backend):

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string; // ISO 8601
  tags?: string[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  userId: string; // Added in v3.0.0 - foreign key to User
}
```

---

## 12. Frontend Quality Gates (Non-Negotiable)

The frontend is considered **complete only if**:

- All behavior is spec-defined
- All patterns trace to Context7 MCP documentation
- UI works without errors
- Codebase integrates with backend correctly
- No undocumented shortcuts exist
- **Authentication flows functional (Added in v3.0.0)**
- **Protected routes enforce access control (Added in v3.0.0)**

---

## 13. Backend Services & APIs (Added in v3.0.0)

### 13.1 API Design Principles

**RESTful Standards:**
- Use standard HTTP methods (GET, POST, PATCH, DELETE)
- Resource-based URLs (`/api/v1/todos`, not `/api/v1/getTodos`)
- Consistent response schemas
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)

**FastAPI Patterns:**
- Use Pydantic models for request/response validation
- Leverage dependency injection for shared logic (auth, database sessions)
- Document all endpoints with OpenAPI/Swagger
- Follow Context7 MCP FastAPI documentation patterns

### 13.2 Error Handling

**Required:**
- Consistent error response format
- User-friendly error messages (no stack traces to clients)
- Appropriate HTTP status codes
- Logging for debugging (server-side only)
- No sensitive information in error responses

**Example Error Response:**
```json
{
  "error": "validation_error",
  "message": "Title is required and must be between 1-200 characters",
  "details": { "field": "title", "constraint": "length" }
}
```

### 13.3 Request Validation

**Required:**
- Input validation on all endpoints
- Type checking via Pydantic models
- Constraint validation (lengths, formats, ranges)
- Sanitization of user input
- Reject invalid requests with 400 Bad Request

### 13.4 API Versioning

**Standard:**
- All endpoints under `/api/v1/` prefix
- Version in URL path, not headers
- Maintain backward compatibility within version
- Document breaking changes requiring version bump

---

## 14. Database & Persistence (Added in v3.0.0)

### 14.1 Database Design

**PostgreSQL Standards:**
- Use SQLModel for schema definition
- Follow Context7 MCP PostgreSQL documentation
- Proper foreign key relationships
- Indexes on frequently queried fields
- NOT NULL constraints for required fields
- Default values where appropriate

**Example Schema:**
```python
class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Todo(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str = Field(max_length=200)
    user_id: str = Field(foreign_key="user.id")
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 14.2 Database Connections

**Required:**
- Connection pooling via SQLModel engine
- Environment-based configuration
- Secure connection strings (never hardcode)
- Graceful connection error handling
- Connection cleanup on shutdown

### 14.3 Migrations

**Strategy:**
- Schema changes via SQLModel model updates
- `SQLModel.metadata.create_all()` for initial setup
- Document migration strategy in spec if complex changes needed
- No direct ALTER TABLE commands (use ORM)

### 14.4 Data Integrity

**Required:**
- Foreign key constraints enforced
- Cascade deletes where appropriate (e.g., user deleted → todos deleted)
- Transaction boundaries for multi-step operations
- No orphaned records
- Consistent timestamps (UTC)

---

## 15. Authentication & Authorization (Added in v3.0.0)

### 15.1 Authentication Standards

**Better-Auth Integration:**
- Follow Context7 MCP Better-Auth documentation exactly
- Email/password authentication
- Session-based (HTTP-only cookies)
- No JWT unless explicitly documented by Better-Auth
- Secure session configuration (7-day expiration, daily renewal)

**Required Flows:**
- User registration with validation
- User login with credential verification
- User logout with session invalidation
- Session persistence across requests
- Session validation on protected endpoints

### 15.2 Authorization Principles

**Backend Enforcement:**
- Authorization checks in FastAPI dependencies (never in route handlers)
- User ownership validation for all resource access
- No authorization logic in frontend (frontend only hides UI)
- Fail-secure (deny by default, allow explicitly)

**Example Dependency:**
```python
async def get_current_user(
    request: Request,
    session: Session = Depends(get_session)
) -> User:
    # Validate Better-Auth session
    # Return authenticated user or raise 401
```

### 15.3 Security Requirements

**Session Security:**
- HTTP-only cookies (no JavaScript access)
- Secure flag on cookies (HTTPS only in production)
- SameSite cookie attribute
- Session token rotation on privilege escalation
- No session fixation vulnerabilities

**Password Security:**
- Never store passwords in plain text
- Use Better-Auth's built-in hashing (bcrypt/argon2)
- No password validation on client-side only
- Rate limiting on auth endpoints (if documented)

**Authorization Security:**
- All todo endpoints require authentication
- User can only access their own todos
- Database queries filtered by user_id
- No user enumeration (generic error messages)
- SQL injection prevention via ORM (SQLModel)

---

## 16. Backend Quality Gates (Added in v3.0.0)

The backend is considered **complete only if**:

- All API endpoints documented in spec
- Authentication enforced on protected endpoints
- Authorization validated at backend layer
- Database schema matches data models
- All patterns trace to Context7 MCP documentation
- CORS configured correctly for frontend origin
- Error handling follows consistent schema
- No security vulnerabilities (SQL injection, XSS, CSRF)
- Environment variables used for secrets
- Database connections use connection pooling
- Sessions persist across server restarts
- User data isolation is 100% enforced

---

## 🎯 Final Mandate

This project must demonstrate:

- **Spec-driven engineering discipline**
- **Documentation-first correctness**
- **Production-ready full-stack architecture**
- **Secure, multi-user authentication and authorization**
- **Clean separation between frontend, backend, and data layers**

---

## Governance

This constitution supersedes all other practices and preferences. All development decisions, code reviews, and architectural choices MUST verify compliance with these principles.

### Amendment Process

1. Proposed amendments MUST be documented with rationale
2. Amendments require explicit approval before implementation
3. Version number MUST be incremented according to semantic versioning:
   - **MAJOR**: Backward incompatible governance/principle removals or redefinitions (e.g., 2.0.0 → 3.0.0 scope expansion)
   - **MINOR**: New principle/section added or materially expanded guidance
   - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements
4. All dependent templates MUST be updated to reflect amendments
5. Migration plan required for changes affecting existing code

### Compliance Review

- All PRs MUST reference constitution principles addressed
- Complexity MUST be justified against constitution constraints
- Deviations require documented ADR with approval

---

**Version**: 3.0.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-12
