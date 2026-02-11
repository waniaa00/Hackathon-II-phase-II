# Research: Todo App Database & Integration

**Feature**: 007-db-integration
**Date**: 2026-02-04
**Status**: Complete

## Research Summary

This document captures technology decisions, best practices, and patterns for implementing the database foundation with Better Auth integration.

---

## 1. Database Connection (Neon PostgreSQL)

### Decision
Use Neon Serverless PostgreSQL with connection pooling via `psycopg2-binary` driver.

### Rationale
- Neon provides serverless PostgreSQL with automatic scaling
- Native PostgreSQL compatibility ensures standard SQL features
- Connection pooling handles concurrent requests efficiently
- SSL/TLS encryption built-in for secure transport

### Alternatives Considered
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Neon PostgreSQL | Serverless, auto-scaling, free tier | Connection limits on free tier | **Selected** |
| Supabase | Includes auth | Different auth system than Better Auth | Rejected |
| Local PostgreSQL | Full control | No cloud deployment, manual scaling | Rejected |

### Implementation Pattern
```python
from sqlmodel import create_engine
import os

DATABASE_URL = os.getenv("NEON_DB_URL")
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
```

---

## 2. ORM Choice (SQLModel)

### Decision
Use SQLModel for database models, combining SQLAlchemy ORM with Pydantic validation.

### Rationale
- Native FastAPI integration (same author)
- Type hints provide IDE support and validation
- Reduces code duplication (model = schema)
- Supports relationships and foreign keys

### Alternatives Considered
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| SQLModel | FastAPI native, type-safe | Newer, smaller community | **Selected** |
| SQLAlchemy + Pydantic | Mature, battle-tested | More boilerplate | Rejected |
| Tortoise ORM | Async-first | Different ecosystem | Rejected |

### Key Patterns from Documentation
- Use `Field(primary_key=True)` for primary keys
- Use `Field(foreign_key="table.column")` for relationships
- Use `Relationship(back_populates="...")` for bidirectional access
- Use link tables for many-to-many relationships

---

## 3. Better Auth Integration

### Decision
Use Better Auth with JWT plugin for authentication, verifying tokens in FastAPI via JWKS endpoint.

### Rationale
- Better Auth handles user registration, login, and session management on the frontend (Next.js)
- JWT tokens can be verified in the FastAPI backend without database lookups
- JWKS endpoint provides public keys for stateless token verification
- Bearer plugin enables Authorization header-based authentication

### Better Auth Core Schema (from docs)

**User Table** (managed by Better Auth on frontend):
| Field | Type | Description |
|-------|------|-------------|
| id | string | Primary Key, unique identifier |
| name | string | Display name |
| email | string | Login email (unique) |
| emailVerified | boolean | Email verification status |
| image | string? | Profile picture URL |
| createdAt | Date | Account creation timestamp |
| updatedAt | Date | Last update timestamp |

**Session Table** (managed by Better Auth):
| Field | Type | Description |
|-------|------|-------------|
| id | string | Primary Key |
| userId | string | Foreign Key to user |
| token | string | Session token |
| expiresAt | Date | Session expiry |
| ipAddress | string? | Client IP |
| userAgent | string? | Client device info |

### Better Auth Configuration (Next.js Frontend)
```typescript
// auth.ts - Frontend configuration
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        bearer(),  // Enable Bearer token authentication
        jwt()      // Enable JWT with JWKS endpoint
    ]
});
```

### JWT Verification in FastAPI Backend (Python)

Better Auth exposes a JWKS endpoint at `/api/auth/jwks` that returns public keys:
```json
{
  "keys": [
    {
      "crv": "Ed25519",
      "x": "bDHiLTt7u-VIU7rfmcltcFhaHKLVvWFy-_csKZARUEU",
      "kty": "OKP",
      "kid": "c5c7995d-0037-4553-8aee-b5b620b89b23"
    }
  ]
}
```

### Python JWT Verification Pattern
```python
# Using PyJWT with cryptography for JWKS verification
import jwt
from jwt import PyJWKClient
from functools import lru_cache

JWKS_URL = "http://localhost:3000/api/auth/jwks"
ISSUER = "http://localhost:3000"
AUDIENCE = "http://localhost:3000"

@lru_cache()
def get_jwk_client():
    return PyJWKClient(JWKS_URL)

def verify_token(token: str) -> dict:
    """Verify JWT token using JWKS from Better Auth."""
    try:
        jwk_client = get_jwk_client()
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],
            issuer=ISSUER,
            audience=AUDIENCE
        )
        return payload
    except jwt.InvalidTokenError as e:
        raise AuthenticationError(f"Invalid token: {e}")
```

### FastAPI Dependency for Authentication
```python
from fastapi import Depends, HTTPException, Header
from typing import Annotated

async def get_current_user(
    authorization: Annotated[str | None, Header()] = None
) -> dict:
    """Extract and verify user from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    return {
        "id": payload.get("sub"),  # User ID is in 'sub' claim
        "email": payload.get("email"),
    }

CurrentUser = Annotated[dict, Depends(get_current_user)]
```

