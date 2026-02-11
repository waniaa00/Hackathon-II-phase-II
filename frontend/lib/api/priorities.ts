import { apiGet } from "./client";
import type { Priority } from "@/lib/types";

export const prioritiesApi = {
  async list(): Promise<Priority[]> {
    return apiGet<Priority[]>(`/api/priorities`);
  },
};
