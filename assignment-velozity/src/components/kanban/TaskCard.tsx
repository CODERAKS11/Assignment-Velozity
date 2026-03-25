import React, { useRef } from 'react';
import type { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDueDate } from '../../utils/dateHelpers';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { ActiveUsersStack } from '../common/ActiveUsersStack';

interface TaskCardProps {
  task: Task;
}

const PRIORITY_BORDER_COLORS: Record<string, string> = {
  critical: 'border-l-[#E91E63]',
  high: 'border-l-[#f97316]',
  medium: 'border-l-[#eab308]',
  low: 'border-l-[#22c55e]'
};

export const TaskCard = React.memo(({ task }: TaskCardProps) => {
  const assignee = USERS.find(u => u.id === task.assigneeId);
  const { text: dueText, isDanger: isDueDanger, isWarning: isDueWarning } = formatDueDate(task.dueDate);
  const cardRef = useRef<HTMLDivElement>(null);

  useDragAndDrop(cardRef, task.id, task.status);

  return (
    <div 
      ref={cardRef}
      className={`group bg-app-surface p-4 rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-app-border border-l-[3px] ${PRIORITY_BORDER_COLORS[task.priority]} cursor-grab active:cursor-grabbing hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:border-app-text-muted hover:-translate-y-0.5 transition-all duration-200 relative touch-none`}
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <h3 className="text-[13px] font-medium text-app-text-primary leading-snug line-clamp-2 flex-1 group-hover:text-app-accent transition-colors">{task.title}</h3>
      </div>
      
      {dueText && (
        <div className={`text-[11px] font-semibold mb-3 tracking-wide ${isDueDanger ? 'text-[#E91E63]' : isDueWarning ? 'text-[#f97316]' : 'text-app-accent'}`}>
          {dueText}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-auto">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2">
          {assignee && (
            <span className="text-xs text-app-text-secondary hidden sm:inline-block truncate max-w-[80px]" title={assignee.name}>
              {assignee.name}
            </span>
          )}
          <ActiveUsersStack taskId={task.id} assignee={assignee} />
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
