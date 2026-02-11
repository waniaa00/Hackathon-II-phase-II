# Implementation Plan: Todo App Frontend & UI

**Branch**: `009-frontend-ui` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-frontend-ui/spec.md`

## Summary

Build a responsive, accessible frontend for the Todo application using Next.js 16+ with App Router. The frontend integrates with the existing backend API (008-backend-api) and Better Auth authentication system, providing complete task management functionality including filtering, sorting, priorities, tags, due dates, recurring tasks, and browser notifications.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode
**Framework**: Next.js 16+ with App Router
**Primary Dependencies**: Better Auth (client), TailwindCSS, shadcn/ui, date-fns, react-hook-form, zod
**Storage**: N/A (backend API provides persistence)
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Web application (frontend only, integrates with existing backend)
**Performance Goals**: Task list loads < 2s for 100 tasks, UI feedback < 200ms
**Constraints**: Mobile-first responsive (320px minimum), WCAG 2.1 AA accessibility
**Scale/Scope**: Up to 500 tasks per user, 10 user stories, 38 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following /sp.specify → /sp.plan → /sp.tasks workflow |
| II. Security First | ✅ PASS | JWT auth via Better Auth, tokens attached to all requests |
| III. Accuracy & Completeness | ✅ PASS | All 38 FRs mapped to implementation tasks |
| IV. Usability & Responsiveness | ✅ PASS | Mobile-first design, loading states, error handling |
| V. Incremental Feature Growth | ✅ PASS | P1 (MVP) → P2 (Enhanced) → P3 (Advanced) |
| VI. RESTful API Standards | ✅ PASS | Frontend consumes existing REST API |
| VII. JWT Authentication | ✅ PASS | Better Auth client handles token management |
| VIII. Database Integrity | N/A | Frontend only - handled by backend |
| IX. Code Traceability | ✅ PASS | PHR created for all significant changes |
| X. Frontend Standards | ✅ PASS | Next.js 16+ App Router, TypeScript strict mode |
| XI. Backend Standards | N/A | Frontend only |
| XII. Task Feature Compliance | ✅ PASS | All Basic + Intermediate + some Advanced features |

**Gate Status**: ✅ PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/009-frontend-ui/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - frontend types/interfaces
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output - API client types
│   └── api-client.ts    # TypeScript API client interface
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/              # Dashboard route group (with layout)
│   │   ├── layout.tsx            # Dashboard layout with sidebar/nav
│   │   ├── page.tsx              # Task list (main dashboard)
│   │   ├── tasks/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Task detail/edit
│   │   │   └── new/
│   │   │       └── page.tsx      # Create task
│   │   └── tags/
│   │       └── page.tsx          # Tag management
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx             # 404 page
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── calendar.tsx
│   │   └── toast.tsx
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── logout-button.tsx
│   ├── tasks/                    # Task components
│   │   ├── task-list.tsx
│   │   ├── task-item.tsx
│   │   ├── task-form.tsx
│   │   ├── task-filters.tsx
│   │   ├── task-sort.tsx
│   │   ├── task-search.tsx
│   │   ├── priority-badge.tsx
│   │   └── tag-badge.tsx
│   ├── tags/                     # Tag management
│   │   ├── tag-list.tsx
│   │   ├── tag-form.tsx
│   │   └── tag-picker.tsx
│   └── shared/                   # Shared components
│       ├── empty-state.tsx
│       ├── loading-spinner.tsx
│       ├── error-message.tsx
│       └── date-picker.tsx
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts             # Base fetch wrapper with auth
│   │   ├── tasks.ts              # Task API functions
│   │   ├── tags.ts               # Tag API functions
│   │   └── priorities.ts         # Priority API functions
│   ├── auth/                     # Better Auth integration
│   │   ├── client.ts             # Better Auth client config
│   │   └── hooks.ts              # useSession, useAuth hooks
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-tasks.ts
│   │   ├── use-tags.ts
│   │   ├── use-priorities.ts
│   │   └── use-notifications.ts
│   ├── utils/                    # Utility functions
│   │   ├── date.ts               # Date formatting
│   │   ├── cn.ts                 # Class name utility
│   │   └── validation.ts         # Zod schemas
│   └── types/                    # TypeScript types
│       ├── task.ts
│       ├── tag.ts
│       ├── priority.ts
│       └── api.ts
├── styles/
│   └── globals.css               # Tailwind + custom styles
├── public/
│   └── icons/
├── tests/
│   ├── components/               # Component tests
│   ├── hooks/                    # Hook tests
│   └── e2e/                      # Playwright E2E tests
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

**Structure Decision**: Web application frontend structure using Next.js 16+ App Router with route groups for auth (`(auth)`) and authenticated dashboard (`(dashboard)`). Components organized by feature domain (auth, tasks, tags, shared) with centralized API client and type definitions.

## Architecture Decisions

### AD-001: Next.js App Router with Route Groups

**Decision**: Use Next.js App Router with route groups `(auth)` and `(dashboard)` to separate public/private layouts.

**Rationale**:
- Server Components by default improve performance
- Route groups enable different layouts without URL nesting
- Built-in loading/error states align with constitution requirements

**Alternatives Rejected**:
- Pages Router: Older pattern, less performant, lacks native loading states
- Single layout: Doesn't allow different auth/dashboard layouts cleanly

### AD-002: Better Auth Client Integration

**Decision**: Use Better Auth official React client with session hooks for authentication state.

**Rationale**:
- Native integration with Better Auth backend
- Handles token refresh automatically
- Provides useSession hook for auth state

**Alternatives Rejected**:
- Manual JWT handling: Error-prone, duplicates Better Auth functionality
- NextAuth: Different auth system than backend uses

### AD-003: shadcn/ui + TailwindCSS for UI

**Decision**: Use shadcn/ui component library with TailwindCSS for styling.

**Rationale**:
- Copy-paste components (not dependency lock-in)
- Built on Radix UI (accessible by default)
- TailwindCSS matches constitution standards
- Fully customizable and theme-able

**Alternatives Rejected**:
- Material UI: Heavier, harder to customize
- Chakra UI: Additional runtime, less flexible
- Custom components: Time-consuming, accessibility burden

### AD-004: API Client with Fetch Wrapper

**Decision**: Create custom fetch wrapper that automatically attaches JWT from Better Auth session.

**Rationale**:
- Full control over request/response handling
- Integrates directly with Better Auth token
- No additional dependency needed

**Alternatives Rejected**:
- Axios: Additional dependency for minimal benefit
- SWR/React Query: Adds complexity; simple fetch sufficient for MVP

### AD-005: React Hook Form + Zod for Forms

**Decision**: Use React Hook Form with Zod validation for all forms.

**Rationale**:
- Performant (uncontrolled inputs)
- Type-safe validation with Zod
- Good developer experience

**Alternatives Rejected**:
- Formik: Less performant, larger bundle
- Native forms: No validation, poor DX

## Complexity Tracking

No constitution violations requiring justification.

## Dependencies

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^16.0.0 | Framework |
| react | ^19.0.0 | UI library |
| typescript | ^5.0.0 | Type safety |
| tailwindcss | ^3.4.0 | Styling |
| @radix-ui/* | latest | Accessible primitives |
| better-auth | latest | Auth client |
| react-hook-form | ^7.0.0 | Form handling |
| zod | ^3.0.0 | Validation |
| date-fns | ^3.0.0 | Date formatting |
| class-variance-authority | latest | Component variants |
| clsx | latest | Class concatenation |
| lucide-react | latest | Icons |

### Internal Dependencies

- **008-backend-api**: REST API at `NEXT_PUBLIC_API_URL`
- **Better Auth Server**: Auth endpoints at `NEXT_PUBLIC_AUTH_URL`

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/auth

# Better Auth
BETTER_AUTH_SECRET=<from-backend>
BETTER_AUTH_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_APP_NAME="Todo App"
```

## Implementation Phases

### Phase 1: Foundation (P1 - MVP)

1. Project setup with Next.js 16+, TypeScript, TailwindCSS
2. Better Auth client integration
3. Auth pages (login, signup)
4. Protected route middleware
5. Basic task list and CRUD

### Phase 2: Core Features (P1 continued)

6. Task completion toggle
7. Task detail/edit views
8. Empty states and loading indicators
9. Error handling and toasts

### Phase 3: Enhanced UX (P2)

10. Filtering by status, priority, tag
11. Sorting options
12. Search functionality
13. Priority and tag assignment
14. Due date picker

### Phase 4: Advanced Features (P2-P3)

15. Tag management page
16. Recurring task UI
17. Overdue/due-today indicators
18. Browser notifications
19. Mobile responsive refinements

### Phase 5: Polish

20. Accessibility audit and fixes
21. Performance optimization
22. Documentation
