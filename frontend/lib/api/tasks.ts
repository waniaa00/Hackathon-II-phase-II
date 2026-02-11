import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./client";
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskQueryParams,
} from "@/lib/types";

function buildQueryString(params?: Partial<TaskQueryParams>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params.priority_id) {
    searchParams.set("priority_id", params.priority_id);
  }
  if (params.tag_id) {
    searchParams.set("tag_id", params.tag_id);
  }
  if (params.due_before) {
    searchParams.set("due_before", params.due_before);
  }
  if (params.due_after) {
    searchParams.set("due_after", params.due_after);
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.sort_by) {
    searchParams.set("sort_by", params.sort_by);
  }
  if (params.sort_order) {
    searchParams.set("sort_order", params.sort_order);
  }
  if (params.page) {
    searchParams.set("page", params.page.toString());
  }
  if (params.page_size) {
    searchParams.set("page_size", params.page_size.toString());
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const tasksApi = {
  async list(
    params?: Partial<TaskQueryParams>
  ): Promise<TaskListResponse> {
    const queryString = buildQueryString(params);
    return apiGet<TaskListResponse>(`/api/tasks${queryString}`);
  },

  async get(taskId: string): Promise<Task> {
    return apiGet<Task>(`/api/tasks/${taskId}`);
  },

  async create(data: TaskCreate): Promise<Task> {
    return apiPost<Task>(`/api/tasks`, data);
  },

  async update(taskId: string, data: TaskUpdate): Promise<Task> {
    return apiPut<Task>(`/api/tasks/${taskId}`, data);
  },

  async delete(taskId: string): Promise<void> {
    return apiDelete(`/api/tasks/${taskId}`);
  },

  async toggleComplete(taskId: string): Promise<Task> {
    return apiPatch<Task>(`/api/tasks/${taskId}/complete`);
  },
};
