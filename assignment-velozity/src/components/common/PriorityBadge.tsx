import React from 'react';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const bgColors: Record<Priority, string> = {
    critical: 'bg-priority-critical/10 text-priority-critical border-priority-critical/20',
    high: 'bg-priority-high/10 text-priority-high border-priority-high/20',
    medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
    low: 'bg-priority-low/10 text-priority-low border-priority-low/20',
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
