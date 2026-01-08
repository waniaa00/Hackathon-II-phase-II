"use client";

/**
 * RecurrencePreview Component
 * Shows preview of next 3 occurrences for recurring tasks
 * Helps users understand recurrence pattern before saving
 */

import { Recurrence } from '@/app/lib/types';
import { calculateNextOccurrences, formatDate } from '@/app/lib/dateUtils';

interface RecurrencePreviewProps {
  startDate: string;
  recurrence: Recurrence;
}

export function RecurrencePreview({ startDate, recurrence }: RecurrencePreviewProps) {
  if (!startDate) {
    return (
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
        <p>Please select a start date to preview occurrences</p>
      </div>
    );
  }

  const occurrences = calculateNextOccurrences(startDate, recurrence, 3);

  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Next 3 occurrences:
          </p>
          <ul className="space-y-1">
            {occurrences.map((date, index) => (
              <li key={index} className="text-sm text-blue-800">
                {index + 1}. {formatDate(date)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
