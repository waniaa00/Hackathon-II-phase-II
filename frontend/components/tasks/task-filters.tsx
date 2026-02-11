"use client";

import { useState } from "react";
import {
  X,
  ChevronDown,
  Circle,
  CheckCircle2,
  ListTodo,
  Flag,
  Tags,
  Calendar,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TaskStatus } from "@/lib/types";

interface TaskFiltersProps {
  onFilterChange: (filters: Partial<TaskFiltersState>) => void;
  currentFilters: Partial<TaskFiltersState>;
}

export interface TaskFiltersState {
  status: TaskStatus | "all";
  priorityIds: string[];
  tagIds: string[];
  dueDate: "all" | "overdue" | "today" | "upcoming";
}

function FilterSection({
  label,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  label: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-1 pt-1">{children}</div>}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150",
        active
          ? variant === "destructive"
            ? "bg-red-500/15 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800"
            : "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function TaskFilters({
  onFilterChange,
  currentFilters,
}: TaskFiltersProps) {
  const clearAllFilters = () => {
    onFilterChange({
      status: "all",
      priorityIds: [],
      tagIds: [],
      dueDate: "all",
    });
  };

  const hasActiveFilters =
    currentFilters.status !== "all" ||
    (currentFilters.priorityIds && currentFilters.priorityIds.length > 0) ||
    (currentFilters.tagIds && currentFilters.tagIds.length > 0) ||
    currentFilters.dueDate !== "all";

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive rounded-md"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Separator className="my-3 bg-border/40" />

      {/* Status */}
      <FilterSection label="Status" icon={ListTodo} defaultOpen>
        <div className="flex flex-wrap gap-1.5">
          {([
            { value: "all", label: "All", icon: ListTodo },
            { value: "pending", label: "Pending", icon: Circle },
            { value: "completed", label: "Completed", icon: CheckCircle2 },
          ] as const).map((item) => (
            <FilterPill
              key={item.value}
              active={currentFilters.status === item.value}
              onClick={() => onFilterChange({ status: item.value })}
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </FilterPill>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-2 bg-border/30" />

      {/* Priority */}
      <FilterSection label="Priority" icon={Flag}>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={
              !currentFilters.priorityIds ||
              currentFilters.priorityIds.length === 0
            }
            onClick={() => onFilterChange({ priorityIds: [] })}
          >
            All
          </FilterPill>
          {([
            { value: "high", label: "High", dot: "bg-red-500" },
            { value: "medium", label: "Medium", dot: "bg-amber-500" },
            { value: "low", label: "Low", dot: "bg-emerald-500" },
          ] as const).map((item) => (
            <FilterPill
              key={item.value}
              active={
                currentFilters.priorityIds?.includes(item.value) || false
              }
              onClick={() => {
                const currentIds = currentFilters.priorityIds || [];
                if (currentIds.includes(item.value)) {
                  onFilterChange({
                    priorityIds: currentIds.filter(
                      (id) => id !== item.value
                    ),
                  });
                } else {
                  onFilterChange({
                    priorityIds: [...currentIds, item.value],
                  });
                }
              }}
            >
              <span
                className={cn("h-2 w-2 rounded-full", item.dot)}
              />
              {item.label}
            </FilterPill>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-2 bg-border/30" />

      {/* Tags */}
      <FilterSection label="Tags" icon={Tags}>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={
              !currentFilters.tagIds || currentFilters.tagIds.length === 0
            }
            onClick={() => onFilterChange({ tagIds: [] })}
          >
            All
          </FilterPill>
          {["work", "personal", "urgent"].map((tag) => (
            <FilterPill
              key={tag}
              active={currentFilters.tagIds?.includes(tag) || false}
              onClick={() => {
                const currentIds = currentFilters.tagIds || [];
                if (currentIds.includes(tag)) {
                  onFilterChange({
                    tagIds: currentIds.filter((id) => id !== tag),
                  });
                } else {
                  onFilterChange({ tagIds: [...currentIds, tag] });
                }
              }}
            >
              {tag}
            </FilterPill>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-2 bg-border/30" />

      {/* Due Date */}
      <FilterSection label="Due Date" icon={Calendar}>
        <div className="flex flex-wrap gap-1.5">
          {([
            { value: "all", label: "All" },
            { value: "overdue", label: "Overdue" },
            { value: "today", label: "Due Today" },
            { value: "upcoming", label: "Upcoming" },
          ] as const).map((item) => (
            <FilterPill
              key={item.value}
              active={currentFilters.dueDate === item.value}
              onClick={() => onFilterChange({ dueDate: item.value })}
              variant={
                item.value === "overdue" &&
                currentFilters.dueDate === "overdue"
                  ? "destructive"
                  : "default"
              }
            >
              {item.label}
            </FilterPill>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
