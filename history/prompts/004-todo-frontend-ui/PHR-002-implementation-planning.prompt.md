---
id: PHR-002
title: Todo Frontend UI Implementation Planning
stage: plan
date: 2026-01-08
surface: CLI
model: claude-sonnet-4-5-20250929
feature: 004-todo-frontend-ui
branch: 004-todo-frontend-ui
user: HP
command: /sp.plan
labels: [planning, architecture, research, design, contracts]
links:
  spec: specs/004-todo-frontend-ui/spec.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - path: specs/004-todo-frontend-ui/plan.md
    action: created
    lines_changed: 482
  - path: specs/004-todo-frontend-ui/research.md
    action: created
    lines_changed: 583
  - path: specs/004-todo-frontend-ui/data-model.md
    action: created
    lines_changed: 504
  - path: specs/004-todo-frontend-ui/contracts/task-actions.ts
    action: created
    lines_changed: 138
  - path: specs/004-todo-frontend-ui/contracts/task-state.ts
    action: created
    lines_changed: 78
  - path: specs/004-todo-frontend-ui/quickstart.md
    action: created
    lines_changed: 568
tests:
  - N/A (planning phase)
---

## Prompt

Create comprehensive implementation plan for Todo App Frontend UI based on completed specification (spec.md). Plan must include:

**Phase 0 - Research**:
- 10 research tasks investigating patterns from Context7 MCP (Next.js, React, Tailwind, MDN only)
- Document all technical decisions with rationale, alternatives, and documentation references
- Resolve technical unknowns: Client Component patterns, useReducer with Context, responsive design, accessible modals, form validation, date handling, debouncing, array operations, dynamic Tailwind classes, TypeScript discriminated unions

**Phase 1 - Design & Contracts**:
- Data model (Task entity with validation rules, FilterState, SortState)
- State contracts (TypeScript action types, state shape, initial state)
- Quickstart guide (setup, validation, troubleshooting)
- Agent context update

**Constitution Compliance**:
- Pre-design Constitution Check (all gates must pass)
- Post-design Constitution Check (re-evaluate after Phase 1)
- Validate: Spec-driven development, documentation-first correctness, UI-first design, deterministic behavior, technology constraints, scope boundaries

**Technical Context**:
- Language: TypeScript 5.3+
- Dependencies: Next.js 14+ App Router, React 18+, Tailwind CSS 3.4+, date-fns 3.x
- Performance goals: <300ms UI updates for 100 tasks, <2s initial load
- Constraints: Frontend-only, mobile-first (320px min), WCAG AA, Context7 MCP patterns only
- Scale: 10-100 tasks typical, up to 1000 supported

## Response snapshot

Successfully created comprehensive implementation plan with complete research and design phases:

**Plan Structure** (plan.md - 482 lines):
- Summary: Frontend-only Todo App with Next.js App Router + Tailwind CSS
- Technical Context: TypeScript, Next.js 14+, React 18+, Tailwind CSS 3.4+, date-fns
- Constitution Check (Pre-Design): ALL 6 GATES PASS ✅
- Project Structure: Next.js App Router convention with 15 UI components
- Phase 0: 10 research tasks with Context7 MCP queries
- Phase 1: Design artifacts (data-model, contracts, quickstart)
- Constitution Check (Post-Design): ALL 6 GATES PASS ✅

**Research Decisions** (research.md - 583 lines):
- **D1**: Client Component at TaskProvider root ('use client' boundary)
- **D2**: useReducer + Context for state management (discriminated unions)
- **D3**: Mobile-first responsive design (Tailwind breakpoints)
- **D4**: Accessible modals (ARIA dialog, focus trap, ESC key)
- **D5**: Controlled form components with real-time validation
- **D6**: ISO 8601 date strings with native Date manipulation
- **D7**: useDebounce hook (300ms delay for search input)
- **D8**: Chained filter/sort with useMemo (O(n log n) performance)
- **D9**: Conditional Tailwind classes (template literals, static detection)
- **D10**: TypeScript discriminated unions (exhaustive switch checking)

