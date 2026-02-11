"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { useTags } from "@/lib/hooks/use-tags";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TagList() {
  const {
    tags,
    isLoading,
    error,
    deleteTag,
    updateTag,
  } = useTags();
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6366f1");

  const startEditing = (tagId: string, currentName: string, currentColor: string) => {
    setEditingTagId(tagId);
    setNewTagName(currentName);
    setNewTagColor(currentColor || "#6366f1");
  };

  const saveEditedTag = async (tagId: string) => {
    if (!newTagName.trim()) return;

    try {
      await updateTag(tagId, {
        name: newTagName.trim(),
        color: newTagColor,
      });
      toast.success("Tag updated successfully");
      setEditingTagId(null);
      setNewTagName("");
      setNewTagColor("#6366f1");
    } catch (error) {
      toast.error("Failed to update tag");
      console.error("Update tag error:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingTagId) return;

    try {
      await deleteTag(deletingTagId);
      toast.success("Tag deleted successfully");
      setDeletingTagId(null);
    } catch (error) {
      toast.error("Failed to delete tag");
      console.error("Delete tag error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message || "Failed to load tags"}
        type="error"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div key={tag.id} className="group flex items-center gap-3 p-3 border border-border/50 rounded-xl bg-card/50 card-hover shadow-sm">
            <Badge
              variant="outline"
              className="rounded-lg text-xs font-medium gap-1.5"
              style={{
                backgroundColor: tag.color ? `${tag.color}15` : undefined,
                color: tag.color || undefined,
                borderColor: tag.color ? `${tag.color}30` : undefined,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tag.color || 'currentColor' }}
              />
              {tag.name}
            </Badge>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-lg p-0"
                onClick={() => startEditing(tag.id, tag.name, tag.color || "#6366f1")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-lg p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeletingTagId(tag.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTagId && (
        <div className="flex items-center gap-3 p-4 border border-border/50 rounded-xl bg-card/80 shadow-sm animate-fade-in-up">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="flex-1 rounded-lg border border-border/50 px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-border/50"
          />
          <Button
            onClick={() => saveEditedTag(editingTagId)}
            disabled={!newTagName.trim()}
            className="rounded-xl shadow-sm"
          >
            Save
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setEditingTagId(null);
              setNewTagName("");
              setNewTagColor("#6366f1");
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!deletingTagId}
        onOpenChange={(open) => !open && setDeletingTagId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
