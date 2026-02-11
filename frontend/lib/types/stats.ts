export interface PriorityCount {
  name: string;
  level: number;
  count: number;
}

export interface TagCount {
  name: string;
  color: string;
  count: number;
}

export interface DailyActivity {
  date: string;
  created: number;
  completed: number;
}

export interface StatsResponse {
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  tasks_by_priority: PriorityCount[];
  tasks_by_tag: TagCount[];
  recent_activity: DailyActivity[];
}
