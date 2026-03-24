import React from 'react';
import { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { formatDueDate } from '../../utils/dateHelpers';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = React.memo(({ task }: TaskCardProps) => {
  const assignee = USERS.find(u => u.id === task.assigneeId);
  const { text: dueText, isDanger: isDueDanger, isWarning: isDueWarning } = formatDueDate(task.dueDate);

  return (
    <div 
      className="bg-white p-4 rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative touch-none"
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight flex-1">{task.title}</h3>
      </div>
      
      {dueText && (
        <div className={`text-xs mt-1 font-medium mb-3 ${isDueDanger ? 'text-red-600' : isDueWarning ? 'text-orange-500' : 'text-gray-500'}`}>
          {dueText}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-auto pt-2">
        <PriorityBadge priority={task.priority} />
        
        {assignee && (
          <div className="flex items-center gap-2" title={assignee.name}>
            <span className="text-xs text-gray-500 hidden sm:inline-block truncate max-w-[80px]">{assignee.name}</span>
            <Avatar name={assignee.name} />
          </div>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
