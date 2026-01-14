import { QuickActionsProps } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';

export function QuickActions({
  onAddTask,
  onViewAll,
  onClearCompleted,
  completedCount
}: QuickActionsProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">⚡</span>
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onAddTask}
          className="w-full"
        >
          ➕ Add New Task
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={onViewAll}
          className="w-full"
        >
          📋 View All Tasks
        </Button>

        <Button
          variant="danger"
          size="md"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          className="w-full"
        >
          🗑️ Clear Completed ({completedCount})
        </Button>
      </div>
    </div>
  );
}
