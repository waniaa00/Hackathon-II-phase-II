"use client";

/**
 * SearchInput Component
 * Debounced search input for filtering tasks by title/description
 * 300ms debounce delay to reduce re-renders
 */

import { useState, useEffect } from 'react';
import { useTaskContext } from '@/app/context/TaskContext';

export function SearchInput() {
  const { state, dispatch } = useTaskContext();
  const [localSearch, setLocalSearch] = useState(state.searchQuery);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'SET_SEARCH',
        payload: localSearch,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearch, dispatch]);

  const handleClear = () => {
    setLocalSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm"
          aria-label="Search tasks"
        />
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Clear Button */}
        {localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
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
        )}
      </div>
    </div>
  );
}
