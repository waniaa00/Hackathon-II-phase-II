"use client";

import { useState, useEffect, useCallback } from "react";
import { statsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/hooks";
import type { StatsResponse } from "@/lib/types";

interface UseStatsReturn {
  stats: StatsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useStats(): UseStatsReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await statsApi.get();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id, fetchStats]);

  return { stats, isLoading, error, refresh: fetchStats };
}
