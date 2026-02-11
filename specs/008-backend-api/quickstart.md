# Quickstart: Todo App Backend & API

**Feature**: 008-backend-api
**Dependency**: 007-db-integration must be completed first

## Prerequisites

1. **007-db-integration completed**:
   - Database models created
   - Alembic migrations applied
   - Neon PostgreSQL connection working

2. **Environment configured**:
   - Python 3.11+ installed
   - Virtual environment activated
   - Dependencies installed

3. **Better Auth configured on frontend**:
   - JWT plugin enabled
   - JWKS endpoint accessible at `/api/auth/jwks`

---

## Quick Setup

### 1. Verify 007-db-integration

```bash
# Ensure database is running and migrations applied
cd backend
alembic current  # Should show latest migration

# Test database connection
python -c "from app.database import engine; print('DB connected')"
```

### 2. Install Additional Dependencies

```bash
pip install pyjwt[crypto] structlog httpx
```

Add to `requirements.txt`:
```
pyjwt[crypto]>=2.8.0
cryptography>=41.0.0
structlog>=24.1.0
httpx>=0.25.0
```

### 3. Update Environment Variables

Add to `.env`:
```bash
# From 007-db-integration
NEON_DB_URL=postgresql://...

# New for 008-backend-api
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=["http://localhost:3000"]
```

### 4. Create Core Security Module

Create `backend/app/core/security.py`:
```python
import jwt
from jwt import PyJWKClient
from functools import lru_cache
from app.config import settings

class JWTVerificationError(Exception):
    pass

@lru_cache(maxsize=1)
def get_jwk_client() -> PyJWKClient:
    return PyJWKClient(settings.jwks_url, cache_keys=True, lifespan=3600)

def verify_jwt_token(token: str) -> dict:
    try:
        jwk_client = get_jwk_client()
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise JWTVerificationError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise JWTVerificationError(f"Invalid token: {str(e)}")
```

### 5. Create Authentication Dependency

Update `backend/app/api/deps.py`:
```python
from fastapi import Depends, HTTPException, Header, Path
from typing import Annotated
from app.core.security import verify_jwt_token, JWTVerificationError

async def get_current_user(
    authorization: Annotated[str | None, Header()] = None
) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    token = authorization[7:]

    try:
        payload = verify_jwt_token(token)
        return {"id": payload.get("sub"), "email": payload.get("email")}
    except JWTVerificationError as e:
        raise HTTPException(status_code=401, detail=str(e))

CurrentUser = Annotated[dict, Depends(get_current_user)]

async def verify_user_access(
    current_user: CurrentUser,
    user_id: Annotated[str, Path()]
) -> str:
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resource"
        )
    return user_id

VerifiedUserId = Annotated[str, Depends(verify_user_access)]
```

### 6. Configure CORS Middleware

Update `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(title="Todo App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 7. Run the Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8. Verify Setup

```bash
# Health check (no auth required)
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "database": "connected"}

# Authenticated request (requires valid JWT)
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:8000/api/<user-id>/tasks

# Expected: 200 with task list or 401 if token invalid
```

---

## Development Workflow

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api/test_tasks.py -v
```

### API Documentation

FastAPI auto-generates docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

### Testing Authentication

For local development, create a test JWT:

```python
# scripts/create_test_token.py
import jwt
from datetime import datetime, timedelta

SECRET = "test-secret-for-development-only"

token = jwt.encode(
    {
        "sub": "test-user-id",
        "email": "test@example.com",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1)
    },
    SECRET,
    algorithm="HS256"
)
print(f"Test token: {token}")
```

Note: In development, you may need to configure a test JWKS endpoint or use dependency overrides in tests.

---

## Common Issues

### CORS Errors

If frontend can't reach backend:
1. Check `FRONTEND_URL` matches exactly (including protocol and port)
2. Ensure CORS middleware is added before routes
3. Check browser console for specific CORS error messages

### JWT Verification Fails

If tokens aren't validating:
1. Verify JWKS endpoint is accessible: `curl http://localhost:3000/api/auth/jwks`
2. Check token hasn't expired
3. Verify Better Auth JWT plugin is configured
4. Check algorithm matches (EdDSA, ES256, or RS256)

### Database Connection Errors

If database operations fail:
1. Verify `NEON_DB_URL` is correct
2. Check Neon dashboard for connection status
3. Ensure SSL is enabled in connection string
4. Verify migrations are applied: `alembic current`

---

## Next Steps

After setup is verified:

1. Run `/sp.tasks` to generate implementation tasks
2. Implement task endpoints (`api/v1/tasks.py`)
3. Implement tag endpoints (`api/v1/tags.py`)
4. Implement priority endpoints (`api/v1/priorities.py`)
5. Write API tests
6. Run `/sp.implement` to execute tasks

---

## File Checklist

After 008-backend-api implementation, these files should exist:

```
backend/
├── app/
│   ├── main.py                  # Updated with CORS, exception handlers
│   ├── config.py                # Updated with FRONTEND_URL
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py          # JWT verification
│   │   └── logging.py           # Structured logging
│   ├── api/
│   │   ├── deps.py              # Updated with auth dependencies
│   │   ├── exceptions.py        # Custom exception handlers
│   │   ├── middleware.py        # Request logging middleware
│   │   └── v1/
│   │       ├── tasks.py         # Full CRUD + filtering
│   │       ├── tags.py          # Full CRUD
│   │       └── priorities.py    # List endpoint
│   └── services/
│       ├── auth_service.py      # User verification helpers
│       ├── task_service.py      # Updated with filtering/sorting
│       ├── tag_service.py       # CRUD operations
│       └── priority_service.py  # Auto-create defaults
└── tests/
    ├── test_auth.py             # Auth tests
    └── test_api/
        ├── test_tasks.py        # Comprehensive task tests
        ├── test_tags.py         # Tag tests
        └── test_priorities.py   # Priority tests
```
