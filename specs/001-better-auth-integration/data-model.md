# Data Model: Better-Auth Integration

**Feature**: 001-better-auth-integration
**Date**: 2026-01-12
**Status**: Design Phase
**Source**: Derived from spec.md requirements and research.md patterns

---

## Overview

This data model defines the entities, relationships, and database schema for Better-Auth authentication integration with the Todo application. The model includes both Better-Auth managed tables (user, session) and application-specific tables (todo).

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     User        │
│  (Better-Auth)  │
├─────────────────┤
│ id: UUID PK     │
│ email: String   │
│ email_verified  │
│ name: String?   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐         ┌─────────────────┐
│    Session      │         │      Todo       │
│  (Better-Auth)  │         │ (Application)   │
├─────────────────┤         ├─────────────────┤
│ id: UUID PK     │         │ id: UUID PK     │
│ user_id: UUID FK│────────▶│ user_id: UUID FK│
│ token: String   │         │ title: String   │
│ expires_at      │         │ description     │
│ ip_address      │         │ status: Enum    │
│ user_agent      │         │ priority: Enum  │
│ created_at      │         │ due_date        │
│ updated_at      │         │ tags: Array     │
└─────────────────┘         │ is_recurring    │
                            │ frequency       │
                            │ interval        │
                            │ created_at      │
                            │ updated_at      │
                            └─────────────────┘

Relationships:
- User → Session: 1:N (one user can have multiple active sessions)
- User → Todo: 1:N (one user owns many todos)
- Session → User: N:1 (many sessions belong to one user)
- Todo → User: N:1 (many todos belong to one user)
```

---

## Entity Definitions

### 1. User Entity (Better-Auth Managed)

**Purpose**: Represents an authenticated user account in the system.

**Managed By**: Better-Auth library (automatic creation and management)

**Fields**:

| Field          | Type         | Constraints           | Description                                    |
|----------------|--------------|-----------------------|------------------------------------------------|
| id             | UUID         | Primary Key, NOT NULL | Unique user identifier                         |
| email          | String(255)  | UNIQUE, NOT NULL      | User's email address (used for login)          |
| email_verified | Boolean      | DEFAULT FALSE         | Email verification status                      |
| name           | String(255)  | NULL                  | User's display name (optional)                 |
| image          | Text         | NULL                  | User profile image URL (optional)              |
| created_at     | TIMESTAMPTZ  | DEFAULT NOW()         | Account creation timestamp                     |
| updated_at     | TIMESTAMPTZ  | DEFAULT NOW()         | Last update timestamp                          |

**Indexes**:
- Primary key index on `id`
- Unique index on `email`

**Relationships**:
- One-to-many with Session (a user can have multiple active sessions)
- One-to-many with Todo (a user owns many todos)

**Security Notes**:
- Password is hashed and stored by Better-Auth (not exposed in this model)
- Email must be unique across the system
- UUID primary key prevents user enumeration attacks

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    """
    User entity managed by Better-Auth.
    Better-Auth handles password hashing and authentication.
    """
    __tablename__ = "user"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    email_verified: bool = Field(default=False)
    name: str | None = Field(default=None, max_length=255)
    image: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### 2. Session Entity (Better-Auth Managed)

**Purpose**: Represents an authenticated user session with token and expiration.

**Managed By**: Better-Auth library (automatic creation and management)

**Fields**:

| Field      | Type        | Constraints                    | Description                              |
|------------|-------------|--------------------------------|------------------------------------------|
| id         | UUID        | Primary Key, NOT NULL          | Unique session identifier                |
| user_id    | UUID        | Foreign Key (user.id), NOT NULL| User who owns this session               |
| token      | String(255) | UNIQUE, NOT NULL               | Session token (stored in HTTP-only cookie)|
| expires_at | TIMESTAMPTZ | NOT NULL                       | Session expiration timestamp (7 days)    |
| ip_address | String(45)  | NULL                           | IP address of session creation           |
| user_agent | Text        | NULL                           | Browser/device user agent                |
| created_at | TIMESTAMPTZ | DEFAULT NOW()                  | Session creation timestamp               |
| updated_at | TIMESTAMPTZ | DEFAULT NOW()                  | Last session update (for renewal)        |

**Indexes**:
- Primary key index on `id`
- Unique index on `token` (for fast lookup during validation)
- Index on `user_id` (for user's session queries)
- Index on `expires_at` (for cleanup of expired sessions)

**Relationships**:
- Many-to-one with User (many sessions belong to one user)

**Business Rules**:
- Sessions expire after 7 days (configurable)
- Sessions are renewed every 24 hours of user activity
- Expired sessions are automatically cleaned up
- Multiple active sessions per user are allowed (different devices)

**Security Notes**:
- Token is a cryptographically secure random value
- Token stored in HTTP-only cookie (not accessible to JavaScript)
- Session validation happens on every protected API call
- Expired sessions return 401 Unauthorized

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4

class Session(SQLModel, table=True):
    """
    Session entity managed by Better-Auth.
    Stores session tokens and expiration info.
    """
    __tablename__ = "session"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, nullable=False)
    token: str = Field(unique=True, index=True, max_length=255)
    expires_at: datetime = Field(nullable=False, index=True)
    ip_address: str | None = Field(default=None, max_length=45)
    user_agent: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: "User" = Relationship(back_populates="sessions")
```

