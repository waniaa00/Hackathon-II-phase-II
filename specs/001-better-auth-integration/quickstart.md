# Quickstart Guide: Better-Auth Integration

**Feature**: 001-better-auth-integration
**Date**: 2026-01-12
**Status**: Implementation Guide

This guide provides step-by-step instructions for setting up and using the Better-Auth authentication system with the Todo application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing Authentication](#testing-authentication)
8. [Common Issues](#common-issues)
9. [API Usage Examples](#api-usage-examples)

---

## Prerequisites

**Required Software:**
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL client (optional, for database inspection)
- Git

**Accounts:**
- Neon PostgreSQL account (already configured)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

**Existing Infrastructure:**
- Neon PostgreSQL database (provisioned)
- Frontend deployed on Vercel
- Backend deployed on Render

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Hackathon-II/phase-II
git checkout 001-better-auth-integration
```

### 2. Environment Variables

Create/update `.env.local` (frontend):

```env
# Frontend environment variables
NEXT_PUBLIC_API_URL=https://hackathon-ii-phase-ii.onrender.com

# Better-Auth configuration
BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
BETTER_AUTH_SECRET=7b4741f835aacfc5d8f44218c0c8937ee73ddb73d1b6131c0cec4e433463b190

# Database (for Better-Auth server-side)
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-wild-rain-ahxe8z1r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Create/update `.env` (backend):

```env
# Backend environment variables
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-wild-rain-ahxe8z1r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# CORS origins (update with your frontend URL)
FRONTEND_URL=https://hackathon-ii-phase-ii-ashy.vercel.app

# Optional: Server configuration
PORT=8000
DEBUG=False
```

### 3. Generate Better-Auth Secret

If you need to generate a new secret:

```bash
# Using openssl
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Database Configuration

### Option 1: Automatic Initialization (Recommended)

Better-Auth will automatically create required tables on first run:

```bash
# Backend will create tables on startup
npm run dev  # or python -m uvicorn backend.main:app --reload
```

Better-Auth creates these tables automatically:
- `user` - User accounts
- `session` - Authentication sessions
- `account` - OAuth accounts (if enabled)
- `verification` - Email verification tokens

### Option 2: Manual SQL Migration

If you prefer manual control, run SQL directly on Neon console:

```sql
-- Create Better-Auth tables
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_token ON "session"(token);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON "session"(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON "session"(expires_at);

-- Create application tables
CREATE TYPE todo_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE IF NOT EXISTS "todo" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status todo_status DEFAULT 'pending' NOT NULL,
  priority todo_priority DEFAULT 'medium' NOT NULL,
  due_date TIMESTAMPTZ,
  tags TEXT[],
  is_recurring BOOLEAN DEFAULT FALSE,
  frequency recurrence_frequency,
  interval INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todo_user_id ON "todo"(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_status ON "todo"(status);
CREATE INDEX IF NOT EXISTS idx_todo_due_date ON "todo"(due_date);
CREATE INDEX IF NOT EXISTS idx_todo_user_status ON "todo"(user_id, status);
```

### Verify Database Tables

```bash
# Using psql (if installed)
psql $DATABASE_URL -c "\dt"

# Expected output:
# - user
# - session
# - account
# - verification
# - todo
```

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Required packages** (should be in requirements.txt):
```
fastapi==0.104.0
uvicorn[standard]==0.24.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
better-auth==1.1.0
pydantic[email]==2.5.0
python-dotenv==1.0.0
```

### 2. Configure Better-Auth Backend

Create `backend/lib/auth_server.py`:

```python
from better_auth import betterAuth
from psycopg2.pool import SimpleConnectionPool
import os

pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    dsn=os.getenv("DATABASE_URL")
)

auth = betterAuth({
    "database": pool,
    "emailAndPassword": {
        "enabled": True,
        "minPasswordLength": 8,
    },
    "session": {
        "expiresIn": 60 * 60 * 24 * 7,  # 7 days
        "updateAge": 60 * 60 * 24,  # Update every 24 hours
        "cookieCache": {
            "enabled": True,
            "maxAge": 60 * 5,  # 5 minutes
        },
    },
    "secret": os.getenv("BETTER_AUTH_SECRET"),
    "baseURL": os.getenv("BETTER_AUTH_URL"),
    "trustedOrigins": [
        os.getenv("FRONTEND_URL"),
        "http://localhost:3000",
    ],
})
```

### 3. Session Validation Dependency

Create `backend/dependencies/auth.py`:

```python
from fastapi import Depends, HTTPException, status, Request
from datetime import datetime

async def get_current_user(request: Request) -> dict:
    """
    Validate Better-Auth session from cookies.
    Returns user context or raises 401.
    """
    session_token = request.cookies.get("better-auth.session_token")

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    # Query session from database
    # (Implementation will use Better-Auth SDK or direct DB query)
    # For now, placeholder:
    from backend.database import get_db

    async with get_db() as db:
        result = await db.execute(
            "SELECT user_id, expires_at FROM session WHERE token = $1",
            session_token
        )
        session = result.fetchone()

        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session"
            )

        if session["expires_at"] < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired"
            )

        return {"user_id": session["user_id"]}
```

### 4. Update CORS Configuration

In `backend/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hackathon-ii-phase-ii-ashy.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,  # CRITICAL for cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### 5. Run Backend Development Server

```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python module
python -m uvicorn backend.main:app --reload
```

Backend should be running at `http://localhost:8000`

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd ..  # Back to project root
npm install
```

**Required packages**:
```bash
npm install better-auth@1.1.0
npm install @tanstack/react-query
npm install pg @types/pg  # For Better-Auth database adapter
```

### 2. Configure Better-Auth Client

Create `lib/auth.ts`:

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient
```

### 3. Create Auth API Route

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/lib/auth-server"

export const { GET, POST } = auth.handler
```

Create `lib/auth-server.ts`:

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
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ],
})
```

### 4. Create Auth Context Provider

Create `context/AuthContext.tsx`:

```typescript
"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useSession } from '@/lib/auth'

interface AuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 5. Create Auth Pages

**Login Page** (`app/login/page.tsx`):

```typescript
"use client"

import { useState } from 'react'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn.email({ email, password })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

**Signup Page** (`app/signup/page.tsx`):

```typescript
"use client"

import { useState } from 'react'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signUp.email({ email, password, name })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            minLength={8}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
```

### 6. Create Protected Route Component

Create `components/auth/ProtectedRoute.tsx`:

```typescript
"use client"

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

### 7. Run Frontend Development Server

```bash
npm run dev
```

Frontend should be running at `http://localhost:3000`

---

## Running the Application

### Local Development

**Terminal 1 - Backend**:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

**Access Points**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Deployment

**Backend (Render)**:
1. Push code to GitHub branch
2. Render auto-deploys from branch
3. Ensure environment variables are set in Render dashboard

**Frontend (Vercel)**:
1. Push code to GitHub branch
2. Vercel auto-deploys from branch
3. Ensure environment variables are set in Vercel dashboard

---

## Testing Authentication

### 1. User Registration Flow

```bash
# Using curl
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }' \
  -c cookies.txt

# Check cookies.txt for session token
```

### 2. User Login Flow

```bash
# Using curl
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }' \
  -c cookies.txt
```

### 3. Protected Endpoint Test

```bash
# Get todos (requires authentication)
curl -X GET http://localhost:8000/api/v1/todos \
  -b cookies.txt

# Should return user's todos or 401 if not authenticated
```

### 4. Frontend Testing Checklist

- [ ] Visit http://localhost:3000/signup
- [ ] Register a new account
- [ ] Verify redirect to dashboard
- [ ] Check browser DevTools → Application → Cookies for `better-auth.session_token`
- [ ] Logout
- [ ] Try accessing /dashboard without authentication (should redirect to login)
- [ ] Login with created account
- [ ] Verify session persists after page refresh
- [ ] Create a todo
- [ ] Verify todo is associated with your user

---

## Common Issues

### Issue 1: "Module not found: Can't resolve 'pg'"

**Solution**:
```bash
npm install pg @types/pg
```

### Issue 2: CORS Error - "Access-Control-Allow-Origin"

**Problem**: Backend CORS uses wildcard `*` with credentials.

**Solution**: Update backend CORS to specific origins:
```python
allow_origins=[
    "https://hackathon-ii-phase-ii-ashy.vercel.app",
    "http://localhost:3000",
],
allow_credentials=True,
```

### Issue 3: Session Cookie Not Sent

**Problem**: Frontend not sending cookies cross-origin.

**Solution**: Ensure `credentials: 'include'` in fetch requests:
```typescript
fetch(url, {
  credentials: 'include',
  // ...
})
```

Better-Auth client handles this automatically.

### Issue 4: Database Connection Error

**Problem**: Cannot connect to Neon PostgreSQL.

**Solution**: Verify DATABASE_URL:
- Includes `sslmode=require`
- Includes `channel_binding=require`
- Connection string is correct (check Neon dashboard)

### Issue 5: Session Expired Immediately

**Problem**: Session expires on every request.

**Solution**: Check `session.expiresIn` configuration:
```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  updateAge: 60 * 60 * 24, // Renew every 24 hours
}
```

### Issue 6: "Not authenticated" on Protected Routes

**Problem**: Session validation failing.

**Solution**:
1. Verify session token exists in cookies
2. Check backend session validation logic
3. Ensure `get_current_user` dependency is applied to routes
4. Verify database session table has valid records

---

## API Usage Examples

### Frontend API Client

Create `lib/api/todos.ts`:

```typescript
import { TodoAPI, CreateTodoRequest, UpdateTodoRequest } from '@/specs/001-better-auth-integration/contracts/todo-contract'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const todosAPI: TodoAPI = {
  async getTodos(query) {
    const params = new URLSearchParams(query as any)
    const res = await fetch(`${API_URL}/api/v1/todos?${params}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch todos')
    return res.json()
  },

  async getTodo(id) {
    const res = await fetch(`${API_URL}/api/v1/todos/${id}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch todo')
    return res.json()
  },

  async createTodo(data: CreateTodoRequest) {
    const res = await fetch(`${API_URL}/api/v1/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create todo')
    return res.json()
  },

  async updateTodo(id, data: UpdateTodoRequest) {
    const res = await fetch(`${API_URL}/api/v1/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update todo')
    return res.json()
  },

  async deleteTodo(id) {
    const res = await fetch(`${API_URL}/api/v1/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete todo')
    return res.json()
  },
}
```

### Using in React Components

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { todosAPI } from '@/lib/api/todos'

function TodoList() {
  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todosAPI.getTodos({ status: 'pending' }),
  })

  const createMutation = useMutation({
    mutationFn: todosAPI.createTodo,
    onSuccess: () => {
      // Refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {data?.items.map(todo => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  )
}
```

---

## Next Steps

After completing this quickstart:

1. **Run `/sp.tasks` command** to generate implementation tasks
2. **Follow task order** (P1 → P2 → P3)
3. **Test each component** as it's implemented
4. **Deploy incrementally** to staging/production

---

**Quickstart Complete**: 2026-01-12
**Next Command**: `/sp.tasks` (generate implementation tasks)
