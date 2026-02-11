# Tasks: UI Improvements + Admin Dashboard with Analytics

**Feature**: 010-todo-frontend
**Branch**: `010-todo-frontend`
**Input**: Implementation plan from conversation (analytics dashboard + UI polish)
**Prerequisites**: 009-frontend-ui (complete), 008-backend-api (complete)
**Date Generated**: 2026-02-10

**Tests**: Not explicitly requested - implementation tasks only.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on existing project structure:
- Backend: `backend/app/`
- Frontend: `frontend/`
- App Router: `frontend/app/`
- Components: `frontend/components/`
- Library: `frontend/lib/`

## User Stories

- **US1** (P1): Backend Analytics Endpoint — As a user, I can retrieve aggregated task statistics via API
- **US2** (P2): Analytics Dashboard Page — As a user, I can view my task analytics with charts and stats
- **US3** (P3): Navigation + Home Page Stats — As a user, I can access analytics from nav and see quick stats on home page

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install required dependencies for charting

- [x] T001 Install shadcn chart component (Recharts) via `npx shadcn@latest add chart` in frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend schema and types that MUST exist before any frontend analytics work

- [x] T002 [P] Create stats response schemas (StatsResponse, PriorityCount, TagCount, DailyActivity) in backend/app/schemas/stats.py
- [x] T003 [P] Create TypeScript types for stats response (StatsResponse, PriorityCount, TagCount, DailyActivity) in frontend/lib/types/stats.ts
- [x] T004 Export stats types from frontend/lib/types/index.ts

**Checkpoint**: Foundation ready — backend schema and frontend types defined

---

## Phase 3: User Story 1 — Backend Analytics Endpoint (Priority: P1) 🎯 MVP

**Goal**: Deliver `GET /api/stats` returning aggregated task statistics per user

**Independent Test**: `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/stats` returns JSON with total_tasks, pending_tasks, completed_tasks, overdue_tasks, completion_rate, tasks_by_priority, tasks_by_tag, recent_activity

### Implementation for User Story 1

- [x] T005 [US1] Create stats service with SQL queries (count by status, overdue, by priority, by tag, 7-day activity) in backend/app/services/stats_service.py
- [x] T006 [US1] Create GET /api/stats endpoint with JWT auth in backend/app/api/v1/stats.py
- [x] T007 [US1] Register stats router in backend/app/api/v1/router.py
- [x] T008 [US1] Verify endpoint: `python -c "from app.api.v1.router import router; print([r.path for r in router.routes])"` shows /api/stats

**Checkpoint**: Backend analytics API is functional and returns aggregated stats

---

## Phase 4: User Story 2 — Analytics Dashboard Page (Priority: P2)

**Goal**: Deliver a full analytics dashboard at /analytics with stat cards, progress bar, charts, and tag distribution

**Independent Test**: Visit http://localhost:3000/analytics — should render stat cards (total, pending, completed, overdue), completion progress bar, priority bar chart, activity area chart, and tag distribution bars

### Implementation for User Story 2

- [x] T009 [P] [US2] Create stats API client (statsApi.get()) in frontend/lib/api/stats.ts
- [x] T010 [P] [US2] Export statsApi from frontend/lib/api/index.ts
- [x] T011 [US2] Create useStats hook wrapping statsApi in frontend/lib/hooks/use-stats.ts
- [x] T012 [P] [US2] Create StatCard component (icon, value, label) in frontend/components/analytics/stat-card.tsx
- [x] T013 [P] [US2] Create CompletionProgress component (progress bar + percentage) in frontend/components/analytics/completion-progress.tsx
- [x] T014 [P] [US2] Create PriorityChart component (horizontal bar chart via Recharts) in frontend/components/analytics/priority-chart.tsx
- [x] T015 [P] [US2] Create ActivityChart component (area chart for 7-day activity) in frontend/components/analytics/activity-chart.tsx
- [x] T016 [P] [US2] Create TagDistribution component (horizontal bars with tag colors) in frontend/components/analytics/tag-distribution.tsx
- [x] T017 [US2] Create analytics page composing all components in frontend/app/(dashboard)/analytics/page.tsx

