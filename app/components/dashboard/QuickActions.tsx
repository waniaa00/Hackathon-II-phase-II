import { QuickActionsProps } from '@/app/lib/types';
import { Button } from '@/app/components/ui/Button';

export function QuickActions({
  onAddTask,
  onViewAll,
  onClearCompleted,
  completedCount
}: QuickActionsProps) {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-xl border border-blue-100">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">⚡</span>
        <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
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
