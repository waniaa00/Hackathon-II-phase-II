/**
 * Mock Task Data
 * Provides realistic sample data for development and testing
 */

import { Task, TaskState } from './types';
import { DEFAULT_FILTERS, DEFAULT_SORT } from './constants';

/**
 * Initial mock tasks with variety of priorities, completion states, due dates, tags
 */
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review pull requests',
    description: 'Review and merge pending PRs from team members',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Tomorrow
    tags: ['work', 'code-review'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0], // Today
    tags: ['personal', 'shopping'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '3',
    title: 'Finish project documentation',
    description: '',
    completed: true,
    priority: 'high',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0], // Yesterday (overdue but completed)
    tags: ['work', 'documentation'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    title: 'Plan weekend trip',
    completed: false,
    priority: 'low',
    tags: ['personal', 'travel'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: '5',
    title: 'Schedule dentist appointment',
    description: 'Annual checkup - call Monday morning',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0], // Next week
    tags: ['personal', 'health'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

/**
 * Initial application state with mock data
 * Provides realistic sample data for development and testing
 */
export const INITIAL_STATE: TaskState = {
  tasks: MOCK_TASKS,
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,
  searchQuery: '',
};
