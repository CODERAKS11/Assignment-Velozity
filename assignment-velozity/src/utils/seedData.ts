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

const PREFIXES = ['[CORE]', '[UI/UX]', '[API]', '[OPS]', '[DB]', '[SEC]', ''];
const ACTIONS = ['Optimize', 'Migrate', 'Refactor', 'Deprecate', 'Integrate', 'Investigate', 'Resolve', 'Implement', 'Audit', 'Standardize'];
const SUBJECTS = [
  'Redis caching strategy', 'legacy Auth0 pipeline', 'Stripe webhooks handling', 
  'React Router v7 loaders', 'GraphQL resolvers', 'E2E test suite', 
  'Docker compose configuration', 'S3 upload streams', 'Figma design tokens', 
  'OAuth2 refresh flows', 'memory leaks in websockets', 'CSS payload chunking'
];
const CONTEXTS = [
  'for Q3 compliance', 'in reporting dashboard', 'causing unhandled exceptions', 
  'to improve LCP metrics', 'to reduce database load', 'across staging environments',
  'for mobile responsive views', 'to resolve client escalation', ''
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

    const prefix = Math.random() > 0.4 ? getRandomItem(PREFIXES) : '';
    const title = `${prefix ? prefix + ' ' : ''}${getRandomItem(ACTIONS)} ${getRandomItem(SUBJECTS)} ${getRandomItem(CONTEXTS)}`.trim();

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
