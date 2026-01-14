"use client";

/**
 * TaskForm Component
 * Minimal and clean form for adding new tasks
 * Features: title, description, priority, tags, due date, recurring tasks
 */

import { useState, FormEvent } from 'react';
import { Priority, Recurrence } from '@/app/lib/types';
import { useTasks } from '@/app/hooks/useTasks';

interface TaskFormProps {
  onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { addTask } = useTasks();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [interval, setInterval] = useState(1);

  // UI state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title');
      setIsSubmitting(false);
      return;
    }
    if (trimmedTitle.length > 200) {
      setError('Title must be 200 characters or less');
      setIsSubmitting(false);
      return;
    }

    // Validate description
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 1000) {
      setError('Description must be 1000 characters or less');
      setIsSubmitting(false);
      return;
    }

    // Parse tags
    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Build recurrence
    const recurrence: Recurrence | undefined = isRecurring
      ? { frequency, interval }
      : undefined;

    try {
      await addTask({
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        completed: false,
        priority,
        tags: parsedTags,
        dueDate: dueDate || undefined,
        recurrence,
      });

      // Reset form
      resetForm();
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags('');
    setDueDate('');
    setIsRecurring(false);
    setFrequency('weekly');
    setInterval(1);
    setError('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Title Input */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          className="w-full px-3 py-2.5 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-white bg-white/5 backdrop-blur-sm"
          autoFocus
        />
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details (optional)"
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 resize-none text-white bg-white/5 backdrop-blur-sm"
        />
      </div>

      {/* Priority and Due Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-300 mb-1.5">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2.5 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-300 mb-1.5">
            Due Date
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-white/5 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="task-tags" className="block text-sm font-medium text-gray-300 mb-1.5">
          Tags
        </label>
        <input
          id="task-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, urgent, personal (comma-separated)"
          className="w-full px-3 py-2.5 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-white bg-white/5 backdrop-blur-sm"
        />
      </div>

      {/* Recurring Task Section */}
      <div className="pt-3 border-t border-white/20">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded border-white/30 text-purple-500 focus:ring-2 focus:ring-purple-500 cursor-pointer bg-white/10"
          />
          <span className="text-sm font-medium text-gray-300">Make this a recurring task</span>
        </label>

        {isRecurring && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-3 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="recurrence-frequency" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Frequency
                </label>
                <select
                  id="recurrence-frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white bg-white/5 backdrop-blur-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="recurrence-interval" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Every
                </label>
                <input
                  id="recurrence-interval"
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white bg-white/5 backdrop-blur-sm"
                />
              </div>
            </div>

            {dueDate && (
              <p className="text-xs text-gray-400">
                Repeats every {interval} {frequency === 'daily' ? 'day(s)' : frequency === 'weekly' ? 'week(s)' : 'month(s)'} starting from {new Date(dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
