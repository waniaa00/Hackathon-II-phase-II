"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { TaskList } from "@/components/tasks/task-list";
import { TaskSearch } from "@/components/tasks/task-search";
import { TaskSort } from "@/components/tasks/task-sort";
import { NotificationPermission } from "@/components/shared/notification-permission";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TaskFilters = dynamic(
  () =>
    import("@/components/tasks/task-filters").then((mod) => ({
      default: mod.TaskFilters,
    })),
  { loading: () => <Skeleton className="h-[300px] rounded-2xl" /> }
);

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    refresh,
    toggleComplete,
    deleteTask,
    filters,
    updateFilters,
    sort,
    updateSort,
  } = useTasks();

  useNotifications(tasks);

  const quickStats = useMemo(() => {
    if (!tasks.length) return null;
    const now = new Date();
    const pending = tasks.filter((t) => t.status === "pending").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const overdue = tasks.filter(
      (t) =>
        t.status === "pending" && t.due_date && new Date(t.due_date) < now
    ).length;
    return { total: tasks.length, pending, completed, overdue };
  }, [tasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.priorityIds?.length) count++;
    if (filters.tagIds?.length) count++;
    if (filters.dueDate && filters.dueDate !== "all") count++;
    return count;
  }, [filters]);

  const handleFilterChange = (
    newFilters: Partial<
      import("@/components/tasks/task-filters").TaskFiltersState
    >
  ) => {
    updateFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSort: {
    sortBy: string;
    sortOrder: string;
  }) => {
    updateSort(
      newSort as {
        sortBy: "created_at" | "due_date" | "title" | "priority";
        sortOrder: "asc" | "desc";
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {quickStats
              ? `${quickStats.pending} pending, ${quickStats.completed} completed`
              : "Manage your tasks"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationPermission />
          <Link href="/tasks/new">
            <Button className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {quickStats && (
        <Link href="/analytics" className="block">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-primary/10 p-1.5">
                    <ListTodo className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {quickStats.total}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-amber-500/10 p-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {quickStats.pending}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-emerald-500/10 p-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Done
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {quickStats.completed}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-red-500/10 p-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Overdue
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {quickStats.overdue}
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Controls Bar */}
      <div className="flex items-center gap-3">
        <TaskSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <TaskSort currentSort={sort} onSortChange={handleSortChange} />

        {/* Mobile filter toggle */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-sm shrink-0 relative"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="px-6 pt-6 pb-2">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <TaskFilters
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TaskFilters
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Task list */}
        <div>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
              <button
                onClick={() =>
                  updateFilters({
                    status: "all",
                    priorityIds: [],
                    tagIds: [],
                    dueDate: "all",
                  })
                }
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}

          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            error={error}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
            onRetry={refresh}
          />
        </div>
      </div>
    </div>
  );
}
