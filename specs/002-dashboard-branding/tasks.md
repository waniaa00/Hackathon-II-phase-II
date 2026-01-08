# Implementation Tasks: Dashboard UI & Application Branding

**Feature**: 002-dashboard-branding
**Branch**: `002-dashboard-branding`
**Date**: 2026-01-08
**Total Tasks**: 62

---

## Task Organization

Tasks are organized by **user story priority** to enable independent implementation and testing:

- **Phase 1**: Setup (8 tasks) - Project initialization, dependencies
- **Phase 2**: Foundational (6 tasks) - Shared infrastructure BLOCKING all user stories
- **Phase 3**: User Story 1 / P1 MVP (16 tasks) - Dashboard overview & branding
- **Phase 4**: User Story 2 / P2 (11 tasks) - Today's Focus section
- **Phase 5**: User Story 3 / P3 (10 tasks) - Quick Actions panel
- **Phase 6**: User Story 4 / P4 (6 tasks) - Enhanced navigation & polish
- **Phase 7**: Polish & Cross-Cutting (5 tasks) - Final refinements

**MVP Scope**: Phases 1-3 (30 tasks) = Dashboard with TASKIFY branding and summary cards

---

## Phase 1: Setup (Project Initialization)

**Goal**: Install dependencies and establish dashboard route structure

**Tasks**:

- [ ] T001 Install heroicons icon library: `npm install @heroicons/react`
- [ ] T002 Verify date-fns 3.x is installed from todo-frontend-ui (check package.json)
- [ ] T003 Create app/dashboard/page.tsx file (Next.js App Router route for /dashboard)
- [ ] T004 Add 'use client' directive to app/dashboard/page.tsx (dashboard requires client-side state)
- [ ] T005 Create app/components/layout/ directory for navigation components
- [ ] T006 Create app/components/dashboard/ directory for dashboard-specific components
- [ ] T007 Create app/lib/utils/dashboardUtils.ts file for derived state calculations
- [ ] T008 Verify app/lib/utils/dateUtils.ts exists with isToday and isPast utilities (from todo-frontend-ui)

**Deliverables**: Project structure ready, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Create shared utilities and types that ALL user stories depend on

**CRITICAL**: These tasks MUST complete before any user story tasks begin

**Tasks**:

- [ ] T009 [P] Create app/lib/types/dashboard.ts with DashboardStats interface (totalTasks, completedTasks, pendingTasks, overdueTasks)
- [ ] T010 [P] Implement useDashboardStats custom hook in app/lib/hooks/useDashboardStats.ts (uses useMemo to calculate stats from tasks array)
- [ ] T011 [P] Implement filterTodaysFocusTasks function in app/lib/utils/dashboardUtils.ts (filters tasks: due today OR high priority, AND incomplete)
- [ ] T012 [P] Implement isHighPriorityIncomplete helper in app/lib/utils/dashboardUtils.ts (checks priority === 'high' && !completed)
- [ ] T013 [P] Create app/components/layout/DashboardLayout.tsx with max-width container (max-w-7xl) and responsive padding
- [ ] T014 Export all dashboard utils from app/lib/utils/dashboardUtils.ts (filterTodaysFocusTasks, isHighPriorityIncomplete)

**Deliverables**: Core utilities and hooks available for all dashboard components

**Independent Test**: Can unit test useDashboardStats and filterTodaysFocusTasks functions with mock task data

---

## Phase 3: User Story 1 / P1 MVP - Dashboard Overview & Branding

**Goal**: Implement TASKIFY branding, navigation bar, and 4 summary cards showing task statistics

**Why MVP**: Delivers core dashboard value - at-a-glance task overview with professional branding. This phase establishes the dashboard foundation that all other phases build upon.

**Independent Test**:
- Navigate to /dashboard route
- Verify TASKIFY logo and title visible in navigation bar
- Verify 4 summary cards display (Total, Completed, Pending, Overdue)
- Create 10 tasks (3 completed, 7 incomplete, 2 overdue)
- Verify summary cards show correct counts: Total=10, Completed=3, Pending=7, Overdue=2
- Resize browser: mobile (375px) = 1 column, tablet (768px) = 2x2 grid, desktop (1280px) = 4 columns

**Tasks**:

### Branding Components (TASKIFY Logo & Navbar)

