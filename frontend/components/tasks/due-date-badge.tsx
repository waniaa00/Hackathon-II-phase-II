import { memo } from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, isOverdue, isDueToday, isDueSoon } from "@/lib/utils/date";
import type { Task } from "@/lib/types";

interface DueDateBadgeProps {
  task: Task;
}

export const DueDateBadge = memo(function DueDateBadge({ task }: DueDateBadgeProps) {
  if (!task.due_date) return null;

  const date = new Date(task.due_date);
  const dateString = formatDate(date, "MMM d, yyyy");

  let colorClasses = "";
  let label = dateString;

  if (isOverdue(task.due_date)) {
    colorClasses =
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800/40";
    label = `Overdue: ${dateString}`;
  } else if (isDueToday(task.due_date)) {
    colorClasses =
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-800/40";
    label = "Due today";
  } else if (isDueSoon(task.due_date)) {
    colorClasses =
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40";
    label = `Due soon: ${dateString}`;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-md text-[11px] font-medium py-0 h-5",
        colorClasses
      )}
    >
      <Calendar className="h-3 w-3" />
      {label}
    </Badge>
  );
});
