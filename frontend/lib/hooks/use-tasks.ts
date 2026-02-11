"use client";

import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/hooks";
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskQueryParams,
  TaskStatus,
} from "@/lib/types";

interface UseTasksOptions {
  params?: Partial<TaskQueryParams>;
  autoFetch?: boolean;
}

interface TaskFiltersState {
  status: TaskStatus | "all";
  priorityIds?: string[];
  tagIds?: string[];
  dueDate?: "all" | "overdue" | "today" | "upcoming";
  search?: string;
}

interface TaskSortState {
  sortBy: "created_at" | "due_date" | "title" | "priority";
  sortOrder: "asc" | "desc";
}

interface UseTasksReturn {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task>;
  updateTask: (taskId: string, data: TaskUpdate) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleComplete: (taskId: string) => Promise<Task>;
  filters: TaskFiltersState;
  updateFilters: (newFilters: Partial<TaskFiltersState>) => void;
  sort: TaskSortState;
  updateSort: (newSort: TaskSortState) => void;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { params, autoFetch = true } = options;
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>({
    status: "all",
    dueDate: "all",
    search: "",
  });
  const [sort, setSort] = useState<TaskSortState>({
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const fetchTasks = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build API params from local filter state
      const combinedParams: Partial<TaskQueryParams> = {
        ...params,
        sort_by: sort.sortBy,
        sort_order: sort.sortOrder,
      };

      // Map local filter state to API query params
      if (filters.status && filters.status !== "all") {
        combinedParams.status = filters.status;
      }
      if (filters.search) {
        combinedParams.search = filters.search;
      }

      const response = await tasksApi.list(combinedParams);
      setTasks(response.tasks || []);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.page_size);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tasks"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, params, filters, sort]);

  useEffect(() => {
    if (autoFetch && user?.id) {
      fetchTasks();
    }
  }, [autoFetch, user?.id, fetchTasks, filters]);

  const updateFilters = useCallback((newFilters: Partial<TaskFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((newSort: TaskSortState) => {
    setSort(newSort);
  }, []);

  const createTask = useCallback(
    async (data: TaskCreate): Promise<Task> => {
      if (!user?.id) throw new Error("User not authenticated");

      const task = await tasksApi.create(data);
      setTasks((prev) => [task, ...prev]);
      setTotal((prev) => prev + 1);
      return task;
    },
    [user?.id]
  );

  const updateTask = useCallback(
    async (taskId: string, data: TaskUpdate): Promise<Task> => {
      if (!user?.id) throw new Error("User not authenticated");

      const updatedTask = await tasksApi.update(taskId, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      return updatedTask;
    },
    [user?.id]
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (!user?.id) throw new Error("User not authenticated");

      await tasksApi.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setTotal((prev) => prev - 1);
    },
    [user?.id]
  );

  const toggleComplete = useCallback(
    async (taskId: string): Promise<Task> => {
      if (!user?.id) throw new Error("User not authenticated");

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === "completed" ? "pending" : "completed",
              }
            : task
        )
      );

      try {
        const updatedTask = await tasksApi.toggleComplete(taskId);
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      } catch (err) {
        // Revert on error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: task.status === "completed" ? "pending" : "completed",
                }
              : task
          )
        );
        throw err;
      }
    },
    [user?.id]
  );

  return {
    tasks,
    total,
    page,
    pageSize,
    isLoading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filters,
    updateFilters,
    sort,
    updateSort,
  };
}
