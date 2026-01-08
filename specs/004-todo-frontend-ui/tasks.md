# Tasks: Todo App Frontend UI

**Feature Branch**: `004-todo-frontend-ui`
**Input**: Design documents from `/specs/004-todo-frontend-ui/` (plan.md, spec.md, data-model.md, contracts/, research.md)
**Prerequisites**: plan.md (required), spec.md (required), data-model.md (required), contracts/ (required), research.md (required)

**Tests**: No test tasks included (tests not requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Path Conventions

This is a Next.js App Router web frontend project. Paths are relative to repository root:

- **App directory**: `app/` (Next.js App Router convention)
- **Components**: `app/components/` (organized by feature)
- **Library code**: `app/lib/` (types, hooks, utils, reducers)
- **Public assets**: `public/` (static files if needed)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Next.js structure

- [ ] T001 Initialize Next.js 14+ project with TypeScript and App Router using create-next-app
- [ ] T002 Install dependencies: tailwindcss, date-fns, and configure package.json scripts
- [ ] T003 [P] Configure Tailwind CSS in tailwind.config.ts with content paths for all component directories
- [ ] T004 [P] Create app/globals.css with Tailwind directives (@tailwind base, components, utilities)
- [ ] T005 [P] Configure tsconfig.json with strict mode and path aliases for clean imports
- [ ] T006 Create app/layout.tsx as root layout with metadata and global styles
- [ ] T007 Create app/page.tsx as main dashboard page placeholder
- [ ] T008 Create directory structure: app/components/{task,filters,ui,providers} and app/lib/{types,hooks,utils,reducers}

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 [P] Create app/lib/types/task.ts with Task, FilterState, SortState, RecurrencePattern TypeScript interfaces
- [ ] T010 [P] Create app/lib/reducers/taskReducer.ts with taskReducer function handling ADD_TASK, UPDATE_TASK, TOGGLE_COMPLETE, DELETE_TASK, SET_FILTER, SET_SORT, RESET_FILTERS actions
- [ ] T011 [P] Create app/lib/types/actions.ts with TaskAction discriminated union (7 action types)
- [ ] T012 [P] Create app/lib/mockData.ts with 5-10 realistic mock Task objects following data-model spec
- [ ] T013 Create app/components/providers/TaskProvider.tsx with 'use client' directive, Context setup, useReducer hook, and provider wrapper
- [ ] T014 Update app/layout.tsx to wrap children with TaskProvider for global state access
- [ ] T015 [P] Create app/lib/hooks/useTasks.ts as custom hook to consume TaskContext (returns state and dispatch)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks and view them in a responsive list. This is the minimum viable product.

**Independent Test**: Open app, add task with title/description/priority/due date/tags, verify it appears in list immediately with all properties displayed correctly. Test on mobile viewport (320px) to verify responsive layout.

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create app/lib/utils/taskValidation.ts with validateTaskTitle, validateDescription, validatePriority, validateDueDate, validateTags functions
- [ ] T017 [P] [US1] Create app/lib/utils/dateUtils.ts with toISODateString, formatDisplayDate, isOverdue, isDueSoon functions
- [ ] T018 [P] [US1] Create app/components/ui/Button.tsx reusable button component with Tailwind variants (primary, secondary, destructive)
- [ ] T019 [P] [US1] Create app/components/ui/Input.tsx reusable text input component with validation state styling
- [ ] T020 [P] [US1] Create app/components/ui/Badge.tsx component for priority badges with color-coded Tailwind classes (red=high, yellow=medium, green=low)
- [ ] T021 [P] [US1] Create app/components/ui/EmptyState.tsx component for empty task list with onboarding message and "Add Task" CTA
- [ ] T022 [US1] Create app/components/task/TaskForm.tsx with controlled inputs (title, description, priority, dueDate, tags), real-time validation using taskValidation utils, and disabled submit button when invalid
- [ ] T023 [US1] Create app/components/task/TaskItem.tsx to display task title, description, priority badge, tags (using Badge component), due date (using formatDisplayDate), completion checkbox, edit/delete buttons
- [ ] T024 [US1] Create app/components/task/TaskList.tsx to map over tasks from useTasks hook, render TaskItem for each, show EmptyState when tasks array is empty, apply responsive grid/list layout with Tailwind classes
- [ ] T025 [US1] Update app/page.tsx to render TaskList component and "Add Task" button, implement modal state (useState for isAddModalOpen), dispatch ADD_TASK action on form submit
- [ ] T026 [US1] Add mobile-first responsive styling to TaskList component (single column on mobile, 2 columns on tablet md:, 3 columns on desktop lg:)
- [ ] T027 [US1] Implement ADD_TASK action in taskReducer.ts to generate UUID for id, set createdAt/updatedAt to ISO timestamps, set completed=false, append to tasks array

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can create and view tasks on desktop and mobile.

---

## Phase 4: User Story 2 - Manage Task Lifecycle (Priority: P2)

**Goal**: Enable users to edit, complete, and delete tasks. Builds on P1 to create a fully functional task manager.

**Independent Test**: Create a task via US1 functionality, then edit its properties via modal, toggle completion checkbox (observe visual change), delete task with confirmation dialog. All operations should update task list immediately.

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create app/components/ui/Modal.tsx accessible modal component with focus trap, ESC key dismissal, click-outside handling, ARIA attributes (role="dialog", aria-modal, aria-labelledby)
- [ ] T029 [P] [US2] Create app/components/task/DeleteConfirmation.tsx modal component with destructive styling (red buttons), "Cancel" and "Delete" actions, clear warning message
- [ ] T030 [US2] Create app/components/task/TaskEditModal.tsx wrapping TaskForm component, prefilling form with existing task data from props, dispatching UPDATE_TASK action on save
- [ ] T031 [US2] Update app/components/task/TaskItem.tsx to add onClick handler for edit button that opens TaskEditModal with task data
- [ ] T032 [US2] Update app/components/task/TaskItem.tsx to add onClick handler for completion checkbox that dispatches TOGGLE_COMPLETE action with task id
- [ ] T033 [US2] Update app/components/task/TaskItem.tsx to apply conditional Tailwind classes for completed tasks (line-through title, opacity-60, or bg-gray-100)
- [ ] T034 [US2] Update app/components/task/TaskItem.tsx to add onClick handler for delete button that opens DeleteConfirmation modal
- [ ] T035 [US2] Implement DELETE_TASK action in app/lib/reducers/taskReducer.ts to filter out task with matching id from tasks array
- [ ] T036 [US2] Implement UPDATE_TASK action in app/lib/reducers/taskReducer.ts to find task by id, merge updates, set updatedAt to current ISO timestamp
- [ ] T037 [US2] Implement TOGGLE_COMPLETE action in app/lib/reducers/taskReducer.ts to find task by id, flip completed boolean, set updatedAt timestamp
- [ ] T038 [US2] Add Tailwind transition classes to TaskItem for smooth opacity/strikethrough changes on completion toggle
- [ ] T039 [US2] Implement focus restoration in Modal component (save previousFocus ref, restore on close) for accessibility

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users have full CRUD capabilities on tasks.

---

## Phase 5: User Story 3 - Filter, Search, and Sort Tasks (Priority: P3)

**Goal**: Enable users to find specific tasks quickly using search, filters, and sorting. Enhances usability for power users with many tasks.

**Independent Test**: Create 10+ tasks with varied properties (priorities, completion status, due dates). Type keyword in search box (observe debouncing), apply priority filter (e.g., "High"), apply status filter (e.g., "Incomplete"), change sort to "Due Date". Verify only tasks matching ALL filters appear and are correctly ordered.

### Implementation for User Story 3

- [ ] T040 [P] [US3] Create app/lib/hooks/useDebounce.ts custom hook with useEffect + setTimeout pattern, cleanup function, TypeScript generic type parameter
- [ ] T041 [P] [US3] Create app/lib/utils/taskFilters.ts with filterTasks function that accepts tasks array and FilterState, implements AND logic for all active filters (searchQuery, completionStatus, priorityFilter, dueDateRange)
- [ ] T042 [P] [US3] Create app/lib/utils/taskSorters.ts with sortTasks function accepting tasks array and SortState, implements comparators for dueDate, priority, title, createdAt fields with asc/desc direction
- [ ] T043 [US3] Create app/components/filters/SearchInput.tsx with controlled input, useDebounce hook (300ms delay), dispatches SET_FILTER action with searchQuery on debounced value change
- [ ] T044 [US3] Create app/components/filters/FilterPanel.tsx with dropdowns for completion status (all/complete/incomplete) and priority (all/low/medium/high), dispatches SET_FILTER action on selection change
- [ ] T045 [US3] Create app/components/filters/SortControl.tsx with dropdown for sort field (dueDate/priority/title/createdAt) and direction toggle button (asc/desc icon), dispatches SET_SORT action on change
- [ ] T046 [US3] Update app/components/providers/TaskProvider.tsx to compute filtered and sorted tasks using useMemo with dependencies on state.tasks, state.filters, state.sort, pass filteredAndSortedTasks to context value
- [ ] T047 [US3] Update app/components/task/TaskList.tsx to render filteredAndSortedTasks from context instead of raw tasks array
- [ ] T048 [US3] Implement SET_FILTER action in app/lib/reducers/taskReducer.ts to merge payload into state.filters using shallow merge
- [ ] T049 [US3] Implement SET_SORT action in app/lib/reducers/taskReducer.ts to replace state.sort with payload
- [ ] T050 [US3] Implement RESET_FILTERS action in app/lib/reducers/taskReducer.ts to reset state.filters to initial state (empty searchQuery, 'all' statuses, no dueDateRange)
- [ ] T051 [US3] Update app/page.tsx to render SearchInput, FilterPanel, and SortControl components above TaskList
- [ ] T052 [US3] Add "Clear Filters" button to FilterPanel that dispatches RESET_FILTERS action
- [ ] T053 [US3] Add visual indicator to SortControl showing active sort field and direction (e.g., "Due Date ↓" or icon)
- [ ] T054 [US3] Handle edge case: display "No results found" message in TaskList when filteredAndSortedTasks is empty but tasks array is not (filters excluded all tasks)

**Checkpoint**: All user stories 1-3 should now work independently. Users can manage, view, and organize large task lists effectively.

---

## Phase 6: User Story 4 - Manage Recurring Tasks and Priorities (Priority: P4)

**Goal**: Add productivity enhancements: recurring task UI, priority visual indicators, urgency badges for overdue/due-soon tasks.

**Independent Test**: Create task with "Daily" recurrence (observe preview of next 3-5 occurrences). Create tasks with different priorities (observe color-coded badges). Create task with due date yesterday (observe "Overdue" indicator). Create task due tomorrow (observe "Due Soon" indicator).

### Implementation for User Story 4

- [ ] T055 [P] [US4] Update app/components/task/TaskForm.tsx to add recurrence selector UI (dropdown for frequency: none/daily/weekly/monthly, number input for interval)
- [ ] T056 [P] [US4] Create app/lib/utils/recurrenceUtils.ts with previewRecurrenceOccurrences function that calculates next 3-5 dates based on frequency and interval
- [ ] T057 [US4] Update app/components/task/TaskForm.tsx to show recurrence preview (list of upcoming dates) when recurrence pattern is selected, using previewRecurrenceOccurrences util
- [ ] T058 [US4] Update app/components/task/TaskItem.tsx to add recurrence indicator badge or icon when task.recurrence is defined
- [ ] T059 [US4] Update app/components/task/TaskItem.tsx to apply urgency styling: red highlight + "Overdue" badge when isOverdue(task.dueDate) is true
- [ ] T060 [US4] Update app/components/task/TaskItem.tsx to apply "Due Soon" badge (yellow/orange) when isDueSoon(task.dueDate) is true
- [ ] T061 [US4] Verify priority Badge component (created in T020) uses consistent color semantics across app (high=red, medium=yellow, low=green)
- [ ] T062 [US4] Update app/components/task/TaskItem.tsx to render tags as Badge components (create loop over task.tags, render Badge for each tag)
- [ ] T063 [US4] Ensure tags wrap appropriately in TaskItem (use flex-wrap in Tailwind) when task has 10+ tags

**Checkpoint**: All user stories 1-4 should now be independently functional. App demonstrates full feature set from spec.md.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality refinements

- [ ] T064 [P] Add Tailwind transition classes to modal open/close animations (transition-opacity, transition-transform)
- [ ] T065 [P] Add Tailwind transition classes to task completion toggle (smooth opacity fade)
- [ ] T066 [P] Add Tailwind hover states to all interactive elements (buttons, checkboxes, cards) for better UX
- [ ] T067 [P] Verify all form inputs have visible focus rings for keyboard navigation (Tailwind focus: classes)
- [ ] T068 [P] Verify WCAG AA color contrast for all text and UI elements using browser dev tools or automated checker
- [ ] T069 [P] Test keyboard navigation: Tab through all interactive elements, Enter to submit forms, Space to toggle checkboxes, ESC to close modals
- [ ] T070 [P] Verify ARIA attributes on Modal (role="dialog", aria-modal="true", aria-labelledby pointing to modal title id)
- [ ] T071 [P] Add aria-label to icon-only buttons (edit, delete) for screen reader accessibility
- [ ] T072 [P] Test mobile viewport (320px width) and verify touch targets are minimum 44x44px
- [ ] T073 [P] Add loading="lazy" to any images if used, optimize bundle size if necessary
- [ ] T074 [P] Verify Next.js metadata in app/layout.tsx includes proper title, description for SEO
- [ ] T075 Run quickstart.md validation scenarios: P1 tests (create/view), P2 tests (edit/complete/delete), P3 tests (search/filter/sort), P4 tests (recurring/priority/urgency)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T008) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion (T009-T015) - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational completion (T009-T015) - Can start in parallel with US1, but logically builds on US1 (needs tasks to exist to edit/delete)
- **User Story 3 (Phase 5)**: Depends on Foundational completion (T009-T015) - Can start in parallel with US1/US2, but logically needs tasks to filter/sort
- **User Story 4 (Phase 6)**: Depends on Foundational completion (T009-T015) - Can start in parallel with others, but logically builds on US1 (needs TaskForm and TaskItem)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ INDEPENDENT
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Logically extends US1 (needs existing tasks to manage lifecycle)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Logically needs US1 (needs tasks to filter/sort)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Logically extends US1 (enhances TaskForm and TaskItem)

