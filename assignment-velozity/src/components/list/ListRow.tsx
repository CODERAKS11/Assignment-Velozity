import React from 'react';
import { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
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

  return (
    <div className="flex bg-white hover:bg-gray-50 border-b border-gray-200 h-12">
      <div className="flex-1 min-w-0 px-6 py-0 self-center">
        <span className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</span>
      </div>
      <div className="w-40 px-6 py-3 self-center shrink-0">
        <StatusDropdown 
          status={task.status} 
          onChange={(newStatus) => dispatch({ type: 'UPDATE_STATUS', payload: { taskId: task.id, newStatus } })} 
        />
      </div>
      <div className="w-32 px-6 py-3 self-center shrink-0">
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="w-48 px-6 py-3 self-center shrink-0">
        {assignee && (
          <div className="flex items-center gap-2" title={assignee.name}>
            <Avatar name={assignee.name} />
            <span className="text-sm text-gray-500 truncate">{assignee.name}</span>
          </div>
        )}
      </div>
      <div className="w-32 px-6 py-3 self-center shrink-0 flex items-center">
        <span className={`text-sm ${isDueDanger ? 'text-red-600 font-medium' : isDueWarning ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
          {dueText}
        </span>
      </div>
    </div>
  );
});

ListRow.displayName = 'ListRow';
