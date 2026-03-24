export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
  currentTaskId?: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate?: string;
  dueDate: string;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignees: string[];
  dateRange: { start: string; end: string } | null;
}