**Recommended Sequential Order**: US1 → US2 → US3 → US4 (follows priority P1→P2→P3→P4 and logical dependency flow)

**Parallel Team Strategy**: If multiple developers available, US1 must complete first (establishes TaskForm and TaskItem base components), then US2/US3/US4 can proceed in parallel with integration at the end.

### Within Each User Story

#### User Story 1
- Validation utils, date utils, UI components (Button, Input, Badge, EmptyState) can run in parallel (T016-T021 marked [P])
- TaskForm depends on validation utils and UI components (T022 after T016-T021)
- TaskItem depends on Badge, date utils (T023 after T017, T020)
- TaskList depends on TaskItem, EmptyState (T024 after T021, T023)
- Page updates depend on TaskList, TaskForm (T025 after T022, T024)
- Responsive styling and reducer action can run in parallel with other tasks (T026-T027)

#### User Story 2
- Modal, DeleteConfirmation can run in parallel (T028-T029 marked [P])
- TaskEditModal depends on Modal and TaskForm (T030 after T022, T028)
- TaskItem updates can proceed after Modal and DeleteConfirmation ready (T031-T034 after T028-T030)
- Reducer actions can run in parallel (T035-T037)
- Polish tasks can run in parallel (T038-T039)

#### User Story 3
- useDebounce hook, filter utils, sorter utils can run in parallel (T040-T042 marked [P])
- Filter components can be built in parallel after utils ready (T043-T045 after T040-T042)
- TaskProvider update depends on filter/sorter utils (T046 after T041-T042)
- TaskList update depends on TaskProvider update (T047 after T046)
- Reducer actions can run in parallel (T048-T050)
- Remaining UI updates can run in parallel (T051-T054)

