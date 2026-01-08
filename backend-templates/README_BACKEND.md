# FastAPI Backend Setup

Complete FastAPI backend for the Todo application with PostgreSQL database.

---

## 📁 Files Included

- `main.py` - Complete FastAPI application with all endpoints
- `requirements.txt` - Python dependencies
- `setup_backend.py` - Interactive setup script
- `Dockerfile` - Docker configuration for Hugging Face
- `.dockerignore` - Docker build exclusions
- `.env.example` - Environment variables template

---

## 🚀 Quick Setup (3 Methods)

### Method 1: Automated Setup Script (Recommended - 5 min)

```bash
# 1. Create Neon database first
# Visit: https://console.neon.tech
# Create project and copy connection string

# 2. Navigate to where you want the backend
cd path/to/your/backend/directory

# 3. Copy all files from backend-templates
cp path/to/phase-II/backend-templates/* .

# 4. Run setup script
python setup_backend.py
# Enter your Neon DATABASE_URL when prompted
# Script will generate SECRET_KEY automatically

# 5. Install dependencies
pip install -r requirements.txt

# 6. Start server
uvicorn main:app --reload --port 8000

# 7. Visit http://localhost:8000/docs
```

### Method 2: Manual Setup (10 min)

```bash
# 1. Copy files
cp path/to/phase-II/backend-templates/* .

# 2. Create .env file manually
cp .env.example .env

# 3. Edit .env with your values
# DATABASE_URL=your-neon-connection-string
# SECRET_KEY=generate-with-python-command-below

# Generate SECRET_KEY:
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start server
uvicorn main:app --reload --port 8000
```

### Method 3: Docker (15 min)

```bash
# 1. Copy files
cp path/to/phase-II/backend-templates/* .

# 2. Create .env file (see Method 2)

# 3. Build Docker image
docker build -t todo-api .

# 4. Run container
docker run -p 8000:8000 --env-file .env todo-api

# 5. Visit http://localhost:8000/docs
```

---

## 📋 Prerequisites

### 1. Neon PostgreSQL Database

Create free account at https://console.neon.tech:

1. Sign up
2. Create new project
3. Copy connection string:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Python Environment

```bash
# Python 3.11 or later
python --version

# pip or uv for package management
pip --version
```

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT Authentication
SECRET_KEY=your-32-char-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
APP_NAME=Todo API
APP_VERSION=1.0.0

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Generate SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🏃 Running the Backend

### Development Server

```bash
uvicorn main:app --reload --port 8000
```

### Production Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### With Custom Host/Port

```bash
uvicorn main:app --host 0.0.0.0 --port 7860
```

---

## 🧪 Testing the API

### 1. Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"ok"}
```

### 2. API Documentation

Visit: http://localhost:8000/docs

Interactive Swagger UI for testing all endpoints

### 3. Register User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 4. Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### 5. Create Todo (requires auth token)

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"high"}'
```

---

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Todos

- `GET /api/v1/todos` - Get all user's todos
- `POST /api/v1/todos` - Create new todo
- `PUT /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo

### Utility

- `GET /health` - Health check
- `GET /` - API info
- `GET /docs` - Swagger documentation
- `GET /redoc` - ReDoc documentation

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t todo-api .
```

### Run Container

```bash
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name todo-api \
  todo-api
```

### Check Logs

```bash
docker logs todo-api
```

### Stop Container

```bash
docker stop todo-api
docker rm todo-api
```

---

## 🚀 Deploy to Hugging Face Spaces

### 1. Create Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Name: `todo-api`
4. SDK: Docker
5. Click "Create Space"

### 2. Add Environment Variables

In Space settings (⚙️):

```
DATABASE_URL = your-neon-connection-string
SECRET_KEY = your-generated-secret-key
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

Mark `SECRET_KEY` and `DATABASE_URL` as secrets 🔒

### 3. Push Code

```bash
# Add Hugging Face remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/todo-api

# Push
git push hf main
```

### 4. Wait for Build

Check "Logs" tab for build progress (3-5 minutes)

### 5. Get Your API URL

```
https://YOUR_USERNAME-todo-api.hf.space
```

Test: https://YOUR_USERNAME-todo-api.hf.space/docs

---

## 🔍 Troubleshooting

### Database Connection Failed

**Error**: "could not connect to server"

**Solutions**:
1. Check DATABASE_URL is correct
2. Ensure `?sslmode=require` at end
3. Verify Neon project is active (not paused)
4. Test connection in Neon SQL Editor

### ImportError: No module named 'fastapi'

**Error**: Missing dependencies

**Solution**:
```bash
pip install -r requirements.txt
```

### 401 Unauthorized

**Error**: Authentication fails

**Solutions**:
1. Check SECRET_KEY is set in .env
2. Token might be expired (sign in again)
3. Verify Authorization header format: `Bearer TOKEN`

### CORS Errors

**Error**: "blocked by CORS policy"

**Solutions**:
1. Add frontend URL to ALLOWED_ORIGINS in .env
2. Update CORS origins in main.py
3. Restart server after changes

### Tables Not Created

**Error**: "relation does not exist"

**Solution**:
Tables are created automatically on first startup. If not:
1. Check database connection
2. Look for errors in startup logs
3. Manually create tables (SQLModel does this automatically)

---

## 📊 Database Schema

### Users Table

```sql
id: integer (primary key)
email: string (unique)
hashed_password: string
created_at: timestamp
```

### Todos Table

```sql
id: integer (primary key)
title: string
description: string (nullable)
completed: boolean
priority: string (low/medium/high)
due_date: string (nullable)
tags: string (JSON array)
recurrence: string (JSON object, nullable)
created_at: timestamp
updated_at: timestamp
user_id: integer (foreign key → users.id)
```

---

## 🔐 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ CORS configured for specific origins
- ✅ Environment variables for secrets
- ✅ SQL injection protection (SQLModel ORM)
- ✅ HTTPS required in production

---

## 📝 Development Notes

### Adding New Endpoints

1. Define Pydantic schema
2. Create route handler
3. Add authentication if needed
4. Update documentation

### Database Migrations

For schema changes:
1. Modify SQLModel models
2. Create migration script (Alembic)
3. Apply migration: `alembic upgrade head`

### Testing

```bash
# Install pytest
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

---

## 🎯 Next Steps

1. ✅ Backend running locally
2. ✅ Test all endpoints in /docs
3. ✅ Connect frontend (update NEXT_PUBLIC_API_URL)
4. ✅ Test full integration locally
5. ⬜ Deploy to Hugging Face
6. ⬜ Update frontend CORS in production
7. ⬜ Test production deployment

---

## 📞 Support

### Check Status

```bash
# Backend running?
curl http://localhost:8000/health

# Database connected?
# Check startup logs for "Application startup complete"

# Frontend connected?
# Check browser console for API calls
```

### Logs

```bash
# Development
# Logs appear in terminal

# Docker
docker logs todo-api

# Hugging Face
# Check "Logs" tab in Space
```

---

## 📈 Performance

### Optimization Tips

1. **Connection Pooling**: Configured in SQLModel/SQLAlchemy
2. **Caching**: Add Redis for session/data caching
3. **Workers**: Use multiple Uvicorn workers in production
4. **Database**: Add indexes on frequently queried fields
5. **Monitoring**: Add logging and metrics

---

Last Updated: 2026-01-07
Status: Production Ready
