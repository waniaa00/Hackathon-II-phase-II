"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PriorityCount } from "@/lib/types";

const chartConfig = {
  count: {
    label: "Tasks",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const PRIORITY_COLORS: Record<string, string> = {
  High: "hsl(0 84% 60%)",
  Medium: "hsl(38 92% 50%)",
  Low: "hsl(142 71% 45%)",
};

interface PriorityChartProps {
  data: PriorityCount[];
}

export function PriorityChart({ data }: PriorityChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    count: item.count,
    fill: PRIORITY_COLORS[item.name] ?? "var(--chart-1)",
  }));

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No priority data yet
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={60}
                fontSize={12}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