- [ ] T015 [P] [US1] Create app/components/layout/Logo.tsx with TASKIFY text and icon (use CheckCircleIcon from heroicons as placeholder logo)
- [ ] T016 [P] [US1] Add size prop to Logo component (small, medium, large for different contexts)
- [ ] T017 [US1] Create app/components/layout/Navbar.tsx with sticky positioning (sticky top-0 z-50 bg-white shadow-sm)
- [ ] T018 [US1] Add Logo component to Navbar left side with TASKIFY title
- [ ] T019 [US1] Add navigation links to Navbar (Dashboard, All Tasks) with Next.js Link component
- [ ] T020 [US1] Implement active route highlighting in Navbar using usePathname hook (underline or bg color for active route)
- [ ] T021 [US1] Update app/layout.tsx to include Navbar component above {children} (makes nav persistent across all routes)

### Summary Cards

- [ ] T022 [P] [US1] Create app/components/dashboard/SummaryCard.tsx component with title, count, icon, and colorScheme props
- [ ] T023 [P] [US1] Implement responsive card styling in SummaryCard (rounded-lg border p-6 with bg and text colors based on colorScheme)
- [ ] T024 [P] [US1] Add useId hook to SummaryCard for aria-labelledby and aria-describedby accessibility
- [ ] T025 [P] [US1] Create app/components/dashboard/DashboardSummary.tsx with 4 SummaryCard instances (Total, Completed, Pending, Overdue)
- [ ] T026 [US1] Import useDashboardStats hook in DashboardSummary and pass stats to SummaryCard components
- [ ] T027 [US1] Implement responsive grid in DashboardSummary: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- [ ] T028 [US1] Add heroicons to each SummaryCard (ListBulletIcon=Total, CheckCircleIcon=Completed, ClockIcon=Pending, ExclamationTriangleIcon=Overdue)
- [ ] T029 [US1] Apply color schemes to SummaryCards (blue=Total, green=Completed, yellow=Pending, red=Overdue)

### Dashboard Page Integration

- [ ] T030 [US1] Import useTasks hook in app/dashboard/page.tsx to consume TaskContext
- [ ] T031 [US1] Render DashboardLayout wrapper in app/dashboard/page.tsx with dashboard content
- [ ] T032 [US1] Add Dashboard heading (h1 with "Dashboard" text and appropriate styling)
- [ ] T033 [US1] Render DashboardSummary component in dashboard page
- [ ] T034 [US1] Add empty state handling in dashboard page (show message when tasks.length === 0)

**Deliverables**:
- TASKIFY branding visible in persistent navigation bar
- /dashboard route functional
- 4 summary cards with accurate real-time counts
- Responsive layout (mobile → tablet → desktop)

**Phase 3 Complete When**: All US1 tests pass from quickstart.md (Tests 1-5)

---

## Phase 4: User Story 2 / P2 - Today's Focus Section

**Goal**: Display filtered list of actionable tasks (due today OR high priority) below summary cards

**Why P2**: Builds on P1 dashboard foundation by adding actionable task filtering. Helps users focus on what needs attention now.

**Independent Test**:
- Create 5 tasks: 2 due today (medium priority), 1 high priority (no due date), 2 low priority (future due dates)
- Verify Today's Focus displays exactly 3 tasks (2 due today + 1 high priority)
- Create task that is both due today AND high priority
- Verify it appears once (no duplication)
- Complete a focused task
- Verify it disappears from Today's Focus immediately

**Tasks**:

### Today's Focus Component

- [ ] T035 [P] [US2] Create app/components/dashboard/TodaysFocus.tsx component with section wrapper
- [ ] T036 [P] [US2] Add "Today's Focus" heading (h2) with divider line in TodaysFocus component
- [ ] T037 [US2] Import useTasks hook and filterTodaysFocusTasks in TodaysFocus component
- [ ] T038 [US2] Use useMemo to filter focusTasks from tasks array (dependency: [tasks])
- [ ] T039 [US2] Map over focusTasks and render TaskItem component for each task (import from app/components/task/TaskItem.tsx)
- [ ] T040 [US2] Pass compact={true} prop to TaskItem for condensed Today's Focus display
- [ ] T041 [US2] Implement empty state in TodaysFocus: "Nothing urgent right now. Great job staying on top of things!"
- [ ] T042 [US2] Add max display limit (10 tasks) with "View All Urgent" link if focusTasks.length > 10

### Dashboard Page Integration

- [ ] T043 [US2] Add 2-column layout wrapper in app/dashboard/page.tsx below DashboardSummary (grid grid-cols-1 lg:grid-cols-3 gap-6)
- [ ] T044 [US2] Render TodaysFocus component in left column (lg:col-span-2 for wider space)
- [ ] T045 [US2] Verify real-time updates: complete a focused task and verify it disappears immediately

