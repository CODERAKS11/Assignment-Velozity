import { useState, useEffect } from 'react';
import type { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
}

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
      className="bg-slate-100 rounded-xl flex flex-col h-full overflow-hidden border border-slate-200 shadow-sm"
      style={{ transition: 'background-color 0.2s ease, box-shadow 0.2s ease' }}
      data-column-status={status}
    >
      <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
        <h2 className="font-semibold tracking-wide text-slate-800 text-sm uppercase">{title}</h2>
        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
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
               <div className="text-center py-2 text-xs font-medium text-slate-400">Rendering...</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
