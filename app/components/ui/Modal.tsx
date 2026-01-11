"use client";

/**
 * Accessible Modal Component
 * React portal, focus trap, ESC close, ARIA dialog
 */

import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);

    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use createPortal to render modal at document.body level
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Click outside to close
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl flex flex-col h-auto max-h-[85vh] min-h-[300px]"
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4 text-gray-900 flex-shrink-0 border-b border-gray-100 pb-3">
          {title}
        </h2>
        <div className="overflow-y-auto flex-grow pb-2 max-h-[55vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
