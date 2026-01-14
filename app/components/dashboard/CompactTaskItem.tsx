import { CompactTaskItemProps } from '@/app/lib/types';
import { Badge } from '@/app/components/ui/Badge';
import { truncateText } from '@/app/lib/dashboardUtils';
import { formatDate } from '@/app/lib/dateUtils';

export function CompactTaskItem({ task, onClick }: CompactTaskItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 border border-white/20 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm"
      onClick={onClick}
    >
      <span className="font-medium text-white">{truncateText(task.title, 60)}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={task.priority}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        {task.dueDate && (
          <span className="text-sm text-gray-400">{formatDate(task.dueDate)}</span>
        )}
      </div>
    </div>
  );
}
