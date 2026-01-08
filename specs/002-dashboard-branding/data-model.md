# Data Model: Dashboard UI & Application Branding

**Feature**: 002-dashboard-branding
**Date**: 2026-01-08
**Purpose**: Define derived state entities, component data structures, and filtering logic for the dashboard

---

## Overview

The dashboard does NOT introduce new base state - it **consumes existing `TaskState` from todo-frontend-ui** and derives dashboard-specific data through calculations and filtering. All entities in this document are **derived state** or **UI component interfaces**.

---

## Derived State Entities

### DashboardStats

Summary statistics derived from the `tasks` array in `TaskState`.

```typescript
/**
 * Dashboard summary statistics
 * Derived from TaskState.tasks[] array
 * Recalculated via useMemo when tasks change
 */
interface DashboardStats {
  /**
   * Total count of all tasks
   * Calculation: tasks.length
   */
  totalTasks: number;

  /**
   * Count of completed tasks
   * Calculation: tasks.filter(t => t.completed).length
   */
  completedTasks: number;

  /**
   * Count of incomplete tasks
   * Calculation: tasks.filter(t => !t.completed).length
   */
  pendingTasks: number;

  /**
   * Count of overdue incomplete tasks
   * Calculation: tasks.filter(t =>
   *   !t.completed &&
   *   t.dueDate &&
   *   isPast(new Date(t.dueDate))
   * ).length
   *
   * Note: Uses isPast() utility from lib/utils/dateUtils.ts (todo-frontend-ui)
   */
  overdueTasks: number;
}
```

**Calculation Implementation**:

```typescript
import { useMemo } from 'react';
import { isPast } from '@/app/lib/utils/dateUtils';

function useDashboardStats(tasks: Task[]): DashboardStats {
  return useMemo(() => {
    const completed = tasks.filter(t => t.completed);
    const incomplete = tasks.filter(t => !t.completed);
    const overdue = incomplete.filter(t =>
      t.dueDate && isPast(t.dueDate)
    );

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      pendingTasks: incomplete.length,
      overdueTasks: overdue.length,
    };
  }, [tasks]);
}
```

**Performance**: Recalculates only when `tasks` array changes (via useMemo dependency).

---

### TodaysFocusCriteria

Filtering logic for the "Today's Focus" section showing actionable tasks.

```typescript
/**
 * Criteria for Today's Focus section
 * Shows tasks that require immediate attention:
 * - Due today (in local timezone)
 * - High priority incomplete tasks (regardless of due date)
 * - ALL must be incomplete (completed tasks excluded)
 */
interface TodaysFocusCriteria {
  /**
   * Check if task due date is today
   * @param dueDate - ISO 8601 date string (e.g., "2026-01-08")
   * @returns true if date matches today in local timezone
   */
  isDueToday: (dueDate: string | undefined) => boolean;

  /**
   * Check if task is high priority and incomplete
   * @param task - Task entity from TaskState
   * @returns true if priority === 'high' AND completed === false
   */
  isHighPriorityIncomplete: (task: Task) => boolean;

  /**
   * Filter tasks for Today's Focus display
   * @param tasks - Array of tasks from TaskState
   * @returns Filtered array of tasks meeting focus criteria (deduplicated)
   */
  filterTodaysFocusTasks: (tasks: Task[]) => Task[];
}
```

**Implementation**:

```typescript
import { isToday } from '@/app/lib/utils/dateUtils';

/**
 * Filter tasks for Today's Focus section
 * Shows: (due today OR high priority) AND incomplete
 */
export function filterTodaysFocusTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => {
    // Exclude completed tasks
    if (task.completed) return false;

    // Include if due today
    const isDueToday = task.dueDate && isToday(task.dueDate);

    // Include if high priority
    const isHighPriority = task.priority === 'high';

    // Task must meet at least one criterion
    return isDueToday || isHighPriority;
  });
}

// Usage with useMemo for performance
function TodaysFocus() {
  const { tasks } = useTasks();

  const focusTasks = useMemo(
    () => filterTodaysFocusTasks(tasks),
    [tasks]
  );

  return <TaskList tasks={focusTasks} compact />;
}
```

**Deduplication**: Tasks that are both due today AND high priority appear once (filter logic uses OR, so task matches if either condition is true).

**Performance**: Filtered via useMemo, recalculates only when `tasks` array changes.

---

## UI Component Data Structures

### SummaryCard

Props interface for the reusable SummaryCard component.

