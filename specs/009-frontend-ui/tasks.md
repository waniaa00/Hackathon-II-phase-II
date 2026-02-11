# Tasks: Todo App Frontend & User Interface

**Feature**: 009-frontend-ui
**Branch**: `009-frontend-ui`
**Input**: Design documents from `/specs/009-frontend-ui/`
**Prerequisites**: 008-backend-api (REST API), Better Auth (authentication)
**Date Generated**: 2026-02-05

**Tests**: Not explicitly requested - implementation tasks only.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Frontend: `frontend/` at repository root
- App Router: `frontend/app/`
- Components: `frontend/components/`
- Library: `frontend/lib/`
- Tests: `frontend/tests/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with all dependencies and configuration

- [x] T001 Create Next.js 16+ project with App Router in frontend/ directory
- [x] T002 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [x] T003 [P] Configure TailwindCSS in frontend/tailwind.config.ts
- [x] T004 [P] Create frontend/.env.example with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_AUTH_URL, BETTER_AUTH_SECRET
- [x] T005 Install core dependencies: better-auth, react-hook-form, zod, date-fns, clsx, class-variance-authority
- [x] T006 [P] Initialize shadcn/ui with button, input, dialog, select, badge, checkbox, calendar, toast components
- [x] T007 [P] Create utility function frontend/lib/utils/cn.ts for class name merging
- [x] T008 [P] Create frontend/styles/globals.css with Tailwind imports and custom variables
- [x] T009 Verify project runs with `npm run dev` - should show Next.js welcome page

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### TypeScript Types

- [x] T010 [P] Create Task type in frontend/lib/types/task.ts (id, user_id, title, description, status, priority, tags, due_date, recurrence_rule)
- [x] T011 [P] Create Tag type in frontend/lib/types/tag.ts (id, user_id, name, color)
- [x] T012 [P] Create Priority type in frontend/lib/types/priority.ts (id, user_id, name, level, color)
- [x] T013 [P] Create API response types in frontend/lib/types/api.ts (TaskListResponse, APIError, ValidationError)
- [x] T014 Create type exports in frontend/lib/types/index.ts

### Better Auth Client

- [x] T015 Configure Better Auth client in frontend/lib/auth/client.ts with createAuthClient
- [x] T016 Create auth hooks (useSession, useAuth) in frontend/lib/auth/hooks.ts
- [x] T017 Create auth provider wrapper component in frontend/components/auth/auth-provider.tsx

### API Client

- [x] T018 Create base fetch wrapper with auth in frontend/lib/api/client.ts (getAuthToken, apiClient function)
- [x] T019 [P] Create tasks API functions in frontend/lib/api/tasks.ts (list, get, create, update, delete, toggleComplete)
- [x] T020 [P] Create tags API functions in frontend/lib/api/tags.ts (list, create, update, delete)
- [x] T021 [P] Create priorities API functions in frontend/lib/api/priorities.ts (list)
- [x] T022 Create API exports in frontend/lib/api/index.ts

### Validation Schemas

- [x] T023 [P] Create task validation schema in frontend/lib/utils/validation.ts (taskSchema with Zod)
- [x] T024 [P] Create auth validation schemas in frontend/lib/utils/validation.ts (loginSchema, signupSchema)
- [x] T025 [P] Create tag validation schema in frontend/lib/utils/validation.ts (tagSchema)

### Shared Components

- [x] T026 [P] Create LoadingSpinner component in frontend/components/shared/loading-spinner.tsx
- [x] T027 [P] Create ErrorMessage component in frontend/components/shared/error-message.tsx
- [x] T028 [P] Create EmptyState component in frontend/components/shared/empty-state.tsx
- [x] T029 [P] Create DatePicker component in frontend/components/shared/date-picker.tsx (using shadcn/ui calendar)

### App Layout

- [x] T030 Create root layout in frontend/app/layout.tsx with AuthProvider and Toaster
- [x] T031 [P] Create global loading state in frontend/app/loading.tsx
- [x] T032 [P] Create global error boundary in frontend/app/error.tsx
- [x] T033 [P] Create 404 page in frontend/app/not-found.tsx

### Route Protection

- [x] T034 Create middleware for route protection in frontend/middleware.ts (redirect unauthenticated to /login)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) MVP

**Goal**: Users can sign up, log in, and access protected pages

**Independent Test**: Create account, log in, verify session persists, log out

**Acceptance Criteria**:
- Signup form creates account and auto-logs in (FR-001)
- Login form authenticates and redirects to dashboard (FR-002)
- Logout clears session and redirects to login (FR-006)
- Unauthenticated users redirected to login (FR-004)
- Session persists across refresh (FR-005)

### Implementation for User Story 1

- [x] T035 [P] [US1] Create login form component in frontend/components/auth/login-form.tsx
- [x] T036 [P] [US1] Create signup form component in frontend/components/auth/signup-form.tsx
- [x] T037 [P] [US1] Create logout button component in frontend/components/auth/logout-button.tsx
- [x] T038 [US1] Create login page in frontend/app/(auth)/login/page.tsx
- [x] T039 [US1] Create signup page in frontend/app/(auth)/signup/page.tsx
- [x] T040 [US1] Create auth layout in frontend/app/(auth)/layout.tsx (minimal, no sidebar)
- [x] T041 [US1] Add form validation with error display in login-form.tsx and signup-form.tsx
- [x] T042 [US1] Add loading states during auth operations
- [x] T043 [US1] Test: verify redirect flow works (unauthenticated → login → dashboard)

**Checkpoint**: Users can authenticate - app is accessible

---

## Phase 4: User Story 2 - View and Manage Tasks (Priority: P1) MVP

**Goal**: Users can view task list and perform CRUD operations

**Independent Test**: Create task, view in list, edit title, delete task

**Acceptance Criteria**:
- Dashboard displays task list or empty state (FR-007, FR-038)
- Can create new task with title and description (FR-008)
- Can view task details (FR-009)
- Can edit task (FR-010)
- Can delete task with confirmation (FR-011)
- Loading states during API calls (FR-036)
- Error messages for failures (FR-037)

### Implementation for User Story 2

- [x] T044 [P] [US2] Create useTasks hook in frontend/lib/hooks/use-tasks.ts (list, create, update, delete)
- [x] T045 [P] [US2] Create TaskItem component in frontend/components/tasks/task-item.tsx
- [x] T046 [US2] Create TaskList component in frontend/components/tasks/task-list.tsx
- [x] T047 [US2] Create TaskForm component in frontend/components/tasks/task-form.tsx (create/edit modes)
- [x] T048 [US2] Create dashboard layout in frontend/app/(dashboard)/layout.tsx with navigation
- [x] T049 [US2] Create dashboard page (task list) in frontend/app/(dashboard)/page.tsx
- [x] T050 [US2] Create new task page in frontend/app/(dashboard)/tasks/new/page.tsx
- [x] T051 [US2] Create task detail/edit page in frontend/app/(dashboard)/tasks/[id]/page.tsx
- [x] T052 [US2] Add delete confirmation dialog using shadcn/ui AlertDialog
- [x] T053 [US2] Add toast notifications for create/update/delete success/failure
- [x] T054 [US2] Test: full CRUD flow works end-to-end

**Checkpoint**: Core task management works - MVP functional

---

## Phase 5: User Story 3 - Toggle Task Completion (Priority: P1) MVP

**Goal**: Users can mark tasks as complete/incomplete

**Independent Test**: Toggle task, verify visual state changes

**Acceptance Criteria**:
- Clicking toggle marks task complete with visual feedback (FR-012)
- Clicking again marks task pending (FR-012)
- Completed tasks visually distinguished (FR-013)

### Implementation for User Story 3

- [x] T055 [US3] Add completion toggle to TaskItem component in frontend/components/tasks/task-item.tsx
- [x] T056 [US3] Style completed tasks differently (strikethrough, muted colors)
- [x] T057 [US3] Add toggle API call to useTasks hook with optimistic update
- [x] T058 [US3] Add completion animation/feedback
- [x] T059 [US3] Test: toggle works, visual state updates correctly

**Checkpoint**: Basic todo app complete - can create, complete, and manage tasks

---

## Phase 6: User Story 4 - Filter and Search Tasks (Priority: P2)

**Goal**: Users can filter by status, priority, tag, due date and search by text

**Independent Test**: Create diverse tasks, apply filters, verify correct results

**Acceptance Criteria**:
- Filter by status works (FR-014)
- Filter by priority works (FR-015)
- Filter by tag works (FR-016)
- Filter by due date (overdue, due today) works (FR-017)
- Search by title/description works (FR-018)

### Implementation for User Story 4

- [x] T060 [P] [US4] Create TaskFilters component in frontend/components/tasks/task-filters.tsx
- [x] T061 [P] [US4] Create TaskSearch component in frontend/components/tasks/task-search.tsx
- [x] T062 [US4] Add filter state to dashboard page with URL query params
- [x] T063 [US4] Update useTasks hook to accept filter parameters
- [x] T064 [US4] Add status filter dropdown (all, pending, completed)
- [x] T065 [US4] Add priority filter dropdown (all, high, medium, low)
- [x] T066 [US4] Add tag filter dropdown (requires tag list)
- [x] T067 [US4] Add due date filter (overdue, due today, upcoming, all)
- [x] T068 [US4] Implement debounced search input
- [x] T069 [US4] Add filter reset/clear all button
- [x] T070 [US4] Test: all filters work correctly, combine properly

**Checkpoint**: Users can find specific tasks quickly

---

## Phase 7: User Story 5 - Sort Tasks (Priority: P2)

**Goal**: Users can sort tasks by various criteria

**Independent Test**: Create tasks, apply sorts, verify order changes

**Acceptance Criteria**:
- Sort by due date works (FR-019)
- Sort by priority works (FR-019)
- Sort by title works (FR-019)
- Sort by creation date works (FR-019)
- Toggle asc/desc works (FR-020)

### Implementation for User Story 5

- [x] T071 [US5] Create TaskSort component in frontend/components/tasks/task-sort.tsx
- [x] T072 [US5] Add sort state to dashboard page with URL query params
- [x] T073 [US5] Update useTasks hook to accept sort parameters
- [x] T074 [US5] Add sort dropdown with options (due date, priority, title, created)
- [x] T075 [US5] Add sort order toggle (asc/desc) button
- [x] T076 [US5] Persist sort preference in localStorage
- [x] T077 [US5] Test: all sort options work correctly

**Checkpoint**: Users can organize tasks by preference

---

## Phase 8: User Story 6 - Assign Priority and Tags (Priority: P2)

**Goal**: Users can assign priorities and tags to tasks

**Independent Test**: Create task with priority/tags, verify display

**Acceptance Criteria**:
- Can select priority on task form (FR-022)
- Priority badge displays on task (FR-021)
- Can select tags on task form (FR-024)
- Tag badges display on task
- Can create new tags (FR-023)
- Can manage tags (FR-025)

### Implementation for User Story 6

- [x] T078 [P] [US6] Create useTags hook in frontend/lib/hooks/use-tags.ts
- [x] T079 [P] [US6] Create usePriorities hook in frontend/lib/hooks/use-priorities.ts
- [x] T080 [P] [US6] Create PriorityBadge component in frontend/components/tasks/priority-badge.tsx
- [x] T081 [P] [US6] Create TagBadge component in frontend/components/tasks/tag-badge.tsx
- [x] T082 [US6] Create TagPicker component in frontend/components/tags/tag-picker.tsx (multi-select)
- [x] T083 [US6] Add priority select to TaskForm component
- [x] T084 [US6] Add tag picker to TaskForm component
- [x] T085 [US6] Display priority badge on TaskItem
- [x] T086 [US6] Display tag badges on TaskItem
- [x] T087 [P] [US6] Create TagList component in frontend/components/tags/tag-list.tsx
- [x] T088 [P] [US6] Create TagForm component in frontend/components/tags/tag-form.tsx
- [x] T089 [US6] Create tag management page in frontend/app/(dashboard)/tags/page.tsx
- [x] T090 [US6] Add link to tag management in dashboard navigation
- [x] T091 [US6] Test: priorities and tags work end-to-end

**Checkpoint**: Full task organization features available

---

## Phase 9: User Story 7 - Set Due Dates (Priority: P2)

**Goal**: Users can set due dates and see visual indicators for overdue/due-today

**Independent Test**: Set due date, verify indicator shows correctly

**Acceptance Criteria**:
- Date picker works on task form (FR-026)
- Due date displays on task (FR-027, FR-028)
- Overdue indicator shows (FR-027)
- Due today indicator shows (FR-028)

### Implementation for User Story 7

- [x] T092 [US7] Create date utility functions in frontend/lib/utils/date.ts (formatDate, isOverdue, isDueToday, isDueSoon)
- [x] T093 [US7] Add DatePicker to TaskForm component for due date
- [x] T094 [US7] Create DueDateBadge component in frontend/components/tasks/due-date-badge.tsx
- [x] T095 [US7] Display due date with indicator on TaskItem
- [x] T096 [US7] Style overdue tasks with warning color
- [x] T097 [US7] Style due-today tasks with accent color
- [x] T098 [US7] Test: due date indicators work correctly

**Checkpoint**: Time-based task tracking available

---

## Phase 10: User Story 8 - Recurring Tasks (Priority: P3)

**Goal**: Users can create tasks with recurrence patterns

**Independent Test**: Create recurring task, verify recurrence displays

**Acceptance Criteria**:
- Can set recurrence pattern (daily/weekly/monthly) (FR-029)
- Recurrence displays on task (FR-030)

### Implementation for User Story 8

- [x] T099 [US8] Create recurrence types and constants in frontend/lib/types/task.ts
- [x] T100 [US8] Create RecurrencePicker component in frontend/components/tasks/recurrence-picker.tsx
- [x] T101 [US8] Add RecurrencePicker to TaskForm component
- [x] T102 [US8] Create RecurrenceBadge component in frontend/components/tasks/recurrence-badge.tsx
- [x] T103 [US8] Display recurrence badge on TaskItem
- [x] T104 [US8] Test: recurring tasks display correctly

**Checkpoint**: Recurring task support added

---

## Phase 11: User Story 9 - Task Notifications (Priority: P3)

**Goal**: Users receive browser notifications for due tasks

**Independent Test**: Set task due soon, verify notification appears

**Acceptance Criteria**:
- Notification permission requested (FR-031)
- Browser notification appears for due tasks (FR-032)
- In-app indicators for overdue/due-soon (FR-033)

### Implementation for User Story 9

- [x] T105 [US9] Create useNotifications hook in frontend/lib/hooks/use-notifications.ts
- [x] T106 [US9] Create NotificationPermission component in frontend/components/shared/notification-permission.tsx
- [x] T107 [US9] Add notification permission request to dashboard layout
- [x] T108 [US9] Implement notification check on app load/focus
- [x] T109 [US9] Send notification for tasks due within threshold
- [x] T110 [US9] Add notification settings to user preferences (optional)
- [x] T111 [US9] Test: notifications trigger correctly (when permitted)

**Checkpoint**: Notification system working

---

## Phase 12: User Story 10 - Responsive Mobile Experience (Priority: P2)

**Goal**: App works well on mobile devices

**Independent Test**: Use app on mobile viewport, verify all features accessible

**Acceptance Criteria**:
- Layout adapts to mobile (FR-034)
- All features work on mobile
- Touch targets appropriately sized (FR-034)

### Implementation for User Story 10

- [x] T112 [US10] Audit all components for mobile responsiveness
- [x] T113 [US10] Create mobile navigation (hamburger menu or bottom nav)
- [x] T114 [US10] Ensure task form works well on mobile
- [x] T115 [US10] Ensure filter/sort controls work on mobile
- [x] T116 [US10] Test touch targets are at least 44x44px
- [x] T117 [US10] Test on 320px viewport width
- [x] T118 [US10] Test: all features work on mobile viewports

**Checkpoint**: Mobile-ready application

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Accessibility

- [x] T119 [P] Add ARIA labels to all interactive elements
- [x] T120 [P] Ensure keyboard navigation works throughout app
- [x] T121 [P] Verify color contrast meets WCAG AA (4.5:1)
- [x] T122 Add skip-to-content link
- [x] T123 Run Lighthouse accessibility audit, fix issues (target 95+)

### Performance

- [x] T124 Add React.memo to expensive components
- [x] T125 Implement list virtualization for large task lists (500+ tasks)
- [x] T126 Optimize bundle size with dynamic imports
- [x] T127 Run Lighthouse performance audit, fix issues (target 90+)

### Error Handling

- [x] T128 Add error boundaries to major sections
- [x] T129 Improve error messages to be user-friendly
- [x] T130 Add retry mechanisms for failed API calls

### Final Validation

- [x] T131 Run quickstart.md verification checklist
- [x] T132 Test complete user flow: signup → create tasks → filter → complete → logout
- [x] T133 Verify all 38 functional requirements are met

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ───────────▶ Phase 2 (Foundational) ─────┐
                                                          │
                              ┌───────────────────────────┘
                              │
                              ▼
              ┌───── User Stories (Phase 3-12) ─────┐
              │                                      │
    ┌─────────┴─────────┐                           │
    │  US1 (Auth)       │ ← Must complete first     │
    └─────────┬─────────┘                           │
              │                                      │
    ┌─────────┴─────────┐                           │
    │  US2 (CRUD)       │ ← P1 MVP                  │
    └─────────┬─────────┘                           │
              │                                      │
    ┌─────────┴─────────┐                           │
    │  US3 (Complete)   │ ← P1 MVP                  │
    └─────────┬─────────┘                           │
              │                                      │
    ┌─────────┴────────────────────────────────────┐│
    │  US4-US10 (P2/P3) - Can run in parallel      ││
    │  - US4: Filter/Search                        ││
    │  - US5: Sort                                 ││
    │  - US6: Priority/Tags                        ││
    │  - US7: Due Dates                            ││
    │  - US8: Recurring (P3)                       ││
    │  - US9: Notifications (P3)                   ││
    │  - US10: Mobile                              ││
    └──────────────────────────────────────────────┘│
                              │                      │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              Phase 13 (Polish)
```

