import React, { useState, useRef, useEffect } from 'react';

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

  const toggleOption = (id: T) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </span>
        <svg className="-mr-1 ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedValues.includes(opt.id)}
                  onChange={() => toggleOption(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 mt-1 flex justify-between items-center rounded-b-md">
            <span className="text-xs font-medium text-gray-500">{selectedValues.length} active</span>
            {selectedValues.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
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
