import type { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  return (
    <div 
      className="bg-gray-100 rounded-md flex flex-col h-full overflow-hidden border border-gray-200"
      data-column-status={status}
    >
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
        <h2 className="font-semibold text-gray-700 text-sm">{title}</h2>
        <span className="bg-white text-gray-500 text-xs font-medium px-2 py-1 rounded-full border border-gray-200">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-0">
        {tasks.length === 0 ? (
          <EmptyState 
            title={`No tasks in ${title}`} 
            message="Adjust filters to see tasks."
            className="h-full border-none bg-transparent"
          />
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
