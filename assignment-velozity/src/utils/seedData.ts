import { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Smith', color: '#fca5a5' },
  { id: 'u2', name: 'Bob Jones', color: '#93c5fd' },
  { id: 'u3', name: 'Charlie Brown', color: '#86efac' },
  { id: 'u4', name: 'Diana Prince', color: '#fdba74' },
  { id: 'u5', name: 'Evan Wright', color: '#c4b5fd' },
  { id: 'u6', name: 'Fiona Gallagher', color: '#f9a8d4' },
];

const VERBS = ['Implement', 'Fix', 'Review', 'Update', 'Design', 'Refactor', 'Test', 'Deploy', 'Research', 'Document', 'Optimize', 'Configure', 'Integrate', 'Remove', 'Add', 'Write', 'Migrate', 'Audit', 'Create', 'Debug'];
const NOUNS = ['API', 'Database', 'Component', 'Service', 'UI', 'Backend', 'Frontend', 'Pipeline', 'Documentation', 'Middleware', 'Schema', 'Dependencies', 'Tests', 'Configuration', 'Auth', 'Security', 'Endpoints', 'Cache', 'Logs', 'Metrics'];
const CONTEXTS = ['for production', 'in staging', 'for client feature', 'urgently', 'asap', 'for next release', 'for mobile app', 'for web portal', 'for legacy system', 'for compliance'];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function generateSeedData(count: number = 500): Task[] {
  const tasks: Task[] = [];
  
  for (let i = 0; i < count; i++) {
    const isNoStartDate = Math.random() < 0.1;
    const isPastDue = Math.random() < 0.15;
    const isDueToday = Math.random() < 0.05;
    
    let dueDateOffset = Math.floor(Math.random() * 28) - 14; 
    
    // Enforce guarantees
    if (isPastDue) {
      dueDateOffset = -1 * (Math.floor(Math.random() * 14) + 1);
    } else if (isDueToday) {
      dueDateOffset = 0;
    } else {
      dueDateOffset = Math.floor(Math.random() * 14) + 1;
    }
    
    const dueDateStr = generateDate(dueDateOffset);
    let startDateStr: string | undefined;
    
    if (!isNoStartDate) {
      const startDateOffset = dueDateOffset - (Math.floor(Math.random() * 7) + 1);
      startDateStr = generateDate(startDateOffset);
    }

    tasks.push({
      id: `task-${i + 1}`,
      title: `${getRandomItem(VERBS)} ${getRandomItem(NOUNS)} ${getRandomItem(CONTEXTS)}`,
      assigneeId: getRandomItem(USERS).id,
      priority: getRandomItem(PRIORITIES),
      status: getRandomItem(STATUSES),
      startDate: startDateStr,
      dueDate: dueDateStr,
    });
  }
  
  return tasks;
}

export const INITIAL_TASKS = generateSeedData();
