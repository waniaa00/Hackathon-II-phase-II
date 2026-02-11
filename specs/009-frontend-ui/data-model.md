# Data Model: Todo App Frontend & UI

**Feature**: 009-frontend-ui
**Date**: 2026-02-05
**Purpose**: Define TypeScript interfaces and types for frontend state and API responses

---

## Core Entities

### User (from Better Auth)

```typescript
// From Better Auth session
interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  user: User;
  accessToken: string;
  expiresAt: Date;
}
```

### Task

```typescript
type TaskStatus = "pending" | "completed";

interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority_id: string | null;
  priority: Priority | null;
  tags: Tag[];
  due_date: string | null; // ISO 8601 format
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
}

// For task list response with pagination
interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}
```

### Tag

```typescript
interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  created_at: string;
}
```

### Priority

```typescript
interface Priority {
  id: string;
  user_id: string;
  name: string; // "high", "medium", "low"
  level: number; // 1 (high), 2 (medium), 3 (low)
  color: string;
  created_at: string;
}
```

---

## API Request Types

### Task Operations

```typescript
// POST /api/{user_id}/tasks
interface TaskCreate {
  title: string;
  description?: string;
  priority_id?: string;
  tag_ids?: string[];
  due_date?: string; // ISO 8601
  recurrence_rule?: string;
}

// PUT /api/{user_id}/tasks/{id}
interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority_id?: string | null;
  tag_ids?: string[];
  due_date?: string | null;
  recurrence_rule?: string | null;
}
```

### Tag Operations

```typescript
// POST /api/{user_id}/tags
interface TagCreate {
  name: string;
  color?: string;
}

// PUT /api/{user_id}/tags/{id}
interface TagUpdate {
  name?: string;
  color?: string;
}
```

---

## Filter & Sort Types

### Task Filters

```typescript
interface TaskFilters {
  status?: TaskStatus | "all";
  priority_id?: string;
  tag_id?: string;
  due_before?: string; // ISO 8601
  due_after?: string;
  search?: string;
}

type SortField = "created_at" | "due_date" | "title" | "priority";
type SortOrder = "asc" | "desc";

interface TaskSort {
  sort_by: SortField;
  sort_order: SortOrder;
}

interface TaskPagination {
  page: number;
  page_size: number;
}

// Combined query params
interface TaskQueryParams extends TaskFilters, TaskSort, TaskPagination {}
```

---

## UI State Types

### Form State

```typescript
// Task form (create/edit)
interface TaskFormState {
  title: string;
  description: string;
  priority_id: string | null;
  tag_ids: string[];
  due_date: Date | null;
  recurrence_rule: string | null;
}

// Login form
interface LoginFormState {
  email: string;
  password: string;
}

// Signup form
interface SignupFormState {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

// Tag form
interface TagFormState {
  name: string;
  color: string;
}
```

### Component Props

```typescript
// Task list
interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  loading?: boolean;
}

// Task item
interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

// Filter controls
interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  priorities: Priority[];
  tags: Tag[];
}

// Sort controls
interface TaskSortProps {
  sort: TaskSort;
  onChange: (sort: TaskSort) => void;
}
```

---

## Error Types

```typescript
interface APIError {
  detail: string;
  type: string;
  status: number;
}

interface ValidationError {
  detail: string;
  type: "validation_error";
  errors: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

// Error state in components
interface ErrorState {
  message: string;
  type: "error" | "warning" | "info";
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Notification Types

```typescript
type NotificationPermission = "granted" | "denied" | "default";

interface TaskNotification {
  task_id: string;
  title: string;
  due_date: string;
  type: "due_today" | "overdue" | "upcoming";
}
```

---

## Recurrence Types

```typescript
type RecurrenceFrequency = "daily" | "weekly" | "monthly";

interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number; // e.g., every 2 weeks
  end_date?: string;
}

// Human-readable labels
const RECURRENCE_LABELS: Record<RecurrenceFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
```

---

## Context Types

```typescript
// Auth context (from Better Auth)
interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Toast context
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}
```

---

## Zod Schemas

```typescript
import { z } from "zod";

// Task validation
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  description: z.string().max(1000).optional(),
  priority_id: z.string().uuid().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional(),
  due_date: z.date().optional().nullable(),
  recurrence_rule: z.string().optional().nullable(),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Signup validation
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().min(1).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Tag validation
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
});
```

---

## Type Exports Summary

```typescript
// lib/types/index.ts
export type {
  // Entities
  User,
  Session,
  Task,
  TaskStatus,
  Tag,
  Priority,

  // API types
  TaskCreate,
  TaskUpdate,
  TagCreate,
  TagUpdate,
  TaskListResponse,

  // Filters & Sort
  TaskFilters,
  TaskSort,
  TaskPagination,
  TaskQueryParams,
  SortField,
  SortOrder,

  // Form state
  TaskFormState,
  LoginFormState,
  SignupFormState,
  TagFormState,

  // Component props
  TaskListProps,
  TaskItemProps,
  TaskFiltersProps,
  TaskSortProps,

  // Errors
  APIError,
  ValidationError,
  ErrorState,

  // Notifications
  NotificationPermission,
  TaskNotification,

  // Recurrence
  RecurrenceFrequency,
  RecurrenceRule,

  // Context
  AuthContextValue,
  Toast,
  ToastType,
  ToastContextValue,
};
```
