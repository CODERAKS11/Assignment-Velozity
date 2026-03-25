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

export const TaskCard = React.memo(({ task }: TaskCardProps) => {
  const assignee = USERS.find(u => u.id === task.assigneeId);
  const { text: dueText, isDanger: isDueDanger, isWarning: isDueWarning } = formatDueDate(task.dueDate);
  const cardRef = useRef<HTMLDivElement>(null);

  useDragAndDrop(cardRef, task.id, task.status);

  return (
    <div 
      ref={cardRef}
      className="group bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all duration-200 relative touch-none"
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="text-sm font-semibold text-slate-800 leading-relaxed line-clamp-2 flex-1 group-hover:text-blue-700 transition-colors">{task.title}</h3>
      </div>
      
      {dueText && (
        <div className={`text-xs mt-1 font-medium mb-3 ${isDueDanger ? 'text-red-600' : isDueWarning ? 'text-orange-500' : 'text-gray-500'}`}>
          {dueText}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-auto pt-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2">
          {assignee && (
            <span className="text-xs text-gray-500 hidden sm:inline-block truncate max-w-[80px]" title={assignee.name}>
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
