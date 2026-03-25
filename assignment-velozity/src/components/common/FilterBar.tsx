import { useFilterContext } from '../../context/FilterContext';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import type { Status, Priority } from '../../types';
import { USERS } from '../../utils/seedData';

const statusOptions: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'inreview', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

const priorityOptions: { id: Priority; label: string }[] = [
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export function FilterBar() {
  const { filters, dispatch } = useFilterContext();

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDateRange = filters.dateRange ? { ...filters.dateRange } : { start: '', end: '' };
    newDateRange[field] = value;
    
    if (!newDateRange.start && !newDateRange.end) {
      dispatch({ type: 'SET_DATE_RANGE', payload: null });
    } else {
      dispatch({ type: 'SET_DATE_RANGE', payload: newDateRange });
    }
  };

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.assignees.length > 0 || 
    filters.dateRange !== null;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-transparent p-0 mb-6 relative">
      <MultiSelectDropdown
        label="Status"
        options={statusOptions}
        selectedValues={filters.status}
        onChange={(val) => dispatch({ type: 'SET_STATUS_FILTER', payload: val })}
      />
      <MultiSelectDropdown
        label="Priority"
        options={priorityOptions}
        selectedValues={filters.priority}
        onChange={(val) => dispatch({ type: 'SET_PRIORITY_FILTER', payload: val })}
      />
      <MultiSelectDropdown
        label="Assignee"
        options={USERS.map(u => ({ id: u.id, label: u.name }))}
        selectedValues={filters.assignees}
        onChange={(val) => dispatch({ type: 'SET_ASSIGNEE_FILTER', payload: val })}
      />
      
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-app-text-secondary">Due Date:</label>
        <input 
          type="date"
          className="h-[26px] text-xs font-medium text-app-text-secondary bg-app-surface border border-app-border rounded-[5px] px-2 focus:outline-none focus:border-app-accent/50"
          value={filters.dateRange?.start || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />
        <span className="text-app-text-secondary font-medium text-xs">to</span>
        <input 
          type="date"
          className="h-[26px] text-xs font-medium text-app-text-secondary bg-app-surface border border-app-border rounded-[5px] px-2 focus:outline-none focus:border-app-accent/50"
          value={filters.dateRange?.end || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          className="ml-auto text-xs font-medium text-app-accent hover:text-app-accent-hover transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
