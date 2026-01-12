# Agent Context for Better-Auth Authentication Integration

This file provides additional context for the agent regarding Better-Auth authentication integration in the TASKIFY todo app.

## New Capabilities/Technologies

### Better-Auth Integration for Authentication & Authorization

**Feature**: 001-better-auth-integration
**Status**: Planning Complete (Phase 0 & Phase 1 artifacts generated)
**Branch**: 001-better-auth-integration
**Constitution**: v3.0.0 (expanded to include backend services)
**Tech Stack**: Next.js 14+, React 18+, TypeScript 5+, FastAPI 0.104+, Better-Auth 1.1+, Python 3.11+, Neon PostgreSQL

#### Authentication UI Components

1. **Login Page (`app/login/page.tsx`)**
   - Email/password form with validation
   - Loading state indicators
   - Error messaging
   - Redirect to dashboard on success
   - Link to signup page

2. **Signup Page (`app/signup/page.tsx`)**
   - Registration form with validation
   - Password confirmation
   - Loading state indicators
   - Error messaging
   - Redirect options after success

3. **Auth Provider (`components/auth/AuthProvider.tsx`)**
   - Context provider for auth state
   - Centralized authentication logic
   - Session management
   - Loading/error states

#### Protected Routing

1. **Protected Route Component (`components/auth/ProtectedRoute.tsx`)**
   - Wrapper for authenticated-only pages
   - Redirects unauthenticated users to login
   - Session validation
   - Loading state during auth check

2. **Route Guarding Pattern**
   - Higher-order component approach
   - Context-based auth state checking
   - Automatic redirects
   - Session expiration handling

#### API Client Integration

1. **Centralized API Client (`lib/api/client.ts`)**
   - Base configuration for all API calls
   - Auth header injection
   - Error handling and normalization
   - Request/response interceptors

2. **Auth API Module (`lib/api/auth.ts`)**
   - Login, signup, logout functions
   - Session token management
   - Error handling for auth operations

3. **Todo API Module (`lib/api/todos.ts`)**
   - CRUD operations for todos
   - Response type safety
   - Error handling for todo operations

#### State Management

1. **Auth Context (`context/AuthContext.tsx`)**
   - Global authentication state
   - User information storage
   - Authentication methods (login, logout, etc.)
   - Loading and error states

2. **Todo State Management**
   - TanStack Query for server state
   - Caching and background updates
   - Optimistic updates
   - Error handling and retries

#### Component Reuse Strategy

- **UI Components**: Button, Input, Card, Alert from `components/ui/`
- **Form Components**: ControlledInput, FormError from `components/forms/`
- **Loading Components**: LoadingSpinner from `components/loading/`
- **Auth Components**: AuthProvider, ProtectedRoute from `components/auth/`

#### Data Types & Contracts

- **Type Definitions**: Defined in `lib/types/` with auth.ts and todos.ts
- **API Contracts**: Defined in `contracts/` with auth-contract.ts and todo-contract.ts
- **Response Interfaces**: Standardized across frontend and backend
- **Error Types**: Consistent error handling across the application

#### Integration Patterns

1. **Next.js App Router Integration**
   - Client components for dynamic UI
   - Server components for static content
   - Layout and loading boundaries
   - Route protection patterns

2. **Better-Auth Integration**
   - Session management following official docs
   - Secure token handling
   - Middleware integration
   - API route protection

3. **TanStack Query Integration**
   - Server state management
   - Caching and background updates
   - Optimistic updates for better UX
   - Error handling and retries

#### Security Considerations

- **Session Management**: Following Better-Auth best practices
- **Token Storage**: Secure storage according to official docs
- **CORS Configuration**: Proper backend configuration
- **Input Validation**: Client and server-side validation
- **Error Handling**: No sensitive information exposure

#### Error Handling & UX

1. **Form Validation**
   - Client-side validation with immediate feedback
   - Controlled components for predictability
   - Error message display
   - Submission prevention for invalid forms

2. **API Error Handling**
   - Centralized error normalization
   - User-friendly error messages
   - Retry mechanisms where appropriate
   - Loading and error state management

3. **Loading State Management**
   - Component-level loading indicators
   - Skeleton UI patterns
   - Submission disable during processing
   - Smooth transitions

#### Performance Considerations

- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: TanStack Query caching strategies
- **Bundle Optimization**: Tree-shaking and dynamic imports
- **API Efficiency**: Optimistic updates and background refetching
- **Component Optimization**: Memoization where appropriate

#### TypeScript Contracts

- **Interfaces**: AuthState, TodoApiResponse, etc. in data-model.md
- **Type Safety**: Full type checking across API boundaries
- **Contract Validation**: Compile-time checking of API contracts
- **Documentation**: JSDoc comments for all exported functions

#### Documentation References

All patterns derived from Context7 MCP documentation:
- Next.js App Router: File-system routing, layouts, client components
- React: Context API, hooks, composition patterns
- Better-Auth: Integration with Next.js App Router, session management
- TanStack Query: Server state management, caching, optimistic updates
- TypeScript: Type safety, interfaces, generics
- MDN: Fetch API, security best practices

#### Planning Artifacts Generated

All planning phase artifacts have been completed and are located in `specs/001-better-auth-integration/`:

1. **plan.md** - Implementation plan with constitutional compliance verification
   - Status: ✅ Approved under constitution v3.0.0
   - Technical context documented
   - All gates passing (documentation sources, scope, technology, quality)
   - Implementation priorities defined (P1/P2)
   - Security checklist included

