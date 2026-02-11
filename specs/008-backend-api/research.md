# Research: Todo App Backend & API

**Feature**: 008-backend-api
**Date**: 2026-02-05
**Status**: Complete
**Dependency**: 007-db-integration (see `specs/007-db-integration/research.md` for database research)

## Research Summary

This document captures technology decisions and patterns specific to the API layer. For database connection, ORM, and Better Auth integration basics, see the 007-db-integration research document.

---

## 1. FastAPI Dependency Injection for Authentication

### Decision
Use FastAPI's dependency injection system with `Depends()` for authentication and authorization.

### Rationale
- Clean separation of concerns
- Reusable across all endpoints
- Easy to test with dependency overrides
- Type hints provide IDE support

### Implementation Pattern

```python
from fastapi import Depends, HTTPException, Header, Path
from typing import Annotated

async def get_current_user(
    authorization: Annotated[str | None, Header()] = None
) -> dict:
    """Extract and verify user from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    token = authorization[7:]  # Remove "Bearer " prefix

    try:
        payload = verify_jwt_token(token)
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
        }
    except JWTError as e:
        raise HTTPException(status_code=401, detail=str(e))

CurrentUser = Annotated[dict, Depends(get_current_user)]

async def verify_user_access(
    current_user: CurrentUser,
    user_id: Annotated[str, Path()]
) -> str:
    """Verify that the authenticated user matches the path user_id."""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resource"
        )
    return user_id

VerifiedUserId = Annotated[str, Depends(verify_user_access)]
```

---

## 2. JWT Verification with JWKS Caching

### Decision
Use PyJWKClient with LRU caching for JWKS retrieval and validation.

### Rationale
- Avoids fetching JWKS on every request
- PyJWKClient handles key rotation automatically
- Thread-safe caching

### Implementation Pattern

```python
import jwt
from jwt import PyJWKClient
from functools import lru_cache
from typing import Any

class JWTVerificationError(Exception):
    pass

@lru_cache(maxsize=1)
def get_jwk_client(jwks_url: str) -> PyJWKClient:
    """Get cached JWK client."""
    return PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)

def verify_jwt_token(token: str, settings: Settings) -> dict[str, Any]:
    """
    Verify JWT token using JWKS from Better Auth.

    Args:
        token: The JWT token string
        settings: Application settings with JWKS URL

    Returns:
        Token payload as dictionary

    Raises:
        JWTVerificationError: If token is invalid
    """
    try:
        jwk_client = get_jwk_client(settings.jwks_url)
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],
            options={"verify_aud": False}  # Better Auth may not set audience
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise JWTVerificationError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise JWTVerificationError(f"Invalid token: {str(e)}")
```

### Better Auth JWT Claims

Based on Better Auth documentation, JWT tokens contain:

| Claim | Description |
|-------|-------------|
| `sub` | User ID (UUID string) |
| `email` | User email address |
| `iat` | Issued at timestamp |
| `exp` | Expiration timestamp |
| `iss` | Issuer URL (frontend URL) |

---

## 3. CORS Configuration

### Decision
Use FastAPI's built-in CORS middleware with explicit origin configuration.

### Rationale
- Required for frontend-backend communication
- Must allow credentials for JWT tokens
- Explicit origins more secure than wildcard

### Implementation Pattern

```python
from fastapi.middleware.cors import CORSMiddleware

def configure_cors(app: FastAPI, settings: Settings):
    """Configure CORS for the application."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
```

---

## 4. Request Logging with Correlation IDs

### Decision
Use custom middleware to generate and propagate correlation IDs for request tracing.

### Rationale
- Enables request tracing across logs
- Essential for debugging in production
- Industry standard practice

### Implementation Pattern

```python
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import structlog

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate or extract correlation ID
        correlation_id = request.headers.get(
            "X-Correlation-ID",
            str(uuid.uuid4())
        )

        # Bind to structlog context
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            correlation_id=correlation_id,
            path=request.url.path,
            method=request.method,
        )

        logger = structlog.get_logger()
        logger.info("Request started")

        response = await call_next(request)

        logger.info("Request completed", status_code=response.status_code)

        # Add correlation ID to response headers
        response.headers["X-Correlation-ID"] = correlation_id

        return response
```

---

## 5. Exception Handling

### Decision
Use FastAPI exception handlers for consistent error responses.

### Rationale
- Centralized error handling
- Consistent JSON error format
- Hides internal details from clients

