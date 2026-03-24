export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  startDate: string | null;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dateFrom: string;
  dateTo: string;
}

export interface CollabUser {
    id : string;
    name : string;
    color : string;
    currentTaskId : string | null;
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';