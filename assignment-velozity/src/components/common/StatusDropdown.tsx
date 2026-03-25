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
  todo: 'bg-[#655CFD]/15 text-[#655CFD] border-[#655CFD]/30',
  inprogress: 'bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30',
  inreview: 'bg-[#eab308]/15 text-[#eab308] border-[#eab308]/30',
  done: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30',
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
        className={`inline-flex justify-between items-center w-full px-2.5 py-1 text-xs font-semibold rounded-[5px] transition-colors focus:outline-none border ${statusColors[status]} ${className}`}
      >
        <span>{statusLabels[status]}</span>
        <svg className="-mr-1 ml-2 h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-40 rounded-md shadow-lg bg-app-bg-secondary border border-app-border ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {allStatuses.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium transition-colors ${opt === status ? 'bg-app-surface text-app-text-primary' : 'text-app-text-secondary hover:bg-app-surface-hover hover:text-app-text-primary'}`}
                role="menuitem"
              >
                {statusLabels[opt]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
