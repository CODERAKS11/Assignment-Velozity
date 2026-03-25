import React, { useMemo } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useFilterContext } from '../../context/FilterContext';

export function TimelineView() {
  const { tasks } = useTaskContext();
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

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      <div className="flex-1 overflow-auto flex">
        {/* Left labels column */}
        <div className="sticky left-0 z-20 bg-white border-r border-gray-200 shrink-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)]" style={{ width: LABEL_WIDTH }}>
          <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center px-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</span>
          </div>
          <div className="flex flex-col">
            {filteredTasks.map(task => (
              <div key={task.id} className="h-12 border-b border-gray-100 flex items-center px-4 overflow-hidden">
                <span className="text-sm text-gray-800 truncate" title={task.title}>{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline scrollable area */}
        <div className="flex flex-col min-w-max relative" style={{ width: days.length * DAY_WIDTH }}>
          <div className="h-12 border-b border-gray-200 bg-gray-50 flex sticky top-0 z-10 shrink-0">
            {days.map(d => (
              <div key={d.date} className="border-r border-gray-200 flex flex-col items-center justify-center shrink-0" style={{ width: DAY_WIDTH }}>
                <span className="text-[10px] text-gray-400 font-medium">{d.dayStr}</span>
                <span className="text-xs font-semibold text-gray-700">{d.date}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col relative flex-1">
            <div className="absolute inset-0 flex pointer-events-none">
              {days.map(d => (
                <div key={d.date} className="border-r border-gray-100 h-full shrink-0" style={{ width: DAY_WIDTH }} />
              ))}
            </div>
            
            {filteredTasks.map(task => (
              <div key={task.id} className="h-12 border-b border-gray-50 relative group hover:bg-gray-50/50">
                 {/* Task bars will mount here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
