import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { RECURRENCE_LABELS } from "@/lib/types";
import type { Task } from "@/lib/types";

interface RecurrenceBadgeProps {
  task: Task;
}

export const RecurrenceBadge = memo(function RecurrenceBadge({ task }: RecurrenceBadgeProps) {
  if (!task.recurrence_rule) return null;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 rounded-md text-[11px] font-medium py-0 h-5 bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
      {RECURRENCE_LABELS[task.recurrence_rule as keyof typeof RECURRENCE_LABELS]}
    </Badge>
  );
});