### Environment Variables
| Variable | Description | Used By |
|----------|-------------|---------|
| BETTER_AUTH_SECRET | Secret for signing/encryption | Frontend (Better Auth) |
| BETTER_AUTH_URL | Base URL (e.g., http://localhost:3000) | Frontend (Better Auth) |
| NEON_DB_URL | PostgreSQL connection string | Backend (FastAPI) |
| FRONTEND_URL | Frontend URL for JWKS | Backend (FastAPI) |

---

## 4. Primary Key Strategy

### Decision
Use UUID for all primary keys in the backend tasks database.

### Rationale
- Matches Better Auth's string-based user IDs
- Globally unique identifiers prevent ID collision
- Suitable for distributed systems
- No sequential prediction (security benefit)

### Implementation Pattern
```python
from uuid import uuid4
from sqlmodel import Field

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")  # References Better Auth user
```

---

## 5. Many-to-Many Relationship (Tasks ↔ Tags)

### Decision
Use explicit link table `TaskTag` for the many-to-many relationship.

### Rationale
- SQLModel requires explicit link tables
- Allows future extension (e.g., assignment timestamp)
- Clear data model for debugging

### Implementation Pattern (from SQLModel docs)
```python
class TaskTag(SQLModel, table=True):
    task_id: str = Field(foreign_key="task.id", primary_key=True)
    tag_id: str = Field(foreign_key="tag.id", primary_key=True)

class Task(SQLModel, table=True):
    id: str = Field(primary_key=True)
    tags: list["Tag"] = Relationship(back_populates="tasks", link_model=TaskTag)

class Tag(SQLModel, table=True):
    id: str = Field(primary_key=True)
    tasks: list["Task"] = Relationship(back_populates="tags", link_model=TaskTag)
```

---

## 6. Session Management

### Decision
Use FastAPI dependency injection with generator pattern for database session management.

### Rationale
- Ensures sessions are properly closed after requests
- Integrates with FastAPI's dependency system
- Supports transaction rollback on errors

### Implementation Pattern (from FastAPI docs)
```python
from sqlmodel import Session
from fastapi import Depends
from typing import Annotated

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
```

---

## 7. User Synchronization Strategy

### Decision
Store minimal user reference in backend database, sync on first task creation.

### Rationale
- Better Auth manages full user data (name, email, password)
- Backend only needs user_id for task ownership
- Avoids data duplication and sync issues
- User ID from JWT is source of truth

### Implementation Pattern
```python
class User(SQLModel, table=True):
    """Minimal user reference for task ownership."""
    id: str = Field(primary_key=True)  # Same as Better Auth user.id
    created_at: datetime = Field(default_factory=datetime.utcnow)

async def ensure_user_exists(session: Session, user_id: str) -> User:
    """Create user record if not exists (on first task creation)."""
    user = session.get(User, user_id)
    if not user:
        user = User(id=user_id)
        session.add(user)
        session.commit()
    return user
```

---

## 8. Cascade Delete Strategy

### Decision
Use database-level cascade delete for user → tasks/tags/priorities.

### Rationale
- Ensures data integrity at database level
- Automatic cleanup when user is deleted
- Prevents orphaned records

### Implementation Pattern
```python
from sqlalchemy import Column, ForeignKey
from sqlmodel import Field

class Task(SQLModel, table=True):
    user_id: str = Field(
        sa_column=Column(
            ForeignKey("user.id", ondelete="CASCADE"),
            nullable=False
        )
    )
```

---

## 9. Index Strategy

### Decision
Create indexes on frequently queried columns.

### Indexes Required
| Table | Column | Reason |
|-------|--------|--------|
| task | user_id | User isolation queries |
| task | title | Search functionality |
| task | due_date | Date filtering/sorting |
| task | status | Status filtering |
| task | priority_id | Priority filtering |
| tag | user_id | User isolation |
| tag | name | Search/lookup |

### Implementation Pattern
```python
class Task(SQLModel, table=True):
    title: str = Field(index=True)
    due_date: datetime | None = Field(default=None, index=True)
```

---

## 10. Environment Configuration

### Decision
Use `python-dotenv` with Pydantic Settings for environment variable management.

### Rationale
- Type-safe configuration
- Validation on startup (fail fast)
- Easy testing with overrides

### Implementation Pattern
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    neon_db_url: str
    frontend_url: str = "http://localhost:3000"

    @property
    def jwks_url(self) -> str:
        return f"{self.frontend_url}/api/auth/jwks"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## 11. Migration Strategy

### Decision
Use Alembic for database migrations.

### Rationale
- Standard SQLAlchemy migration tool
- Supports SQLModel models
- Version-controlled schema changes
- Rollback capability

### Commands
```bash
# Initialize alembic
alembic init alembic

# Generate migration
alembic revision --autogenerate -m "initial schema"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Unresolved Questions

None - all technical decisions resolved.

## References

- [Better Auth Official Docs](https://www.better-auth.com/docs)
- [Better Auth JWT Plugin](https://www.better-auth.com/docs/plugins/jwt)
- [Better Auth Bearer Plugin](https://www.better-auth.com/docs/plugins/bearer)
- [SQLModel Official Docs](https://sqlmodel.tiangolo.com/)
- [FastAPI SQL Databases Tutorial](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