#### User Story 4
- TaskForm recurrence UI and recurrence utils can run in parallel (T055-T056 marked [P])
- Subsequent TaskForm and TaskItem updates are sequential (T057-T063)

---

## Parallel Opportunities

### Setup Phase (Phase 1)
```bash
# These tasks can run simultaneously:
T003: Configure Tailwind (tailwind.config.ts)
T004: Create globals.css
T005: Configure tsconfig.json
```

### Foundational Phase (Phase 2)
```bash
# These tasks can run simultaneously:
T009: Create task types (app/lib/types/task.ts)
T010: Create taskReducer (app/lib/reducers/taskReducer.ts)
T011: Create action types (app/lib/types/actions.ts)
T012: Create mockData (app/lib/mockData.ts)
T015: Create useTasks hook (app/lib/hooks/useTasks.ts)
```

### User Story 1
```bash
# These tasks can run simultaneously:
T016: Create taskValidation utils
T017: Create dateUtils
T018: Create Button component
T019: Create Input component
T020: Create Badge component
T021: Create EmptyState component
```

### User Story 2
```bash
# These tasks can run simultaneously:
T028: Create Modal component
T029: Create DeleteConfirmation component
T035: Implement DELETE_TASK reducer action
T036: Implement UPDATE_TASK reducer action
T037: Implement TOGGLE_COMPLETE reducer action
T038: Add transitions to TaskItem
T039: Implement focus restoration in Modal
```

