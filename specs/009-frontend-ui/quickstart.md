# Quickstart: Todo App Frontend & UI

**Feature**: 009-frontend-ui
**Date**: 2026-02-05
**Purpose**: Setup guide and verification steps for frontend implementation

---

## Prerequisites

### Required Software

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm 8+
- Git

### Required Services

- Backend API running (008-backend-api) at `http://localhost:8000`
- Better Auth server configured
- PostgreSQL database (Neon) - via backend

### Environment Variables

Create `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/auth

# Better Auth (same as backend)
BETTER_AUTH_SECRET=<your-better-auth-secret>
BETTER_AUTH_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_APP_NAME="Todo App"
```

---

## Setup Steps

### 1. Initialize Next.js Project

```bash
cd /path/to/todo-app

# Create Next.js project with TypeScript and TailwindCSS
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd frontend
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install better-auth @better-auth/react
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Dev dependencies
npm install -D @types/node
```

### 3. Initialize shadcn/ui

```bash
npx shadcn@latest init

# Install required components
npx shadcn@latest add button input label
npx shadcn@latest add dialog alert-dialog
npx shadcn@latest add select dropdown-menu
npx shadcn@latest add checkbox badge
npx shadcn@latest add calendar popover
npx shadcn@latest add toast sonner
npx shadcn@latest add form
npx shadcn@latest add card
npx shadcn@latest add skeleton
```

### 4. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Verification Checklist

### Phase 1: Project Setup ✓

- [ ] Next.js 16+ with App Router initialized
- [ ] TypeScript strict mode enabled
- [ ] TailwindCSS configured
- [ ] shadcn/ui components installed
- [ ] Environment variables set
- [ ] Dev server runs without errors

```bash
# Verify
npm run dev
# Should see Next.js welcome page at http://localhost:3000
```

### Phase 2: Authentication ✓

- [ ] Better Auth client configured
- [ ] Login page renders at `/login`
- [ ] Signup page renders at `/signup`
- [ ] Middleware protects dashboard routes
- [ ] Session persists across refresh

```bash
# Test auth flow
1. Visit http://localhost:3000/login
2. Should see login form
3. Visit http://localhost:3000 (protected)
4. Should redirect to /login
```

### Phase 3: Task Management ✓

- [ ] Task list displays on dashboard
- [ ] Create task form works
- [ ] Edit task form works
- [ ] Delete task with confirmation works
- [ ] Toggle completion works
- [ ] Empty state displays when no tasks

```bash
# Test task CRUD
1. Login with test account
2. Create a new task
3. Verify it appears in list
4. Edit the task title
5. Toggle completion
6. Delete the task
```

### Phase 4: Filtering & Sorting ✓

- [ ] Filter by status works
- [ ] Filter by priority works
- [ ] Filter by tag works
- [ ] Search by title/description works
- [ ] Sort by all fields works
- [ ] Sort order toggle works

```bash
# Test filtering
1. Create tasks with different statuses
2. Filter by "completed" - verify only completed shown
3. Filter by "pending" - verify only pending shown
4. Search for specific text - verify results
```

### Phase 5: Priority & Tags ✓

- [ ] Priority dropdown shows options
- [ ] Priority badge displays correctly
- [ ] Tag picker shows user's tags
- [ ] Can create new tags
- [ ] Tags display on tasks
- [ ] Tag management page works

```bash
# Test priority/tags
1. Create task with "high" priority
2. Verify red priority badge
3. Add tags to task
4. Verify tags display
5. Create new tag from picker
```

### Phase 6: Due Dates ✓

- [ ] Date picker opens and works
- [ ] Due date displays on task
- [ ] Overdue indicator shows for past dates
- [ ] "Due today" indicator shows correctly
- [ ] Due date filters work

```bash
# Test due dates
1. Create task with due date tomorrow
2. Verify date displays
3. Change due date to yesterday
4. Verify overdue indicator appears
```

### Phase 7: Responsive Design ✓

- [ ] Desktop layout (1024px+) works
- [ ] Tablet layout (768px) works
- [ ] Mobile layout (320px) works
- [ ] Touch targets appropriately sized
- [ ] Navigation works on mobile

```bash
# Test responsive
1. Open browser dev tools
2. Toggle device toolbar
3. Test at 320px, 768px, 1024px widths
4. Verify all features accessible
```

### Phase 8: Accessibility ✓

- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Screen reader labels present
- [ ] No accessibility warnings in audit

```bash
# Test accessibility
1. Navigate app using only Tab key
2. Run Lighthouse accessibility audit
3. Score should be 90+
```

---

## Common Issues

### Issue: API connection failed

**Symptom**: Network errors, tasks don't load

**Solution**:
1. Verify backend is running at `NEXT_PUBLIC_API_URL`
2. Check CORS is configured for frontend origin
3. Verify JWT token is being sent

### Issue: Auth redirect loop

**Symptom**: Constant redirects between login and dashboard

**Solution**:
1. Check Better Auth session cookie is set
2. Verify middleware is checking correct cookie name
3. Clear cookies and try again

### Issue: Better Auth session not persisting

**Symptom**: Logged out after refresh

**Solution**:
1. Verify `BETTER_AUTH_SECRET` matches backend
2. Check cookie settings (secure, sameSite)
3. Ensure auth URL matches

### Issue: Components not styled

**Symptom**: Raw HTML without Tailwind styles

**Solution**:
1. Verify `globals.css` imports Tailwind
2. Check `tailwind.config.ts` content paths
3. Restart dev server

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

---

## File Structure Verification

After setup, verify these files exist:

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/           # shadcn components
│   ├── auth/         # auth components
│   └── tasks/        # task components
├── lib/
│   ├── api/          # API client
│   ├── auth/         # Better Auth client
│   └── utils/        # Utilities
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Test Accounts

For development, create test accounts via signup:

| Email | Password | Purpose |
|-------|----------|---------|
| test@example.com | password123 | Primary test account |
| test2@example.com | password123 | Multi-user testing |

---

## Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Task list load (100 items) | < 2s | Network tab |
| UI feedback | < 200ms | User testing |
| Lighthouse Performance | > 90 | Lighthouse audit |
| Lighthouse Accessibility | > 95 | Lighthouse audit |
