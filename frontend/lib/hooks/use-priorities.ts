"use client";

import { useState, useEffect, useCallback } from "react";
import { prioritiesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/hooks";
import type { Priority } from "@/lib/types";

export function usePriorities() {
  const { user } = useAuth();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPriorities = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedPriorities = await prioritiesApi.list();
      setPriorities(fetchedPriorities);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch priorities"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPriorities();
    }
  }, [user?.id, fetchPriorities]);

  return {
    priorities,
    isLoading,
    error,
    refresh: fetchPriorities,
  };
}
