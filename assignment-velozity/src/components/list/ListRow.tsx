import React from 'react';
import type { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { ActiveUsersStack } from '../common/ActiveUsersStack';
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
    <div className="group flex bg-white hover:bg-slate-50/70 border-b border-slate-100 h-14 transition-colors duration-150 items-center">
      <div className="flex-1 min-w-0 px-6 py-0 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-700 line-clamp-1 group-hover:text-blue-700 transition-colors tracking-wide">{task.title}</span>
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
        <div className="flex items-center gap-3">
          <ActiveUsersStack taskId={task.id} assignee={assignee} />
          {assignee && (
            <span className="text-sm text-gray-500 truncate" title={assignee.name}>{assignee.name}</span>
          )}
        </div>
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
