import { useEffect } from 'react';
import type { FilterState, Status, Priority } from '../types';
import type { FilterAction } from '../reducers/filterReducer';
import { useSearchParams } from 'react-router-dom';

export function useURLSync(state: FilterState, dispatch: React.Dispatch<FilterAction>) {
  const [searchParams, setSearchParams] = useSearchParams();

  // On mount and URL change (like browser back), sync to state
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const assigneesParam = searchParams.get('assignees');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    if (statusParam) dispatch({ type: 'SET_STATUS_FILTER', payload: statusParam.split(',') as Status[] });
    if (priorityParam) dispatch({ type: 'SET_PRIORITY_FILTER', payload: priorityParam.split(',') as Priority[] });
    if (assigneesParam) dispatch({ type: 'SET_ASSIGNEE_FILTER', payload: assigneesParam.split(',') });
    if (startParam && endParam) dispatch({ type: 'SET_DATE_RANGE', payload: { start: startParam, end: endParam } });
    else if (!startParam && !endParam && state.dateRange) dispatch({ type: 'SET_DATE_RANGE', payload: null });
    
    // Check if URL is completely empty but state is not, implies we navigated back to empty filter
    if (!statusParam && state.status.length > 0) dispatch({ type: 'SET_STATUS_FILTER', payload: [] });
    if (!priorityParam && state.priority.length > 0) dispatch({ type: 'SET_PRIORITY_FILTER', payload: [] });
    if (!assigneesParam && state.assignees.length > 0) dispatch({ type: 'SET_ASSIGNEE_FILTER', payload: [] });
    
    // We intentionally don't put state in the deps array so this mainly responds to URL changes (like popstate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, dispatch]);

  // On state change, serialize to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (state.status.length > 0) params.set('status', state.status.join(','));
    if (state.priority.length > 0) params.set('priority', state.priority.join(','));
    if (state.assignees.length > 0) params.set('assignees', state.assignees.join(','));
    if (state.dateRange) {
      params.set('start', state.dateRange.start);
      params.set('end', state.dateRange.end);
    }
    
    // Only update if URL actually needs to change, preventing infinite loops
    setSearchParams(params, { replace: true });
  }, [state, setSearchParams]);
}
