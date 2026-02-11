import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string, formatStr = "MMM d, yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isAfter(dateObj, new Date());
}

/**
 * Check if a date is overdue (past and not today)
 */
export function isOverdue(date: Date | string): boolean {
  return isPast(date) && !isToday(date);
}

/**
 * Check if a date is due today
 */
export function isDueToday(date: Date | string): boolean {
  return isToday(date);
}

/**
 * Check if a date is due soon (within the next 24 hours)
 */
export function isDueSoon(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return isAfter(dateObj, now) && isBefore(dateObj, tomorrow);
}

/**
 * Check if a date is in the past or today
 */
export function isPastOrToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return isBefore(dateObj, today) || isSameDay(dateObj, today);
}
