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
    high: 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-500/30',
    medium: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-yellow-500/30',
    low: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/30',
    tag: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500/30',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variantClasses[variant]}
        backdrop-blur-sm
        ${className}
      `}
    >
      {children}
    </span>
  );
}
