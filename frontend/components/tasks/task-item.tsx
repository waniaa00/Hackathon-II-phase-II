"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "./priority-badge";
import { TagBadge } from "./tag-badge";
import { DueDateBadge } from "./due-date-badge";
import { RecurrenceBadge } from "./recurrence-badge";
import { isOverdue, isDueToday } from "@/lib/utils/date";
import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const priorityAccent: Record<string, string> = {
  high: "before:bg-red-500",
  medium: "before:bg-amber-500",
  low: "before:bg-emerald-500",
};

export const TaskItem = memo(function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const isCompleted = task.status === "completed";
  const isOverdueTask = task.due_date && isOverdue(task.due_date);
  const isDueTodayTask = task.due_date && isDueToday(task.due_date);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete();
    } finally {
      setIsToggling(false);
    }
  };

  const accentClass = task.priority?.level
    ? priorityAccent[task.priority.level]
    : "before:bg-border";

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl border bg-card p-4 pl-5 transition-all duration-200",
        "shadow-sm hover:shadow-md hover:-translate-y-[1px]",
        "before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-full before:transition-colors",
        accentClass,
        isCompleted && "bg-muted/30 opacity-60 before:bg-muted-foreground/20",
        !isCompleted &&
          isOverdueTask &&
          "border-red-200/80 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900/30",
        !isCompleted &&
          isDueTodayTask &&
          "border-orange-200/80 bg-orange-50/30 dark:bg-orange-950/10 dark:border-orange-900/30"
      )}
    >
      {/* Custom checkbox */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground scale-100"
            : "border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5",
          isToggling && "opacity-50"
        )}
      >
        {isCompleted && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/tasks/${task.id}`}
              className={cn(
                "text-sm font-semibold leading-snug hover:text-primary transition-colors line-clamp-1",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </Link>

            {task.description && (
              <p
                className={cn(
                  "mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed",
                  isCompleted && "line-through"
                )}
              >
                {task.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl shadow-lg border-border/50 w-36"
            >
              <DropdownMenuItem
                onClick={onEdit}
                className="rounded-lg gap-2 text-xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="rounded-lg gap-2 text-xs text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        {(task.priority || task.tags?.length || task.due_date || task.recurrence_rule) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {task.priority && <PriorityBadge priority={task.priority} />}
            {task.tags?.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {task.due_date && <DueDateBadge task={task} />}
            {task.recurrence_rule && <RecurrenceBadge task={task} />}
          </div>
        )}
      </div>
    </div>
  );
});