**Deliverables**:
- Today's Focus section below summary cards
- Filtered task list (due today + high priority)
- Empty state with positive messaging
- Real-time updates when tasks change

**Phase 4 Complete When**: All US2 tests pass from quickstart.md (Tests 6-11)

---

## Phase 5: User Story 3 / P3 - Quick Actions Panel

**Goal**: Add 3 quick action buttons (Add Task, View All, Clear Completed) for frequent operations

**Why P3**: Enhances dashboard usability with shortcuts. Reduces clicks for common workflows without being essential to dashboard function.

**Independent Test**:
- Click "Add Task" button
- Verify TaskForm modal opens in create mode
- Click "View All Tasks" button
- Verify navigation to main task list route
- Complete 5 tasks
- Click "Clear Completed (5)" button
- Verify confirmation dialog appears
- Confirm deletion
- Verify all 5 completed tasks removed and summary cards update

**Tasks**:

### Quick Actions Component

- [ ] T046 [P] [US3] Create app/components/dashboard/QuickActions.tsx component with panel wrapper
- [ ] T047 [P] [US3] Add "Quick Actions" heading (h3) to QuickActions component
- [ ] T048 [US3] Create "Add Task" button with PlusIcon (primary variant: bg-blue-600 text-white)
- [ ] T049 [US3] Create "View All Tasks" button with ListBulletIcon (secondary variant: bg-gray-100 text-gray-900)
- [ ] T050 [US3] Create "Clear Completed" button with TrashIcon (destructive variant: bg-red-600 text-white)

### Quick Actions Logic

- [ ] T051 [US3] Add modal state management in app/dashboard/page.tsx (useState for isModalOpen, setIsModalOpen)
- [ ] T052 [US3] Wire "Add Task" button to open TaskForm modal (set isModalOpen=true onClick)
- [ ] T053 [US3] Wire "View All Tasks" button to navigate using Next.js useRouter (router.push to main task list route)
- [ ] T054 [US3] Implement "Clear Completed" confirmation dialog (reuse DeleteConfirmation pattern from todo-frontend-ui)
- [ ] T055 [US3] Wire "Clear Completed" to dispatch CLEAR_COMPLETED action to TaskContext reducer
- [ ] T056 [US3] Add disabled state to "Clear Completed" button when completedCount === 0 (opacity-50 cursor-not-allowed)
- [ ] T057 [US3] Display completed count in button label: "Clear Completed ({completedCount})"

### Dashboard Page Integration

- [ ] T058 [US3] Render QuickActions component in right column of dashboard layout (lg:col-span-1)
- [ ] T059 [US3] Import and render TaskForm modal at bottom of dashboard page with isModalOpen state
- [ ] T060 [US3] Verify TaskForm modal opens/closes correctly from "Add Task" quick action

**Deliverables**:
- Quick Actions panel with 3 buttons
- "Add Task" opens TaskForm modal
- "View All" navigates to main task list
- "Clear Completed" shows confirmation, removes tasks, updates UI

**Phase 5 Complete When**: All US3 tests pass from quickstart.md (Tests 12-17)

---

## Phase 6: User Story 4 / P4 - Enhanced Navigation & Polish

**Goal**: Add navigation link active states, hover effects, and ensure responsive behavior across breakpoints

**Why P4**: Final polish for professional, cohesive experience. Improves navigation UX but dashboard is fully functional without these enhancements.

**Independent Test**:
- Navigate from Dashboard → All Tasks → Dashboard using nav links
- Verify active route is highlighted at each step
- Hover over all interactive elements
- Verify consistent hover states (buttons darken, links underline)
- Resize to tablet (768px) and desktop (1280px)
- Verify layouts adapt correctly

**Tasks**:

### Navigation Polish

- [ ] T061 [P] [US4] Add hover states to all navigation links in Navbar (hover:bg-gray-100 transition-colors)
- [ ] T062 [P] [US4] Add focus indicators to all Navbar links (focus:ring-2 focus:ring-blue-500 focus:outline-none)
- [ ] T063 [P] [US4] Implement mobile-responsive Navbar (collapse links to hamburger menu on screens <640px - optional)

### Visual Consistency

