/**
 * Task State Shape
 *
 * Defines the global application state managed by the task reducer.
 * This is the single source of truth for all task data and UI state.
 *
 * @see data-model.md for entity definitions and state transitions
 * @see taskReducer.ts for state update logic
 */

import type { Task } from '../lib/types/task';

/**
 * Filter state for deriving visible task list
 *
 * All filters are applied simultaneously (AND logic)
 * Tasks must match ALL active filters to be displayed
 */
export interface FilterState {
  /** Case-insensitive substring search on title and description */
  searchQuery: string;

  /** Filter by completion status */
  completionStatus: 'all' | 'complete' | 'incomplete';

  /** Filter by priority level */
  priorityFilter: 'all' | 'low' | 'medium' | 'high';

  /** Optional date range filter for due dates */
  dueDateRange?: {
    start: string; // ISO 8601 date (YYYY-MM-DD)
    end: string;   // ISO 8601 date (YYYY-MM-DD)
  };
}

/**
 * Sort state for ordering task list
 *
 * Applied after filtering to derive final visible task list
 */
export interface SortState {
  /** Which task property to sort by */
  field: 'dueDate' | 'priority' | 'title' | 'createdAt';

  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Global application state
 *
 * Single source of truth for all task data
 * filters and sort are applied to derive visible task list
 */
export interface TaskState {
  /** Base task collection (source of truth) */
  tasks: Task[];

  /** Active filter criteria (derived state controller) */
  filters: FilterState;

  /** Active sort configuration (derived state controller) */
  sort: SortState;
}

/**
 * Initial state for task reducer
 *
 * tasks array populated with mock data on app initialization
 * filters default to showing all tasks
 * sort defaults to newest first (by creation time)
 */
export const initialTaskState: TaskState = {
  tasks: [], // Will be populated with mockTasks in TaskProvider

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

/**
 * Type for task reducer dispatch function
 *
 * Used in Context to provide type-safe dispatch
 */
export type TaskDispatch = (action: TaskAction) => void;

/**
 * Import TaskAction type from contracts
 */
import type { TaskAction } from './task-actions';
