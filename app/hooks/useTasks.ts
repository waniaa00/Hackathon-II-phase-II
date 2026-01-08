/**
 * Custom hook for task operations with API integration
 * Combines API calls with context dispatch
 */

import { useTaskContext } from '../context/TaskContext';
import { apiClient } from '@/lib/api-client';
import { Task } from '../lib/types';

export function useTasks() {
  const { state, dispatch, loadTasks } = useTaskContext();

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Map frontend field names to backend expected names
      const apiData = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        completed: taskData.completed || false,
        due_date: taskData.dueDate,
        tags: taskData.tags || [],
        recurrence: taskData.recurrence ? {
          frequency: taskData.recurrence.frequency,
          interval: taskData.recurrence.interval,
        } : undefined,
      };

      const newTask = await apiClient.todos.create(apiData);

      // Reload tasks to get the latest from server
      await loadTasks();

      return newTask;
    } catch (error: any) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Map frontend field names to backend expected names
      const apiData: any = {};
      if (updates.title !== undefined) apiData.title = updates.title;
      if (updates.description !== undefined) apiData.description = updates.description;
      if (updates.priority !== undefined) apiData.priority = updates.priority;
      if (updates.completed !== undefined) apiData.completed = updates.completed;
      if (updates.dueDate !== undefined) apiData.due_date = updates.dueDate;
      if (updates.tags !== undefined) apiData.tags = updates.tags;
      if (updates.recurrence !== undefined) {
        apiData.recurrence = updates.recurrence ? {
          frequency: updates.recurrence.frequency,
          interval: updates.recurrence.interval,
        } : undefined;
      }

      await apiClient.todos.update(id, apiData);

      // Reload tasks to get the latest from server
      await loadTasks();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiClient.todos.delete(id);

      // Reload tasks to get the latest from server
      await loadTasks();
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const toggleComplete = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  return {
    tasks: state.tasks,
    filters: state.filters,
    sort: state.sort,
    searchQuery: state.searchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    loadTasks,
    dispatch,
  };
}