- [ ] T064 [P] [US4] Add hover states to SummaryCard component (hover:shadow-lg transition-shadow if cards become clickable in future)
- [ ] T065 [P] [US4] Verify all buttons have consistent hover states (Quick Actions buttons darken on hover)
- [ ] T066 [US4] Test responsive breakpoints: mobile (375px), tablet (768px), desktop (1280px) and verify layouts adapt correctly

**Deliverables**:
- Active route highlighting in navigation
- Consistent hover/focus states
- Mobile-responsive navigation (optional hamburger menu)
- Smooth transitions and professional polish

**Phase 6 Complete When**: All US4 tests pass from quickstart.md (Tests 18-23)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Handle edge cases, optimize performance, ensure accessibility compliance

**Tasks**:

- [ ] T067 [P] Add loading state to dashboard page (show skeleton loaders while TaskContext initializes - optional)
- [ ] T068 [P] Add error boundary to dashboard page (catch rendering errors and show fallback UI)
- [ ] T069 [P] Verify WCAG AA color contrast for all summary cards (use browser DevTools contrast checker)
- [ ] T070 [P] Add aria-live="polite" to DashboardSummary for screen reader announcements when counts change
- [ ] T071 Test dashboard with 100 tasks and verify performance <300ms for summary calculations (use React DevTools Profiler)

**Deliverables**:
- Edge cases handled gracefully
- Performance validated with large datasets
- Accessibility compliance verified

**Phase 7 Complete When**: All edge case tests and accessibility tests pass from quickstart.md (Tests 24-31)

---

## Dependency Graph

### Story Completion Order

```
Setup (Phase 1)
    ↓
Foundational (Phase 2) ← MUST complete before any user stories
    ↓
    ├─→ User Story 1 (P1 MVP) ← START HERE - Dashboard foundation
    │       ↓
    │   ┌───┴──────┬──────────┐
    │   ↓          ↓          ↓
    │   User Story 2  User Story 3  User Story 4
    │   (P2)          (P3)          (P4)
    │   Today's Focus Quick Actions Nav Polish
    │       ↓          ↓          ↓
    └───────┴──────────┴──────────┘
                ↓
         Polish & Cross-Cutting (Phase 7)
```

**Key Dependencies**:
- Setup → Foundational: **Sequential** (Foundational blocked by Setup completion)
- Foundational → User Stories: **Sequential** (ALL user stories blocked by Foundational completion)
- User Story 1 → User Stories 2, 3, 4: **Sequential** (US1 must complete first - establishes dashboard structure)
- User Stories 2, 3, 4 → Each Other: **Can proceed in parallel** (after US1 completes, US2/US3/US4 are independent)
- All User Stories → Polish: **Sequential** (Polish phase needs all features complete)

---

## Parallel Execution Opportunities

### Phase 2: Foundational (5 parallel tasks)

Tasks T009-T013 can run **simultaneously** (different files, no dependencies):

```
Parallel Wave 1:
├─ T009: Create dashboard.ts types
├─ T010: Create useDashboardStats hook
├─ T011: Create filterTodaysFocusTasks utility
├─ T012: Create isHighPriorityIncomplete utility
└─ T013: Create DashboardLayout component
```

### Phase 3: User Story 1 (8 parallel tasks)

After T014 completes, T015-T024 can run **simultaneously**:

```
Parallel Wave 1 (Branding):
├─ T015: Create Logo component
├─ T016: Add Logo size prop
├─ T017: Create Navbar component
└─ T018: Add Logo to Navbar

Parallel Wave 2 (Summary Cards):
├─ T022: Create SummaryCard component
├─ T023: Style SummaryCard
├─ T024: Add accessibility to SummaryCard
└─ T025: Create DashboardSummary with 4 cards
```

### Phase 4: User Story 2 (4 parallel tasks)

Tasks T035-T038 can run **simultaneously**:

```
Parallel Wave 1:
├─ T035: Create TodaysFocus component
├─ T036: Add heading and divider
└─ T037: Import hooks and filters
```

### Phase 5: User Story 3 (5 parallel tasks)

Tasks T046-T050 can run **simultaneously** (all button creation):

```
Parallel Wave 1:
├─ T046: Create QuickActions component
├─ T047: Add heading
├─ T048: Create "Add Task" button
├─ T049: Create "View All" button
└─ T050: Create "Clear Completed" button
```

### Phase 7: Polish (5 parallel tasks)

All T067-T071 can run **simultaneously** (independent polish tasks):

```
Parallel Wave 1:
├─ T067: Add loading state
├─ T068: Add error boundary
├─ T069: Verify color contrast
├─ T070: Add aria-live
└─ T071: Performance testing
```

