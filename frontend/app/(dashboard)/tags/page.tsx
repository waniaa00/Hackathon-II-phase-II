"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagList } from "@/components/tags/tag-list";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

const TagForm = dynamic(() => import("@/components/tags/tag-form").then(mod => ({ default: mod.TagForm })), {
  loading: () => <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>,
});
import { ErrorMessage } from "@/components/shared/error-message";
import { useTags } from "@/lib/hooks/use-tags";
import type { TagFormData } from "@/lib/utils/validation";

export default function TagsPage() {
  const { createTag, isLoading, error } = useTags();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TagFormData) => {
    setIsSubmitting(true);
    try {
      await createTag({
        name: data.name,
        color: data.color,
      });
      toast.success("Tag created successfully");
      setIsCreating(false);
    } catch (err) {
      toast.error("Failed to create tag");
      console.error("Create tag error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isCreating) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !isCreating) {
    return (
      <ErrorMessage
        message={error.message || "Failed to load tags"}
        type="error"
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Tags</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Organize tasks with custom tags</p>
          </div>
        </div>

        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="rounded-xl shadow-sm hover:shadow-md transition-all gap-2">
            <Plus className="h-4 w-4" />
            Create Tag
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Create New Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <TagForm
              onSubmit={handleSubmit}
              onCancel={() => setIsCreating(false)}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Your Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <TagList />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
