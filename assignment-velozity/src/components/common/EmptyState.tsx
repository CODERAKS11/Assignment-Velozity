import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className = '' }: EmptyStateProps) {
  const defaultIcon = (
    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl shadow-sm w-full max-w-md mx-auto ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-sm mt-1 leading-relaxed">{message}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
