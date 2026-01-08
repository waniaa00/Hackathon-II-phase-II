"use client";

/**
 * Task Context Provider
 * Provides global task state and dispatch function to all components
 * Uses React Context + useReducer pattern with API integration
 */

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TaskState, TaskAction } from '@/app/lib/types';
import { taskReducer } from './taskReducer';
import { INITIAL_STATE } from '@/app/lib/mockTasks';
import { apiClient } from '@/lib/api-client';

/**
 * Context value type
 */
interface TaskContextValue {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  loadTasks: () => Promise<void>;
}

/**
 * Task Context
 */
const TaskContext = createContext<TaskContextValue | undefined>(undefined);

/**
 * Task Context Provider
 * Wraps the application and provides task state to all child components
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, INITIAL_STATE);

  // Function to load tasks from API
  const loadTasks = async () => {
    try {
      const tasks = await apiClient.todos.getAll();
      dispatch({ type: 'LOAD_TASKS', payload: { tasks } });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Continue with empty state if API fails
    }
  };

  // Load tasks on mount if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadTasks();
    }
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom hook to use Task Context
 * Throws error if used outside TaskProvider
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}
