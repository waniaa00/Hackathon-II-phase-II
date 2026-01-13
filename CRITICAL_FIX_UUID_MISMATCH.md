# CRITICAL: UUID vs TEXT Type Mismatch

## Problem Discovered

Your backend models and Better-Auth database schema have **incompatible ID types**:

**Better-Auth Creates:**
- `user.id` = **TEXT** (string IDs like "KpRS3QF9Mb71Hkti3M8ZpfT6aZ1Ksj1Z")

**Backend Expects:**
- `User.id` = **UUID** (format like "550e8400-e29b-41d4-a716-446655440000")
- `Todo.user_id` = **UUID** (foreign key to User.id)

**Result:** Even if auth works, the todos API will fail because it can't match TEXT IDs with UUID fields!

---

## Solution: Run ALL These Commands Together

Copy and paste this ENTIRE block into Neon SQL Editor:

```sql
-- STEP 1: Drop existing tables to start fresh
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "todo" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- STEP 2: Create user table with UUID id (Better-Auth compatible)
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY,  -- TEXT to match Better-Auth
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "name" TEXT,  -- NULLABLE to allow signup without name
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "image" TEXT
);

-- STEP 3: Create sessions table
CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT
);

-- STEP 4: Create accounts table
CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- STEP 5: Create verification table
CREATE TABLE "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- STEP 6: Create todos table with TEXT user_id to match Better-Auth
CREATE TABLE "todo" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "due_date" TIMESTAMP,
  "tags" TEXT[],
  "is_recurring" BOOLEAN DEFAULT FALSE,
  "frequency" TEXT,
  "interval" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- STEP 7: Create indexes for performance
CREATE INDEX "session_token_idx" ON "session"("token");
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE INDEX "account_userId_idx" ON "account"("userId");
CREATE INDEX "todo_user_id_idx" ON "todo"("user_id");
CREATE INDEX "todo_status_idx" ON "todo"("status");
CREATE INDEX "todo_due_date_idx" ON "todo"("due_date");

-- STEP 8: Verify the schema
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('user', 'todo')
  AND column_name IN ('id', 'user_id', 'name')
ORDER BY table_name, column_name;
```

---

## Expected Output After Running

You should see:

```
table_name | column_name | data_type | is_nullable
-----------|-------------|-----------|------------
todo       | id          | text      | NO
todo       | user_id     | text      | NO
user       | id          | text      | NO
user       | name        | text      | YES
```

Key points:
- ✅ All IDs are TEXT
- ✅ user_id in todo matches user.id type
- ✅ name is nullable (YES)

---

## What This Fixes

### Issue 1: Name Column (422 Error)
- **Before:** name NOT NULL → signup fails
- **After:** name nullable → signup works ✅

### Issue 2: UUID vs TEXT Mismatch (Todos 401 Error)
- **Before:** user.id=TEXT, todo.user_id=UUID → no match → 401
- **After:** user.id=TEXT, todo.user_id=TEXT → match works ✅

---

## After Running This

### Test 1: Signup
```
Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/signup
Email: test@example.com
Password: password123
Name: (leave blank)
```

**Expected:** ✅ Success, redirects to dashboard

### Test 2: Login
```
Visit: https://hackathon-ii-phase-ii-ashy.vercel.app/login
Use same credentials
```

**Expected:** ✅ Login works

### Test 3: Todos
```
Dashboard should load
Todos should be empty initially (no 401 error)
Create a todo → should work
```

**Expected:** ✅ No 401 errors on /api/v1/todos

---

## Important Notes

⚠️ **This drops all existing data!** If you have test users/todos, they'll be deleted.

✅ **This is safe** because you're still in development and testing.

✅ **Run this once** - it creates everything correctly from scratch.

---

## Alternative: Keep Existing Users

If you want to keep existing users (though there shouldn't be any that work):

```sql
-- Just fix the name column
ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;

-- Add todos table if it doesn't exist
CREATE TABLE IF NOT EXISTS "todo" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "due_date" TIMESTAMP,
  "tags" TEXT[],
  "is_recurring" BOOLEAN DEFAULT FALSE,
  "frequency" TEXT,
  "interval" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS "todo_user_id_idx" ON "todo"("user_id");
```

---

## Why This Matters

**Authentication Flow:**
1. User signs up → Better-Auth creates user with TEXT id
2. User logs in → Better-Auth creates session with TEXT userId
3. User accesses todos → Backend needs to filter by user_id
4. **If types don't match → 401 error!**

**With This Fix:**
1. User signs up → TEXT id ✅
2. User logs in → TEXT userId ✅
3. User accesses todos → user_id matches ✅
4. **Everything works!** 🎉

---

## TL;DR

1. Open Neon SQL Editor
2. Copy the ENTIRE first SQL block (all steps)
3. Paste and run it
4. Verify output shows all TEXT types
5. Test signup → works
6. Test todos → works
7. Done! 🚀
