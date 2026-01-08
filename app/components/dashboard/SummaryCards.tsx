import { DashboardMetrics } from '@/app/lib/types';
import { SummaryCard } from './SummaryCard';

export function SummaryCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard type="total" label="Total Tasks" count={metrics.total} />
      <SummaryCard type="completed" label="Completed" count={metrics.completed} />
      <SummaryCard type="pending" label="Pending" count={metrics.pending} />
      <SummaryCard type="overdue" label="Overdue" count={metrics.overdue} />
    </div>
  );
}
