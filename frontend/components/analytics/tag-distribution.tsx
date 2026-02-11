"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TagCount } from "@/lib/types";

interface TagDistributionProps {
  data: TagCount[];
}

export function TagDistribution({ data }: TagDistributionProps) {
  const maxCount = Math.max(...data.map((t) => t.count), 1);

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Tasks by Tag</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No tag data yet
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((tag) => (
              <div key={tag.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums">
                    {tag.count}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(tag.count / maxCount) * 100}%`,
                      backgroundColor: tag.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
