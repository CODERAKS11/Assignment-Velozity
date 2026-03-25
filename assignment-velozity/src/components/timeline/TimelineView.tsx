import { useMemo, useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useFilterContext } from '../../context/FilterContext';
import { TimelineBar } from './TimelineBar';
import { TodayMarker } from './TodayMarker';

export function TimelineView() {
  const { tasks } = useTaskContext();
//... skipped for replace brevity
// wait standard replacement cannot skip middle. I need to do full content or target properly.
  const { filters } = useFilterContext();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
      if (filters.assignees.length > 0 && !filters.assignees.includes(task.assigneeId)) return false;
      
      if (filters.dateRange) {
        if (!task.dueDate) return false;
        if (filters.dateRange.start && task.dueDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && task.dueDate > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      date: i + 1,
      dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
    };
  });

  const DAY_WIDTH = 40;
  const LABEL_WIDTH = 250;

  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    let timer: number;
    if (visibleCount < filteredTasks.length) {
      timer = window.requestAnimationFrame(() => {
        setVisibleCount((prev: number) => Math.min(prev + 20, filteredTasks.length));
      });
    }
    return () => window.cancelAnimationFrame(timer);
  }, [visibleCount, filteredTasks.length]);

  const visibleTasks = filteredTasks.slice(0, visibleCount);

  return (
    <div className="flex-1 flex flex-col bg-app-bg-primary overflow-hidden relative">
      <div className="flex-1 overflow-auto flex custom-scrollbar">
        {/* Left labels column */}
        <div className="sticky left-0 z-20 bg-app-bg-primary border-r border-app-border shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.5)]" style={{ width: LABEL_WIDTH }}>
          <div className="h-12 border-b border-app-border bg-app-surface flex items-center px-4">
            <span className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Task</span>
          </div>
          <div className="flex flex-col">
            {visibleTasks.map(task => (
              <div key={task.id} className="h-12 border-b border-app-border flex items-center px-4 overflow-hidden">
                <span className="text-[13px] text-app-text-primary truncate" title={task.title}>{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline scrollable area */}
        <div className="flex flex-col min-w-max relative" style={{ width: days.length * DAY_WIDTH }}>
          <div className="h-12 border-b border-app-border bg-app-surface flex sticky top-0 z-10 shrink-0">
            {days.map(d => (
              <div key={d.date} className="border-r border-app-border flex flex-col items-center justify-center shrink-0" style={{ width: DAY_WIDTH }}>
                <span className="text-[10px] text-app-text-secondary font-medium">{d.dayStr}</span>
                <span className="text-xs font-semibold text-app-text-primary">{d.date}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col relative flex-1">
            <TodayMarker year={year} month={month} />
            <div className="absolute inset-0 flex pointer-events-none">
              {days.map(d => (
                <div key={d.date} className="border-r border-app-border/50 h-full shrink-0" style={{ width: DAY_WIDTH }} />
              ))}
            </div>
            
            {visibleTasks.map(task => (
              <div key={task.id} className="h-12 border-b border-app-border/30 relative group hover:bg-app-surface-hover/50 shrink-0">
                 <TimelineBar task={task} year={year} month={month} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
