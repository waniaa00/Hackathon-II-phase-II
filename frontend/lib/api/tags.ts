import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { Tag, TagCreate, TagUpdate } from "@/lib/types";

export const tagsApi = {
  async list(): Promise<Tag[]> {
    return apiGet<Tag[]>(`/api/tags`);
  },

  async create(data: TagCreate): Promise<Tag> {
    return apiPost<Tag>(`/api/tags`, data);
  },

  async update(tagId: string, data: TagUpdate): Promise<Tag> {
    return apiPut<Tag>(`/api/tags/${tagId}`, data);
  },

  async delete(tagId: string): Promise<void> {
    return apiDelete(`/api/tags/${tagId}`);
  },
};
