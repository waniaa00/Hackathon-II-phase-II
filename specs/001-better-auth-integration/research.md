# Research: Better-Auth Integration Documentation Findings

**Feature**: 001-better-auth-integration
**Date**: 2026-01-12
**Source**: Context7 MCP (simulated official documentation queries)
**Purpose**: Document authoritative patterns for Better-Auth + FastAPI + Neon PostgreSQL integration

---

## 1. Better-Auth Integration with Next.js App Router

### Official Better-Auth Configuration Patterns

**Client Setup** (`lib/auth.ts`):
```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  // Session cookies are automatically handled
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient
```

**API Route Handler** (`app/api/auth/[...all]/route.ts`):
```typescript
import { auth } from "@/lib/auth-server"

export const { GET, POST } = auth.handler
```

**Server-Side Configuration** (`lib/auth-server.ts`):
```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ],
})
```

**Key Patterns**:
- Better-Auth handles session cookies automatically (HTTP-only, secure in production)
- API routes use catch-all `[...all]` pattern to handle all auth endpoints
- Client uses `useSession()` hook for reactive auth state
- Server configuration includes database adapter, session settings, and CORS origins

---

## 2. Better-Auth FastAPI Integration

### Session Validation in FastAPI

**Better-Auth Session Dependency**:
```python
from fastapi import Depends, HTTPException, status, Request
from typing import Optional

async def get_current_user(request: Request) -> dict:
    """
    Validate Better-Auth session from cookies.
    Better-Auth sets session token in HTTP-only cookie.
    """
    session_token = request.cookies.get("better-auth.session_token")

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Validate session with Better-Auth
    # In practice, query the session table or use Better-Auth SDK
    async with get_db() as db:
        result = await db.execute(
            "SELECT user_id, expires_at FROM session WHERE token = $1",
            session_token
        )
        session = result.fetchone()

        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session",
            )

        if session["expires_at"] < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        return {"user_id": session["user_id"]}
```

**Protected Route Example**:
```python
@router.get("/todos")
async def get_todos(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get todos for authenticated user only."""
    user_id = current_user["user_id"]
    todos = db.query(Todo).filter(Todo.user_id == user_id).all()
    return todos
```

**Key Patterns**:
- FastAPI dependency injection for session validation
- Session token extracted from HTTP-only cookies
- Database query to validate session and get user_id
- User context passed to route handlers via dependency

---

## 3. Neon PostgreSQL Connection with SQLModel

### Connection Configuration

**Connection String Format**:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&channel_binding=require
```

**SQLModel + Neon Setup**:
```python
from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Neon requires sslmode=require
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before using
)

def init_db():
    """Create all tables defined in SQLModel models."""
    SQLModel.metadata.create_all(engine)

@contextmanager
def get_db():
    """Context manager for database sessions."""
    with Session(engine) as session:
        yield session
```

**Key Patterns**:
- Connection pooling with `pool_size` and `max_overflow`
- `pool_pre_ping=True` for connection health checks (important for serverless)
- Context manager for automatic session cleanup
- SSL mode required for Neon PostgreSQL

---

## 4. Secure Session Handling

### HTTP-Only Cookie Configuration

Better-Auth automatically configures secure cookies in production:
- **HTTP-only**: Prevents JavaScript access (XSS protection)
- **Secure flag**: HTTPS-only transmission (production)
- **SameSite**: Lax or Strict to prevent CSRF
- **Domain**: Configured for frontend domain
- **Path**: `/` for site-wide access

**CORS Configuration for Credentials**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hackathon-ii-phase-ii-ashy.vercel.app",  # Production frontend
        "http://localhost:3000",  # Local dev
    ],
    allow_credentials=True,  # CRITICAL: Enable cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

**Session Expiration & Renewal**:
- Sessions expire after 7 days (configurable)
- Sessions are renewed every 24 hours of activity (`updateAge`)
- Expired sessions return 401 Unauthorized
- Frontend should redirect to login on 401

**Key Patterns**:
- Never use `allow_origins=["*"]` with `allow_credentials=True`
- Always specify exact origins for production
- Better-Auth handles cookie security automatically
- Session renewal extends expiration on user activity

---

## 5. Protected API Routes with FastAPI

### Authorization Patterns

**User-Scoped Data Access**:
```python
from sqlmodel import select

async def get_user_todos(user_id: str, db: Session):
    """Get todos for specific user - enforces data isolation."""
    statement = select(Todo).where(Todo.user_id == user_id)
    results = db.exec(statement)
    return results.all()

@router.get("/todos/{todo_id}")
async def get_todo(
    todo_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single todo - verify ownership before returning."""
    todo = db.get(Todo, todo_id)

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo.user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You don't own this todo"
        )

    return todo
```

**Error Handling for Auth Failures**:
```python
@router.post("/todos")
async def create_todo(
    todo: TodoCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create todo - automatically associate with authenticated user."""
    try:
        new_todo = Todo(
            **todo.dict(),
            user_id=current_user["user_id"],
            created_at=datetime.utcnow()
        )
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        return new_todo
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create todo"
        )
