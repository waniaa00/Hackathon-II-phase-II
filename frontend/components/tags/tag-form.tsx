"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { tagSchema, type TagFormData } from "@/lib/utils/validation";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import type { Tag } from "@/lib/types";

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: TagFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function TagForm({
  tag,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TagFormProps) {
  const isEditing = !!tag;

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      color: tag?.color || "#6366f1",
    },
  });

  const handleSubmit = async (data: TagFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tag name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={field.value || "#6366f1"}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={isSubmitting}
                    className="h-10 w-10 cursor-pointer rounded border"
                  />
                  <Input
                    type="text"
                    placeholder="#RRGGBB"
                    disabled={isSubmitting}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditing ? "Saving..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Save tag"
            ) : (
              "Create tag"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
