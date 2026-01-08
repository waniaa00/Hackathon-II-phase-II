/**
 * Date Utility Functions
 * Helper functions for formatting dates and determining urgency
 * Includes recurrence calculation for recurring tasks
 */

import { Recurrence } from './types';

export type DateUrgency = 'overdue' | 'today' | 'soon' | 'future';

export interface DateInfo {
  text: string;
  color: string;
  urgency: DateUrgency;
}

/**
 * Format a date string into a user-friendly display format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if a date is overdue (before today)
 */
export function isOverdue(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is due soon (within 7 days)
 */
export function isDueSoon(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
}

/**
 * Get urgency level for a due date
 */
export function getUrgency(dateString: string): DateUrgency {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 7) return 'soon';
  return 'future';
}

/**
 * Get formatted date info with text, color, and urgency
 */
export function getDateInfo(dateString: string): DateInfo {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
      color: 'text-red-600',
      urgency: 'overdue',
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Due today',
      color: 'text-orange-600',
      urgency: 'today',
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Due tomorrow',
      color: 'text-yellow-600',
      urgency: 'soon',
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Due in ${diffDays} days`,
      color: 'text-blue-600',
      urgency: 'soon',
    };
  }

  return {
    text: formatDate(dateString),
    color: 'text-gray-600',
    urgency: 'future',
  };
}

/**
 * Calculate next N occurrences of a recurring task
 * @param startDate - Starting date for recurrence (ISO string)
 * @param recurrence - Recurrence pattern
 * @param count - Number of occurrences to calculate (default: 3)
 * @returns Array of future occurrence dates as ISO strings
 */
export function calculateNextOccurrences(
  startDate: string,
  recurrence: Recurrence,
  count: number = 3
): string[] {
  const occurrences: string[] = [];
  const start = new Date(startDate);
  const currentDate = new Date(start);

  for (let i = 0; i < count; i++) {
    switch (recurrence.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurrence.interval);
        break;

      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (recurrence.interval * 7));
        break;

      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
        break;
    }

    occurrences.push(currentDate.toISOString().split('T')[0]);
  }

  return occurrences;
}

/**
 * Format recurrence pattern for display
 * @param recurrence - Recurrence pattern
 * @returns Human-readable recurrence description
 */
export function formatRecurrence(recurrence: Recurrence): string {
  const { frequency, interval } = recurrence;

  if (interval === 1) {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  }

  const frequencyLabels = {
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
  };

  return `Every ${interval} ${frequencyLabels[frequency]}`;
}
