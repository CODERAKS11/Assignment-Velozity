import { createContext, useCallback, useContext, useMemo } from 'react';
import type { Dispatch, FC, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, Status, Priority } from '../types';
import { filterReducer } from '../reducers/filterReducer';
import type { FilterAction } from '../reducers/filterReducer';

interface FilterContextType {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<FilterState>(() => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const assigneesParam = searchParams.get('assignees');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    return {
      status: statusParam ? (statusParam.split(',') as Status[]) : [],
      priority: priorityParam ? (priorityParam.split(',') as Priority[]) : [],
      assignees: assigneesParam ? assigneesParam.split(',') : [],
      dateRange: startParam && endParam ? { start: startParam, end: endParam } : null,
    };
  }, [searchParams]);

  const dispatch = useCallback((action: FilterAction) => {
    const nextState = filterReducer(filters, action);
    
    const params = new URLSearchParams();
    if (nextState.status.length > 0) params.set('status', nextState.status.join(','));
    if (nextState.priority.length > 0) params.set('priority', nextState.priority.join(','));
    if (nextState.assignees.length > 0) params.set('assignees', nextState.assignees.join(','));
    if (nextState.dateRange) {
      params.set('start', nextState.dateRange.start);
      params.set('end', nextState.dateRange.end);
    }
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  return (
    <FilterContext.Provider value={{ filters, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
