import type { Tag } from "./tag";
import type { Priority } from "./priority";

export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority_id: string | null;
  priority: Priority | null;
  tags: Tag[];
  due_date: string | null;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority_id?: string;
  tag_ids?: string[];
  due_date?: string;
  recurrence_rule?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority_id?: string | null;
  tag_ids?: string[];
  due_date?: string | null;
  recurrence_rule?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority_id?: string;
  tag_id?: string;
  due_before?: string;
  due_after?: string;
  search?: string;
}

export type SortField = "created_at" | "due_date" | "title" | "priority";
export type SortOrder = "asc" | "desc";

export interface TaskSort {
  sort_by: SortField;
  sort_order: SortOrder;
}

export interface TaskPagination {
  page: number;
  page_size: number;
}

export interface TaskQueryParams extends TaskFilters, TaskSort, TaskPagination {}

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  end_date?: string;
}

export const RECURRENCE_LABELS: Record<RecurrenceFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
