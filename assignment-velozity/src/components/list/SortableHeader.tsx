export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSortField: SortField | null;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortableHeader({ label, field, currentSortField, currentDirection, onSort, className = '' }: SortableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <div 
      className={`text-xs font-medium text-app-text-secondary uppercase tracking-wider cursor-pointer hover:text-app-text-primary group select-none flex items-center gap-1 ${className}`}
      onClick={() => onSort(field)}
      role="columnheader"
    >
      {label}
      <span className={`text-app-text-secondary ${isActive ? 'opacity-100 text-app-accent' : 'opacity-0 group-hover:opacity-100'}`}>
        {isActive ? (currentDirection === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </div>
  );
}