**Data Model** (data-model.md - 504 lines):
- **Task Entity**: 10 fields (id, title, description, completed, priority, dueDate, tags, recurrence, createdAt, updatedAt)
- **Validation Rules**: Title (1-200 chars), description (max 1000), priority (enum), dueDate (ISO 8601), tags (max 50 chars each)
- **FilterState**: searchQuery, completionStatus, priorityFilter, dueDateRange
- **SortState**: field (dueDate/priority/title/createdAt), direction (asc/desc)
- **State Transitions**: CREATE, UPDATE, TOGGLE_COMPLETE, DELETE, SET_FILTER, SET_SORT, RESET_FILTERS
- **API Readiness**: UUID v4 ids, ISO 8601 timestamps, JSON-serializable types

**State Contracts** (contracts/ - 216 lines total):
- **task-actions.ts**: 7 action types with discriminated union (AddTaskAction, UpdateTaskAction, ToggleCompleteAction, DeleteTaskAction, SetFilterAction, SetSortAction, ResetFiltersAction)
- **task-state.ts**: TaskState interface, FilterState, SortState, initialTaskState, TaskDispatch type
- Type guards for all action types
- Exhaustive TypeScript type checking

**Quickstart Guide** (quickstart.md - 568 lines):
- Prerequisites: Node.js 18+, npm 9+/pnpm 8+, modern browser
- Setup: Install dependencies, run dev server, open http://localhost:3000
- Validation: 22 test scenarios across 4 user stories (P1-P4)
  - P1 Tests: Empty state, add task, view task list
  - P2 Tests: Edit task, toggle completion, delete task
  - P3 Tests: Search, filter by status/priority, sort, multiple filters, clear filters
  - P4 Tests: Recurring tasks, priority visual indicators, overdue indicators
- Edge Cases: Empty list, invalid input, long titles, many tags, rapid clicks
- Performance: Large task lists (100 tasks), mobile responsiveness
- Troubleshooting: 5 common issues with solutions

**Constitution Compliance**:
- **Pre-Design**: All 6 gates pass (Spec-Driven, Documentation-First, UI-First, Deterministic, Technology Constraints, Scope Boundaries)
- **Post-Design**: All 6 gates pass (re-evaluated after Phase 1 completion)
- **Documentation Sources**: 100% Context7 MCP (Next.js, React, Tailwind CSS, MDN)
- **Zero Violations**: No complexity tracking needed

**Project Structure**:
- Documentation: specs/004-todo-frontend-ui/ (plan, research, data-model, contracts, quickstart)
- Source Code: app/ directory with Next.js App Router convention
- Components: task/, filters/, ui/, providers/
- Library: types/, hooks/, utils/, reducers/
- 15 UI components planned across 4 categories

## Outcome

- ✅ Impact: Complete implementation plan with 10 researched patterns, full data model, state contracts, and comprehensive quickstart guide ready for task generation
- 🧪 Tests: N/A (planning phase - 22 test scenarios defined in quickstart.md for validation)
- 📁 Files: plan.md (482 lines), research.md (583 lines), data-model.md (504 lines), task-actions.ts (138 lines), task-state.ts (78 lines), quickstart.md (568 lines)
- 🔁 Next prompts: /sp.tasks (generate implementation tasks organized by user story priority P1-P4)
- 🧠 Reflection: Implementation plan is comprehensive and constitution-compliant. All technical unknowns resolved via Context7 MCP documentation sources. Data model includes API-ready shapes for future backend integration. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning phases completed successfully with constitution compliance
- Graders run and results (PASS/FAIL): Constitution Check (Pre-Design) - 6/6 PASS, Constitution Check (Post-Design) - 6/6 PASS
- Prompt variant (if applicable): N/A (standard planning workflow)
- Next experiment (smallest change to try): Generate implementation tasks via /sp.tasks and validate task organization follows user story priorities (P1 MVP first, then P2-P4 incrementally)
