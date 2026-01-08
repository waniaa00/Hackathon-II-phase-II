"use client";

/**
 * Badge Component
 * For priority and tag badges with color variants
 */

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'high' | 'medium' | 'low' | 'tag';
  className?: string;
}

export function Badge({ children, variant = 'tag', className = '' }: BadgeProps) {
  const variantClasses = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300',
    tag: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
