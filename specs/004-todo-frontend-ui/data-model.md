# Data Model: Todo App Frontend UI

**Date**: 2026-01-08
**Feature**: 004-todo-frontend-ui
**Purpose**: Define all data entities, their relationships, validation rules, and state transitions for the frontend-only todo application

---

## Entity Definitions

### Task

**Description**: Represents a single todo item with associated metadata and properties.

**TypeScript Interface**:
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  recurrence?: RecurrencePattern;
  createdAt: string;
  updatedAt: string;
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
}
```

**Field Specifications**:

| Field | Type | Required | Default | Constraints | Purpose |
|-------|------|----------|---------|-------------|---------|
| `id` | string | Yes | Generated (UUID v4) | Unique identifier | Primary key for task identification |
| `title` | string | Yes | N/A | Min 1 char (trimmed), max 200 chars | Task name/summary |
| `description` | string | No | `undefined` | Max 1000 chars | Detailed task information |
| `completed` | boolean | Yes | `false` | N/A | Completion status flag |
| `priority` | 'low' \| 'medium' \| 'high' | Yes | `'medium'` | Must be one of defined values | Importance level for visual prominence |
| `dueDate` | string | No | `undefined` | ISO 8601 date format (YYYY-MM-DD) | When task should be completed |
| `tags` | string[] | No | `undefined` | Each tag max 50 chars, non-empty | Categorization labels |
| `recurrence` | RecurrencePattern | No | `undefined` | See RecurrencePattern spec | Recurring task pattern |
| `createdAt` | string | Yes | Generated (now) | ISO 8601 datetime with timezone | Creation timestamp |
| `updatedAt` | string | Yes | Generated (now) | ISO 8601 datetime with timezone | Last modification timestamp |

**RecurrencePattern Specifications**:

| Field | Type | Required | Constraints | Purpose |
|-------|------|----------|-------------|---------|
| `frequency` | 'daily' \| 'weekly' \| 'monthly' | Yes | Must be one of defined values | How often task recurs |
| `interval` | number | Yes | Positive integer (>= 1) | Interval multiplier (e.g., every 2 days) |

**Validation Rules**:

1. **Title Validation**:
   - Required: Must not be empty after trimming whitespace
   - Length: Min 1 character, max 200 characters
   - Rule: `title.trim().length > 0 && title.length <= 200`

2. **Description Validation**:
   - Optional: Can be undefined or null
   - Length: Max 1000 characters if provided
   - Rule: `!description || description.length <= 1000`

3. **Priority Validation**:
   - Required: Must be one of 'low', 'medium', 'high'
   - Rule: `['low', 'medium', 'high'].includes(priority)`

4. **Due Date Validation**:
   - Optional: Can be undefined
   - Format: Must be valid ISO 8601 date string (YYYY-MM-DD) if provided
   - Rule: `!dueDate || /^\d{4}-\d{2}-\d{2}$/.test(dueDate) && !isNaN(new Date(dueDate).getTime())`

5. **Tags Validation**:
   - Optional: Can be undefined or empty array
   - Each tag: Non-empty string, max 50 characters
   - Rule: `!tags || tags.every(tag => tag.trim().length > 0 && tag.length <= 50)`

6. **Recurrence Validation**:
   - Optional: Can be undefined
   - If provided: Both frequency and interval must be valid
   - Interval: Must be positive integer
   - Rule: `!recurrence || (['daily', 'weekly', 'monthly'].includes(recurrence.frequency) && Number.isInteger(recurrence.interval) && recurrence.interval >= 1)`

**API Readiness**:
- ID field uses UUID v4 format (compatible with most backend systems)
- Timestamps use ISO 8601 with timezone (e.g., `2026-01-08T10:30:00.000Z`)
- Due dates use ISO 8601 date-only format (YYYY-MM-DD)
- Shape matches typical REST API response structures
- All fields use JSON-serializable types (no Date objects, functions, or symbols)

---

### FilterState

**Description**: Represents active filtering criteria applied to the task list. This is derived state - not persisted, computed from user interactions.

**TypeScript Interface**:
```typescript
interface FilterState {
  searchQuery: string;
  completionStatus: 'all' | 'complete' | 'incomplete';
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  dueDateRange?: DateRange;
}