```typescript
/**
 * Props for SummaryCard component
 * Displays a single metric card in the dashboard summary grid
 */
interface SummaryCardProps {
  /**
   * Card title/label (e.g., "Total Tasks", "Completed", "Pending", "Overdue")
   * Displayed as heading (h2 or h3)
   */
  title: string;

  /**
   * Numeric count to display prominently
   * Example: 42, 28, 14, 3
   */
  count: number;

  /**
   * Optional description text for screen readers and additional context
   * Example: "All tasks in the system"
   */
  description?: string;

  /**
   * Icon component to display alongside title
   * Example: CheckCircleIcon, ClockIcon, ListBulletIcon
   * From @heroicons/react/24/outline
   */
  icon?: React.ComponentType<{
    className?: string;
    'aria-hidden'?: string;
  }>;

  /**
   * Color scheme for card styling (maps to Tailwind colors)
   * - blue: Info/neutral (Total Tasks)
   * - green: Success (Completed Tasks)
   * - yellow: Warning (Pending Tasks)
   * - red: Error/urgent (Overdue Tasks)
   */
  colorScheme: 'blue' | 'green' | 'yellow' | 'red';

  /**
   * Optional click handler if card should be interactive
   * If provided, card renders as button; otherwise static article
   */
  onClick?: () => void;
}
```

**Usage Example**:

```typescript
<SummaryCard
  title="Completed Tasks"
  count={28}
  description="Tasks marked as complete"
  icon={CheckCircleIcon}
  colorScheme="green"
/>
```

**Tailwind Color Mapping**:

```typescript
const colorClasses: Record<SummaryCardProps['colorScheme'], string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  green: 'bg-green-50 border-green-200 text-green-600',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  red: 'bg-red-50 border-red-200 text-red-600',
};
```

---

### QuickActionButton

Props interface for action buttons in the Quick Actions panel.

```typescript
/**
 * Props for QuickActionButton component
 * Displays an action button with icon and label
 */
interface QuickActionButtonProps {
  /**
   * Button label text
   * Example: "Add Task", "View All Tasks", "Clear Completed"
   */
  label: string;

  /**
   * Icon component to display alongside label
   * Example: PlusIcon, ListBulletIcon, TrashIcon
   * From @heroicons/react/24/outline
   */
  icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: string;
  }>;

  /**
   * Click handler for button action
   */
  onClick: () => void;

  /**
   * Button variant determines styling
   * - primary: Prominent action (Add Task) - blue background
   * - secondary: Neutral action (View All) - gray background
   * - destructive: Dangerous action (Clear Completed) - red background
   */
  variant: 'primary' | 'secondary' | 'destructive';

  /**
   * Disabled state (e.g., Clear Completed when no completed tasks exist)
   * Defaults to false
   */
  disabled?: boolean;

  /**
   * Optional aria-label for accessibility
   * If not provided, uses label text
   */
  'aria-label'?: string;
}
```

**Usage Example**:

```typescript
<QuickActionButton
  label="Add Task"
  icon={PlusIcon}
  onClick={handleAddTask}
  variant="primary"
/>

<QuickActionButton
  label={`Clear Completed (${completedCount})`}
  icon={TrashIcon}
  onClick={handleClearCompleted}
  variant="destructive"
  disabled={completedCount === 0}
  aria-label="Delete all completed tasks"
/>
```

**Variant Styling**:

```typescript
const variantClasses: Record<QuickActionButtonProps['variant'], string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};
```

---

### DashboardLayout

Props interface for the dashboard layout container.

```typescript
/**
 * Props for DashboardLayout component
 * Wraps dashboard content with consistent max-width and spacing
 */
interface DashboardLayoutProps {
  /**
   * Dashboard content to render (summary cards, Today's Focus, Quick Actions)
   */
  children: React.ReactNode;

  /**
   * Optional header content (defaults to "Dashboard" h1)
   */
  header?: React.ReactNode;

  /**
   * Optional max-width class (defaults to 'max-w-7xl')
   * Controls dashboard width on large screens
   */
  maxWidth?: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
}
```

**Usage Example**:

```typescript
<DashboardLayout header={<h1>TASKIFY Dashboard</h1>}>
  <DashboardSummary stats={stats} />
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
    <div className="lg:col-span-2">
      <TodaysFocus tasks={focusTasks} />
    </div>
    <QuickActions />
  </div>
</DashboardLayout>
```

---

## State Transitions (None for Dashboard)

