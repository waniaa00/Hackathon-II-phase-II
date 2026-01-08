"use client";

/**
 * TaskItem Component
 * Single task display with all metadata (US2)
 * Shows: checkbox, title, description, priority badge, tags, due date
 * Completed tasks show with strikethrough styling
 */

import { useState } from 'react';
import { Task } from '@/app/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTasks } from '@/app/hooks/useTasks';
import { getDateInfo, formatRecurrence } from '@/app/lib/dateUtils';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleComplete, deleteTask } = useTasks();
  const [showDescription, setShowDescription] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(task.id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const dueDateInfo = task.dueDate ? getDateInfo(task.dueDate) : null;

  return (
    <div
      className={`
        p-4 rounded-lg border
        ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}
        hover:shadow-sm transition-shadow
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer flex-shrink-0"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title, Priority, and Recurrence */}
          <div className="flex items-start gap-2 mb-2">
            <p
              className={`
                flex-1 text-base font-medium
                ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
              `}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.recurrence && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-300">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {formatRecurrence(task.recurrence)}
                </span>
              )}
              <Badge variant={task.priority}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-2">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
                aria-expanded={showDescription}
              >
                {showDescription ? 'Hide' : 'Show'} description
              </button>
              {showDescription && (
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="tag">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 4 && (
                <Badge variant="tag">+{task.tags.length - 4} more</Badge>
              )}
            </div>
          )}

          {/* Due Date */}
          {dueDateInfo && (
            <p className={`text-sm ${dueDateInfo.color} font-medium`}>
              {dueDateInfo.text}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(task)}
              aria-label={`Edit task "${task.title}"`}
            >
              Edit
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            aria-label={`Delete task "${task.title}"`}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
