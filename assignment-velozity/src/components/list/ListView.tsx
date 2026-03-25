import React, { useMemo, useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useFilterContext } from '../../context/FilterContext';
import { EmptyState } from '../common/EmptyState';
import { ListRow } from './ListRow';
import { SortableHeader } from './SortableHeader';
import type { SortField, SortDirection } from './SortableHeader';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import type { Priority } from '../../types';

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
  
  const listContainerRef = React.useRef<HTMLDivElement>(null);

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

  const { startIndex, endIndex, totalHeight, offsetY } = useVirtualScroll({
    itemCount: filteredTasks.length,
    rowHeight: 56,
    containerRef: listContainerRef
  });

  const virtualItems = filteredTasks.slice(startIndex, endIndex + 1);

  const handleSort = React.useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

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
              className="px-4 py-2 bg-app-accent/15 text-app-accent hover:bg-app-accent/25 rounded-[5px] text-sm font-medium transition-colors border border-app-accent/30"
            >
              Clear filters
            </button>
          ) : null}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-app-bg-primary overflow-hidden overflow-x-auto">
      <div className="min-w-[1000px] flex flex-col h-full bg-app-bg-primary">
        <div className="px-6 py-2 bg-app-bg-secondary border-b border-app-border text-xs text-app-text-secondary flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Note: You can click on column headers (like Task Title, Priority, Due Date) to sort tasks.
        </div>
        <div className="flex bg-app-bg-primary border-b-2 border-app-border sticky top-0 z-10 shrink-0 h-10 items-center">
          <div className="flex-1 min-w-0 px-6 py-0 text-left">
            <SortableHeader label="Task Title" field="title" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
          <div className="w-40 px-6 py-2 text-left">
            <span className="text-xs font-medium text-app-text-secondary uppercase tracking-wider select-none">Status</span>
          </div>
          <div className="w-32 px-6 py-2 text-left">
            <SortableHeader label="Priority" field="priority" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
          <div className="w-48 px-6 py-2 text-left">
            <span className="text-xs font-medium text-app-text-secondary uppercase tracking-wider select-none">Assignee</span>
          </div>
          <div className="w-32 px-6 py-2 text-left">
            <SortableHeader label="Due Date" field="dueDate" currentSortField={sortField} currentDirection={sortDirection} onSort={handleSort} />
          </div>
          <div className="w-32 px-6 py-2 text-left">
            <span className="text-xs font-medium text-app-text-secondary uppercase tracking-wider select-none">Start Date</span>
          </div>
          <div className="w-48 px-6 py-2 text-left">
            <span className="text-xs font-medium text-app-text-secondary uppercase tracking-wider select-none">Progress</span>
          </div>
        </div>
        
        <div 
          ref={listContainerRef}
          className="flex-1 overflow-y-auto w-full max-w-full relative"
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)`, willChange: 'transform' }}>
              {virtualItems.map(task => (
                <ListRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
