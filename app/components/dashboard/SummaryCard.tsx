import { SummaryCardProps, SummaryCardType } from '@/app/lib/types';

const cardStyles: Record<SummaryCardType, string> = {
  total: 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20',
  completed: 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/20',
  pending: 'bg-gradient-to-br from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/20',
  overdue: 'bg-gradient-to-br from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/20',
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
    <div className={`p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transform transition-all hover:scale-105 hover:shadow-xl ${cardStyles[type]}`}>
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
