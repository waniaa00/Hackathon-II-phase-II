/**
 * Today's Focus Filtering Logic - Type Contracts
 *
 * Defines filtering criteria and utility functions for the Today's Focus section.
 * Shows tasks requiring immediate attention: due today OR high priority, AND incomplete.
 *
 * @see data-model.md for TodaysFocusCriteria definition
 * @see spec.md for FR-020 through FR-028 (Today's Focus requirements)
 */

import type { Task } from '../../004-todo-frontend-ui/contracts/task-state';

/**
 * Check if a date string represents today in local timezone
 *
 * Implementation extracts date components (day, month, year) and compares
 * them individually to avoid time portion issues.
 *
 * @param dateString - ISO 8601 date string (e.g., "2026-01-08")
 * @returns true if date matches today in local timezone, false otherwise
 *
 * @example
 * ```typescript
 * const today = "2026-01-08";
 * const tomorrow = "2026-01-09";
 * const yesterday = "2026-01-07";
 *
 * isToday(today); // true (if run on 2026-01-08)
 * isToday(tomorrow); // false
 * isToday(yesterday); // false
 * isToday(undefined); // false
 * ```
 *
 * Browser compatibility: All modern browsers (uses Date.getDate, getMonth, getFullYear)
 *
 * @see research.md Decision 5 for date comparison rationale
 */
export type IsTodayFn = (dateString: string | undefined) => boolean;

/**
 * Check if a task is high priority and incomplete
 *
 * Used to include high-priority tasks in Today's Focus regardless of due date.
 * Completed tasks are always excluded from focus.
 *
 * @param task - Task entity from TaskState
 * @returns true if priority === 'high' AND completed === false
 *
 * @example
 * ```typescript
 * const highPriorityIncomplete = {
 *   id: '1',
 *   title: 'Critical bug fix',
 *   priority: 'high',
 *   completed: false,
 * };
 *
 * const highPriorityCompleted = {
 *   ...highPriorityIncomplete,
 *   completed: true,
 * };
 *
 * const mediumPriority = {
 *   ...highPriorityIncomplete,
 *   priority: 'medium',
 * };
 *
 * isHighPriorityIncomplete(highPriorityIncomplete); // true
 * isHighPriorityIncomplete(highPriorityCompleted); // false (completed)
 * isHighPriorityIncomplete(mediumPriority); // false (not high priority)
 * ```
 */
export type IsHighPriorityIncompleteFn = (task: Task) => boolean;

/**
 * Filter tasks for Today's Focus section
 *
 * Returns tasks that meet ANY of these criteria:
 * 1. Due date equals today (local timezone comparison)
 * 2. Priority is 'high' AND task is incomplete
 *
 * ALL tasks must be incomplete (completed tasks always excluded).
 * Tasks meeting both criteria appear once (no duplication).
 *
 * @param tasks - Array of tasks from TaskState
 * @returns Filtered array of tasks meeting focus criteria
 *
 * @example
 * ```typescript
 * const tasks = [
 *   { id: '1', title: 'Due today', dueDate: '2026-01-08', priority: 'medium', completed: false },
 *   { id: '2', title: 'High priority', priority: 'high', completed: false },
 *   { id: '3', title: 'Both', dueDate: '2026-01-08', priority: 'high', completed: false },
 *   { id: '4', title: 'Completed', dueDate: '2026-01-08', priority: 'high', completed: true },
 *   { id: '5', title: 'Tomorrow', dueDate: '2026-01-09', priority: 'low', completed: false },
 * ];
 *
 * const focused = filterTodaysFocusTasks(tasks);
 * // Returns: [task 1, task 2, task 3]
 * // Excludes: task 4 (completed), task 5 (not due today, not high priority)
 * ```
 *
 * Performance: O(n) single pass through tasks array
 * Optimization: Use with useMemo to recalculate only when tasks change
 *
 * @example
 * ```typescript
 * // Usage with useMemo for performance
 * function TodaysFocus() {
 *   const { tasks } = useTasks();
 *
 *   const focusTasks = useMemo(
 *     () => filterTodaysFocusTasks(tasks),
 *     [tasks]
 *   );
 *
 *   return <TaskList tasks={focusTasks} compact />;
 * }
 * ```
 *
 * @see FR-020 through FR-028 in spec.md for Today's Focus requirements
 */
export type FilterTodaysFocusTasksFn = (tasks: Task[]) => Task[];

/**
 * Today's Focus Criteria interface
 *
 * Bundles all filtering logic for the Today's Focus section.
 * Provides functions for checking individual criteria and filtering task arrays.
 */
