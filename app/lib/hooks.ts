/**
 * Custom React Hooks
 * Reusable hooks for task management
 */

import { useMemo } from 'react';
import { Task, TaskState } from './types';

/**
 * Filter and sort tasks based on current state
 * Uses useMemo for performance optimization
 */
export function useFilteredAndSortedTasks(state: TaskState): Task[] {
  return useMemo(() => {
    let filtered = [...state.tasks];

    // Apply search filter (case-insensitive, matches title and description)
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (state.filters.status !== 'all') {
      if (state.filters.status === 'complete') {
        filtered = filtered.filter((task) => task.completed);
      } else if (state.filters.status === 'incomplete') {
        filtered = filtered.filter((task) => !task.completed);
      }
    }

    // Apply priority filter
    if (state.filters.priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === state.filters.priority);
    }

    // Apply due date filter
    if (state.filters.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (state.filters.dueDate === 'overdue') {
        filtered = filtered.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
      } else if (state.filters.dueDate === 'this-week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        filtered = filtered.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today && dueDate <= nextWeek;
        });
      } else if (state.filters.dueDate === 'no-date') {
        filtered = filtered.filter((task) => !task.dueDate);
      }
    }

    // Apply sorting (stable sort)
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (state.sort.field) {
        case 'dueDate': {
          // Handle undefined dates as Infinity (sort to end)
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        }

        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }

        case 'title': {
          comparison = a.title.localeCompare(b.title);
          break;
        }

        case 'createdAt': {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          comparison = dateA - dateB;
          break;
        }
      }

      // Apply direction
      return state.sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [state.tasks, state.searchQuery, state.filters, state.sort]);
}
