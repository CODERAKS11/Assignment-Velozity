import { Task, Status } from '../types';

export type TaskAction = 
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPDATE_STATUS'; payload: { taskId: string; newStatus: Status } };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'UPDATE_STATUS':
      return state.map(task => 
        task.id === action.payload.taskId 
          ? { ...task, status: action.payload.newStatus } 
          : task
      );
    default:
      return state;
  }
}
