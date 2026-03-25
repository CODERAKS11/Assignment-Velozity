import type { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const bgColors: Record<Priority, string> = {
    critical: 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30',
    high: 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/30',
    medium: 'bg-[#eab308]/15 text-[#eab308] border-[#eab308]/30',
    low: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30',
  };

  const labels: Record<Priority, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColors[priority]} ${className}`}>
      {labels[priority]}
    </span>
  );
}
