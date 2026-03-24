import type { FilterState, Status, Priority } from '../types';

export type FilterAction = 
  | { type: 'SET_STATUS_FILTER'; payload: Status[] }
  | { type: 'SET_PRIORITY_FILTER'; payload: Priority[] }
  | { type: 'SET_ASSIGNEE_FILTER'; payload: string[] }
  | { type: 'SET_DATE_RANGE'; payload: { start: string; end: string } | null }
  | { type: 'CLEAR_ALL' };

export const initialFilterState: FilterState = {
  status: [],
  priority: [],
  assignees: [],
  dateRange: null,
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_STATUS_FILTER':
      return { ...state, status: action.payload };
    case 'SET_PRIORITY_FILTER':
      return { ...state, priority: action.payload };
    case 'SET_ASSIGNEE_FILTER':
      return { ...state, assignees: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'CLEAR_ALL':
      return initialFilterState;
    default:
      return state;
  }
}
