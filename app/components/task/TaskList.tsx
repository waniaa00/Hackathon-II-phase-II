"use client";

/**
 * TaskList Component
 * Displays list of tasks with empty state
 * Handles task editing via modal
 */

import { useState } from 'react';
import { Task } from '@/app/lib/types';
import { TaskItem } from './TaskItem';
import { TaskEditModal } from './TaskEditModal';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No tasks yet
        </h3>
        <p className="text-gray-600">
          Add your first task to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={setEditingTask}
          />
        ))}
      </div>

      {/* Edit Modal - key prop remounts component when task changes */}
      {editingTask && (
        <TaskEditModal
          key={editingTask.id}
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
