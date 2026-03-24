import React, { createContext, useReducer, useContext, FC, ReactNode } from 'react';
import { FilterState } from '../types';
import { filterReducer, initialFilterState, FilterAction } from '../reducers/filterReducer';

interface FilterContextType {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

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
