/**
 * Todo App Constants
 * Default values and configuration
 */

import { FilterState, SortState } from './types';

/**
 * Default filter state (all filters disabled)
 */
export const DEFAULT_FILTERS: FilterState = {
  status: 'all',
  priority: 'all',
  dueDate: 'all',
};

/**
 * Default sort state (by due date ascending)
 */
export const DEFAULT_SORT: SortState = {
  field: 'dueDate',
  direction: 'asc',
};

/**
 * Priority color classes (Tailwind CSS)
 */
export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
} as const;

/**
 * Urgency color classes (Tailwind CSS)
 */
export const URGENCY_COLORS = {
  overdue: 'text-red-600 font-semibold',
  'due-soon': 'text-yellow-600 font-medium',
  future: 'text-gray-600',
  none: 'text-gray-400',
} as const;