The dashboard feature does **NOT introduce new state or state transitions**. It only:
1. **Reads** `TaskState` from existing `TaskContext` (from todo-frontend-ui)
2. **Derives** stats and filtered lists via useMemo
3. **Dispatches** existing actions to TaskContext:
   - `ADD_TASK` (via "Add Task" quick action → opens TaskForm)
   - `CLEAR_COMPLETED` (via "Clear Completed" quick action → confirmation dialog)
   - `TOGGLE_COMPLETE` (via TaskItem in Today's Focus)

**No new reducer actions needed** - dashboard reuses existing task management actions.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ TaskContext (from todo-frontend-ui)                         │
│   TaskState = { tasks: Task[], filters: FilterState, ... }  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (consumed via useTasks hook)
                      │
        ┌─────────────▼─────────────┐
        │  Dashboard Page           │
        │  (app/dashboard/page.tsx) │
        └────┬────────────────┬─────┘
             │                │
             │                │
   ┌─────────▼──────┐  ┌─────▼─────────────┐
   │ useDashboardStats│  │ filterTodaysFocus │
   │ (useMemo)        │  │ (useMemo)         │
   └─────────┬──────┘  └─────┬─────────────┘
             │                │
             │                │
   ┌─────────▼──────────┐  ┌─▼──────────────┐
   │ DashboardSummary   │  │ TodaysFocus    │
   │ (4 SummaryCards)   │  │ (TaskItem list)│
   └────────────────────┘  └────────────────┘
```

**Key Points**:
- Dashboard reads `TaskState.tasks` array (read-only)
- Dashboard computes derived state via useMemo (performance-optimized)
- Dashboard dispatches actions to TaskContext (writes go through reducer)
- No local state in dashboard beyond modal visibility (UI state only)

---

## Entity Relationships

```
TaskState (existing)
  └─ tasks: Task[]
       │
       ├─ DashboardStats (derived)
       │    ├─ totalTasks (count all)
       │    ├─ completedTasks (count completed)
       │    ├─ pendingTasks (count incomplete)
       │    └─ overdueTasks (count incomplete + past due)
       │
       └─ TodaysFocusTasks (derived)
            └─ filtered Task[] (due today OR high priority, AND incomplete)
```

**No new entities introduced** - only derived views of existing Task entities.

---

## Validation Rules (Inherited from Task Entity)

Dashboard displays and filters tasks but does NOT modify task data. All validation rules are inherited from the `Task` entity defined in todo-frontend-ui:

- **Title**: Required, 1-200 characters
- **Priority**: Enum ('low' | 'medium' | 'high')
- **DueDate**: Optional, ISO 8601 string (YYYY-MM-DD)
- **Completed**: Boolean

Dashboard-specific derived state has **no validation rules** (calculations are deterministic).

---

## Performance Considerations

### useMemo Optimization

All derived state uses useMemo to prevent unnecessary recalculations:

```typescript
// Recalculates ONLY when tasks array changes
const stats = useMemo(() => calculateDashboardStats(tasks), [tasks]);

// Recalculates ONLY when tasks array changes
const focusTasks = useMemo(() => filterTodaysFocusTasks(tasks), [tasks]);
```

### Calculation Complexity

- **DashboardStats**: O(n) - single pass through tasks array for all 4 counts
- **TodaysFocus**: O(n) - single filter pass through tasks array
- **Total**: O(n) for dashboard data preparation with n = number of tasks

**Expected Performance**: <300ms for 100 tasks, <2s for 1000 tasks (within spec requirements).

---

## API Readiness (Future Backend Integration)

While dashboard is frontend-only, derived state shapes are **API-ready**:

```typescript
// Future API endpoint: GET /api/dashboard/stats
interface DashboardStatsResponse {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  updated_at: string; // ISO 8601 timestamp
}

// Future API endpoint: GET /api/dashboard/todays-focus
interface TodaysFocusResponse {
  tasks: Task[];
  count: number;
  criteria: {
    due_today_count: number;
    high_priority_count: number;
  };
}
```

**Current**: Calculations performed client-side via useMemo
**Future**: API responses can replace calculations, dashboard code remains largely unchanged

---

## Summary

**Derived Entities**: 2 (DashboardStats, TodaysFocusTasks)
**UI Component Interfaces**: 3 (SummaryCard, QuickActionButton, DashboardLayout)
**New Base State**: 0 (reuses existing TaskState)
**State Transitions**: 0 (dispatches existing actions only)
**Performance**: O(n) calculations with useMemo optimization

---

**Data Model Status**: COMPLETE - Ready for TypeScript contract generation in `contracts/` directory.
