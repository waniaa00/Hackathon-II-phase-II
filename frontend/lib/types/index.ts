// Core entities
export type {
  Task,
  TaskStatus,
  TaskCreate,
  TaskUpdate,
  TaskFilters,
  TaskSort,
  TaskPagination,
  TaskQueryParams,
  SortField,
  SortOrder,
  RecurrenceFrequency,
  RecurrenceRule,
} from "./task";

export { RECURRENCE_LABELS } from "./task";

export type { Tag, TagCreate, TagUpdate } from "./tag";

export type { Priority } from "./priority";

export type {
  TaskListResponse,
  APIError,
  ValidationError,
  ErrorState,
} from "./api";

export type {
  StatsResponse,
  PriorityCount,
  TagCount,
  DailyActivity,
} from "./stats";

// User types (from Better Auth)
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  accessToken: string;
  expiresAt: Date;
}
