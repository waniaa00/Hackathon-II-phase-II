# Vercel Environment Variables Setup

## Critical: Fix 401/500 Authentication Errors

The authentication errors you're experiencing are caused by missing/incorrect environment variables on Vercel. Follow these steps to fix them:

## Step 1: Access Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project: `hackathon-ii-phase-ii-ashy`
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar

## Step 2: Set Required Environment Variables

Add/verify the following environment variables. **IMPORTANT**: Set them for all environments (Production, Preview, Development):

### Better-Auth Server Variables

```
Variable Name: BETTER_AUTH_SECRET
Value: 7b4741f835aacfc5d8f44218c0c8937ee73ddb73d1b6131c0cec4e433463b190
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Variable Name: BETTER_AUTH_URL
Value: https://hackathon-ii-phase-ii-ashy.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Variable Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_1upq7BMmbPKj@ep-wild-rain-ahxe8z1r-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
Environments: ✓ Production ✓ Preview ✓ Development
```

### Better-Auth Client Variable (NEW - CRITICAL!)

```
Variable Name: NEXT_PUBLIC_BETTER_AUTH_URL
Value: https://hackathon-ii-phase-ii-ashy.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

**⚠️ THIS IS THE MISSING VARIABLE CAUSING THE 401/500 ERRORS!**

### Backend API Variable

```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://hackathon-ii-phase-ii.onrender.com
Environments: ✓ Production ✓ Preview ✓ Development
```

## Step 3: Redeploy

After adding/updating the environment variables:

1. Go to the **Deployments** tab
2. Click on the three dots (⋯) next to the latest deployment
3. Select **Redeploy**
4. Check ☑ **Use existing Build Cache**
5. Click **Redeploy**

**OR** simply wait for the automatic deployment triggered by the git push to complete.

## Step 4: Verify

Once the deployment completes:

1. Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/signup
2. Try creating a new account
3. Check browser console - there should be no 500 errors
4. After signup, you should be redirected to the dashboard
5. Try logging out and logging back in

## Understanding the Variables

### Why Two BETTER_AUTH_URL Variables?

- **BETTER_AUTH_URL**: Used by the server-side Better-Auth configuration
- **NEXT_PUBLIC_BETTER_AUTH_URL**: Used by the client-side auth client

Next.js requires the `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in the browser (client-side code).

### Security Notes

- `BETTER_AUTH_SECRET`: 32+ character secret for JWT signing (keep private!)
- `DATABASE_URL`: Your Neon PostgreSQL connection string (keep private!)
- `NEXT_PUBLIC_*` variables: Publicly accessible in the browser (don't put secrets here!)

## Common Issues

### Issue: Still getting 500 errors after setting variables
**Solution**:
1. Verify all variables are set correctly (no typos)
2. Ensure variables are checked for all environments
3. Perform a fresh redeploy (without cache)
4. Check Vercel Function Logs for detailed error messages

### Issue: 401 Unauthorized on /api/v1/todos
**Solution**: This error occurs when authentication fails. Once the 500 error on signup/login is fixed, this will resolve automatically.

### Issue: Variables not taking effect
**Solution**: Environment variables only take effect after redeployment. Always redeploy after changing environment variables.

## Verification Checklist

After deployment, verify:
- [ ] Signup creates new users successfully
- [ ] Login authenticates existing users
- [ ] Session persists across page reloads
- [ ] Protected routes (dashboard, todos) require authentication
- [ ] Logout clears session properly
- [ ] No console errors during authentication flows

## Need Help?

If issues persist:
1. Check Vercel Function Logs: Deployments → Select deployment → Functions tab
2. Check browser console for detailed error messages
3. Verify database tables exist (run scripts/init-better-auth.sql if needed)
4. Test database connection separately using Neon SQL Editor