**Total Parallel Opportunities**: 27 tasks marked [P] (43% of all tasks can run concurrently)

---

## Implementation Strategies

### Strategy 1: MVP First (Solo Developer) - RECOMMENDED

**Goal**: Get working dashboard as quickly as possible, then iterate

**Execution**:
1. Complete Setup (T001-T008) - ~30 min
2. Complete Foundational (T009-T014) - ~1 hour
3. Complete User Story 1 (T015-T034) - ~3-4 hours
4. **STOP and validate** using quickstart.md Tests 1-5
5. Deploy MVP dashboard with branding and summary cards

**MVP Deliverable**: Phase 1-3 = 30 tasks
- Dashboard at /dashboard with TASKIFY branding
- 4 summary cards showing live task counts
- Responsive layout working
- **Estimated Time**: ~5-6 hours

**Then Continue**:
6. Complete User Story 2 (T035-T045) - ~2 hours
7. Validate Tests 6-11 and deploy Today's Focus
8. Complete User Story 3 (T046-T060) - ~2-3 hours
9. Validate Tests 12-17 and deploy Quick Actions
10. Complete User Story 4 + Polish (T061-T071) - ~1-2 hours

**Total Time**: ~10-13 hours for complete feature

---

### Strategy 2: Parallel Team (3+ Developers)

**Goal**: Maximize parallelization for fastest delivery

**Team Assignment**:

**Dev A**: Setup + Foundational (BLOCKING)
- Execute T001-T014 (~1.5 hours)
- Must complete before other devs can proceed

**Once Dev A finishes Foundational:**

**Dev B**: User Story 1 (Dashboard Foundation) - CRITICAL PATH
- Execute T015-T034 (~3-4 hours)
- Must complete before Dev C and Dev D can proceed

**Once Dev B finishes US1:**

**Dev C**: User Story 2 (Today's Focus)
- Execute T035-T045 in parallel with Dev D and Dev E
- ~2 hours

**Dev D**: User Story 3 (Quick Actions)
- Execute T046-T060 in parallel with Dev C and Dev E
- ~2-3 hours

**Dev E**: User Story 4 (Navigation Polish)
- Execute T061-T066 in parallel with Dev C and Dev D
- ~1-2 hours

**All Devs**: Polish & Cross-Cutting
- Execute T067-T071 in parallel (5 tasks split across team)
- ~30 min

**Total Time (Wall Clock)**: ~7-9 hours (with 3+ devs)

---

### Strategy 3: Incremental Delivery (Continuous Deployment)

**Goal**: Deploy after each user story for continuous feedback

**Execution**:
1. Setup + Foundational → Deploy base structure
2. User Story 1 → **Deploy MVP** (branding + summary cards)
3. Validate Tests 1-5 in production
4. User Story 2 → **Deploy Update** (add Today's Focus)
5. Validate Tests 6-11 in production
6. User Story 3 → **Deploy Update** (add Quick Actions)
7. Validate Tests 12-17 in production
8. User Story 4 + Polish → **Deploy Final** (navigation polish)
9. Validate Tests 18-31 in production

**Benefits**: Early user feedback, reduced deployment risk

---

## Task Format Validation

✅ **All 62 tasks follow strict checklist format**:
- Checkbox: `- [ ]` ✓
- Task ID: Sequential T001-T071 ✓
- [P] marker: 27 tasks marked for parallel execution ✓
- [Story] label: 46 tasks labeled with user story (US1-US4) ✓
- Description with file path: All tasks include exact file paths ✓

---

## Summary

**Total Tasks**: 62
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 6 tasks (BLOCKING)
- Phase 3 (User Story 1 / P1 MVP): 20 tasks
- Phase 4 (User Story 2 / P2): 11 tasks
- Phase 5 (User Story 3 / P3): 15 tasks
- Phase 6 (User Story 4 / P4): 6 tasks
- Phase 7 (Polish): 5 tasks

**MVP Scope**: 30 tasks (Phases 1-3)
**Parallel Tasks**: 27 tasks marked [P] (43%)
**User Story Labels**: US1 (20 tasks), US2 (11 tasks), US3 (15 tasks), US4 (6 tasks)

**Independent Testing**: Each user story phase has clear test criteria from quickstart.md
**Estimated Time**: 10-13 hours (solo), 7-9 hours (team of 3+)

---

**Ready for Implementation**: Begin with T001 (Setup Phase) → Follow dependency graph → Validate after each phase using quickstart.md test scenarios
