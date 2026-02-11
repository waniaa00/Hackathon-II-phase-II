"use client";

import { memo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface TaskSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const TaskSearch = memo(function TaskSearch({
  searchQuery,
  onSearchChange,
  placeholder = "Search tasks...",
}: TaskSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-muted/50 p-1">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 pl-11 pr-10 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-sm focus-visible:shadow-md focus-visible:ring-primary/20 transition-all"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
});
