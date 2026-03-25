import { Task } from '../../types';

interface TimelineBarProps {
  task: Task;
  year: number;
  month: number;
}

const DAY_WIDTH = 40;

export function TimelineBar({ task, year, month }: TimelineBarProps) {
  if (!task.dueDate) return null;

  const getDayOffset = (dateStr: string) => {
    const parts = dateStr.includes('T') ? dateStr.split('T')[0].split('-') : dateStr.split('-');
    const taskYear = parseInt(parts[0], 10);
    const taskMonth = parseInt(parts[1], 10) - 1;
    const taskDay = parseInt(parts[2], 10);

    const targetDate = new Date(taskYear, taskMonth, taskDay);
    const startOfMonth = new Date(year, month, 1);
    
    const diffTime = targetDate.getTime() - startOfMonth.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const endOffset = getDayOffset(task.dueDate);
  const startOffset = task.startDate ? getDayOffset(task.startDate) : endOffset;
  
  const left = Math.max(0, startOffset) * DAY_WIDTH;
  const rawWidth = (endOffset - startOffset + 1) * DAY_WIDTH;
  const width = startOffset < 0 ? rawWidth + (startOffset * DAY_WIDTH) : rawWidth;
  
  if (width <= 0 && startOffset < 0) return null;
  
  const priorityColors = {
    critical: 'bg-red-400 border-red-500',
    high: 'bg-orange-400 border-orange-500',
    medium: 'bg-yellow-400 border-yellow-500',
    low: 'bg-green-400 border-green-500',
  };

  if (!task.startDate) {
    return (
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border shadow-sm ${priorityColors[task.priority]}`}
        style={{ left: `${endOffset * DAY_WIDTH + (DAY_WIDTH / 2) - 6}px` }}
        title={`${task.title} (Due: ${task.dueDate})`}
      />
    );
  }

  return (
    <div 
      className={`absolute top-3 h-6 rounded-md border shadow-sm opacity-90 hover:opacity-100 transition-opacity ${priorityColors[task.priority]}`}
      style={{ left: `${left}px`, width: `${Math.max(4, width)}px` }}
      title={`${task.title}\nStart: ${task.startDate}\nDue: ${task.dueDate}`}
    />
  );
}
