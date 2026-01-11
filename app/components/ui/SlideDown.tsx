"use client";

import { useState, useEffect, useRef } from 'react';

interface SlideDownProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export function SlideDown({ children, isOpen, className = "" }: SlideDownProps) {
  const [height, setHeight] = useState<number | string>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Calculate the full height of the content
      setHeight(contentRef.current.scrollHeight);
    } else {
      // Collapse to 0 when closed
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
      style={{
        height: isOpen ? height : 0,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}