---

### 3. Todo Entity (Application Managed)

**Purpose**: Represents a user's todo item with full task management features.

**Managed By**: Application code (FastAPI backend)

**Fields**:

| Field        | Type        | Constraints                         | Description                                    |
|--------------|-------------|-------------------------------------|------------------------------------------------|
| id           | UUID        | Primary Key, NOT NULL               | Unique todo identifier                         |
| user_id      | UUID        | Foreign Key (user.id), NOT NULL     | User who owns this todo                        |
| title        | String(255) | NOT NULL                            | Todo title (required)                          |
| description  | Text        | NULL                                | Detailed description (optional)                |
| status       | Enum        | NOT NULL, DEFAULT 'pending'         | Todo status (pending, in_progress, completed)  |
| priority     | Enum        | NOT NULL, DEFAULT 'medium'          | Priority level (low, medium, high)             |
| due_date     | TIMESTAMPTZ | NULL                                | Due date and time (optional)                   |
| tags         | Array       | NULL                                | Array of string tags (optional)                |
| is_recurring | Boolean     | DEFAULT FALSE                       | Whether this is a recurring task               |
| frequency    | Enum        | NULL                                | Recurrence frequency (daily, weekly, monthly)  |
| interval     | Integer     | NULL                                | Recurrence interval (e.g., every 2 weeks)      |
| created_at   | TIMESTAMPTZ | DEFAULT NOW()                       | Todo creation timestamp                        |
| updated_at   | TIMESTAMPTZ | DEFAULT NOW()                       | Last update timestamp                          |

**Enums**:

**TodoStatus**:
- `pending`: Not started
- `in_progress`: Currently being worked on
- `completed`: Finished

**TodoPriority**:
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority

**RecurrenceFrequency** (if is_recurring=true):
- `daily`: Repeats every N days
- `weekly`: Repeats every N weeks
- `monthly`: Repeats every N months

