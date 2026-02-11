"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useTasks } from "@/lib/hooks/use-tasks";

const TaskForm = dynamic(() => import("@/components/tasks/task-form").then(mod => ({ default: mod.TaskForm })), {
  ssr: false,
  loading: () => <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>,
});
import type { TaskFormData } from "@/lib/utils/validation";

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask } = useTasks({ autoFetch: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await createTask({
        title: data.title,
        description: data.description || undefined,
        priority_id: data.priority_id || undefined,
        tag_ids: data.tag_ids || undefined,
        due_date: data.due_date?.toISOString() || undefined,
        recurrence_rule: data.recurrence_rule || undefined,
      });
      toast.success("Task created successfully");
      router.push("/");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Create task error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Task</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to create a task</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