2. **research.md** - Documentation research findings (Phase 0)
   - Better-Auth integration patterns for Next.js App Router and FastAPI
   - Neon PostgreSQL connection configuration with SQLModel
   - Session management and security best practices
   - Protected API route patterns with FastAPI dependencies
   - CORS configuration for credentials
   - Database schema requirements

3. **data-model.md** - Entity definitions and relationships (Phase 1)
   - User entity (Better-Auth managed)
   - Session entity (Better-Auth managed)
   - Todo entity (application managed, enhanced with user_id FK)
   - Entity relationship diagram
   - Database schema (SQL)
   - API request/response models
   - Data validation rules
   - Migration strategies

4. **contracts/auth-contract.ts** - Authentication API contract (Phase 1)
   - Signup, login, logout, session endpoints
   - Request/response TypeScript interfaces
   - Error response schemas
   - Security notes and patterns
   - API client interface for frontend

5. **contracts/todo-contract.ts** - Todo API contract with authorization (Phase 1)
   - CRUD endpoints with user-scoped access
   - Query parameters for filtering/pagination
   - Authorization enforcement patterns
   - Ownership verification logic
   - User isolation guarantees

6. **quickstart.md** - Setup and usage guide (Phase 1)
   - Environment setup instructions
   - Database configuration (Neon PostgreSQL)
   - Backend setup (FastAPI + Better-Auth)
   - Frontend setup (Next.js + Better-Auth client)
   - Testing authentication flows
   - Common issues and solutions
   - API usage examples

#### Key Implementation Patterns

**Better-Auth Client Configuration** (`lib/auth.ts`):
```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
```

**Better-Auth Server Configuration** (`lib/auth-server.ts`):
```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
})
```

**FastAPI Session Validation Dependency** (`backend/dependencies/auth.py`):
```python
from fastapi import Depends, HTTPException, status, Request

async def get_current_user(request: Request) -> dict:
    session_token = request.cookies.get("better-auth.session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Validate session from database
    # Return user_id for authorization
    return {"user_id": validated_user_id}
```

**Protected Todo Endpoint** (`backend/routers/todos.py`):
```python
@router.get("/todos")
async def get_todos(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]
    todos = db.query(Todo).filter(Todo.user_id == user_id).all()
    return todos
```

**CORS Configuration for Credentials** (`backend/main.py`):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hackathon-ii-phase-ii-ashy.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,  # CRITICAL for session cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Database Schema

**Better-Auth Managed Tables** (auto-created):
- `user` - User accounts (id, email, email_verified, name, created_at, updated_at)
- `session` - Authentication sessions (id, user_id, token, expires_at, ip_address, user_agent)
- `account` - OAuth provider accounts (if OAuth enabled)
- `verification` - Email verification tokens

**Application Tables**:
- `todo` - User todos with authorization (id, user_id FK, title, description, status, priority, due_date, tags, is_recurring, frequency, interval, created_at, updated_at)

**Key Indexes**:
- `idx_session_token` on `session.token` (for session validation)
- `idx_todo_user_id` on `todo.user_id` (for user-scoped queries)
- `idx_todo_user_status` on `(todo.user_id, todo.status)` (for filtered queries)

#### Security Model

**Session Security**:
- HTTP-only cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- 7-day expiration with 24-hour renewal
- Cryptographically secure tokens

**Authorization Enforcement**:
- All todo endpoints use `get_current_user` dependency
- Database queries ALWAYS filtered by `user_id`
- Ownership verified before update/delete operations
- Returns 403 Forbidden for cross-user access attempts
- Foreign key constraints enforce referential integrity

**Input Validation**:
- Client-side validation (email format, password strength)
- Server-side validation (Pydantic models)
- SQL injection prevention (SQLModel ORM with parameterized queries)
- Generic error messages (no user enumeration)

#### Environment Configuration

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=https://hackathon-ii-phase-ii.onrender.com
BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
BETTER_AUTH_SECRET=<secret>
DATABASE_URL=<neon-postgresql-connection-string>
```

**Backend** (`.env`):
```env
DATABASE_URL=<neon-postgresql-connection-string>
FRONTEND_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
PORT=8000
```

#### Implementation Status

- ✅ **Phase 0 Complete**: Research documentation (research.md)
- ✅ **Phase 1 Complete**: Design artifacts (data-model.md, contracts/, quickstart.md)
- ✅ **Planning Approved**: Constitution v3.0.0 compliant, all gates passing
- ⏳ **Phase 2 Pending**: Task generation (`/sp.tasks` command)
- ⏳ **Implementation Pending**: Will follow tasks.md in priority order (P1→P2)

#### Next Steps

1. Execute `/sp.tasks` command to generate implementation tasks
2. Implement tasks in priority order:
   - **P1 Tasks**: Database setup, backend auth config, session validation, frontend UI, auth context, protected routes, authorization enforcement
   - **P2 Tasks**: Logout functionality, auth state display, session expiration handling, error messaging
3. Test each component incrementally
4. Deploy to staging/production

#### Related Features

- **Constitutional Change**: Constitution v2.0.0 → v3.0.0 (MAJOR) to allow backend services
- **Database**: Neon PostgreSQL already provisioned and configured
- **Deployment**: Frontend on Vercel, backend on Render (already configured)