"use client";

/**
 * FilterPanel Component
 * Filter controls for status, priority, and due date
 * Includes clear all button
 */

import { useTaskContext } from '@/app/context/TaskContext';
import { Button } from '../ui/Button';

export function FilterPanel() {
  const { state, dispatch } = useTaskContext();
  const { filters } = state;

  const handleFilterChange = (key: string, value: string) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { [key]: value },
    });
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.dueDate !== 'all';

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="border-white/30 text-white hover:bg-white/10"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2.5 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm font-medium shadow-sm"
            aria-label="Filter by status"
          >
            <option value="all">📋 All Tasks</option>
            <option value="incomplete">⏳ Incomplete</option>
            <option value="complete">✅ Complete</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2.5 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm font-medium shadow-sm"
            aria-label="Filter by priority"
          >
            <option value="all">🎯 All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label htmlFor="duedate-filter" className="block text-sm font-medium text-gray-300 mb-1">
            Due Date
          </label>
          <select
            id="duedate-filter"
            value={filters.dueDate}
            onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            className="w-full px-3 py-2.5 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm font-medium shadow-sm"
            aria-label="Filter by due date"
          >
            <option value="all">📅 All Dates</option>
            <option value="overdue">🔥 Overdue</option>
            <option value="this-week">📆 This Week</option>
            <option value="no-date">➖ No Due Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
