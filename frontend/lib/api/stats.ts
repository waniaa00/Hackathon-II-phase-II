import { apiGet } from "./client";
import type { StatsResponse } from "@/lib/types";

export const statsApi = {
  async get(): Promise<StatsResponse> {
    return apiGet<StatsResponse>("/api/stats");
  },
};
