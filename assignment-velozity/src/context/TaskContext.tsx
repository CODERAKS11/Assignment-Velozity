import React, { createContext, useReducer, useContext, FC, ReactNode } from 'react';
import { Task } from '../types';
import { taskReducer, TaskAction } from '../reducers/taskReducer';
import { INITIAL_TASKS } from '../utils/seedData';

interface TaskContextType {
  tasks: Task[];
  dispatch: React.Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, INITIAL_TASKS);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
