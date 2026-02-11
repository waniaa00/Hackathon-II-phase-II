"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionProgressProps {
  rate: number;
  completed: number;
  total: number;
}

export function CompletionProgress({
  rate,
  completed,
  total,
}: CompletionProgressProps) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Completion Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold tracking-tight">{rate}%</span>
          <span className="text-sm text-muted-foreground">
            {completed} of {total} tasks
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
