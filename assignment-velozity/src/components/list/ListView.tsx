import React, { useMemo, useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useFilterContext } from '../../context/FilterContext';
import { EmptyState } from '../common/EmptyState';
import { ListRow } from './ListRow';
import { SortableHeader, SortField, SortDirection } from './SortableHeader';
import { Priority } from '../../types';

const priorityOrder: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function ListView() {
  const { tasks } = useTaskContext();
  const { filters, dispatch: filterDispatch } = useFilterContext();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => {
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

    if (sortField) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === 'title') {
          cmp = a.title.localeCompare(b.title);
        } else if (sortField === 'priority') {
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortField === 'dueDate') {
          if (!a.dueDate && !b.dueDate) cmp = 0;
          else if (!a.dueDate) cmp = 1; // null sorts to end
          else if (!b.dueDate) cmp = -1;
          else cmp = a.dueDate.localeCompare(b.dueDate);
        }
        
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [tasks, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.assignees.length > 0 || 
    filters.dateRange !== null;

  if (filteredTasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState 
          title="No tasks found" 
          message="Adjust your filters or add new tasks."
          action={hasActiveFilters ? (
            <button 
              onClick={() => filterDispatch({ type: 'CLEAR_ALL' })}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
            >
              Clear filters
            </button>
          ) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden overflow-x-auto">
      <div className="min-w-[800px] flex flex-col h-full">
        <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex-1 min-w-0 px-6 py-3 text-left">
            <SortableHeader label="Task Title" field="title" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
          <div className="w-40 px-6 py-3 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Status</span>
          </div>
          <div className="w-32 px-6 py-3 text-left">
            <SortableHeader label="Priority" field="priority" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
          <div className="w-48 px-6 py-3 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider select-none">Assignee</span>
          </div>
          <div className="w-32 px-6 py-3 text-left">
            <SortableHeader label="Due Date" field="dueDate" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full max-w-full relative">
          {filteredTasks.map(task => (
            <ListRow key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
