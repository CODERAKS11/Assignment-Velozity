import React from 'react';
import { useFilterContext } from '../../context/FilterContext';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { Status, Priority } from '../../types';
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
    let newDateRange = filters.dateRange ? { ...filters.dateRange } : { start: '', end: '' };
    newDateRange[field] = value;
    
    if (!newDateRange.start && !newDateRange.end) {
      dispatch({ type: 'SET_DATE_RANGE', payload: null });
    } else {
      dispatch({ type: 'SET_DATE_RANGE', payload: newDateRange });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
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
        <label className="text-sm font-medium text-gray-700">Due Date:</label>
        <input 
          type="date"
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          value={filters.dateRange?.start || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />
        <span className="text-gray-500 font-medium text-sm">to</span>
        <input 
          type="date"
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
          value={filters.dateRange?.end || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>
    </div>
  );
}