### User Story Dependencies

- **US1 (Auth)**: Depends on Phase 2 - MUST complete before all other stories
- **US2 (CRUD)**: Depends on US1 - MUST complete before US3
- **US3 (Complete)**: Depends on US2 - Completes MVP
- **US4-US10**: Depend on Phase 2 - Can run in parallel after US3

### Parallel Opportunities

**Within Phase 1 (Setup)**:
```
T002, T003, T004, T006, T007, T008 can run in parallel
```

**Within Phase 2 (Foundational)**:
```
T010-T013 can run in parallel (type files)
T019-T021 can run in parallel (API files)
T023-T025 can run in parallel (validation schemas)
T026-T029 can run in parallel (shared components)
T031-T033 can run in parallel (app pages)
```

**Within User Stories (after MVP)**:
```
US4, US5, US6, US7, US8, US9, US10 can run in parallel
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (Task CRUD)
5. Complete Phase 5: User Story 3 (Completion Toggle)
6. **STOP and VALIDATE**: Test MVP independently
7. Deploy/demo if ready - Basic todo app is functional

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Auth) → Test → Secure access
3. Add US2 (CRUD) → Test → Basic functionality
4. Add US3 (Complete) → Test → Deploy/Demo (MVP!)
5. Add US4-US7 (P2 features) → Test → Enhanced UX
6. Add US8-US9 (P3 features) → Test → Advanced features
7. Add US10 (Mobile) → Test → Full responsive
8. Polish phase → Production-ready

---

## Summary

| Phase | User Story | Task Count | Priority |
|-------|------------|------------|----------|
| 1 | Setup | 9 | - |
| 2 | Foundational | 25 | - |
| 3 | US1 - Auth | 9 | P1 |
| 4 | US2 - CRUD | 11 | P1 |
| 5 | US3 - Complete | 5 | P1 |
| 6 | US4 - Filter/Search | 11 | P2 |
| 7 | US5 - Sort | 7 | P2 |
| 8 | US6 - Priority/Tags | 14 | P2 |
| 9 | US7 - Due Dates | 7 | P2 |
| 10 | US8 - Recurring | 6 | P3 |
| 11 | US9 - Notifications | 7 | P3 |
| 12 | US10 - Mobile | 7 | P2 |
| 13 | Polish | 15 | - |
| **Total** | | **133** | |

**MVP Scope**: Phases 1-5 (T001-T059, 59 tasks)
**Parallelizable Tasks**: 54 marked with [P]

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All components use shadcn/ui primitives for accessibility