**Indexes**:
- Primary key index on `id`
- Index on `user_id` (for user's todo queries)
- Index on `status` (for filtering by status)
- Index on `due_date` (for sorting by due date)
- Composite index on `(user_id, status)` for common queries

**Relationships**:
- Many-to-one with User (many todos belong to one user)

**Business Rules**:
- Todos are scoped to a single user (enforced by foreign key and queries)
- Users can only access their own todos (authorization check)
- Deleting a user cascades to delete all their todos (`ON DELETE CASCADE`)
- Title is required, description is optional
- Status defaults to 'pending' on creation
- Tags are stored as array for flexible categorization

**Authorization Rules**:
- All todo queries MUST filter by `user_id` of authenticated user
- Create operations MUST set `user_id` from authenticated session
- Update/delete operations MUST verify ownership before proceeding
- Attempting to access another user's todo returns 403 Forbidden

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship, Column, ARRAY, String
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum

class TodoStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TodoPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class RecurrenceFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Todo(SQLModel, table=True):
    """
    Todo entity for user task management.
    Each todo belongs to exactly one user.
    """
    __tablename__ = "todo"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: str | None = Field(default=None)
    status: TodoStatus = Field(default=TodoStatus.PENDING, nullable=False, index=True)
    priority: TodoPriority = Field(default=TodoPriority.MEDIUM, nullable=False)
    due_date: datetime | None = Field(default=None, index=True)
    tags: list[str] | None = Field(default=None, sa_column=Column(ARRAY(String)))
    is_recurring: bool = Field(default=False)
    frequency: RecurrenceFrequency | None = Field(default=None)
    interval: int | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: "User" = Relationship(back_populates="todos")
```

---

## Database Schema (SQL)

### Create Tables

```sql
-- Better-Auth managed tables (auto-created by Better-Auth)
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Application tables (created by SQLModel or manual migration)
CREATE TYPE todo_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE "todo" (
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

CREATE INDEX idx_todo_user_id ON "todo"(user_id);
CREATE INDEX idx_todo_status ON "todo"(status);
CREATE INDEX idx_todo_due_date ON "todo"(due_date);
CREATE INDEX idx_todo_user_status ON "todo"(user_id, status);
```

---

## API Request/Response Models

### Authentication

**SignupRequest**:
```typescript
interface SignupRequest {
  email: string        // Valid email format
  password: string     // Min 8 characters
  name?: string        // Optional display name
}
```

**LoginRequest**:
```typescript
interface LoginRequest {
  email: string
  password: string
}
```

**AuthResponse**:
```typescript
interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    created_at: string
  }
  session: {
    expires_at: string
  }
}
```

### Todo Operations

**TodoCreate**:
```typescript
interface TodoCreate {
  title: string                    // Required
  description?: string             // Optional
  priority?: 'low' | 'medium' | 'high'  // Default: 'medium'
  due_date?: string                // ISO 8601 format
  tags?: string[]                  // Optional array
  is_recurring?: boolean           // Default: false
  frequency?: 'daily' | 'weekly' | 'monthly'  // Required if is_recurring
  interval?: number                // Required if is_recurring
}
```

**TodoUpdate**:
```typescript
interface TodoUpdate {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
  tags?: string[]
  is_recurring?: boolean
  frequency?: 'daily' | 'weekly' | 'monthly' | null
  interval?: number | null
}
```

**TodoResponse**:
```typescript
interface TodoResponse {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  tags: string[] | null
  is_recurring: boolean
  frequency: 'daily' | 'weekly' | 'monthly' | null
  interval: number | null
  created_at: string
  updated_at: string
}
```

---

## Data Validation Rules

### User Data
- Email: Must be valid email format, unique across system
- Password: Minimum 8 characters, must contain uppercase, digit (enforced by Better-Auth)
- Name: Optional, max 255 characters

### Todo Data
- Title: Required, max 255 characters, non-empty after trimming
- Description: Optional, max 10,000 characters
- Status: Must be one of: pending, in_progress, completed
- Priority: Must be one of: low, medium, high
- Due date: Must be valid ISO 8601 datetime, can be in past
- Tags: Max 20 tags, each max 50 characters
- Recurring: If true, frequency and interval are required
- Frequency: Required if is_recurring=true
- Interval: Must be positive integer (1-100) if is_recurring=true

---

## Data Migration Strategy

### Initial Setup

1. **Better-Auth Tables**: Automatically created by Better-Auth on first initialization
2. **Application Tables**: Created via SQLModel `create_all()` or SQL migration scripts

### Migration Script Example

```python
# scripts/init_db.py
from sqlmodel import SQLModel, create_engine
from backend.models import User, Session, Todo
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_database():
    """Initialize all database tables."""
    SQLModel.metadata.create_all(engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()
```

### Production Migration

For production environments, use versioned migration scripts:

```sql
-- migrations/001_create_todo_table.sql
CREATE TYPE todo_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE "todo" (
  -- ... (full schema as above)
);

CREATE INDEX idx_todo_user_id ON "todo"(user_id);
CREATE INDEX idx_todo_status ON "todo"(status);
CREATE INDEX idx_todo_due_date ON "todo"(due_date);
CREATE INDEX idx_todo_user_status ON "todo"(user_id, status);
```

---

## Performance Considerations

### Query Optimization

**Common Queries**:
1. Get all todos for a user: `SELECT * FROM todo WHERE user_id = $1` (uses idx_todo_user_id)
2. Get pending todos for a user: `SELECT * FROM todo WHERE user_id = $1 AND status = 'pending'` (uses idx_todo_user_status composite index)
3. Get todos due soon: `SELECT * FROM todo WHERE user_id = $1 AND due_date < NOW() + INTERVAL '7 days'` (uses idx_todo_due_date)
4. Validate session: `SELECT user_id FROM session WHERE token = $1 AND expires_at > NOW()` (uses idx_session_token)

**Index Strategy**:
- Primary keys for unique lookups
- Foreign keys for relationship queries
- Composite index on (user_id, status) for common filtered queries
- Separate indexes on due_date and status for flexibility

### Connection Pooling

- Pool size: 5-10 connections for development
- Max overflow: 10 additional connections during spikes
- Pool pre-ping: Enabled for serverless (Neon PostgreSQL)
- Connection timeout: 30 seconds

---

## Security Model

### Data Access Control

**User Isolation**:
- All todo queries MUST include `WHERE user_id = :current_user_id`
- Authorization enforced at FastAPI dependency level
- No cross-user data access possible (database enforced via foreign keys)

**Session Security**:
- Session tokens stored in HTTP-only cookies (no JavaScript access)
- Tokens are cryptographically secure random values
- Sessions expire after 7 days, renewed every 24 hours
- Expired sessions rejected with 401 Unauthorized

**Database Security**:
- Foreign key constraints enforce referential integrity
- `ON DELETE CASCADE` ensures orphan record cleanup
- No user enumeration (generic error messages)
- Prepared statements prevent SQL injection (SQLModel ORM)

---

**Data Model Complete**: 2026-01-12
**Next Artifacts**: API contracts (contracts/), quickstart guide (quickstart.md)
