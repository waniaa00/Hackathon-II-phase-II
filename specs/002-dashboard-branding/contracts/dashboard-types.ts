/**
 * Dashboard UI & Application Branding - Type Contracts
 *
 * Defines TypeScript interfaces for dashboard components and derived state.
 * These contracts ensure type safety across all dashboard components.
 *
 * @see data-model.md for entity definitions and relationships
 * @see spec.md for functional requirements
 */

import type { Task } from '../../004-todo-frontend-ui/contracts/task-state';

/**
 * Dashboard summary statistics derived from TaskState
 *
 * Calculated via useMemo from tasks array:
 * - Recalculates only when tasks change
 * - O(n) complexity for all 4 counts
 * - Performance target: <300ms for 100 tasks
 *
 * @example
 * ```typescript
 * const stats = useMemo(() => ({
 *   totalTasks: tasks.length,
 *   completedTasks: tasks.filter(t => t.completed).length,
 *   pendingTasks: tasks.filter(t => !t.completed).length,
 *   overdueTasks: tasks.filter(t =>
 *     !t.completed && t.dueDate && isPast(t.dueDate)
 *   ).length
 * }), [tasks]);
 * ```
 */
export interface DashboardStats {
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
   * Uses isPast utility from lib/utils/dateUtils.ts (todo-frontend-ui)
   */
  overdueTasks: number;
}

/**
 * Props for SummaryCard component
 *
 * Displays a single metric card in the dashboard summary grid.
 * Cards are rendered as static <article> elements with semantic HTML.
 *
 * @example
 * ```typescript
 * <SummaryCard
 *   title="Completed Tasks"
 *   count={28}
 *   description="Tasks marked as complete"
 *   icon={CheckCircleIcon}
 *   colorScheme="green"
 * />
 * ```
 */
export interface SummaryCardProps {
  /**
   * Card title/label (e.g., "Total Tasks", "Completed", "Pending", "Overdue")
   * Rendered as h2 heading with unique ID from useId() hook
   */
  title: string;

  /**
   * Numeric count to display prominently
   * Rendered as large text (text-3xl font-bold)
   * Example: 42, 28, 14, 3
   */
  count: number;

  /**
   * Optional description text for screen readers and additional context
   * Linked to card via aria-describedby
   * Example: "All tasks in the system", "Tasks marked as complete"
   */
  description?: string;

  /**
   * Icon component to display alongside title
   * Should be from @heroicons/react/24/outline for consistency
   * Must accept className and aria-hidden props
   *
   * @example
   * import { CheckCircleIcon } from '@heroicons/react/24/outline';
   */
  icon?: React.ComponentType<{
    className?: string;
    'aria-hidden'?: string;
  }>;

  /**
   * Color scheme for card styling (maps to Tailwind color utilities)
   * - blue: Info/neutral (Total Tasks)
   * - green: Success (Completed Tasks)
   * - yellow: Warning (Pending Tasks)
   * - red: Error/urgent (Overdue Tasks)
   *
   * Maps to Tailwind classes:
   * - blue: bg-blue-50 border-blue-200 text-blue-600
   * - green: bg-green-50 border-green-200 text-green-600
   * - yellow: bg-yellow-50 border-yellow-200 text-yellow-600
   * - red: bg-red-50 border-red-200 text-red-600
   */
  colorScheme: 'blue' | 'green' | 'yellow' | 'red';

  /**
   * Optional click handler if card should be interactive
   * If provided, card renders as <button> within <article>
   * If omitted, card renders as static <article>
   *
   * Default: undefined (static card)
   */
  onClick?: () => void;
}

/**
 * Props for QuickActionButton component
 *
 * Action buttons in the Quick Actions panel with icon and label.
 * Rendered as native <button> elements with appropriate ARIA attributes.
 *
 * @example
 * ```typescript
 * <QuickActionButton
 *   label="Add Task"
 *   icon={PlusIcon}
 *   onClick={handleAddTask}
 *   variant="primary"
 * />
 * ```
 */
export interface QuickActionButtonProps {
  /**
   * Button label text (visible to all users)
   * Example: "Add Task", "View All Tasks", "Clear Completed (3)"
   */
  label: string;

  /**
   * Icon component to display alongside label
   * Should be from @heroicons/react/24/outline for consistency
   * Icon is marked aria-hidden="true" (label provides context)
   *
   * @example
   * import { PlusIcon } from '@heroicons/react/24/outline';
   */
  icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: string;
  }>;

  /**
   * Click handler for button action
   * Called when button is clicked or activated via keyboard (Enter/Space)
   */
  onClick: () => void;

  /**
   * Button variant determines styling and semantic meaning
   * - primary: Prominent positive action (Add Task) - blue background
   * - secondary: Neutral navigation action (View All) - gray background
   * - destructive: Dangerous destructive action (Clear Completed) - red background
   *
   * Maps to Tailwind classes:
   * - primary: bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
   * - secondary: bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500
   * - destructive: bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
   */
  variant: 'primary' | 'secondary' | 'destructive';

  /**
   * Disabled state (e.g., Clear Completed when completedCount === 0)
   * When true, button is not clickable and has disabled styling
   *
   * Default: false
   */
  disabled?: boolean;

  /**
   * Optional aria-label for screen reader accessibility
   * If not provided, uses label text
   * Useful for providing additional context (e.g., "Delete all 5 completed tasks")
   */
  'aria-label'?: string;
}