### Implementation Pattern

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

def configure_exception_handlers(app: FastAPI):
    """Register custom exception handlers."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError
    ):
        return JSONResponse(
            status_code=400,
            content={
                "detail": "Validation error",
                "code": "VALIDATION_ERROR",
                "errors": exc.errors()
            }
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(
        request: Request,
        exc: SQLAlchemyError
    ):
        logger = structlog.get_logger()
        logger.error("Database error", error=str(exc))

        return JSONResponse(
            status_code=503,
            content={
                "detail": "Database temporarily unavailable",
                "code": "SERVICE_UNAVAILABLE"
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception
    ):
        logger = structlog.get_logger()
        logger.error("Unhandled exception", error=str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "code": "INTERNAL_ERROR"
            }
        )
```

---

## 6. Pagination Pattern

### Decision
Use offset-based pagination with total count.

### Rationale
- Simple to implement
- Works well for UI pagination controls
- Total count enables "page X of Y" display

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Offset pagination | Simple, total count | Performance degrades at high offsets | **Selected** |
| Cursor pagination | Consistent performance | No total count, complex | Rejected |
| Keyset pagination | Efficient for large datasets | Requires specific ordering | Rejected |

### Implementation Pattern

```python
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List

T = TypeVar('T')

class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int

    @property
    def total_pages(self) -> int:
        return (self.total + self.page_size - 1) // self.page_size
```

---

## 7. Query Filtering Implementation

### Decision
Use SQLAlchemy query composition for dynamic filtering.

### Rationale
- Type-safe query building
- Prevents SQL injection
- Composable filter chain

### Implementation Pattern

```python
from sqlmodel import select, Session
from sqlalchemy import or_

def build_task_query(
    user_id: str,
    status: str | None = None,
    priority_id: str | None = None,
    tag_id: str | None = None,
    due_before: datetime | None = None,
    due_after: datetime | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """Build SQLAlchemy query with filters."""
    query = select(Task).where(Task.user_id == user_id)

    # Apply filters
    if status:
        query = query.where(Task.status == status)

    if priority_id:
        query = query.where(Task.priority_id == priority_id)

    if tag_id:
        query = query.join(TaskTag).where(TaskTag.tag_id == tag_id)

    if due_before:
        query = query.where(Task.due_date <= due_before)

    if due_after:
        query = query.where(Task.due_date >= due_after)

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term)
            )
        )

    # Apply sorting
    sort_column = getattr(Task, sort_by, Task.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc().nulls_last())
    else:
        query = query.order_by(sort_column.desc().nulls_last())

    return query
```

---

## 8. Sorting with Priority

### Decision
Priority sorting uses the level field with custom ordering (high > medium > low).

### Rationale
- Natural priority ordering (high first)
- Consistent with user expectations
- Can be extended with numeric values if needed

### Implementation Pattern

```python
from sqlalchemy import case

def get_priority_sort_order():
    """Get case expression for priority sorting."""
    return case(
        (Priority.level == "high", 1),
        (Priority.level == "medium", 2),
        (Priority.level == "low", 3),
        else_=4  # null priorities last
    )

# Usage in query
query = select(Task).join(Priority, isouter=True).order_by(
    get_priority_sort_order().asc()
)
```

---

## 9. Testing Strategy

### Decision
Use pytest with httpx TestClient for API testing, dependency overrides for mocking.

### Rationale
- httpx TestClient integrates well with FastAPI
- Dependency overrides allow easy mocking of auth
- pytest-asyncio for async test support

### Implementation Pattern

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_current_user

# Mock user for testing
def mock_get_current_user():
    return {"id": "test-user-id", "email": "test@example.com"}

@pytest.fixture
def client():
    """Create test client with mocked auth."""
    app.dependency_overrides[get_current_user] = mock_get_current_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_create_task(client):
    response = client.post(
        "/api/test-user-id/tasks",
        json={"title": "Test Task"},
        headers={"Authorization": "Bearer mock-token"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"
```

---

## Unresolved Questions

None - all technical decisions resolved.

## References

- [007-db-integration Research](../007-db-integration/research.md) - Database and Better Auth integration details
- [FastAPI Dependency Injection](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [FastAPI CORS Middleware](https://fastapi.tiangolo.com/tutorial/cors/)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [Better Auth JWT Plugin](https://www.better-auth.com/docs/plugins/jwt)
- [structlog Documentation](https://www.structlog.org/)
