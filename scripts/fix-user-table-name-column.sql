-- Fix User Table Name Column
-- This script makes the "name" column nullable to allow signup without a name
-- Run this on your Neon PostgreSQL database to fix the 422 error

-- Make the name column nullable
ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'user' AND column_name = 'name';

-- Expected output: is_nullable should be 'YES'