/**
 * Props for DashboardLayout component
 *
 * Wraps dashboard content with consistent max-width container and spacing.
 * Provides structural layout for dashboard sections.
 *
 * @example
 * ```typescript
 * <DashboardLayout header={<h1>TASKIFY Dashboard</h1>}>
 *   <DashboardSummary stats={stats} />
 *   <TodaysFocus tasks={focusTasks} />
 *   <QuickActions />
 * </DashboardLayout>
 * ```
 */
export interface DashboardLayoutProps {
  /**
   * Dashboard content to render
   * Typically includes: DashboardSummary, TodaysFocus, QuickActions
   */
  children: React.ReactNode;

  /**
   * Optional header content displayed above dashboard sections
   * Defaults to <h1>Dashboard</h1> if not provided
   *
   * @example
   * <h1 className="text-3xl font-bold">TASKIFY Dashboard</h1>
   */
  header?: React.ReactNode;

  /**
   * Optional max-width constraint for dashboard container
   * Controls dashboard width on large screens
   *
   * Default: 'max-w-7xl' (1280px)
   */
  maxWidth?: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
}

/**
 * Props for DashboardSummary component
 *
 * Displays 4 summary cards in responsive grid layout.
 * Grid adapts: 1 column (mobile) → 2x2 (tablet) → 4 columns (desktop).
 *
 * @example
 * ```typescript
 * <DashboardSummary stats={stats} />
 * ```
 */
export interface DashboardSummaryProps {
  /**
   * Dashboard statistics derived from TaskState
   * Calculated via useDashboardStats hook with useMemo
   */
  stats: DashboardStats;
}

/**
 * Props for TodaysFocus component
 *
 * Displays filtered list of tasks requiring immediate attention.
 * Tasks shown: due today OR high priority, AND incomplete.
 * Reuses TaskItem component from todo-frontend-ui with compact styling.
 *
 * @example
 * ```typescript
 * const focusTasks = useMemo(
 *   () => filterTodaysFocusTasks(tasks),
 *   [tasks]
 * );
 *
 * <TodaysFocus tasks={focusTasks} />
 * ```
 */
export interface TodaysFocusProps {
  /**
   * Filtered tasks for Today's Focus section
   * Pre-filtered via filterTodaysFocusTasks utility
   * Empty array shows empty state message
   */
  tasks: Task[];

  /**
   * Optional max number of tasks to display
   * If tasks.length > maxDisplay, shows "View All" link
   *
   * Default: 10
   */
  maxDisplay?: number;
}

/**
 * Props for QuickActions component
 *
 * Displays panel with 3 quick action buttons:
 * 1. Add Task (primary) - Opens TaskForm modal
 * 2. View All Tasks (secondary) - Navigates to main task list
 * 3. Clear Completed (destructive) - Opens confirmation, dispatches CLEAR_COMPLETED
 *
 * @example
 * ```typescript
 * <QuickActions
 *   onAddTask={handleAddTask}
 *   onViewAll={handleViewAll}
 *   onClearCompleted={handleClearCompleted}
 *   completedCount={completedTasks}
 * />
 * ```
 */
export interface QuickActionsProps {
  /**
   * Callback for "Add Task" button click
   * Should open TaskForm modal in create mode
   */
  onAddTask: () => void;

  /**
   * Callback for "View All Tasks" button click
   * Should navigate to main task list route (from todo-frontend-ui)
   */
  onViewAll: () => void;

  /**
   * Callback for "Clear Completed" button click
   * Should show confirmation dialog, then dispatch CLEAR_COMPLETED action
   */
  onClearCompleted: () => void;

  /**
   * Count of completed tasks (for button label and disabled state)
   * Button label: "Clear Completed (3)"
   * Button disabled when count === 0
   */
  completedCount: number;
}

/**
 * Props for Navbar component
 *
 * Persistent navigation bar with TASKIFY branding and route links.
 * Placed in root layout for application-wide persistence.
 *
 * @example
 * ```typescript
 * <Navbar currentPath="/dashboard" />
 * ```
 */
export interface NavbarProps {
  /**
   * Current route path for active link highlighting
   * Example: "/dashboard", "/tasks", "/"
   */
  currentPath: string;
}

/**
 * Props for Logo component
 *
 * TASKIFY logo with icon and text.
 * Displayed in navigation bar.
 *
 * @example
 * ```typescript
 * <Logo size="medium" />
 * ```
 */
export interface LogoProps {
  /**
   * Logo size variant
   * - small: Icon 20px, text text-lg (mobile)
   * - medium: Icon 24px, text text-xl (desktop default)
   * - large: Icon 32px, text text-2xl (hero sections)
   *
   * Default: 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether to show only icon or icon + text
   * Useful for mobile collapsed navigation
   *
   * Default: false (show both)
   */
  iconOnly?: boolean;
}