interface DateRange {
  start: string;  // ISO 8601 date (YYYY-MM-DD)
  end: string;    // ISO 8601 date (YYYY-MM-DD)
}
```

**Field Specifications**:

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| `searchQuery` | string | Yes | `''` (empty) | Keyword search matching title and description |
| `completionStatus` | 'all' \| 'complete' \| 'incomplete' | Yes | `'all'` | Filter by task completion status |
| `priorityFilter` | 'all' \| 'low' \| 'medium' \| 'high' | Yes | `'all'` | Filter by priority level |
| `dueDateRange` | DateRange | No | `undefined` | Filter by due date within range |

**Filtering Logic**:
- **searchQuery**: Case-insensitive substring match on `task.title` or `task.description`
- **completionStatus**:
  - `'all'`: Show all tasks
  - `'complete'`: Show only `task.completed === true`
  - `'incomplete'`: Show only `task.completed === false`
- **priorityFilter**:
  - `'all'`: Show all priorities
  - `'low' | 'medium' | 'high'`: Show only tasks with matching `task.priority`
- **dueDateRange**: Show only tasks where `task.dueDate` is between `start` and `end` (inclusive)

**Multiple Filter Behavior**:
- All active filters apply simultaneously (AND logic)
- Tasks must match ALL active filters to be displayed
- Example: `searchQuery="meeting"` + `priorityFilter="high"` shows only high-priority tasks containing "meeting"

---

### SortState

**Description**: Represents active sorting configuration applied to the task list. This is derived state - not persisted, computed from user selection.

**TypeScript Interface**:
```typescript
interface SortState {
  field: 'dueDate' | 'priority' | 'title' | 'createdAt';
  direction: 'asc' | 'desc';
}
```

**Field Specifications**:

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| `field` | 'dueDate' \| 'priority' \| 'title' \| 'createdAt' | Yes | `'createdAt'` | Which task property to sort by |
| `direction` | 'asc' \| 'desc' | Yes | `'desc'` | Sort direction (ascending or descending) |

**Sort Comparators**:

1. **dueDate**:
   - Ascending: Earliest due date first
   - Descending: Latest due date first
   - Null handling: Tasks with no due date appear last (treated as `Infinity`)
   - Comparator: `(a, b) => (a.dueDate ?? Infinity) - (b.dueDate ?? Infinity)`

2. **priority**:
   - Priority order: `high=3`, `medium=2`, `low=1`
   - Ascending: Low priority first
   - Descending: High priority first
   - Comparator: `(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]`

3. **title**:
   - Alphabetical sort using locale-aware comparison
   - Ascending: A-Z
   - Descending: Z-A
   - Comparator: `(a, b) => a.title.localeCompare(b.title)`

4. **createdAt**:
   - Chronological sort by creation timestamp
   - Ascending: Oldest first
   - Descending: Newest first (default)
   - Comparator: `(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()`

**Stable Sorting**:
- Array.sort() is stable in ES2019+ (guaranteed by spec)
- Tasks with identical sort keys maintain their relative order
- Example: Two high-priority tasks maintain their creation order when sorted by priority

---

## State Shape

### TaskState

**Description**: Global application state managed by reducer. This is the single source of truth for all task data and UI state.

**TypeScript Interface**:
```typescript
interface TaskState {
  tasks: Task[];
  filters: FilterState;
  sort: SortState;
}
```

**Initial State**:
```typescript
export const initialTaskState: TaskState = {
  tasks: [], // Populated with mock data from mockData.ts on app init
  filters: {
    searchQuery: '',
    completionStatus: 'all',
    priorityFilter: 'all',
    dueDateRange: undefined,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc', // Newest tasks first by default
  },
};
```

**State Structure Notes**:
- `tasks` array is the base state (source of truth)
- `filters` and `sort` are applied to derive visible task list (computed via useMemo)
- Derived state never mutates base `tasks` array
- All state updates go through reducer (no direct mutations)

---

## State Transitions

### CREATE Task

**Trigger**: User submits "Add Task" form with valid data

**Action**: `{ type: 'ADD_TASK', payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }`

**State Changes**:
1. Generate new UUID v4 for `id`
2. Set `createdAt` to current ISO timestamp
3. Set `updatedAt` to current ISO timestamp
4. Set `completed` to `false` (default)
5. Append new task to `tasks` array

**Example**:
```typescript
// Before
{ tasks: [task1, task2] }

// Action
dispatch({
  type: 'ADD_TASK',
  payload: { title: 'New Task', priority: 'high', description: 'Details here' }
});

// After
{
  tasks: [
    task1,
    task2,
    {
      id: 'uuid-generated',
      title: 'New Task',
      priority: 'high',
      description: 'Details here',
      completed: false,
      createdAt: '2026-01-08T10:30:00.000Z',
      updatedAt: '2026-01-08T10:30:00.000Z',
    }
  ]
}
```

---

### UPDATE Task

**Trigger**: User saves changes in "Edit Task" modal

**Action**: `{ type: 'UPDATE_TASK', payload: { id: string, updates: Partial<Task> } }`

**State Changes**:
1. Find task by `id` in `tasks` array
2. Merge `updates` into found task (shallow merge)
3. Set `updatedAt` to current ISO timestamp
4. Leave `id`, `createdAt` unchanged

**Example**:
```typescript
// Before
{ tasks: [{ id: '123', title: 'Old Title', priority: 'low', updatedAt: '2026-01-07T10:00:00.000Z' }] }

// Action
dispatch({
  type: 'UPDATE_TASK',
  payload: { id: '123', updates: { title: 'New Title', priority: 'high' } }
});

// After
{
  tasks: [{
    id: '123',
    title: 'New Title',
    priority: 'high',
    updatedAt: '2026-01-08T10:30:00.000Z' // Updated timestamp
  }]
}
```

---

### TOGGLE_COMPLETE Task

**Trigger**: User clicks completion checkbox on task

**Action**: `{ type: 'TOGGLE_COMPLETE', payload: { id: string } }`

**State Changes**:
1. Find task by `id` in `tasks` array
2. Flip `completed` boolean (`true` → `false` or `false` → `true`)
3. Set `updatedAt` to current ISO timestamp

**Example**:
```typescript
// Before
{ tasks: [{ id: '123', completed: false, updatedAt: '2026-01-07T10:00:00.000Z' }] }

// Action
dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: '123' } });

