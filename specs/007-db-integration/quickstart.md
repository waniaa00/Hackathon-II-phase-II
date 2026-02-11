# Quickstart: Todo App Database & Integration

**Feature**: 007-db-integration
**Date**: 2026-02-04

## Prerequisites

- Python 3.11+
- Node.js 18+ (for Better Auth frontend)
- Neon PostgreSQL account (free tier)
- Git

## 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd todo-app

# Checkout feature branch
git checkout 007-db-integration
```

## 2. Configure Environment Variables

### Backend (.env in /backend)

```bash
# Create .env file
cp backend/.env.example backend/.env

# Edit with your values:
NEON_DB_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/todoapp?sslmode=require
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env in /frontend)

```bash
# Create .env file
cp frontend/.env.example frontend/.env

# Edit with your values:
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

## 3. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

## 4. Setup Frontend (Better Auth)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 5. Verify Setup

### Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Check Better Auth JWKS
```bash
curl http://localhost:3000/api/auth/jwks
```

Expected response:
```json
{
  "keys": [
    {
      "crv": "Ed25519",
      "x": "...",
      "kty": "OKP",
      "kid": "..."
    }
  ]
}
```

## 6. Test Authentication Flow

### 1. Register a User (Frontend)
Navigate to `http://localhost:3000/sign-up` and create an account.

### 2. Get Bearer Token
After login, the frontend stores the token. You can get it from:
- Browser DevTools → Application → Local Storage → `bearer_token`
- Or from the response of sign-in API call

### 3. Test API with Token
```bash
# Set your token
TOKEN="your-bearer-token"
USER_ID="your-user-id"

# Create a task
curl -X POST "http://localhost:8000/api/${USER_ID}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Testing the API"}'

# List tasks
curl "http://localhost:8000/api/${USER_ID}/tasks" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 7. Database Schema

After migrations, your database will have:

| Table | Description |
|-------|-------------|
| user | Minimal user reference (synced from Better Auth) |
| task | Todo items with status, priority, due dates |
| tag | User-defined labels |
| priority | Priority levels (high, medium, low) |
| task_tag | Junction table for task-tag relationship |
| alembic_version | Migration tracking |

## 8. Common Issues

### "Connection refused" on database
- Verify `NEON_DB_URL` is correct
- Check Neon console for connection string
- Ensure SSL is enabled (`?sslmode=require`)

### "Invalid token" on API calls
- Ensure frontend is running and JWKS endpoint is accessible
- Verify `FRONTEND_URL` in backend matches frontend URL
- Check token is not expired

### "User not found" when creating tasks
- Backend creates user record on first task creation
- Ensure JWT contains valid user ID in `sub` claim

## 9. Development Workflow

```bash
# Run tests
cd backend
pytest

# Generate new migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 10. API Documentation

Once backend is running, access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement models in `backend/app/models/`
3. Implement API endpoints in `backend/app/api/v1/`
4. Run tests to verify functionality
