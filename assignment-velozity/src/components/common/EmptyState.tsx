import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg ${className}`}>
      {icon && <div className="text-gray-400 mb-4 w-12 h-12 flex items-center justify-center">{icon}</div>}
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
