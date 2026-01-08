# Implementation Plan: Dashboard UI & Application Branding

**Branch**: `002-dashboard-branding` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dashboard-branding/spec.md`

**Note**: This plan defines the architecture and implementation strategy for adding a modern dashboard and TASKIFY branding layer to the Todo App, leveraging existing todo-frontend-ui infrastructure.

---

## Summary

Build a comprehensive dashboard experience with TASKIFY branding that provides at-a-glance task insights, actionable focus filtering, and quick access to core operations. The dashboard will include a persistent navigation bar with TASKIFY logo/title, 4 summary cards (Total/Completed/Pending/Overdue), a Today's Focus section filtering tasks due today or high-priority incomplete, and a Quick Actions panel with shortcuts for Add Task, View All, and Clear Completed operations. Implementation reuses existing TaskContext provider and components (TaskItem, TaskForm, DeleteConfirmation) from todo-frontend-ui, with all functionality client-side using derived state calculations.

**Core Value Proposition**: Transform the Todo App into a recognizable, branded product (TASKIFY) with a professional dashboard hub that provides immediate task context and improves navigation while maintaining strict frontend-only architecture and component reusability.

---

## Technical Context

**Language/Version**: TypeScript 5.3+ (consistent with todo-frontend-ui)
**Primary Dependencies**:
- Next.js 14+ (App Router - dashboard route at `/dashboard`)
- React 18+ (Client Components for interactive dashboard)
- Tailwind CSS 3.4+ (mobile-first responsive grid layouts)
- date-fns 3.x (date comparison utilities from todo-frontend-ui: `isToday`, `isPast`)
- lucide-react or heroicons (icon library for summary cards and quick actions)

**Storage**: N/A (consumes existing TaskContext client-side state from todo-frontend-ui)
**Testing**: Not specified in current phase (validation via quickstart manual test scenarios)
**Target Platform**: Modern web browsers (Chrome 120+, Firefox 121+, Safari 17+, Edge 120+) - same as todo-frontend-ui
**Project Type**: Web frontend (Next.js App Router page at `/dashboard` within existing todo app)
**Performance Goals**:
- Dashboard initial render <2s
- Summary card calculations <300ms for 100 tasks (useMemo optimization)
- Today's Focus filtering <200ms for 100 tasks (useMemo optimization)
- Real-time UI updates <100ms when task state changes

**Constraints**:
- Frontend-only (no backend, APIs, or persistence - matches todo-frontend-ui)
- Reuse existing TaskContext and components (TaskItem, TaskForm, DeleteConfirmation)
- Mobile-first responsive design (320px min viewport)
- WCAG AA accessibility compliance
- All patterns trace to Context7 MCP documentation (Next.js, React, Tailwind, MDN)

**Scale/Scope**:
- Target: 10-100 tasks per user (typical use case)
- Support: Up to 1000 tasks without performance degradation
- 8 new UI components (Navbar, Logo, SummaryCard, DashboardSummary, TodaysFocus, QuickActions, DashboardLayout, dashboard page)
- 57 functional requirements implemented
- 4 prioritized user stories (P1-P4)
- Integration: Reuses 3 components from todo-frontend-ui (TaskItem, TaskForm, DeleteConfirmation)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Quality Gates (Constitution v2.0.0)

**✅ PASS**: Spec-Driven Development
- Specification created and validated (spec.md) before implementation planning
- All 57 functional requirements documented across 9 categories
- 20+ acceptance scenarios defined across 4 user stories
- Zero ambiguous requirements
- Requirements checklist: 16/16 PASS

**✅ PASS**: Documentation-First Correctness
- Technical decisions will trace to Context7 MCP sources only:
  - Next.js App Router: https://nextjs.org/docs (routing, layouts, client components)
  - React: https://react.dev/reference/react (hooks: useMemo, useContext, useState)
  - Tailwind CSS: https://tailwindcss.com/docs (responsive grids, color schemes, spacing)
  - Browser APIs: https://developer.mozilla.org/en-US/ (date comparison, local timezone)
- No blog posts, tutorials, or StackOverflow references permitted
- Icon library (lucide-react or heroicons) uses official documentation only

**✅ PASS**: UI-First Design
- Dashboard serves UI needs (information display, navigation shortcuts)
- State consumed from existing TaskContext (no new state management)
- Derived state (summary counts, filtered tasks) calculated from base Task[] array
- No backend assumptions in dashboard logic

**✅ PASS**: Deterministic Frontend Behavior
- Summary counts derived via useMemo (pure calculations from task array)
- Today's Focus filtering via useMemo (deterministic date/priority logic)
- No hidden side effects in rendering
- Predictable UI updates when TaskContext state changes

**✅ PASS**: Technology Constraints
- Next.js App Router (required) ✅ - `/dashboard` route
- TypeScript (required) ✅ - all dashboard components typed
- React (required) ✅ - Client Components with hooks
- Tailwind CSS exclusive styling (required) ✅ - no custom CSS beyond Tailwind utilities
- No forbidden technologies: Pages Router ❌, non-Tailwind CSS ❌, unofficial UI libraries ❌

**✅ PASS**: Scope Boundaries
- Frontend-only: No backend, APIs, auth, persistence ✅
- Client-side dashboard with derived state ✅
- Reuses existing todo-frontend-ui infrastructure ✅
- Navigation and branding additions only ✅

**Compliance Status**: **ALL GATES PASS** - Ready for Phase 0 research

---

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-branding/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (dashboard patterns, integration patterns)
├── data-model.md        # Phase 1 output (DashboardStats, TodaysFocusCriteria)
├── quickstart.md        # Phase 1 output (setup, dashboard validation)
├── contracts/           # Phase 1 output (component interfaces)
│   ├── dashboard-types.ts   # DashboardStats, SummaryCard, QuickActionButton props
│   └── focus-filters.ts     # TodaysFocusCriteria filtering logic
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (complete - 16/16 PASS)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

This feature extends the existing Next.js App Router structure with new dashboard components:

```text
app/
├── layout.tsx                    # Root layout with TaskProvider (existing - from todo-frontend-ui)
├── page.tsx                      # Main task list page (existing - from todo-frontend-ui)
├── dashboard/
│   └── page.tsx                  # NEW: Dashboard route at /dashboard
├── globals.css                   # Tailwind directives (existing)
├── components/
│   ├── task/                     # EXISTING (from todo-frontend-ui)
│   │   ├── TaskForm.tsx          # Reused for "Add Task" quick action
│   │   ├── TaskItem.tsx          # Reused for Today's Focus section
│   │   └── DeleteConfirmation.tsx # Reused for "Clear Completed" confirmation
│   ├── layout/                   # NEW: Dashboard layout components
│   │   ├── Navbar.tsx            # Persistent navigation bar with TASKIFY branding
│   │   ├── Logo.tsx              # TASKIFY logo component (icon + text)
│   │   └── DashboardLayout.tsx   # Max-width container for dashboard sections
│   ├── dashboard/                # NEW: Dashboard-specific components
│   │   ├── SummaryCard.tsx       # Reusable summary card (Total, Completed, Pending, Overdue)
│   │   ├── DashboardSummary.tsx  # 4-card grid layout wrapper
│   │   ├── TodaysFocus.tsx       # Filtered task list (due today + high priority)
│   │   └── QuickActions.tsx      # 3 action buttons (Add Task, View All, Clear Completed)
│   ├── ui/                       # EXISTING (from todo-frontend-ui)
│   │   ├── Button.tsx            # Reused in QuickActions
│   │   ├── Badge.tsx             # Reused in TodaysFocus for priority badges
│   │   └── EmptyState.tsx        # Reused in TodaysFocus empty state
│   └── providers/
│       └── TaskProvider.tsx      # EXISTING: Context provider (from todo-frontend-ui)
├── lib/
│   ├── types/
│   │   ├── task.ts               # EXISTING: Task, FilterState types (from todo-frontend-ui)
│   │   └── dashboard.ts          # NEW: DashboardStats, TodaysFocusCriteria types
│   ├── hooks/
│   │   └── useTasks.ts           # EXISTING: Hook to consume TaskContext (from todo-frontend-ui)
│   └── utils/
│       ├── dateUtils.ts          # EXISTING: isToday, isPast from todo-frontend-ui
│       └── dashboardUtils.ts     # NEW: calculateDashboardStats, filterTodaysFocus
```

**Structure Decision**: Extend existing Next.js App Router structure with new `/dashboard` route and dashboard-specific components while maximizing reuse of todo-frontend-ui components (TaskItem, TaskForm, DeleteConfirmation, Button, Badge, EmptyState) and utilities (dateUtils, TaskContext).

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations detected. All gates pass. No complexity tracking needed.*

---

## Phase 0: Research & Technical Decisions

**Goal**: Resolve all technical unknowns by consulting Context7 MCP documentation sources (Next.js, React, Tailwind CSS, MDN).

### Research Tasks

1. **Dashboard Route Structure** (Next.js App Router)
   - **Unknown**: Best practice for adding `/dashboard` route alongside existing routes
   - **Documentation Source**: Next.js App Router routing documentation
   - **Research Question**: How to structure App Router pages with multiple sibling routes?

2. **Derived State Performance** (React useMemo)
   - **Unknown**: useMemo patterns for calculating summary counts and filtering tasks
   - **Documentation Source**: React useMemo hook reference
   - **Research Question**: When to use useMemo for derived calculations? What are the dependency patterns?

3. **Responsive Grid Layouts** (Tailwind CSS)
   - **Unknown**: Grid layout patterns for summary cards (1 column mobile → 2x2 tablet → 4 column desktop)
   - **Documentation Source**: Tailwind CSS responsive design and grid utilities
   - **Research Question**: How to implement responsive grid with Tailwind breakpoints?

4. **Navigation Bar Persistence** (Next.js Layout)
   - **Unknown**: Where to place navigation bar for cross-route persistence
   - **Documentation Source**: Next.js layouts and templates documentation
   - **Research Question**: Should Navbar be in root layout or shared layout component?

5. **Date Comparison in Browser** (MDN Date API)
   - **Unknown**: Client-side date comparison for "due today" filtering with local timezone
   - **Documentation Source**: MDN Date API reference
   - **Research Question**: How to compare dates in local timezone without server calls?

6. **Component Reuse Patterns** (React composition)
   - **Unknown**: Best practices for reusing TaskItem from todo-frontend-ui in dashboard context
   - **Documentation Source**: React composition vs inheritance guide
   - **Research Question**: How to pass dashboard-specific props to reused components?

7. **Icon Integration** (lucide-react or heroicons)
   - **Unknown**: Which icon library aligns with Next.js/React/Tailwind stack
   - **Documentation Source**: lucide-react or heroicons official documentation
   - **Research Question**: Installation, usage patterns, and accessibility for icon components?

8. **Modal State Coordination** (React state management)
   - **Unknown**: How to trigger TaskForm modal from Quick Actions when modal state is in TaskForm component
   - **Documentation Source**: React state lifting and composition patterns
   - **Research Question**: Should modal state be lifted to parent or use callback props?

9. **Batch Deletion Pattern** (TaskContext actions)
   - **Unknown**: Pattern for "Clear Completed" action (single action vs multiple DELETE_TASK dispatches)
   - **Documentation Source**: React useReducer patterns for batch operations
   - **Research Question**: Should we add CLEAR_COMPLETED action or iterate DELETE_TASK?

10. **Accessibility for Card Grids** (ARIA + Semantic HTML)
    - **Unknown**: Proper ARIA attributes and semantic HTML for summary card grid
    - **Documentation Source**: MDN ARIA and semantic HTML guides
    - **Research Question**: Should summary cards be interactive (buttons/links) or static (divs)?

**Output**: `research.md` with 10 documented decisions (D1-D10), each including:
- Decision made
- Rationale based on Context7 MCP documentation
- Alternatives considered
- Implementation notes

---

## Phase 1: Design & Contracts

**Goal**: Define data model, TypeScript contracts, and quickstart validation guide.

### Deliverables

#### 1. data-model.md

**Derived State Entities**:

- **DashboardStats** (derived from TaskState.tasks[])
  - totalTasks: number
  - completedTasks: number
  - pendingTasks: number
  - overdueTasks: number
  - Calculation logic documented

- **TodaysFocusCriteria** (filtering logic)
  - isDueToday(task, currentDate)
  - isHighPriorityIncomplete(task)
  - filterTodaysFocusTasks(tasks[])

**UI Component Data**:

- **SummaryCardData**
  - label: string
  - count: number
  - icon: string/component
  - colorScheme: 'blue' | 'green' | 'yellow' | 'red'

#### 2. contracts/dashboard-types.ts

```typescript
// DashboardStats interface
// SummaryCardProps interface
// QuickActionButtonProps interface
// DashboardLayoutProps interface
```

#### 3. contracts/focus-filters.ts

```typescript
// TodaysFocusCriteria type
// filterTodaysFocusTasks function signature
// isDueToday utility type
// isHighPriorityIncomplete utility type
```

#### 4. quickstart.md

**Sections**:
- Prerequisites (same as todo-frontend-ui + dashboard addition)
- Setup: Install dependencies (lucide-react or heroicons), run dev server
- Validation: 15+ test scenarios across 4 user stories:
  - US1 (P1): TASKIFY branding visible, summary cards show accurate counts, responsive grid
  - US2 (P2): Today's Focus displays filtered tasks, empty state works, real-time updates
  - US3 (P3): Quick Actions open modals/navigate correctly, Clear Completed confirmation works
  - US4 (P4): Navigation bar persists, active route highlighted, consistent design
- Troubleshooting: Dashboard not rendering, summary cards show 0, icons not loading

#### 5. Agent Context Update

Run: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

**New Capabilities to Add**:
- Dashboard UI with TASKIFY branding
- Summary cards with derived state calculations
- Today's Focus filtering (due today + high priority)
- Quick Actions panel with modal integration
- Navigation bar with persistent routing

---

## Phase 2: Constitution Check (Post-Design)

**Goal**: Re-evaluate all 6 constitution gates after Phase 1 artifacts are complete.

### Re-Evaluation Criteria

1. **Spec-Driven Development**: Verify all Phase 1 artifacts trace to spec.md requirements
2. **Documentation-First Correctness**: Confirm research.md references only Context7 MCP sources
3. **UI-First Design**: Verify derived state serves dashboard UI needs without backend assumptions
4. **Deterministic Frontend Behavior**: Confirm useMemo patterns documented in research.md are deterministic
5. **Technology Constraints**: Verify no forbidden technologies introduced
6. **Scope Boundaries**: Confirm dashboard remains frontend-only with no backend dependencies

**Expected Result**: ALL GATES PASS (if violations, document in Complexity Tracking)

---

## Implementation Phases (User-Provided Context)

*The following phases were provided by the user as implementation guidance and will inform task generation in Phase 2 (/sp.tasks):*

### Phase 1: Project Setup & Routing
- Create `/dashboard` route using App Router
- Define DashboardLayout component
- Set responsive max-width container

### Phase 2: Branding & Navigation Bar
- Create Logo component (TASKIFY text + icon)
- Create Navbar component (sticky header, navigation links, mobile-responsive)

### Phase 3: Dashboard Overview Summary
- Create SummaryCard component
- Create DashboardSummary component (4-card grid)
- Implement derived count calculations

### Phase 4: Today's Focus Section
- Create TodaysFocus component
- Implement filtering logic (due today, high priority, incomplete)
- Reuse TaskList/TaskItem components

### Phase 5: Quick Actions Panel
- Create QuickActions component
- Wire up "Add Task" modal trigger
- Wire up "View All Tasks" navigation
- Wire up "Clear Completed" confirmation dialog

### Phase 6: State Management & Mock Data
- Consume existing TaskContext
- Implement useMemo for derived state
- No new state management needed (reuses todo-frontend-ui TaskContext)

### Phase 7: Responsiveness & Accessibility
- Implement mobile-first responsive layouts
- Add ARIA labels and semantic HTML
- Ensure keyboard navigation support

### Phase 8: Edge Case Handling
- Empty dashboard state (no tasks)
- All tasks completed state
- Long task titles truncation
- Mobile viewport edge cases

---

## Summary of Deliverables

**Phase 0 Outputs**:
- research.md (10 technical decisions documented)

**Phase 1 Outputs**:
- data-model.md (DashboardStats, TodaysFocusCriteria entities)
- contracts/dashboard-types.ts (component prop interfaces)
- contracts/focus-filters.ts (filtering logic types)
- quickstart.md (dashboard setup and validation guide)
- Updated agent context file (CLAUDE.md with dashboard capabilities)

**Phase 2 (Future)**:
- tasks.md (generated via `/sp.tasks` command)

---

## Phase 2: Constitution Check (Post-Design) ✅

*Re-evaluation after Phase 0 research and Phase 1 design artifacts completed.*

### Quality Gates Re-Evaluation (Constitution v2.0.0)

**✅ PASS**: Spec-Driven Development
- ✅ All Phase 1 artifacts trace to spec.md requirements (FR-001 through FR-057)
- ✅ research.md documents 10 technical decisions (D1-D10) all from spec unknowns
- ✅ data-model.md entities match Key Entities section in spec.md
- ✅ contracts/ interfaces implement all component props from spec
- ✅ quickstart.md validation scenarios cover all 4 user stories (P1-P4)
- **Verification**: Every design artifact references corresponding spec requirements

**✅ PASS**: Documentation-First Correctness
- ✅ research.md cites only Context7 MCP sources:
  - D1-D2, D4, D8: Next.js official docs
  - D3, D6-D8: React official docs (react.dev)
  - D4, D9: Tailwind CSS official docs
  - D5, D10: MDN Web Docs
  - D7: heroicons official docs
- ✅ Zero blog posts, tutorials, or StackOverflow references
- ✅ All patterns traceable to authoritative documentation
- **Verification**: Every research decision includes "Documentation References" section

**✅ PASS**: UI-First Design
- ✅ DashboardStats and TodaysFocusTasks are derived state (read-only from TaskState)
- ✅ No new base state introduced (reuses TaskContext from todo-frontend-ui)
- ✅ data-model.md explicitly states "API Readiness" section showing future backend shapes
- ✅ Dashboard serves UI needs (information display, navigation) without backend assumptions
- **Verification**: data-model.md "State Transitions" section confirms zero new state

**✅ PASS**: Deterministic Frontend Behavior
- ✅ research.md D3 documents useMemo patterns with proper dependency arrays
- ✅ DashboardStats calculation: Pure function from tasks array (no side effects)
- ✅ filterTodaysFocusTasks: Pure filter function (deterministic given same input)
- ✅ contracts/focus-filters.ts defines pure function signatures (IsTodayFn, IsHighPriorityIncompleteFn)
- **Verification**: All derived state calculations documented as pure functions in research.md and data-model.md

**✅ PASS**: Technology Constraints
- ✅ Next.js App Router: research.md D1-D2 confirm app/dashboard/page.tsx pattern
- ✅ TypeScript: All contracts/ files are .ts with complete type definitions
- ✅ React: research.md D3, D6, D8 document React hooks (useMemo, useId, composition)
- ✅ Tailwind CSS: research.md D4, D9, D10 use only Tailwind utilities (grid, responsive, colors)
- ✅ No forbidden technologies: No Pages Router, no non-Tailwind CSS, no unofficial libraries
- ✅ heroicons: Chosen in research.md D7 for Tailwind integration (created by Tailwind Labs)
- **Verification**: Every technical decision in research.md references official docs for required stack

**✅ PASS**: Scope Boundaries
- ✅ Frontend-only: data-model.md confirms "No new base state" and "API Readiness (Future Backend Integration)"
- ✅ Client-side dashboard: quickstart.md validates local rendering without backend calls
- ✅ Reuses existing infrastructure: plan.md Structure Decision documents 80% component reuse from todo-frontend-ui
- ✅ No backend dependencies: contracts/ define only UI component props, no API schemas
- **Verification**: data-model.md "State Transitions" section explicitly states "dashboard dispatches existing actions only"

**Compliance Status**: **ALL 6 GATES PASS** - Phase 1 design artifacts complete and constitution-compliant

### Violations and Complexity Tracking

**No violations detected.** All design decisions align with constitution requirements. No complexity tracking needed.

---

**Plan Status**: ✅ **COMPLETE** - All phases finished. Ready for task generation via `/sp.tasks` command.

**Phase Completion Summary**:
- ✅ Phase 0 (Research): 10 technical decisions documented in research.md
- ✅ Phase 1 (Design & Contracts): data-model.md, contracts/, quickstart.md, CLAUDE.md created
- ✅ Phase 2 (Post-Design Check): All 6 constitution gates PASS

**Next Command**: `/sp.tasks` to generate implementation tasks organized by user story priority (P1 MVP → P2 → P3 → P4)
