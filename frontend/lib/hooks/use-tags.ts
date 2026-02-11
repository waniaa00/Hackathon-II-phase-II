"use client";

import { useState, useEffect, useCallback } from "react";
import { tagsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/hooks";
import type { Tag, TagCreate, TagUpdate } from "@/lib/types";

export function useTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedTags = await tagsApi.list();
      setTags(fetchedTags);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tags"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchTags();
    }
  }, [user?.id, fetchTags]);

  const createTag = useCallback(
    async (data: TagCreate): Promise<Tag> => {
      if (!user?.id) throw new Error("User not authenticated");

      const tag = await tagsApi.create(data);
      setTags((prev) => [...prev, tag]);
      return tag;
    },
    [user?.id]
  );

  const updateTag = useCallback(
    async (tagId: string, data: TagUpdate): Promise<Tag> => {
      if (!user?.id) throw new Error("User not authenticated");

      const updatedTag = await tagsApi.update(tagId, data);
      setTags((prev) => prev.map((tag) => (tag.id === tagId ? updatedTag : tag)));
      return updatedTag;
    },
    [user?.id]
  );

  const deleteTag = useCallback(
    async (tagId: string): Promise<void> => {
      if (!user?.id) throw new Error("User not authenticated");

      await tagsApi.delete(tagId);
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
    },
    [user?.id]
  );

  return {
    tags,
    isLoading,
    error,
    refresh: fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
}
