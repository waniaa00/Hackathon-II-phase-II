# Debug 500/401 Authentication Errors on Vercel

## Current Status

You're experiencing these errors:
- ❌ 500 Internal Server Error on `/api/auth/sign-up/email`
- ❌ 401 Unauthorized on `/api/auth/sign-in/email`
- ❌ 401 Unauthorized on `/api/v1/todos` (cascading from auth failure)

## What I've Fixed in the Code

✅ **1. Runtime Configuration**
- Added `export const runtime = 'nodejs'` to auth route
- Required for database connections on Vercel
- Edge runtime doesn't support all PostgreSQL features

✅ **2. Error Handling**
- Added try-catch blocks in auth handler
- Detailed error logging for debugging
- Error responses now include messages

✅ **3. Database Connection**
- Simplified Neon serverless configuration
- Added connection test at startup
- Removed deprecated options

✅ **4. Better-Auth Configuration**
- Simplified database adapter setup
- Added detailed logging
- Verified environment variable checks

## Critical: Check Vercel Deployment Logs

The code changes will provide detailed error messages. Here's how to check them:

### Step 1: Access Function Logs

1. Go to https://vercel.com/dashboard
2. Click on your project: `hackathon-ii-phase-ii-ashy`
3. Go to **Deployments** tab
4. Click on the **latest deployment**
5. Click on the **Functions** tab
6. Look for `/api/auth/[...all]` function
7. Click **View Logs**

### Step 2: Look for These Log Messages

**Successful initialization looks like:**
```
[Better-Auth] Initializing with Neon PostgreSQL...
[Better-Auth] Base URL: https://hackathon-ii-phase-ii-ashy.vercel.app
[Better-Auth] Database connection successful
```

**Errors to watch for:**
```
[Better-Auth] DATABASE_URL is missing
[Better-Auth] BETTER_AUTH_SECRET is missing
[Better-Auth] BETTER_AUTH_URL is missing
[Better-Auth] Database connection failed: [error details]
[Better-Auth GET/POST] Error: [error details]
```

## Environment Variables Checklist

Verify ALL these variables are set on Vercel:

### Required Variables:

```bash
# 1. Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_1upq7BMmbPKj@ep-wild-rain-ahxe8z1r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
✓ Set for: Production, Preview, Development

# 2. Better-Auth Server URL
BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
✓ Set for: Production, Preview, Development

# 3. Better-Auth Client URL (CRITICAL!)
NEXT_PUBLIC_BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
✓ Set for: Production, Preview, Development

# 4. Better-Auth Secret
BETTER_AUTH_SECRET=7b4741f835aacfc5d8f44218c0c8937ee73ddb73d1b6131c0cec4e433463b190
✓ Set for: Production, Preview, Development

# 5. Backend API URL
NEXT_PUBLIC_API_URL=https://hackathon-ii-phase-ii.onrender.com
✓ Set for: Production, Preview, Development
```

## How to Verify Environment Variables

### Method 1: Via Vercel Dashboard

1. Project Settings → Environment Variables
2. Ensure EACH variable shows "3 environments" (Prod + Preview + Dev)
3. Click on each variable to verify the value is correct
4. No typos, no extra spaces, exact URLs

### Method 2: Test Deployment

After setting variables:
1. Go to Deployments tab
2. Click ⋯ on latest deployment
3. Click **Redeploy**
4. ☑ Check "Use existing Build Cache"
5. Wait for deployment to complete
6. Check Function Logs immediately

## Common Issues and Solutions

### Issue 1: "DATABASE_URL is missing"
**Solution:**
- Verify DATABASE_URL is set on Vercel
- Must include `?sslmode=require&channel_binding=require`
- Check for any trailing spaces or quotes

### Issue 2: "Error: Pool is not defined"
**Solution:**
- This means Neon serverless driver isn't working
- Verify you've redeployed after latest code push
- Check that runtime='nodejs' is in the route

### Issue 3: Still getting 500 after everything is set
**Possible causes:**
- Database tables don't exist (run init-better-auth.sql)
- Database credentials are incorrect
- Network issue between Vercel and Neon
- Check Function Logs for specific error

### Issue 4: NEXT_PUBLIC_BETTER_AUTH_URL not working
**Solution:**
- Must have NEXT_PUBLIC_ prefix
- Value must match BETTER_AUTH_URL exactly
- Must redeploy after adding it

## Testing Steps

After deployment completes with all variables set:

### 1. Test Database Connection
Open Neon SQL Editor and run:
```sql
SELECT * FROM "user" LIMIT 1;
SELECT * FROM "session" LIMIT 1;
```
If tables don't exist, run `scripts/init-better-auth.sql`

### 2. Test Signup
1. Open browser DevTools (F12) → Console
2. Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/signup
3. Enter email and password
4. Click "Create account"
5. Watch Console for errors

**Expected:**
- No console errors
- Redirect to /dashboard
- User created in database

### 3. Test Login
1. Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/login
2. Enter same credentials
3. Click "Sign in"

**Expected:**
- No 401 errors
- Redirect to /dashboard
- Session cookie set

### 4. Test Protected Routes
1. Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/dashboard
2. Check if todos load

**Expected:**
- No 401 errors on /api/v1/todos
- Dashboard loads successfully

## Emergency Debugging: Local Testing

If Vercel continues to fail, test locally:

```bash
# 1. Ensure .env.local has all variables
cat .env.local

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Test locally at http://localhost:3000
# Open signup page and test
```

If it works locally but not on Vercel:
- Problem is with Vercel environment variables
- Or Vercel → Neon network connectivity

## Get Specific Error Details

To see the actual error:

1. Open browser DevTools → Network tab
2. Try to sign up
3. Find the failed `/api/auth/sign-up/email` request
4. Click on it → Response tab
5. Copy the error response
6. Share it with me for specific debugging

## Expected Error Response Format

With the new error handling, you should see:
```json
{
  "error": "Internal server error",
  "message": "[Specific error message here]"
}
```

This message will tell us exactly what's failing.

## Next Steps

1. ✅ Code is fixed and pushed
2. ⏳ Wait for Vercel deployment to complete
3. ✅ Verify ALL environment variables on Vercel
4. ✅ Check Function Logs for initialization messages
5. ✅ Test signup/login flows
6. 📋 Share Function Log output if errors persist

## Quick Verification Command

You can verify your Neon database is accessible:
```bash
# Using psql (if installed)
psql "postgresql://neondb_owner:npg_1upq7BMmbPKj@ep-wild-rain-ahxe8z1r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Then run:
\dt
# Should show: user, session, account, verification tables
```

If tables don't exist, that's the problem!

## Summary

**Most Likely Cause:**
- Missing `NEXT_PUBLIC_BETTER_AUTH_URL` on Vercel (most common)
- Database tables not created (run init-better-auth.sql)
- Environment variables not applied to deployment (need redeploy)

**How to Confirm:**
- Check Vercel Function Logs
- Look for "[Better-Auth]" messages
- Share the specific error message you see

**Expected Result:**
All authentication should work once variables are set and deployment completes!