// After
{ tasks: [{ id: '123', completed: true, updatedAt: '2026-01-08T10:30:00.000Z' }] }
```

---

### DELETE Task

**Trigger**: User confirms deletion in confirmation dialog

**Action**: `{ type: 'DELETE_TASK', payload: { id: string } }`

**State Changes**:
1. Remove task with matching `id` from `tasks` array
2. No other state changes

**Example**:
```typescript
// Before
{ tasks: [task1, task2, task3] }

// Action
dispatch({ type: 'DELETE_TASK', payload: { id: 'task2-id' } });

// After
{ tasks: [task1, task3] } // task2 removed
```

---

### SET_FILTER

**Trigger**: User changes filter controls (search, status dropdown, priority dropdown, date range)

**Action**: `{ type: 'SET_FILTER', payload: Partial<FilterState> }`

**State Changes**:
1. Merge `payload` into `filters` object (shallow merge)
2. Base `tasks` array unchanged (filters are derived state)

**Example**:
```typescript
// Before
{ filters: { searchQuery: '', completionStatus: 'all', priorityFilter: 'all' } }

// Action
dispatch({ type: 'SET_FILTER', payload: { searchQuery: 'meeting', priorityFilter: 'high' } });

// After
{ filters: { searchQuery: 'meeting', completionStatus: 'all', priorityFilter: 'high' } }
```

---

### SET_SORT

**Trigger**: User changes sort dropdown or clicks sort button

**Action**: `{ type: 'SET_SORT', payload: SortState }`

**State Changes**:
1. Replace `sort` object with `payload`
2. Base `tasks` array unchanged (sort is derived state)

**Example**:
```typescript
// Before
{ sort: { field: 'createdAt', direction: 'desc' } }

// Action
dispatch({ type: 'SET_SORT', payload: { field: 'dueDate', direction: 'asc' } });

