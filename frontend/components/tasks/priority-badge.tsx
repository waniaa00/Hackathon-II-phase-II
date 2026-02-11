import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority;
}

const styles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  high: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200/60 dark:border-red-800/40",
    dot: "bg-red-500",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  low: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    dot: "bg-emerald-500",
  },
};

export const PriorityBadge = memo(function PriorityBadge({ priority }: PriorityBadgeProps) {
  const s = styles[priority.level] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium text-[11px] rounded-md py-0 h-5", s.bg, s.text, s.border)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {priority.level.charAt(0).toUpperCase() + priority.level.slice(1)}
    </Badge>
  );
});