### User Story 3
```bash
# These tasks can run simultaneously:
T040: Create useDebounce hook
T041: Create taskFilters utils
T042: Create taskSorters utils

# After utils complete, these can run simultaneously:
T043: Create SearchInput
T044: Create FilterPanel
T045: Create SortControl
T048: Implement SET_FILTER action
T049: Implement SET_SORT action
T050: Implement RESET_FILTERS action
```

### User Story 4
```bash
# These tasks can run simultaneously:
T055: Update TaskForm with recurrence UI
T056: Create recurrenceUtils
```

### Polish Phase
```bash
# All polish tasks (T064-T074) can run simultaneously:
T064: Add modal transitions
T065: Add completion toggle transitions
T066: Add hover states
T067: Verify focus rings
T068: Verify WCAG AA contrast
T069: Test keyboard navigation
T070: Verify ARIA attributes on Modal
T071: Add aria-label to icon buttons
T072: Test mobile touch targets
T073: Optimize images/bundle
T074: Verify Next.js metadata
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T015) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T016-T027)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md P1 scenarios
5. Deploy/demo if ready - **YOU NOW HAVE A WORKING TODO APP MVP!**

**Estimated Tasks for MVP**: 35 tasks (Setup 8 + Foundational 7 + US1 12 + margin 8)

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational (T001-T015) → Foundation ready
2. Add User Story 1 (T016-T027) → Test independently → Deploy/Demo (**MVP!** 🎯)
3. Add User Story 2 (T028-T039) → Test independently → Deploy/Demo (Full CRUD)
4. Add User Story 3 (T040-T054) → Test independently → Deploy/Demo (Power user features)
5. Add User Story 4 (T055-T063) → Test independently → Deploy/Demo (Productivity enhancements)
6. Polish (T064-T075) → Final QA → Production deploy

**Benefits**:
- Each story adds value without breaking previous stories
- Can stop at any checkpoint and have a functional app
- User feedback can inform later story priorities
- Lower risk (smaller increments)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T015)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T016-T027) - **MUST COMPLETE FIRST**
   - Wait for Developer A to finish TaskForm and TaskItem base components
3. After US1 base components exist:
   - **Developer B**: User Story 2 (T028-T039) - Extends TaskItem
   - **Developer C**: User Story 3 (T040-T054) - Creates filter/sort system
   - **Developer D**: User Story 4 (T055-T063) - Extends TaskForm/TaskItem
4. Stories complete and integrate independently
5. Team completes Polish together (T064-T075)

---

## Notes

- **[P] tasks** = different files, no dependencies on incomplete tasks - can run in parallel
- **[Story] label** maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Paths**: All paths assume Next.js App Router structure (app/ directory at root)
- **TypeScript**: All files should be .tsx (components) or .ts (utilities/types)
- **Tests**: No test tasks included as tests were not requested in specification

---

## Task Count Summary

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 7 tasks
- **Phase 3 (User Story 1 - P1 MVP)**: 12 tasks
- **Phase 4 (User Story 2 - P2)**: 12 tasks
- **Phase 5 (User Story 3 - P3)**: 15 tasks
- **Phase 6 (User Story 4 - P4)**: 9 tasks
- **Phase 7 (Polish)**: 12 tasks

**Total**: 75 implementation tasks

**Parallel Opportunities**: 34 tasks marked with [P] for parallel execution

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 = 27 tasks (Setup + Foundation + US1)

---

**Tasks Status**: ✅ **READY FOR IMPLEMENTATION**
**Format Validation**: ✅ **All tasks follow checklist format** (checkbox, ID, optional [P]/[Story] labels, description with file paths)
**Next Step**: Begin with Phase 1 Setup (T001-T008), then Foundational (T009-T015), then User Story 1 (T016-T027) for MVP
