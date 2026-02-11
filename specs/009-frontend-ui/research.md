# Research: Todo App Frontend & UI

**Feature**: 009-frontend-ui
**Date**: 2026-02-05
**Purpose**: Resolve technical decisions and best practices for frontend implementation

---

## R-001: Better Auth React Client Integration

### Decision
Use Better Auth's official `@better-auth/react` client with `createAuthClient()` and `useSession()` hook.

### Rationale
- Native integration with Better Auth backend (already configured in 008-backend-api)
- Automatic token management and refresh
- Session state available via React context
- TypeScript support out of the box

### Implementation Pattern

```typescript
// lib/auth/client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

```typescript
// Usage in components
import { useSession } from "@/lib/auth/client";

function Component() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Loading />;
  if (!session) return <Redirect to="/login" />;

  return <Dashboard user={session.user} />;
}
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Manual JWT storage in localStorage | Security risk, manual refresh logic needed |
| NextAuth.js | Different auth system than backend uses |
| Custom auth hooks | Duplicates Better Auth functionality |

---

## R-002: API Client Pattern

### Decision
Create a custom fetch wrapper that:
1. Gets JWT from Better Auth session
2. Attaches Authorization header to all requests
3. Handles common error responses
4. Provides typed API functions

### Rationale
- Centralized auth header handling
- Consistent error handling
- Type safety with TypeScript
- No additional dependencies (native fetch)

### Implementation Pattern

```typescript
// lib/api/client.ts
import { authClient } from "@/lib/auth/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthToken(): Promise<string | null> {
  const session = await authClient.getSession();
  return session?.accessToken ?? null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.detail, response.status);
  }

  return response.json();
}
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Axios | Additional dependency for minimal benefit |
| TanStack Query | Adds complexity; simple patterns sufficient for MVP |
| SWR | Extra layer; direct fetch cleaner for our needs |

---

## R-003: Component Library Selection

### Decision
Use shadcn/ui (copy-paste components built on Radix UI) with TailwindCSS.

### Rationale
- Copy-paste model: No version lock-in, full customization control
- Built on Radix UI: Accessible by default (keyboard nav, ARIA)
- TailwindCSS integration: Matches constitution styling standard
- Widely adopted: Good documentation, community support

### Components Needed
| Component | Purpose |
|-----------|---------|
| Button | Actions throughout app |
| Input | Form inputs |
| Dialog | Task edit modal, confirmations |
| Select | Priority/tag dropdowns |
| Badge | Priority/tag display |
| Checkbox | Task completion toggle |
| Calendar | Due date picker |
| Toast | Notifications/feedback |
| DropdownMenu | Sort/filter menus |

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Material UI | Heavy, opinionated styling, harder to customize |
| Chakra UI | Runtime CSS-in-JS, larger bundle |
| Headless UI | Less components, would need more custom work |
| Custom from scratch | Time-consuming, accessibility burden |

---

## R-004: Form Handling

### Decision
Use React Hook Form with Zod validation for all forms (login, signup, task create/edit, tag management).

### Rationale
- Uncontrolled inputs = better performance
- Zod provides runtime + compile-time type safety
- Built-in integration with shadcn/ui form components
- Minimal re-renders

### Implementation Pattern

```typescript
// lib/utils/validation.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  priority_id: z.string().optional(),
  tag_ids: z.array(z.string()).optional(),
  due_date: z.date().optional(),
  recurrence_rule: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
```

```typescript
// components/tasks/task-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "@/lib/utils/validation";

function TaskForm({ onSubmit }) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "" },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Formik | More boilerplate, less performant |
| Native forms | No validation framework, poor DX |
| Final Form | Less TypeScript support |

---

## R-005: State Management

### Decision
Use React's built-in state (useState, useReducer) with custom hooks for data fetching. No global state library.

### Rationale
- Task list is fetched per-page, not shared globally
- Auth state provided by Better Auth hooks
- Filter/sort state is local to task list component
- Avoids unnecessary complexity

### Implementation Pattern

```typescript
// lib/hooks/use-tasks.ts
export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    tasksApi.list(filters)
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters]);

  const createTask = async (data: TaskCreate) => {
    const task = await tasksApi.create(data);
    setTasks(prev => [...prev, task]);
    return task;
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Redux | Overkill for app of this size |
| Zustand | Not needed; local state sufficient |
| Jotai/Recoil | Adds complexity without clear benefit |
| React Context | Auth already uses it; data fetching doesn't need it |

---

## R-006: Route Protection Pattern

### Decision
Use Next.js middleware for route protection, redirecting unauthenticated users to login.

### Rationale
- Runs before page renders (server-side)
- Single point of auth enforcement
- Better UX than client-side redirects

### Implementation Pattern

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("better-auth.session_token");

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Client-side redirect in layout | Flash of content, poor UX |
| Higher-order component | More boilerplate, client-side only |
| Per-page auth check | Duplicated logic, easy to forget |

---

## R-007: Date Handling

### Decision
Use date-fns for date formatting and manipulation.

### Rationale
- Tree-shakeable (only import what you need)
- Immutable (doesn't mutate dates)
- TypeScript support
- Extensive formatting options

### Key Functions Needed

```typescript
import { format, isPast, isToday, isTomorrow, parseISO } from "date-fns";

// Format for display
format(date, "MMM d, yyyy"); // "Jan 15, 2026"

// Due date indicators
isPast(dueDate);    // Overdue
isToday(dueDate);   // Due today
isTomorrow(dueDate); // Due tomorrow
```

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Moment.js | Deprecated, heavy bundle |
| Day.js | Smaller but date-fns more feature-rich |
| Native Intl | Verbose, less convenient for comparisons |

---

## R-008: Browser Notifications

### Decision
Use the Web Notifications API with permission request on first use.

### Rationale
- Native browser API (no dependencies)
- User must grant permission
- Works across modern browsers

### Implementation Pattern

```typescript
// lib/hooks/use-notifications.ts
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== "granted") return;

    new Notification(title, options);
  };

  return { permission, requestPermission, showNotification };
}
```

### Trigger Points
- When task becomes overdue (checked on app load/focus)
- When task due date is within notification threshold

---

## Summary of Decisions

| Area | Decision | Key Dependency |
|------|----------|----------------|
| Authentication | Better Auth React client | @better-auth/react |
| API Client | Custom fetch wrapper | Native fetch |
| UI Components | shadcn/ui + Radix | @radix-ui/*, tailwindcss |
| Forms | React Hook Form + Zod | react-hook-form, zod |
| State | React built-in hooks | None |
| Route Protection | Next.js middleware | None |
| Dates | date-fns | date-fns |
| Notifications | Web Notifications API | None |
