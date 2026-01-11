"use client";

/**
 * TaskForm Component
 * Form for adding new tasks with all metadata fields (US2)
 * Fields: title, description, priority, tags, due date
 * Validation: title required (1-200 chars), description optional (max 1000 chars)
 */

import { useState, FormEvent } from 'react';
import { Priority, Recurrence } from '@/app/lib/types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTasks } from '@/app/hooks/useTasks';
import { RecurrencePreview } from './RecurrencePreview';

interface TaskFormProps {
  onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [enableRecurrence, setEnableRecurrence] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }
    if (trimmedTitle.length > 200) {
      setError('Task title must be 200 characters or less');
      return;
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    // Parse tags (comma-separated, trim whitespace, remove empty)
    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Build recurrence object if enabled
    const recurrence: Recurrence | undefined = enableRecurrence
      ? { frequency: recurrenceFrequency, interval: recurrenceInterval }
      : undefined;

    try {
      // Add task via API
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
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags('');
      setDueDate('');
      setEnableRecurrence(false);
      setRecurrenceFrequency('weekly');
      setRecurrenceInterval(1);
      setError('');
      setIsSubmitting(false);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Task Title *"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError('');
        }}
        maxLength={200}
        autoComplete="off"
        aria-label="Task title"
      />
      {error && (
        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Add more details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={2}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
          aria-label="Task description"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-xs font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
          aria-label="Task priority"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Med</option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      <Input
        label="Tags"
        type="text"
        placeholder="work, urgent, personal (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        autoComplete="off"
        aria-label="Task tags"
        className="text-sm py-1.5"
      />

      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Task due date"
        className="text-sm py-1.5"
      />

      {/* Recurrence Section */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="enable-recurrence"
            checked={enableRecurrence}
            onChange={(e) => setEnableRecurrence(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Enable recurrence"
          />
          <label htmlFor="enable-recurrence" className="text-sm font-medium text-gray-700 cursor-pointer">
            Recurring Task
          </label>
        </div>

        {enableRecurrence && (
          <div className="space-y-3 pl-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="recurrence-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  id="recurrence-frequency"
                  value={recurrenceFrequency}
                  onChange={(e) => setRecurrenceFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  aria-label="Recurrence frequency"
                >
                  <option value="daily">📅 Daily</option>
                  <option value="weekly">📆 Wkly</option>
                  <option value="monthly">🗓️ Mon</option>
                </select>
              </div>

              <div>
                <label htmlFor="recurrence-interval" className="block text-xs font-medium text-gray-700 mb-1">
                  Every
                </label>
                <input
                  type="number"
                  id="recurrence-interval"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="30"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-gray-800"
                  aria-label="Recurrence interval"
                />
              </div>
            </div>

            {dueDate && (
              <RecurrencePreview
                startDate={dueDate}
                recurrence={{ frequency: recurrenceFrequency, interval: recurrenceInterval }}
              />
            )}
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full py-2 text-sm" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
}
