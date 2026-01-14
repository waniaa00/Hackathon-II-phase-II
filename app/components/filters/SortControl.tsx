"use client";

/**
 * SortControl Component
 * Dropdown for sorting tasks by different criteria
 * Supports due date, priority, and title with asc/desc toggle
 */

import { useTaskContext } from '@/app/context/TaskContext';

export function SortControl() {
  const { state, dispatch } = useTaskContext();
  const { sort } = state;

  const handleSortChange = (value: string) => {
    // Parse sort string: "field-direction"
    const [field, direction] = value.split('-') as [string, 'asc' | 'desc'];

    dispatch({
      type: 'SET_SORT',
      payload: {
        field: field as 'dueDate' | 'priority' | 'title' | 'createdAt',
        direction,
      },
    });
  };

  const currentValue = `${sort.field}-${sort.direction}`;

  return (
    <div>
      <label htmlFor="sort-control" className="block text-sm font-medium text-gray-300 mb-1">
        Sort By
      </label>
      <select
        id="sort-control"
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm font-medium shadow-sm"
        aria-label="Sort tasks"
      >
        <option value="createdAt-desc">🆕 Newest First</option>
        <option value="createdAt-asc">⏮️ Oldest First</option>
        <option value="dueDate-asc">📅 Due Date (Soonest)</option>
        <option value="dueDate-desc">📅 Due Date (Latest)</option>
        <option value="priority-desc">⬆️ Priority (High to Low)</option>
        <option value="priority-asc">⬇️ Priority (Low to High)</option>
        <option value="title-asc">🔤 Title (A-Z)</option>
        <option value="title-desc">🔤 Title (Z-A)</option>
      </select>
    </div>
  );
}
