import React from 'react';
import { Task } from '../../types';
import { USERS } from '../../utils/seedData';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = React.memo(({ task }: TaskCardProps) => {
  const assignee = USERS.find(u => u.id === task.assigneeId);

  return (
    <div 
      className="bg-white p-4 rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative touch-none"
      data-task-id={task.id}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight flex-1 mr-2">{task.title}</h3>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <PriorityBadge priority={task.priority} />
        
        {assignee && (
          <div className="flex items-center gap-2">
            <Avatar name={assignee.name} />
          </div>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
