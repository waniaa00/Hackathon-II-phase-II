"use client";

import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { useStats } from "@/lib/hooks/use-stats";
import { StatCard } from "@/components/analytics/stat-card";
import { CompletionProgress } from "@/components/analytics/completion-progress";
import { PriorityChart } from "@/components/analytics/priority-chart";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { TagDistribution } from "@/components/analytics/tag-distribution";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[120px] rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
      <Skeleton className="h-[200px] rounded-xl" />
    </div>
  );
}

export default function AnalyticsPage() {
  const { stats, isLoading, error, refresh } = useStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Analytics
        </h1>
        <AnalyticsSkeleton />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Analytics
        </h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {error?.message || "Failed to load analytics"}
          </p>
          <Button variant="outline" onClick={refresh} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Analytics
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total_tasks}
          icon={ListTodo}
        />
        <StatCard
          title="Pending"
          value={stats.pending_tasks}
          icon={Clock}
          iconClassName="bg-amber-500/10"
        />
        <StatCard
          title="Completed"
          value={stats.completed_tasks}
          icon={CheckCircle2}
          iconClassName="bg-emerald-500/10"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue_tasks}
          icon={AlertTriangle}
          iconClassName="bg-red-500/10"
        />
      </div>

      {/* Completion progress */}
      <CompletionProgress
        rate={stats.completion_rate}
        completed={stats.completed_tasks}
        total={stats.total_tasks}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PriorityChart data={stats.tasks_by_priority} />
        <ActivityChart data={stats.recent_activity} />
      </div>

      {/* Tag distribution */}
      <TagDistribution data={stats.tasks_by_tag} />
    </div>
  );
}