export interface TodaysFocusCriteria {
  /**
   * Check if date is today
   * @see IsTodayFn
   */
  isToday: IsTodayFn;

  /**
   * Check if task is high priority and incomplete
   * @see IsHighPriorityIncompleteFn
   */
  isHighPriorityIncomplete: IsHighPriorityIncompleteFn;

  /**
   * Filter tasks meeting Today's Focus criteria
   * @see FilterTodaysFocusTasksFn
   */
  filterTodaysFocusTasks: FilterTodaysFocusTasksFn;
}

/**
 * Implementation example (reference for actual implementation)
 *
 * This is NOT executable code - it's documentation of expected implementation.
 * Actual implementation will be in lib/utils/dashboardUtils.ts
 *
 * @example
 * ```typescript
 * // lib/utils/dashboardUtils.ts
 *
 * import { isToday } from './dateUtils'; // Reused from todo-frontend-ui
 *
 * export function isHighPriorityIncomplete(task: Task): boolean {
 *   return task.priority === 'high' && !task.completed;
 * }
 *
 * export function filterTodaysFocusTasks(tasks: Task[]): Task[] {
 *   return tasks.filter(task => {
 *     // Exclude all completed tasks
 *     if (task.completed) return false;
 *
 *     // Include if due today
 *     const isDueToday = task.dueDate && isToday(task.dueDate);
 *
 *     // Include if high priority
 *     const isHighPriority = task.priority === 'high';
 *
 *     // Task must meet at least one criterion (OR logic)
 *     return isDueToday || isHighPriority;
 *   });
 * }
 * ```
 */

/**
 * Edge cases handled by Today's Focus filtering
 */
export type TodaysFocusEdgeCases = {
  /**
   * No tasks meet criteria
   * Result: Empty array []
   * UI: Shows empty state message
   */
  noTasksMatchCriteria: Task[];

  /**
   * All tasks are completed
   * Result: Empty array [] (completed tasks excluded)
   * UI: Shows congratulatory empty state
   */
  allTasksCompleted: Task[];

  /**
   * Task with no due date but high priority
   * Result: Included in focus (high priority criterion met)
   */
  highPriorityNoDueDate: Task;

  /**
   * Task due today with low priority
   * Result: Included in focus (due today criterion met)
   */
  dueTodayLowPriority: Task;

  /**
   * Task due today AND high priority
   * Result: Included once (both criteria met, but no duplication)
   */
  dueTodayAndHighPriority: Task;

  /**
   * Task due yesterday with high priority
   * Result: Included (high priority criterion met, overdue doesn't matter for focus)
   */
  overdueHighPriority: Task;

  /**
   * Task due today but completed
   * Result: Excluded (completed tasks always filtered out)
   */
  dueTodayButCompleted: Task;

  /**
   * Task with invalid/undefined due date
   * Result: Only included if high priority incomplete, otherwise excluded
   */
  invalidDueDate: Task;
};

/**
 * Test scenarios for Today's Focus filtering
 *
 * These scenarios should be validated during implementation.
 *
 * @example
 * ```typescript
 * // Test Scenario 1: Mix of criteria
 * const tasks = [
 *   { id: '1', title: 'A', dueDate: '2026-01-08', priority: 'medium', completed: false },
 *   { id: '2', title: 'B', priority: 'high', completed: false },
 *   { id: '3', title: 'C', dueDate: '2026-01-09', priority: 'low', completed: false },
 * ];
 *
 * const result = filterTodaysFocusTasks(tasks);
 * // Expected (on 2026-01-08): [task 1, task 2]
 * // task 1: due today ✓
 * // task 2: high priority ✓
 * // task 3: neither criterion met ✗
 *
 * // Test Scenario 2: All completed
 * const completedTasks = tasks.map(t => ({ ...t, completed: true }));
 * const result2 = filterTodaysFocusTasks(completedTasks);
 * // Expected: [] (all excluded)
 *
 * // Test Scenario 3: Deduplication
 * const bothCriteria = [{
 *   id: '1',
 *   title: 'Both due today and high priority',
 *   dueDate: '2026-01-08',
 *   priority: 'high',
 *   completed: false,
 * }];
 * const result3 = filterTodaysFocusTasks(bothCriteria);
 * // Expected: [task] (appears once, not duplicated)
 * ```
 */
export type TodaysFocusTestScenarios = {
  mixedCriteria: Task[];
  allCompleted: Task[];
  deduplication: Task[];
  emptyArray: Task[];
  singleTaskDueToday: Task[];
  singleTaskHighPriority: Task[];
};
