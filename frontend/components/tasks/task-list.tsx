"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListTodo, Plus } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { TaskItem } from "./task-item";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";
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
import type { Task } from "@/lib/types";

const VIRTUALIZATION_THRESHOLD = 500;
const ESTIMATED_TASK_HEIGHT = 88;

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onToggleComplete: (id: string) => Promise<Task | void>;
  onDelete: (id: string) => Promise<void>;
  onRetry?: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  error,
  onToggleComplete,
  onDelete,
  onRetry,
}: TaskListProps) {
  const router = useRouter();
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const useVirtual = tasks.length >= VIRTUALIZATION_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: useVirtual ? tasks.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_TASK_HEIGHT,
    overscan: 10,
  });

  const handleDelete = async () => {
    if (!deleteTaskId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteTaskId);
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTaskId(null);
    }
  };

  const handleToggle = useCallback(
    async (id: string) => {
      try {
        await onToggleComplete(id);
      } catch (err) {
        toast.error("Failed to update task");
        console.error("Toggle error:", err);
      }
    },
    [onToggleComplete]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="rounded-2xl bg-muted/30 p-4">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading tasks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message || "Failed to load tasks"}
        type="error"
        action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="rounded-2xl bg-muted/20 p-5">
          <ListTodo className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold">No tasks yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first task to get started
          </p>
        </div>
        <Button
          onClick={() => router.push("/tasks/new")}
          size="sm"
          className="gap-2 rounded-xl mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Create task
        </Button>
      </div>
    );
  }

  return (
    <>
      {useVirtual ? (
        <div ref={parentRef} className="h-[600px] overflow-auto">
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const task = tasks[virtualItem.index];
              return (
                <div
                  key={task.id}
                  className="absolute left-0 top-0 w-full pb-2.5"
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                >
                  <TaskItem
                    task={task}
                    onToggleComplete={() => handleToggle(task.id)}
                    onDelete={() => setDeleteTaskId(task.id)}
                    onEdit={() => router.push(`/tasks/${task.id}`)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 animate-fade-in-up">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={() => handleToggle(task.id)}
              onDelete={() => setDeleteTaskId(task.id)}
              onEdit={() => router.push(`/tasks/${task.id}`)}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteTaskId}
        onOpenChange={(open) => !open && setDeleteTaskId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
