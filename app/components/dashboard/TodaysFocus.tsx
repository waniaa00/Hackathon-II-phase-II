'use client'

import { useRouter } from 'next/navigation';
import { TodaysFocusProps } from '@/app/lib/types';
import { CompactTaskItem } from './CompactTaskItem';

export function TodaysFocus({ tasks }: TodaysFocusProps) {
  const router = useRouter();

  const handleTaskClick = () => {
    router.push('/todos');
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🎯</span>
        <h2 className="text-2xl font-bold text-white">Today&apos;s Focus</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg backdrop-blur-sm">
          <p className="text-6xl mb-3">✨</p>
          <p className="text-lg font-semibold text-white">All caught up!</p>
          <p className="text-gray-400 mt-1">No urgent tasks for today.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <CompactTaskItem key={task.id} task={task} onClick={handleTaskClick} />
          ))}
        </div>
      )}
    </div>
  );
}
