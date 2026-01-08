# 🚀 Start Here: Complete Setup Guide

**Goal**: Get your Todo app running locally with database, then deploy to production.

**Time**: 15-20 minutes

---

## Part 1: Backend Setup (10 minutes)

### Step 1: Create Neon Database (3 min)

1. Go to https://console.neon.tech
2. Click "Sign Up" (free, no credit card)
3. Click "Create Project"
   - Name: `todo-app`
   - Region: Choose closest to you
   - Click "Create"
4. **COPY** the connection string shown (looks like):
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
   Save this - you'll need it in next step!

### Step 2: Set Up Backend Directory (2 min)

Choose one option:

**Option A: Create new backend directory (Recommended)**
```bash
# Create a new backend folder
mkdir todo-backend
cd todo-backend

# Copy all backend files from templates
cp ../Hackathon-II/phase-II/backend-templates/* .
```

**Option B: Use existing phase-I directory**
```bash
cd phase-I

# Backup existing files
mkdir backup
mv src backup/

# Copy backend files
cp ../phase-II/backend-templates/* .
```

### Step 3: Run Setup Script (2 min)

```bash
# Make sure you're in the backend directory
python setup_backend.py
```

**The script will ask you:**

1. **Neon DATABASE_URL**: Paste the connection string from Step 1
2. **Frontend URL**: Press Enter for default `http://localhost:3000`

The script will:
- ✅ Generate a secure SECRET_KEY automatically
- ✅ Create .env file with all settings
- ✅ Validate your configuration

### Step 4: Install Dependencies (2 min)

```bash
pip install -r requirements.txt
```

If you get errors, try:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Start Backend Server (1 min)

```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

**Test it**: Open http://localhost:8000/docs in your browser
- You should see API documentation with all endpoints

---

## Part 2: Frontend Setup (5 minutes)

### Step 1: Navigate to Frontend

Open a **NEW terminal** (keep backend running):

```bash
cd path/to/Hackathon-II/phase-II
```

### Step 2: Verify Environment

Check if `.env.local` exists and has correct API URL:

```bash
# Windows
type .env.local

# Mac/Linux
cat .env.local
```

Should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not, create/update it:
```bash
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
```

### Step 3: Install Dependencies (if not done)

```bash
npm install
```

### Step 4: Start Frontend

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
```

---

## Part 3: Test Everything (5 minutes)

### Test 1: Visit the App

Open http://localhost:3000 in your browser

You should see the welcome page with "Get Started" button

### Test 2: Sign Up

1. Click "Get Started" or go to http://localhost:3000/signup
2. Create account:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `test123`
3. Click "Sign Up"

**Expected**: Redirected to dashboard with your user profile

### Test 3: Create a Task

1. Go to "All Tasks" (navigation menu)
2. Click "Add Task" button
3. Fill in:
   - Title: `Test my todo app`
   - Priority: `High`
   - Due Date: Tomorrow's date
   - Tags: `testing, demo`
4. Click "Add Task"

**Expected**: Task appears in the list

### Test 4: Verify Persistence

1. **Refresh the page** (F5)
2. Task should still be there!
3. Sign out and sign in again
4. Task should still be there!

**If this works, your database is connected! 🎉**

### Test 5: Edit & Delete

1. Click "Edit" on your task
2. Change the title
3. Click "Save Changes"
4. Click "Delete" and confirm

**Expected**: Changes persist, delete works

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can sign up and create account
- [ ] Can create tasks
- [ ] Tasks persist after page refresh
- [ ] Can edit and delete tasks
- [ ] No errors in browser console (F12)

**If all checked, you're ready for deployment! 🚀**

---

## 🆘 Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Fix**:
```bash
pip install -r requirements.txt
```

---

**Error**: `could not connect to server: Connection refused`

**Fix**:
1. Check DATABASE_URL in .env file
2. Make sure it ends with `?sslmode=require`
3. Check Neon project is active (not paused)

---

**Error**: `Port 8000 already in use`

**Fix**:
```bash
# Find and kill process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

---

### Frontend Issues

**Error**: `Failed to fetch` in console

**Fix**:
1. Make sure backend is running (check http://localhost:8000/health)
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Restart frontend dev server

---

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Fix**:
1. Backend main.py already has CORS configured
2. Make sure frontend URL in origins list
3. Restart backend server

---

### Database Issues

**Error**: `relation "users" does not exist`

**Fix**:
1. Tables are created automatically on startup
2. Check backend startup logs for errors
3. Restart backend server
4. If persists, check DATABASE_URL is correct

---

**Issue**: Tasks not persisting

**Fix**:
1. Check browser console for errors
2. Verify token is being sent (Network tab → Headers)
3. Sign out and sign in again
4. Check backend logs for database errors

---

## 📊 Visual Confirmation

### Backend Running Successfully

```
INFO:     Will watch for changes in these directories: ['/app']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Frontend Running Successfully

```
▲ Next.js 16.1.1 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Starting...
✓ Ready in 2.3s
```

### Browser Console (F12) - No Errors

Should see successful API calls:
```
GET http://localhost:8000/api/v1/todos 200 OK
POST http://localhost:8000/api/v1/todos 200 OK
```

---

## 🚀 Next: Deploy to Production

Once everything works locally:

1. **Deploy Backend** - Follow: `backend-templates/README_BACKEND.md` → Deploy to Hugging Face
2. **Deploy Frontend** - Follow: `DEPLOYMENT.md` → Deploy to Vercel
3. **Test Production** - Follow: `DEPLOYMENT.md` → Part 3 Testing

---

## 📁 File Structure Check

Your directories should look like:

```
todo-backend/  (or phase-I/)
├── main.py
├── requirements.txt
├── .env (created by setup script)
├── Dockerfile
└── .dockerignore

phase-II/
├── app/
├── lib/
├── .env.local (should exist)
├── package.json
└── [all frontend files]
```

---

## 🎯 Quick Commands Reference

```bash
# Backend
cd todo-backend  # (or phase-I)
python setup_backend.py          # First time setup
pip install -r requirements.txt  # Install dependencies
uvicorn main:app --reload --port 8000  # Start server

# Frontend (new terminal)
cd phase-II
npm install                      # Install dependencies
npm run dev                      # Start dev server

# Testing
curl http://localhost:8000/health  # Test backend
open http://localhost:3000         # Test frontend
```

---

## 💡 Pro Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Check logs first** - If something breaks, check terminal output
3. **Use /docs** - http://localhost:8000/docs to test API directly
4. **Clear browser cache** - If UI behaves strangely, clear cache (Ctrl+Shift+Delete)
5. **Restart helps** - When in doubt, restart both servers

---

## 🎉 You're Done!

If all tests passed, congratulations! You have:

✅ Neon PostgreSQL database
✅ FastAPI backend with authentication
✅ Next.js frontend with full features
✅ Complete CRUD operations
✅ Data persistence
✅ Ready for production deployment

**Next step**: Deploy to production when ready!

---

**Need More Help?**
- Backend details: `backend-templates/README_BACKEND.md`
- Deployment: `DEPLOYMENT.md`
- Troubleshooting: `BACKEND_SETUP.md`

**Quick Support**:
- Backend logs: Check terminal running backend
- Frontend logs: Check browser console (F12)
- API testing: Visit http://localhost:8000/docs
