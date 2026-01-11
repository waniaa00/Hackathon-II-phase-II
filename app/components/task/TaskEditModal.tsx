"use client";

/**
 * TaskEditModal Component
 * Modal for editing all task metadata (US2)
 * Fields: title, description, priority, tags, due date
 */

import { useState, FormEvent } from 'react';
import { Task, Priority, Recurrence } from '@/app/lib/types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTasks } from '@/app/hooks/useTasks';
import { RecurrencePreview } from './RecurrencePreview';
import { SlideDown } from '../ui/SlideDown';

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const { updateTask } = useTasks();
  // Initialize state from task props - component will remount when key changes
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [tags, setTags] = useState(task.tags.join(', '));
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [enableRecurrence, setEnableRecurrence] = useState(!!task.recurrence);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    task.recurrence?.frequency || 'weekly'
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(task.recurrence?.interval || 1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required');
      setIsSubmitting(false);
      return;
    }
    if (trimmedTitle.length > 200) {
      setError('Task title must be 200 characters or less');
      setIsSubmitting(false);
      return;
    }

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

    // Build recurrence object if enabled
    const recurrence: Recurrence | undefined = enableRecurrence
      ? { frequency: recurrenceFrequency, interval: recurrenceInterval }
      : undefined;

    try {
      // Update task via API
      await updateTask(task.id, {
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        priority,
        tags: parsedTags,
        dueDate: dueDate || undefined,
        recurrence,
      });

      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to update task');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title *"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          error={error}
          maxLength={200}
          autoComplete="off"
          autoFocus
        />

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            placeholder="Add more details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
            aria-label="Task description"
          />
        </div>

        <div>
          <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="edit-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium shadow-sm"
            aria-label="Task priority"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
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
        />

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Task due date"
        />

        {/* Recurrence Section */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="edit-enable-recurrence"
              checked={enableRecurrence}
              onChange={(e) => setEnableRecurrence(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Enable recurrence"
            />
            <label htmlFor="edit-enable-recurrence" className="text-sm font-medium text-gray-700 cursor-pointer">
              Recurring Task
            </label>
          </div>

          <SlideDown isOpen={enableRecurrence}>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-recurrence-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    id="edit-recurrence-frequency"
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
                  <label htmlFor="edit-recurrence-interval" className="block text-xs font-medium text-gray-700 mb-1">
                    Every
                  </label>
                  <input
                    type="number"
                    id="edit-recurrence-interval"
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
                <div className="mt-2">
                  <RecurrencePreview
                    startDate={dueDate}
                    recurrence={{ frequency: recurrenceFrequency, interval: recurrenceInterval }}
                  />
                </div>
              )}
            </div>
          </SlideDown>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
