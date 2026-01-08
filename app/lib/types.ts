/**
 * Todo App TypeScript Type Definitions
 * Following spec-driven development with strict typing
 */

/**
 * Priority level enum
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Recurrence pattern for recurring tasks (P4 feature - UI only)
 */
export interface Recurrence {
  /** Recurrence frequency */
  frequency: 'daily' | 'weekly' | 'monthly';
  /** Interval between recurrences (e.g., every 2 weeks = interval: 2) */
  interval: number;
}

/**
 * Represents a single todo task with metadata
 * Frontend-only interface designed to match expected backend API schema
 */
export interface Task {
  /** Unique identifier (UUID v4 or timestamp-based) */
  id: string;
  /** Task title (required, 1-200 characters) */
  title: string;
  /** Optional multi-line description (0-1000 characters) */
  description?: string;
  /** Completion status (default: false) */
  completed: boolean;
  /** Priority level (default: 'medium') */
  priority: Priority;
  /** Optional due date in ISO 8601 format (YYYY-MM-DD) */
  dueDate?: string;
  /** Array of tag strings (case-insensitive, 1-30 chars each) */
  tags: string[];
  /** Optional recurrence pattern (P4 feature - UI only) */
  recurrence?: Recurrence;
  /** Creation timestamp in ISO 8601 format with timezone */
  createdAt: string;
  /** Last update timestamp in ISO 8601 format with timezone */
  updatedAt: string;
}

/**
 * Filter criteria for task list
 */
export interface FilterState {
  /** Completion status filter */
  status: 'all' | 'complete' | 'incomplete';
  /** Priority level filter */
  priority: 'all' | 'low' | 'medium' | 'high';
  /** Due date range filter */
  dueDate: 'all' | 'overdue' | 'this-week' | 'no-date';
}

/**
 * Sort configuration for task list
 */
export interface SortState {
  /** Field to sort by */
  field: 'dueDate' | 'priority' | 'title' | 'createdAt';
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Global application state managed by TaskContext
 */
export interface TaskState {
  /** Array of all tasks */
  tasks: Task[];
  /** Active filter criteria */
  filters: FilterState;
  /** Active sort configuration */
  sort: SortState;
  /** Search query string (debounced) */
  searchQuery: string;
}

/**
 * All possible actions for task state management
 */
export type TaskAction =
  | { type: 'LOAD_TASKS'; payload: { tasks: Task[] } }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: SortState }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'CLEAR_FILTERS' };

/**
 * Dashboard-specific types
 */

/**
 * Derived metrics for dashboard summary cards
 * Computed from TaskState.tasks
 */
export interface DashboardMetrics {
  /** Total number of tasks */
  total: number;
  /** Number of completed tasks */
  completed: number;
  /** Number of pending (incomplete) tasks */
  pending: number;
  /** Number of overdue tasks (incomplete + due date in past) */
  overdue: number;
}

/**
 * Semantic type for summary cards
 */
export type SummaryCardType = 'total' | 'completed' | 'pending' | 'overdue';

/**
 * Props for SummaryCard component
 */
export interface SummaryCardProps {
  /** Card type (determines color scheme) */
  type: SummaryCardType;
  /** Display label (e.g., "Total Tasks", "Completed") */
  label: string;
  /** Numeric count to display */
  count: number;
  /** Optional icon component */
  icon?: React.ReactNode;
}

/**
 * Props for CompactTaskItem component (dashboard-specific)
 */
export interface CompactTaskItemProps {
  /** Task to display */
  task: Task;
  /** Optional click handler for navigation */
  onClick?: () => void;
}

/**
 * Props for TodaysFocus section component
 */
export interface TodaysFocusProps {
  /** Filtered tasks for today's focus */
  tasks: Task[];
}

/**
 * Props for QuickActions panel component
 */
export interface QuickActionsProps {
  /** Handler for opening Add Task form/modal */
  onAddTask: () => void;
  /** Handler for navigating to All Tasks view */
  onViewAll: () => void;
  /** Handler for clearing completed tasks */
  onClearCompleted: () => void;
  /** Number of completed tasks (for Clear Completed button state) */
  completedCount: number;
}

/**
 * Props for Logo component
 */
export interface LogoProps {
  /** Optional size variant (default: 'medium') */
  size?: 'small' | 'medium' | 'large';
  /** Optional click handler (for navigation to home) */
  onClick?: () => void;
}

/**
 * Props for Navbar component
 */
export interface NavbarProps {
  /** Optional current page indicator for active link styling */
  currentPath?: string;
}
