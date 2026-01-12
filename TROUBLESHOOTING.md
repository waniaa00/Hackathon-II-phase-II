# Better-Auth Troubleshooting Guide

## Issue: 500 Error on `/api/auth/sign-in/email`

This error occurs when the Better-Auth server configuration is not properly set up. Follow these steps to resolve:

### Step 1: Verify Environment Variables on Vercel

Go to your Vercel project settings and ensure these environment variables are set:

```env
# Required for Better-Auth Server
BETTER_AUTH_SECRET=<your-secret-key-at-least-32-characters>
BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app
DATABASE_URL=<your-neon-postgresql-connection-string>

# Required for Better-Auth Client (frontend)
NEXT_PUBLIC_BETTER_AUTH_URL=https://hackathon-ii-phase-ii-ashy.vercel.app

# Required for API calls
NEXT_PUBLIC_API_URL=https://hackathon-ii-phase-ii.onrender.com
```

**IMPORTANT**: Both `BETTER_AUTH_URL` (server) and `NEXT_PUBLIC_BETTER_AUTH_URL` (client) must be set to the same value (your Vercel deployment URL).

**Generate a secure secret:**
```bash
# Run this in your terminal to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Initialize Database Tables

The Better-Auth tables need to be created in your Neon PostgreSQL database.

1. Open your Neon PostgreSQL dashboard
2. Go to the SQL Editor
3. Run the SQL script located at `scripts/init-better-auth.sql`

Or use the command line:
```bash
psql $DATABASE_URL -f scripts/init-better-auth.sql
```

### Step 3: Verify Backend is Running

Make sure your backend at `https://hackathon-ii-phase-ii.onrender.com` is running and healthy:

```bash
curl https://hackathon-ii-phase-ii.onrender.com/health
```

### Step 4: Check Better-Auth Configuration

Verify that `lib/auth-server.ts` has the correct configuration:

```typescript
export const auth = betterAuth({
  database: pool, // PostgreSQL connection pool
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
})
```

### Step 5: Redeploy

After setting environment variables and initializing the database:

1. Commit your changes
2. Push to GitHub
3. Vercel will automatically redeploy
4. Wait for the deployment to complete
5. Test the login again

### Common Issues

#### Issue: "Pool is not defined" or "Cannot connect to database"
**Solution:** Make sure the DATABASE_URL environment variable is correctly set in Vercel and points to your Neon PostgreSQL database.

#### Issue: "Secret is required"
**Solution:** Set the BETTER_AUTH_SECRET environment variable with a secure random string (at least 32 characters).

#### Issue: "Table 'user' doesn't exist"
**Solution:** Run the `init-better-auth.sql` script in your database to create the required tables.

#### Issue: CORS errors
**Solution:** Verify that your backend CORS configuration includes the Vercel domain:
```python
allow_origins=[
    "https://hackathon-ii-phase-ii-ashy.vercel.app",
    "http://localhost:3000",
]
```

### Testing Authentication

Once everything is set up, test the authentication flow:

1. Navigate to `/signup`
2. Create a new account
3. Check if you're redirected to `/dashboard`
4. Try logging out and logging back in
5. Verify that protected routes require authentication

### Debug Mode

To see detailed error messages, check:
1. Vercel Function Logs: Go to your deployment → Functions tab
2. Backend Logs: Check Render logs for your backend service
3. Browser Console: Check for detailed error messages

### Need Help?

If you're still experiencing issues:
1. Check Vercel deployment logs
2. Check Render backend logs
3. Verify all environment variables are set correctly
4. Ensure database tables are created
5. Test the database connection separately
