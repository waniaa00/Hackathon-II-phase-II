# Todo App Deployment Guide

This guide covers deploying the frontend to Vercel and integrating with the backend API.

## Current Status

### Frontend (phase-II) - READY FOR DEPLOYMENT ✅
- API client integration complete
- Environment configuration ready
- Authentication flow implemented
- All task operations connected to API
- Build-ready Next.js application

### Backend (phase-I) - REQUIRES SETUP ⚠️
The backend needs to be deployed separately with database configuration.

---

## Part 1: Frontend Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Backend API URL (after backend deployment)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Frontend ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `phase-II`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.hf.space
   ```

   Replace `your-backend-url.hf.space` with your actual Hugging Face Space URL after backend deployment.

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your deployment URL: `https://your-app.vercel.app`

### Step 3: Update Environment for Production

After deployment, you can update environment variables in:
- Vercel Dashboard → Your Project → Settings → Environment Variables

---

## Part 2: Backend Requirements (phase-I)

The backend needs the following setup before the frontend can work:

### Database Setup (Neon PostgreSQL)

1. **Create Neon Account**
   - Visit https://neon.tech
   - Sign up for free account
   - Create new project

2. **Get Database URL**
   ```
   postgresql://user:password@host/dbname?sslmode=require
   ```

3. **Update Backend Environment**
   The backend needs a `.env` file with:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### CORS Configuration

The backend must allow requests from your Vercel domain:

```python
# In backend main.py or app.py
origins = [
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Add your Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Backend Deployment to Hugging Face

1. **Create Dockerfile** (in phase-I directory)
   ```dockerfile
   FROM python:3.11-slim

   WORKDIR /app

   COPY pyproject.toml uv.lock ./
   RUN pip install uv && uv pip install --system -r pyproject.toml

   COPY src ./src

   EXPOSE 7860

   CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```

2. **Create Space on Hugging Face**
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Name: `todo-api`
   - SDK: Docker
   - Visibility: Public or Private

3. **Add Environment Variables in Space Settings**
   ```
   DATABASE_URL=your-neon-postgres-url
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Push to Hugging Face**
   ```bash
   git remote add hf https://huggingface.co/spaces/username/todo-api
   git push hf main
   ```

---

## Part 3: Testing the Integration

### Local Testing (Before Deployment)

1. **Start Backend Locally**
   ```bash
   cd ../phase-I
   # Follow backend setup instructions
   ```

2. **Start Frontend**
   ```bash
   cd phase-II
   npm run dev
   ```

3. **Test Authentication**
   - Go to http://localhost:3000/signup
   - Create account
   - Sign in
   - Verify dashboard shows user profile

4. **Test Task Operations**
   - Add new task
   - Edit task
   - Mark complete/incomplete
   - Delete task
   - Verify all operations work

### Production Testing

After deployment:

1. **Test Sign Up Flow**
   - Visit `https://your-app.vercel.app/signup`
   - Create new account
   - Verify redirect to dashboard

2. **Test Authentication**
   - Sign out
   - Sign in with created account
   - Verify session persistence

3. **Test Task CRUD**
   - Create tasks with all fields
   - Edit tasks
   - Delete tasks
   - Verify data persists across sessions

---

## Part 4: Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptom**: Console shows "CORS policy" errors

**Solution**: Update backend CORS settings to include your Vercel URL

#### 2. API Connection Failed
**Symptom**: "Failed to fetch" or network errors

**Solution**:
- Verify `NEXT_PUBLIC_API_URL` is correct in Vercel
- Check backend is running and accessible
- Verify backend URL is HTTPS (Hugging Face provides this)

#### 3. Authentication Not Working
**Symptom**: Sign up/sign in fails

**Solution**:
- Check backend database is properly configured
- Verify SECRET_KEY is set in backend
- Check browser console for specific error messages

#### 4. Tasks Not Persisting
**Symptom**: Tasks disappear on page refresh

**Solution**:
- Verify backend database connection
- Check authentication token is being stored
- Verify API endpoints are returning proper responses

---

## Part 5: Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Development
# or
NEXT_PUBLIC_API_URL=https://username-todo-api.hf.space  # Production
```

### Backend (phase-I/.env)
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
SECRET_KEY=your-secret-key-minimum-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Part 6: Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Hugging Face
- [ ] Database created on Neon
- [ ] Environment variables configured on both platforms
- [ ] CORS updated with production URLs
- [ ] Sign up flow tested
- [ ] Sign in flow tested
- [ ] Task CRUD operations tested
- [ ] Data persistence verified
- [ ] Error handling tested
- [ ] Mobile responsiveness verified

---

## Security Notes

1. **Never commit `.env.local`** - It's in .gitignore
2. **Use strong SECRET_KEY** - Minimum 32 random characters
3. **Use HTTPS in production** - Both Vercel and Hugging Face provide this
4. **Rotate tokens regularly** - Update SECRET_KEY periodically
5. **Monitor logs** - Check Vercel and Hugging Face logs for errors

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Hugging Face Spaces**: https://huggingface.co/docs/hub/spaces
- **Neon PostgreSQL**: https://neon.tech/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Rollback Plan

If issues occur after deployment:

1. **Revert Frontend**
   - Vercel Dashboard → Deployments → Previous Deployment → Promote to Production

2. **Revert Backend**
   - Hugging Face Space → Files → Revert commit

3. **Database Issues**
   - Neon has point-in-time recovery for last 7 days
   - Contact Neon support if needed

---

Last Updated: 2026-01-07
