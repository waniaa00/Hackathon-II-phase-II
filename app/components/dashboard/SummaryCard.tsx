import { SummaryCardProps, SummaryCardType } from '@/app/lib/types';

const cardStyles: Record<SummaryCardType, string> = {
  total: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200',
  completed: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
  pending: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200',
  overdue: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200',
};

const iconStyles: Record<SummaryCardType, string> = {
  total: '📊',
  completed: '✅',
  pending: '⏳',
  overdue: '🔥',
};

export function SummaryCard({ type, label, count, icon }: SummaryCardProps) {
  const displayIcon = icon || iconStyles[type];

  return (
    <div className={`p-6 rounded-xl border-0 transform transition-all hover:scale-105 ${cardStyles[type]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">{label}</p>
          <p className="text-5xl font-bold mt-3">{count}</p>
        </div>
        {displayIcon && <div className="text-5xl opacity-80">{displayIcon}</div>}
      </div>
    </div>
  );
}
