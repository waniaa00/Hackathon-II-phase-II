/**
 * Task State Reducer
 * Pure function that returns new state based on action
 * Implements 8 action types for task management
 */

import { TaskState, TaskAction, Task } from '@/app/lib/types';

/**
 * Generate unique ID for tasks
 * Uses crypto.randomUUID() if available, fallback to timestamp-based ID
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random suffix
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Task state reducer
 * Handles all task state mutations immutably
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'LOAD_TASKS': {
      return {
        ...state,
        tasks: action.payload.tasks,
      };
    }

    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Ensure required fields have defaults if not provided
        completed: action.payload.completed ?? false,
        priority: action.payload.priority ?? 'medium',
        tags: action.payload.tags ?? [],
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? {
                ...task,
                ...action.payload.updates,
                updatedAt: new Date().toISOString(),
              }
            : task
        ),
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id),
      };
    }

    case 'TOGGLE_COMPLETE': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? {
                ...task,
                completed: !task.completed,
                updatedAt: new Date().toISOString(),
              }
            : task
        ),
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }

    case 'SET_SORT': {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case 'SET_SEARCH': {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }

    case 'CLEAR_FILTERS': {
      return {
        ...state,
        filters: {
          status: 'all',
          priority: 'all',
          dueDate: 'all',
        },
        searchQuery: '',
      };
    }

    default:
      return state;
  }
}
