import React, { useMemo } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useFilterContext } from '../../context/FilterContext';
import { KanbanColumn } from './KanbanColumn';
import { Status } from '../../types';

export function KanbanBoard() {
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

  const columns: { id: Status; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'inreview', title: 'In Review' },
    { id: 'done', title: 'Done' },
  ];

  return (
    <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
      {columns.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col.id);
        return <KanbanColumn key={col.id} status={col.id} title={col.title} tasks={colTasks} />;
      })}
    </div>
  );
}
