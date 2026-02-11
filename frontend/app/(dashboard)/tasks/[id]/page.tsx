"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

const TaskForm = dynamic(() => import("@/components/tasks/task-form").then(mod => ({ default: mod.TaskForm })), {
  ssr: false,
  loading: () => <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>,
});
import { ErrorMessage } from "@/components/shared/error-message";
import { tasksApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/hooks";
import type { Task } from "@/lib/types";
import type { TaskFormData } from "@/lib/utils/validation";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await tasksApi.get(taskId);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load task"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [user?.id, taskId]);

  const handleSubmit = async (data: TaskFormData) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      await tasksApi.update(taskId, {
        title: data.title,
        description: data.description || null,
        priority_id: data.priority_id,
        tag_ids: data.tag_ids,
        due_date: data.due_date?.toISOString() || null,
        recurrence_rule: data.recurrence_rule,
      });
      toast.success("Task updated successfully");
      router.push("/");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Update task error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      await tasksApi.delete(taskId);
      toast.success("Task deleted");
      router.push("/");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Delete task error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ErrorMessage
          message={error.message || "Failed to load task"}
          type="error"
          action={{
            label: "Go back",
            onClick: () => router.push("/"),
          }}
        />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ErrorMessage message="Task not found" type="error" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Task</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update your task details</p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
