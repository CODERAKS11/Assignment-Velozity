import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Sarah Jenkins', color: '#3b82f6' },
  { id: 'u2', name: 'Michael Chang', color: '#10b981' },
  { id: 'u3', name: 'Elena Rodriguez', color: '#8b5cf6' },
  { id: 'u4', name: 'David Kim', color: '#f59e0b' },
  { id: 'u5', name: 'Priya Patel', color: '#ec4899' },
  { id: 'u6', name: 'James Wilson', color: '#06b6d4' },
  { id: 'u7', name: 'Anita Singh', color: '#ef4444' },
];

const REALISTIC_TITLES = [
  'Fix Safari date parsing regression',
  'Add keyboard nav to custom dropdowns',
  'Virtualised list — fix blank row bug',
  'URL-sync filter state via useSearchParams',
  'Gantt bar width off-by-one on month end',
  'Implement drag & drop Kanban system',
  'Build virtual scrolling from scratch',
  'Redesign landing page hero section',
  'Set up CI/CD pipeline for staging',
  'Mobile responsive nav component',
  'Lighthouse performance score 85+',
  'Update API documentation v2.4',
  'Connect WebSocket live collaboration',
  'Zustand store architecture setup',
  'Design system tokens & color scale',
  'Migrate legacy Auth0 pipeline to OAuth2',
  'Optimize Redis caching strategy for dashboard',
  'Stripe webhooks unhandled exception bug',
  'React Router v7 loaders data hydration',
  'Resolve memory leaks in socket multiplexer'
];

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

    const title = getRandomItem(REALISTIC_TITLES);

    tasks.push({
      id: `task-${i + 1}`,
      title,
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
