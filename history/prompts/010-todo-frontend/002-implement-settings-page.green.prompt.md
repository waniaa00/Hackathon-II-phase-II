---
id: 002
title: Implement User Profile & Settings Page
stage: green
date: 2026-02-11
surface: agent
model: claude-opus-4-6
feature: 010-todo-frontend
branch: 010-todo-frontend
user: wania
command: implement
labels: ["settings", "profile", "password", "account-deletion"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/lib/auth/server.ts
  - frontend/lib/utils/validation.ts
  - frontend/app/(dashboard)/settings/page.tsx
  - frontend/components/shared/navbar.tsx
tests:
  - npx tsc --noEmit (PASS - no new errors)
---

## Prompt

Implement the following plan:

# Plan: User Profile & Settings Page

## Context
There is no user profile or settings page. Authenticated users can only log out. We need a full settings page with profile editing, password change, account deletion, and theme preference — all using existing Better Auth APIs and project patterns.

## Steps
1. Enable account deletion in Better Auth server config
2. Add validation schemas (profile + change password)
3. Create settings page with 3 cards (Profile, Change Password, Danger Zone)
4. Add Settings link to navbar (desktop + mobile)
5. Verify `/settings` is protected by default (no middleware change needed)

## Response snapshot

Implemented all 4 changes:

1. **server.ts**: Added `deleteUser: { enabled: true }` to unlock `POST /api/auth/delete-user`
2. **validation.ts**: Added `profileSchema` (name min 1, max 50) and `changePasswordSchema` (currentPassword required, newPassword min 8, confirmNewPassword refine match)
3. **settings/page.tsx**: Created full settings page with:
   - Profile card: edit name, email displayed read-only, saves via `authClient.updateUser()`
   - Change Password card: current/new/confirm fields, calls `authClient.changePassword()`
   - Danger Zone card: AlertDialog with password confirmation, calls `authClient.deleteUser()`
4. **navbar.tsx**: Added Settings gear icon to desktop actions and mobile Sheet menu

TypeScript compilation passes (only pre-existing `@types/ws` warning remains).

## Outcome

- ✅ Impact: Users can now manage profile, change password, and delete account from /settings
- 🧪 Tests: TypeScript compilation passes with no new errors
- 📁 Files: 1 created, 3 modified
- 🔁 Next prompts: Test end-to-end flows, add theme preference persistence
- 🧠 Reflection: Better Auth's `updateUser`, `changePassword`, and `deleteUser` client methods integrate cleanly with React Hook Form + Zod pattern

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): tsc --noEmit PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add avatar upload or theme persistence
