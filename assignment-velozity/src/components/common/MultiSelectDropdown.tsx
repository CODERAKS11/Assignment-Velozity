import { useState, useRef, useEffect, useCallback } from 'react';

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  options: { id: T; label: string }[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  className?: string;
}

export function MultiSelectDropdown<T extends string>({
  label,
  options,
  selectedValues,
  onChange,
  className = '',
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOption = useCallback((id: T) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  }, [selectedValues, onChange]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex justify-between items-center px-2.5 h-[26px] text-xs font-medium rounded-[5px] transition-colors focus:outline-none border ${
          selectedValues.length > 0 
            ? 'bg-app-accent/15 text-app-accent border-app-accent/30' 
            : 'bg-app-surface text-app-text-secondary border-app-border hover:bg-app-surface-hover'
        }`}
      >
        <span>
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </span>
        <svg className="-mr-1 ml-2 h-4 w-4 text-app-text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-app-bg-secondary border border-app-border ring-1 ring-black ring-opacity-5">
          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center px-4 py-2 text-xs text-app-text-secondary hover:bg-app-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="mr-3 h-3.5 w-3.5 rounded border-app-border bg-app-surface text-app-accent focus:ring-app-accent focus:ring-opacity-25 cursor-pointer"
                  checked={selectedValues.includes(opt.id)}
                  onChange={() => toggleOption(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-app-border bg-app-surface flex justify-between items-center rounded-b-md">
            <span className="text-xs font-medium text-app-text-secondary">{selectedValues.length} active</span>
            {selectedValues.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                className="text-xs font-semibold text-app-accent hover:text-app-accent-hover transition-colors"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
