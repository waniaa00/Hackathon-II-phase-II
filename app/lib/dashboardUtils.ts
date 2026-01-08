import { Task, DashboardMetrics } from './types';

/**
 * Computes dashboard metrics from task array
 * Pure function for testability and memoization
 */
export function calculateMetrics(tasks: Task[]): DashboardMetrics {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;

  // Overdue: incomplete tasks with due date in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const overdue = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  return { total, completed, pending, overdue };
}

/**
 * Filters tasks for Today's Focus section
 * Criteria: (Due today OR High priority) AND Not completed
 */
export function getTodaysFocusTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  return tasks.filter(task => {
    // Exclude completed tasks
    if (task.completed) return false;

    // Include if due today
    if (task.dueDate === today) return true;

    // Include if high priority (regardless of due date)
    if (task.priority === 'high') return true;

    // Exclude all others
    return false;
  });
}

/**
 * Truncates text to specified length with ellipsis
 * Used for task titles in compact views
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
