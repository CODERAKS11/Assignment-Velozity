import { useState, useRef, useEffect } from 'react';
import type { Status } from '../../types';

interface StatusDropdownProps {
  status: Status;
  onChange: (newStatus: Status) => void;
  className?: string;
}

const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  inreview: 'In Review',
  done: 'Done',
};

const statusColors: Record<Status, string> = {
  todo: 'bg-status-todo',
  inprogress: 'bg-status-inprogress',
  inreview: 'bg-status-inreview',
  done: 'bg-status-done',
};

export function StatusDropdown({ status, onChange, className = '' }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const allStatuses: Status[] = ['todo', 'inprogress', 'inreview', 'done'];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[status]}`}></span>
          {statusLabels[status]}
        </span>
        <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {allStatuses.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${opt === status ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                role="menuitem"
              >
                <span className={`w-2 h-2 rounded-full ${statusColors[opt]}`}></span>
                {statusLabels[opt]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
