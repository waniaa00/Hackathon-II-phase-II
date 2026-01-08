import { CompactTaskItemProps } from '@/app/lib/types';
import { Badge } from '@/app/components/ui/Badge';
import { truncateText } from '@/app/lib/dashboardUtils';
import { formatDate } from '@/app/lib/dateUtils';

export function CompactTaskItem({ task, onClick }: CompactTaskItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <span className="font-medium text-gray-800">{truncateText(task.title, 60)}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={task.priority}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        {task.dueDate && (
          <span className="text-sm text-gray-600">{formatDate(task.dueDate)}</span>
        )}
      </div>
    </div>
  );
}
