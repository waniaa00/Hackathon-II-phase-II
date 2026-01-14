"use client";

/**
 * ActiveFilters Component
 * Visual feedback showing currently active filters
 * Displays filter badges with remove buttons
 */

import { useTaskContext } from '@/app/context/TaskContext';

export function ActiveFilters() {
  const { state, dispatch } = useTaskContext();
  const { filters, searchQuery } = state;

  const activeFilters: Array<{ key: string; label: string; value: string }> = [];

  if (searchQuery) {
    activeFilters.push({
      key: 'search',
      label: 'Search',
      value: searchQuery,
    });
  }

  if (filters.status !== 'all') {
    activeFilters.push({
      key: 'status',
      label: 'Status',
      value: filters.status === 'complete' ? 'Complete' : 'Incomplete',
    });
  }

  if (filters.priority !== 'all') {
    activeFilters.push({
      key: 'priority',
      label: 'Priority',
      value: filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1),
    });
  }

  if (filters.dueDate !== 'all') {
    const dueDateLabels = {
      'overdue': 'Overdue',
      'this-week': 'This Week',
      'no-date': 'No Due Date',
    };
    activeFilters.push({
      key: 'dueDate',
      label: 'Due Date',
      value: dueDateLabels[filters.dueDate as keyof typeof dueDateLabels],
    });
  }

  if (activeFilters.length === 0) return null;

  const handleRemoveFilter = (key: string) => {
    if (key === 'search') {
      dispatch({ type: 'SET_SEARCH', payload: '' });
    } else {
      dispatch({
        type: 'SET_FILTER',
        payload: { [key]: 'all' },
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/20">
      <span className="text-sm font-medium text-gray-300">Active filters:</span>
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white rounded-full text-sm backdrop-blur-sm border border-white/20"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => handleRemoveFilter(filter.key)}
            className="ml-1 hover:text-gray-200 focus:outline-none"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