// After
{ sort: { field: 'dueDate', direction: 'asc' } }
```

---

### RESET_FILTERS

**Trigger**: User clicks "Clear Filters" button

**Action**: `{ type: 'RESET_FILTERS' }`

**State Changes**:
1. Reset `filters` to initial state (empty search, 'all' statuses, no date range)
2. Base `tasks` array unchanged
3. `sort` unchanged

**Example**:
```typescript
// Before
{ filters: { searchQuery: 'meeting', completionStatus: 'complete', priorityFilter: 'high' } }

// Action
dispatch({ type: 'RESET_FILTERS' });

// After
{ filters: { searchQuery: '', completionStatus: 'all', priorityFilter: 'all', dueDateRange: undefined } }
```

---

## Derived State Computation

**Visible Tasks** (filtered and sorted):

```typescript
const visibleTasks = useMemo(() => {
  // Step 1: Filter base tasks
  const filtered = filterTasks(state.tasks, state.filters);

  // Step 2: Sort filtered tasks
  const sorted = sortTasks(filtered, state.sort);

  return sorted;
}, [state.tasks, state.filters, state.sort]);
```

**Key Principles**:
- Base state (`state.tasks`) never mutated by filter/sort operations
- Filter and sort create new arrays (immutable operations)
- useMemo prevents recomputation unless dependencies change
- Derived state computed on-demand during render (no separate storage)

---

## Entity Relationships

```
TaskState (global state)
  ├─ tasks: Task[]                  # Base data (source of truth)
  │    └─ Task                      # Individual task entity
  │         ├─ recurrence?: RecurrencePattern  # Optional nested entity
  │         └─ dueDate?: string     # Optional ISO date
  │
  ├─ filters: FilterState           # Derived state controller
  │    └─ dueDateRange?: DateRange  # Optional nested entity
  │
  └─ sort: SortState                # Derived state controller
```

**Relationship Notes**:
- No foreign keys (single entity type: Task)
- No parent-child task relationships (subtasks out of scope)
- No user entity (authentication out of scope)
- No backend entity references (frontend-only)

---

## Mock Data Shape

**Example Mock Tasks** (populated on app initialization):

```typescript
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize Q1 project proposal for stakeholder review',
    completed: false,
    priority: 'high',
    dueDate: '2026-01-10',
    tags: ['work', 'proposal'],
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    completed: false,
    priority: 'medium',
    dueDate: '2026-01-08',
    tags: ['personal', 'errands'],
    createdAt: '2026-01-06T14:30:00.000Z',
    updatedAt: '2026-01-06T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Weekly team meeting',
    description: 'Discuss sprint progress and roadblocks',
    completed: true,
    priority: 'medium',
    dueDate: '2026-01-07',
    tags: ['work', 'meeting'],
    recurrence: { frequency: 'weekly', interval: 1 },
    createdAt: '2026-01-03T10:00:00.000Z',
    updatedAt: '2026-01-07T15:00:00.000Z',
  },
  {
    id: '4',
    title: 'Review pull requests',
    description: null,
    completed: false,
    priority: 'high',
    tags: ['work', 'code-review'],
    createdAt: '2026-01-08T08:00:00.000Z',
    updatedAt: '2026-01-08T08:00:00.000Z',
  },
  {
    id: '5',
    title: 'Plan weekend trip',
    completed: false,
    priority: 'low',
    tags: ['personal', 'vacation'],
    createdAt: '2026-01-07T19:00:00.000Z',
    updatedAt: '2026-01-07T19:00:00.000Z',
  },
];
```

---

## Validation Summary

| Entity | Validation Rules | Required Fields | Optional Fields |
|--------|------------------|-----------------|-----------------|
| Task | Title (1-200 chars), Priority (enum), DueDate (ISO), Tags (max 50 chars each), Recurrence (valid pattern) | id, title, completed, priority, createdAt, updatedAt | description, dueDate, tags, recurrence |
| FilterState | N/A (all values user-controlled) | searchQuery, completionStatus, priorityFilter | dueDateRange |
| SortState | Field (enum), Direction (enum) | field, direction | None |

---

**Data Model Status**: ✅ **COMPLETE**
**API Readiness**: ✅ **All entities use JSON-serializable types with ISO timestamps**
**Next Step**: Create contracts/ files (task-actions.ts, task-state.ts)
