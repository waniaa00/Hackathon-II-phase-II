"use client";

import { memo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortField, SortOrder } from "@/lib/types";

interface TaskSortProps {
  currentSort: {
    sortBy: SortField;
    sortOrder: SortOrder;
  };
  onSortChange: (sort: { sortBy: SortField; sortOrder: SortOrder }) => void;
}

export const TaskSort = memo(function TaskSort({
  currentSort,
  onSortChange,
}: TaskSortProps) {
  const handleSortByChange = (field: SortField) => {
    onSortChange({
      sortBy: field,
      sortOrder: currentSort.sortOrder,
    });
  };

  const toggleSortOrder = () => {
    const newOrder = currentSort.sortOrder === "asc" ? "desc" : "asc";
    onSortChange({
      sortBy: currentSort.sortBy,
      sortOrder: newOrder,
    });
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Select
        value={currentSort.sortBy}
        onValueChange={(value: SortField) => handleSortByChange(value)}
      >
        <SelectTrigger className="w-[130px] h-10 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-sm text-xs">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border-border/50">
          <SelectItem value="created_at" className="rounded-lg text-xs">
            Date Created
          </SelectItem>
          <SelectItem value="due_date" className="rounded-lg text-xs">
            Due Date
          </SelectItem>
          <SelectItem value="title" className="rounded-lg text-xs">
            Title
          </SelectItem>
          <SelectItem value="priority" className="rounded-lg text-xs">
            Priority
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        className="h-10 w-10 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all shrink-0"
      >
        {currentSort.sortOrder === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
        <span className="sr-only">
          Sort {currentSort.sortOrder === "asc" ? "ascending" : "descending"}
        </span>
      </Button>
    </div>
  );
});
