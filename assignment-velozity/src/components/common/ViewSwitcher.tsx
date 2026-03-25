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
    <div className="flex bg-app-surface p-1 rounded-[6px] border border-app-border">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`px-4 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors ${
            currentView === view.id
              ? 'bg-app-accent text-white shadow-[0_2px_8px_rgba(101,92,253,0.3)]'
              : 'text-app-text-secondary hover:text-app-text-primary'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