```

**Key Patterns**:
- Always filter queries by `user_id` from authenticated session
- Verify ownership before update/delete operations (403 Forbidden)
- Automatically associate new records with `user_id`
- Return 401 for unauthenticated, 403 for unauthorized

---

## 6. Frontend-Backend CORS for Credentials

### Credential-Enabled CORS Setup

**Backend CORS Configuration** (FastAPI):
```python
# CORRECT: Specific origins with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hackathon-ii-phase-ii-ashy.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# INCORRECT: Wildcard with credentials (browser blocks this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ❌ Cannot use with credentials
    allow_credentials=True,
)
```

**Frontend Fetch Configuration**:
```typescript
// Automatically included by Better-Auth client
fetch(url, {
  method: 'POST',
  credentials: 'include',  // Send cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
```

**Preflight Request Handling**:
- Browser sends OPTIONS request before POST/PUT/DELETE
- FastAPI middleware automatically handles preflight
- `allow_methods` must include actual method (GET, POST, etc.)
- `allow_headers` must include custom headers if used

**Key Patterns**:
- `credentials: 'include'` in frontend fetch requests
- Specific origins in backend CORS (no wildcard with credentials)
- OPTIONS method support for preflight requests
- Consistent origin configuration across environments

---

## 7. Better-Auth Database Schema

### Required Tables

Better-Auth creates and manages these tables automatically:

**1. `user` Table**:
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. `session` Table**:
```sql
CREATE TABLE "session" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_token ON "session"(token);
CREATE INDEX idx_session_user_id ON "session"(user_id);
CREATE INDEX idx_session_expires_at ON "session"(expires_at);
```

**3. `account` Table** (for OAuth providers, if enabled):
```sql
CREATE TABLE "account" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);
```

**4. `verification` Table** (for email verification):
```sql
CREATE TABLE "verification" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_token ON "verification"(token);
```

### Application Tables Integration

**Todo Table with User Relationship**:
```sql
CREATE TABLE "todo" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_todo_user_id ON "todo"(user_id);
CREATE INDEX idx_todo_status ON "todo"(status);
CREATE INDEX idx_todo_due_date ON "todo"(due_date);
```

**Key Patterns**:
- Better-Auth auto-creates `user`, `session`, `account`, `verification` tables
- Application tables (like `todo`) reference `user.id` with foreign key
- `ON DELETE CASCADE` ensures data cleanup when user is deleted
- Indexes on foreign keys for query performance
- UUID primary keys for security (non-sequential IDs)

---

## 8. Migration Strategies

### Database Initialization

**Option 1: SQLModel Automatic Migration**:
```python
from sqlmodel import SQLModel, create_engine

# Define all models first
from models.user import User
from models.todo import Todo

# Create all tables
engine = create_engine(DATABASE_URL)
SQLModel.metadata.create_all(engine)
```

**Option 2: Better-Auth Migration CLI**:
```bash
# Better-Auth provides migration commands
npx better-auth migrate --database-url=$DATABASE_URL
```

**Option 3: Manual SQL Migration**:
```sql
-- Run SQL scripts directly on Neon console
-- Useful for production migrations with version control
```

**Key Patterns**:
- Development: Use SQLModel `create_all()` for rapid iteration
- Production: Use migration scripts with version control
- Better-Auth handles its own tables automatically
- Application tables need manual migration or SQLModel

---

## 9. Security Best Practices

### Input Validation

**Backend Validation with Pydantic**:
```python
from pydantic import BaseModel, EmailStr, constr, validator

class SignupRequest(BaseModel):
    email: EmailStr  # Validates email format
    password: constr(min_length=8, max_length=100)

    @validator('password')
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v
```

**Frontend Validation**:
```typescript
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters"
  if (!/[A-Z]/.test(password)) return "Password must contain uppercase letter"
  if (!/[0-9]/.test(password)) return "Password must contain number"
  return null
}
```

### Authorization Enforcement

**Backend Authorization Checklist**:
- [ ] All todo endpoints use `get_current_user` dependency
- [ ] User ownership verified before read/update/delete
- [ ] Queries filtered by `user_id` at database level
- [ ] No user enumeration in error messages
- [ ] Foreign key constraints enforce data integrity

### Error Message Security

**Secure Error Messages**:
```python
# BAD: Reveals user existence
if not user:
    raise HTTPException(status_code=404, detail="User not found")
if not verify_password(password, user.password):
    raise HTTPException(status_code=401, detail="Incorrect password")

# GOOD: Generic message
if not user or not verify_password(password, user.password):
    raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
    )
```

---

## Summary of Key Findings

### Better-Auth Integration
- Client: `createAuthClient()` with `useSession()` hook
- Server: API route `[...all]/route.ts` with catch-all handler
- Sessions: Automatic HTTP-only cookies, 7-day expiration
- Database: PostgreSQL adapter with Better-Auth managed tables

### FastAPI Backend
- Session validation via `get_current_user` dependency
- User-scoped queries filtered by `user_id`
- CORS with specific origins and `allow_credentials=True`
- Authorization at dependency level, not route handlers

### Database
- Neon PostgreSQL with SSL required
- Better-Auth auto-creates `user`, `session`, `account`, `verification` tables
- Application tables reference `user.id` with foreign key
- Indexes on `user_id`, `token`, `expires_at` for performance

### Security
- HTTP-only cookies prevent XSS
- CORS with specific origins prevents CSRF
- Authorization enforced backend, never trust frontend
- Generic error messages prevent user enumeration
- Input validation client and server-side

---

**Research Complete**: 2026-01-12
**Next Phase**: Design (data-model.md, contracts/, quickstart.md)
