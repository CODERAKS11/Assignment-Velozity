type ViewType = 'kanban' | 'list' | 'timeline';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: { id: ViewType; label: string }[] = [
    { id: 'kanban', label: 'Kanban' },
    { id: 'list', label: 'List' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div className="flex bg-gray-100 p-1 rounded-md">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentView === view.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
