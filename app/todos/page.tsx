'use client'

import { useState, useMemo } from 'react';
import { useTaskContext } from '@/app/context/TaskContext';
import { TaskForm } from '@/app/components/task/TaskForm';
import { TaskList } from '@/app/components/task/TaskList';
import { FilterPanel } from '@/app/components/filters/FilterPanel';
import { SearchInput } from '@/app/components/filters/SearchInput';
import { SortControl } from '@/app/components/filters/SortControl';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Navbar } from '@/app/components/layout/Navbar';
import { Footer } from '@/app/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function TodosPage() {
  const { state } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Apply filters, search, and sort to tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...state.tasks];

    // Apply status filter
    if (state.filters.status !== 'all') {
      result = result.filter(task =>
        state.filters.status === 'complete' ? task.completed : !task.completed
      );
    }

    // Apply priority filter
    if (state.filters.priority !== 'all') {
      result = result.filter(task => task.priority === state.filters.priority);
    }

    // Apply due date filter
    if (state.filters.dueDate !== 'all') {
      const now = new Date();
      const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      result = result.filter(task => {
        if (state.filters.dueDate === 'overdue') {
          return task.dueDate && new Date(task.dueDate) < now && !task.completed;
        } else if (state.filters.dueDate === 'this-week') {
          return task.dueDate && new Date(task.dueDate) <= oneWeek && new Date(task.dueDate) >= now;
        } else if (state.filters.dueDate === 'no-date') {
          return !task.dueDate;
        }
        return true;
      });
    }

    // Apply search
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (state.sort.field) {
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return state.sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [state.tasks, state.filters, state.searchQuery, state.sort]);

  const handleTaskAdded = () => {
    setIsAddModalOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <Navbar currentPath="/todos" />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
              <p className="text-gray-600">
                {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'} found
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add New Task
            </Button>
          </div>

          {/* Search and Sort */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput />
            </div>
            <div className="sm:w-64">
              <SortControl />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <FilterPanel />
          </div>

          {/* Task List */}
          <TaskList tasks={filteredAndSortedTasks} />

          {/* Add Task Modal */}
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Add New Task"
          >
            <TaskForm onSuccess={handleTaskAdded} />
          </Modal>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
