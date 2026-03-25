import { useState, useEffect } from 'react';
import type { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
}

const COLUMN_COLORS: Record<Status, string> = {
  todo: 'border-t-[#655CFD]',
  inprogress: 'border-t-[#8b5cf6]',
  inreview: 'border-t-[#eab308]',
  done: 'border-t-[#22c55e]'
};

export function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    let timer: number;
    if (visibleCount < tasks.length) {
      timer = window.requestAnimationFrame(() => {
        setVisibleCount((prev: number) => Math.min(prev + 10, tasks.length));
      });
    }
    return () => cancelAnimationFrame(timer);
  }, [visibleCount, tasks.length]);

  const visibleTasks = tasks.slice(0, visibleCount);

  return (
    <div 
      className={`w-[340px] shrink-0 bg-app-bg-secondary rounded-[8px] flex flex-col h-[calc(100vh-180px)] max-h-full overflow-hidden border border-app-border border-t-[3px] shadow-[0_4px_24px_rgba(0,0,0,0.2)] ${COLUMN_COLORS[status]}`}
      style={{ transition: 'background-color 0.2s ease, box-shadow 0.2s ease' }}
      data-column-status={status}
    >
      <div className="px-5 py-4 border-b border-app-border flex justify-between items-center bg-app-bg-secondary shrink-0">
        <h2 className="font-semibold tracking-wide text-app-text-primary text-sm">{title}</h2>
        <span className="bg-app-surface text-app-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-app-border">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0 custom-scrollbar">
        {tasks.length === 0 ? (
          <EmptyState 
            title={`No tasks in ${title}`} 
            message="Adjust filters to see tasks."
            className="h-full border-none bg-transparent"
          />
        ) : (
          <>
            {visibleTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {visibleCount < tasks.length && (
               <div className="text-center py-2 text-xs font-medium text-app-text-secondary">Rendering...</div>
            )}
            {status === 'done' && tasks.length > visibleTasks.length && (
              <button className="w-full mt-2 py-2.5 rounded-md border border-app-border bg-app-surface/50 text-app-text-secondary text-xs font-medium hover:bg-app-surface-hover hover:text-app-text-primary transition-colors">
                View all {tasks.length} completed &rarr;
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