**Checkpoint**: Full analytics dashboard is functional at /analytics with loading, error, and data states

---

## Phase 5: User Story 3 — Navigation + Home Page Stats Bar (Priority: P3)

**Goal**: Add Analytics nav link and a compact stats summary bar on the home page linking to /analytics

**Independent Test**: Nav bar shows "Analytics" link with BarChart3 icon; home page shows 4 mini stat values (total, pending, done, overdue) in a clickable bar

### Implementation for User Story 3

- [x] T018 [US3] Add BarChart3 import and Analytics nav item to navItems array in frontend/app/(dashboard)/layout.tsx
- [x] T019 [US3] Add useStats hook and compact stats summary bar (with Link to /analytics) above task list in frontend/app/(dashboard)/page.tsx

**Checkpoint**: Navigation shows Analytics link; home page shows quick stats bar

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification across all stories

- [x] T020 [P] Run TypeScript check: `npx tsc --noEmit` — zero errors
- [x] T021 [P] Run ESLint: `npx eslint .` — zero errors
- [x] T022 [P] Run backend tests: `python -m pytest tests/ -q` — all passing
- [x] T023 Verify backend imports: `python -c "from app.api.v1.stats import router"` succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — install chart component
- **Foundational (Phase 2)**: Depends on Setup — defines schemas and types
- **US1 (Phase 3)**: Depends on Foundational — backend endpoint
- **US2 (Phase 4)**: Depends on Foundational + US1 (needs API to fetch from)
- **US3 (Phase 5)**: Depends on US2 (needs useStats hook and analytics page to link to)
- **Polish (Phase 6)**: Depends on all stories complete

### User Story Dependencies

- **US1 (Backend Endpoint)**: Can start after Foundational (Phase 2)
- **US2 (Dashboard Page)**: Depends on US1 (backend must serve data)
- **US3 (Nav + Stats Bar)**: Depends on US2 (reuses useStats hook, links to /analytics)

### Within Each User Story

- Models/schemas before services
- Services before endpoints
- API clients before hooks
- Hooks before components
- Components before pages

### Parallel Opportunities

- T002, T003, T004 can run in parallel (backend schema + frontend types)
- T009, T010 can run in parallel with T011 prep
- T012–T016 (all chart components) can run in parallel
- T020–T023 (all verification checks) can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all chart components in parallel:
Task: "Create StatCard in frontend/components/analytics/stat-card.tsx"
Task: "Create CompletionProgress in frontend/components/analytics/completion-progress.tsx"
Task: "Create PriorityChart in frontend/components/analytics/priority-chart.tsx"
Task: "Create ActivityChart in frontend/components/analytics/activity-chart.tsx"
Task: "Create TagDistribution in frontend/components/analytics/tag-distribution.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Install chart component
2. Complete Phase 2: Backend schema + frontend types
3. Complete Phase 3: Backend stats endpoint
4. **STOP and VALIDATE**: Test GET /api/stats returns correct data
5. Proceed to dashboard UI

### Incremental Delivery

1. Setup + Foundational → Types defined
2. US1 → Backend API works → Validate with curl
3. US2 → Dashboard page renders charts → Validate visually
4. US3 → Nav link + home page stats bar → Validate navigation flow
5. Polish → All checks pass

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 23 |
| **US1 Tasks** | 4 |
| **US2 Tasks** | 9 |
| **US3 Tasks** | 2 |
| **Setup Tasks** | 1 |
| **Foundational Tasks** | 3 |
| **Polish Tasks** | 4 |
| **Parallel Opportunities** | 12 tasks marked [P] |
| **Status** | All 23 tasks COMPLETE ✅ |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- All tasks have been implemented and verified
- Commit after each task or logical group
