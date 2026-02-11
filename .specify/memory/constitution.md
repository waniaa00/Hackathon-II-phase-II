<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial constitution establishment)

  Modified principles: N/A (new document)

  Added sections:
    - 12 Core Principles (I through XII)
    - Technology Stack section
    - Development Workflow section
    - Governance section

  Removed sections: N/A (new document)

  Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
    - .specify/templates/spec-template.md: ✅ Compatible (user stories align with principles)
    - .specify/templates/tasks-template.md: ✅ Compatible (phase structure supports workflow)

  Deferred TODOs: None
-->

# Full-Stack Todo App Hackathon Constitution

## Core Principles

### I. Spec-Driven Development

All implementation MUST follow generated specifications. No manual coding outside Claude Code is permitted.

- Every feature begins with a specification document (`/sp.specify`)
- Implementation plans MUST be generated before coding (`/sp.plan`)
- Tasks MUST be generated from plans (`/sp.tasks`)
- Code changes MUST trace back to a specification requirement
- Rationale: Ensures consistency, traceability, and prevents scope creep

### II. Security First

User authentication and task data isolation via JWT and Better Auth are non-negotiable.

- All API endpoints MUST require valid JWT authentication
- Task data MUST be isolated per user; cross-user access is forbidden
- JWT secret MUST be stored in environment variable `BETTER_AUTH_SECRET`
- Passwords MUST be hashed; plaintext storage is forbidden
- All authentication failures MUST return 401 Unauthorized
- Rationale: Protects user data and prevents unauthorized access

### III. Accuracy & Completeness

All API endpoints and frontend features MUST work exactly as specified.

- Endpoints MUST accept documented inputs and return documented outputs
- Error responses MUST follow consistent JSON structure
- All documented features MUST be functional; partial implementations are forbidden
- Edge cases identified in specifications MUST be handled
- Rationale: Ensures reliable, production-ready functionality

### IV. Usability & Responsiveness

Intuitive UI and seamless multi-device support are required.

- Frontend MUST be responsive across desktop, tablet, and mobile viewports
- UI interactions MUST provide immediate visual feedback
- Error messages MUST be user-friendly and actionable
- Loading states MUST be displayed during async operations
- Rationale: Delivers positive user experience across all devices

### V. Incremental Feature Growth

Core features first, then intermediate, then advanced enhancements.

- Basic Level features MUST be complete before Intermediate features
- Intermediate features MUST be complete before Advanced features
- Each level MUST be independently testable and deployable
- Feature additions MUST NOT break existing functionality
- Rationale: Enables progressive delivery and reduces risk

### VI. RESTful API Standards

All endpoints MUST adhere to REST conventions.

- Use appropriate HTTP methods: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove)
- URLs MUST represent resources, not actions
- Response status codes MUST match operation outcomes (200, 201, 400, 401, 404, 500)
- Required endpoints:
  - `GET /api/{user_id}/tasks` - List all tasks
  - `POST /api/{user_id}/tasks` - Create task
  - `GET /api/{user_id}/tasks/{id}` - Get single task
  - `PUT /api/{user_id}/tasks/{id}` - Update task
  - `DELETE /api/{user_id}/tasks/{id}` - Delete task
  - `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion
- Rationale: Ensures consistent, predictable API behavior

### VII. JWT Authentication Enforcement

Every request MUST include a valid token; invalid requests return 401 Unauthorized.

- Middleware MUST validate JWT on every protected route
- Token expiration MUST be enforced
- User ID from token MUST match route parameter `{user_id}`
- Token refresh mechanism MUST be implemented
- Rationale: Prevents unauthorized access and session hijacking

### VIII. Database Integrity

Task operations MUST enforce user ownership and data consistency in Neon PostgreSQL.

- All queries MUST filter by authenticated user ID
- Foreign key constraints MUST be enforced
- Task IDs MUST be unique per user
- Deletions MUST be soft or hard based on specification
- Database migrations MUST be versioned and reversible
- Rationale: Maintains data consistency and prevents corruption

### IX. Code Traceability

All specs, plans, and tasks MUST be documented and reviewable.

- Every code change MUST reference a task ID
- Prompt History Records (PHRs) MUST be created for significant interactions
- Architecture Decision Records (ADRs) MUST document significant choices
- Git commits MUST reference related specification artifacts
- Rationale: Enables auditability and knowledge preservation

### X. Frontend Standards

Next.js 16+ App Router with responsive design and proper error handling.

- Use App Router (`app/` directory) architecture
- Server Components by default; Client Components only when necessary
- Implement proper error boundaries and loading states
- Follow accessibility best practices (ARIA labels, keyboard navigation)
- Use TypeScript with strict mode enabled
- Rationale: Leverages modern Next.js patterns for performance and maintainability

### XI. Backend Standards

FastAPI with SQLModel ORM; middleware to verify JWT and extract user info.

- Use async/await patterns for I/O operations
- Implement Pydantic models for request/response validation
- Use SQLModel for database operations with Neon PostgreSQL
- Middleware MUST extract and validate user from JWT
- Implement proper exception handling with consistent error responses
- Rationale: Ensures type-safe, performant backend implementation

### XII. Task Feature Compliance

MUST implement all Basic Level features; Intermediate and Advanced features are optional but encouraged.

**Basic Level (Required):**
- User authentication (signup, login, logout)
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Task list display with completion status

**Intermediate Level (Encouraged):**
- Task filtering (all, active, completed)
- Task sorting (date, priority, alphabetical)
- Search functionality
- Due dates on tasks

**Advanced Level (Optional):**
- Recurring tasks
- Task categories/tags
- Reminders/notifications
- Data export

- Rationale: Defines clear feature tiers with mandatory baseline

## Technology Stack

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Frontend | Next.js | 16+ with App Router |
| Backend | FastAPI | Latest stable |
| ORM | SQLModel | Latest stable |
| Database | Neon PostgreSQL | Cloud-hosted |
| Authentication | Better Auth | JWT-based |
| Styling | TailwindCSS | Responsive design |

## Development Workflow

### Spec-Kit Plus Flow

1. **Specification** (`/sp.specify`): Define feature requirements and acceptance criteria
2. **Planning** (`/sp.plan`): Generate implementation plan with architecture decisions
3. **Tasks** (`/sp.tasks`): Generate actionable, dependency-ordered task list
4. **Implementation** (`/sp.implement`): Execute tasks via Claude Code
5. **Documentation** (`/sp.phr`): Record prompt history for traceability

### Quality Gates

- [ ] Specification approved before planning
- [ ] Plan reviewed before task generation
- [ ] Tests written before implementation (when applicable)
- [ ] Code passes linting and type checking
- [ ] All acceptance criteria verified
- [ ] PHR created for significant changes

### Branch Strategy

- Main branch: `main` (protected)
- Feature branches: `###-feature-name` (e.g., `001-todo-app-setup`)
- All changes via pull request with review

## Governance

### Amendment Process

1. Propose change with rationale
2. Document impact on existing specifications
3. Update constitution version following semantic versioning
4. Update dependent templates if affected
5. Record change in Sync Impact Report

### Versioning Policy

- **MAJOR**: Breaking changes to principles or required features
- **MINOR**: New principles added or existing expanded
- **PATCH**: Clarifications, typos, non-semantic refinements

### Compliance Review

- All PRs MUST verify alignment with constitution principles
- Complexity beyond specification MUST be justified
- Constitution supersedes conflicting local decisions
- Violations require documented exception or constitution amendment

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
