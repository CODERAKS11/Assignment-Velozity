import React from 'react';
import type { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusDropdown } from '../common/StatusDropdown';
import { formatDueDate } from '../../utils/dateHelpers';
import { useTaskContext } from '../../context/TaskContext';

interface ListRowProps {
  task: Task;
}

export const ListRow = React.memo(({ task }: ListRowProps) => {
  const { dispatch } = useTaskContext();
  const assignee = USERS.find(u => u.id === task.assigneeId);
  const { text: dueText, isDanger: isDueDanger, isWarning: isDueWarning } = formatDueDate(task.dueDate);
  const { text: startText } = formatDueDate(task.startDate);
  
  // Deterministic progress based on status and ID to match Figma
  const getProgress = () => {
    if (task.status === 'done') return 100;
    if (task.status === 'todo') return 0;
    if (task.status === 'inreview') return 85 + (task.id.charCodeAt(task.id.length - 1) % 10);
    return 20 + (task.id.charCodeAt(task.id.length - 1) % 60);
  };
  const progressAmount = getProgress();
  const progressColor = task.status === 'done' ? 'bg-[#3CB87E]' : task.status === 'inreview' ? 'bg-[#655CFD]' : 'bg-[#f97316]';

  return (
    <div className="group flex bg-app-bg-primary hover:bg-app-surface border-b border-app-border h-12 transition-colors duration-150 items-center">
      <div className="flex-1 min-w-0 px-6 py-0 flex items-center gap-3">
        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-app-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-[13px] font-medium text-app-text-primary line-clamp-1 group-hover:text-app-accent transition-colors">{task.title}</span>
      </div>
      <div className="w-40 px-6 py-2 self-center shrink-0">
        <StatusDropdown 
          status={task.status} 
          onChange={(newStatus) => dispatch({ type: 'UPDATE_STATUS', payload: { taskId: task.id, newStatus } })} 
        />
      </div>
      <div className="w-32 px-6 py-2 self-center shrink-0">
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="w-48 px-6 py-2 self-center shrink-0">
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-app-surface overflow-hidden border border-app-border flex items-center justify-center text-[10px] text-white bg-opacity-80" style={{backgroundColor: assignee.color}}>{assignee.name.charAt(0)}</div>
              <span className="text-[13px] text-app-text-secondary truncate" title={assignee.name}>{assignee.name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-32 px-6 py-2 self-center shrink-0 flex items-center">
        <span className={`text-[13px] ${isDueDanger ? 'text-[#E91E63] font-medium' : isDueWarning ? 'text-[#f97316] font-medium' : 'text-app-text-secondary'}`}>
          {dueText || '-'}
        </span>
      </div>
      <div className="w-32 px-6 py-2 self-center shrink-0 flex items-center">
        <span className="text-[13px] text-app-text-secondary">
          {startText || '-'}
        </span>
      </div>
      <div className="w-48 px-6 py-2 self-center shrink-0 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-app-surface rounded-full overflow-hidden border border-app-border/50">
          <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${progressAmount}%` }} />
        </div>
        <span className="text-xs text-app-text-secondary w-8">{progressAmount}%</span>
      </div>
    </div>
  );
});

ListRow.displayName = 'ListRow';
