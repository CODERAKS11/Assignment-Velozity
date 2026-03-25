import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { FilterProvider } from './context/FilterContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { CollaborationProvider } from './context/CollaborationContext';
import { GlobalPresence } from './components/common/GlobalPresence';
import { GlobalAvatarLayer } from './components/common/GlobalAvatarLayer';
import { FilterBar } from './components/common/FilterBar';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-app-surface border border-app-border text-app-text-secondary hover:text-app-text-primary transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 7.757l.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<'kanban' | 'list' | 'timeline'>('kanban');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-app-bg-primary text-app-text-primary font-sans selection:bg-app-accent-soft">
      {/* Sidebar */}
      <aside className="w-[52px] shrink-0 bg-sidebar-bg border-r border-sidebar-border flex flex-col items-center py-4 z-20">
        <div className="flex flex-col gap-4 w-full">
          {/* Active icon slot */}
          <div className="w-full h-10 flex items-center justify-center relative cursor-pointer text-app-accent">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-app-accent rounded-r-md"></div>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          {/* Removed inactive slots to prevent AI-generated empty button appearance */}
        </div>
        <div className="mt-auto flex flex-col items-center gap-4">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-sidebar-bg relative cursor-pointer">
            AK
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-sidebar-bg"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-4 px-6 pb-2">
        <header className="flex flex-col md:flex-row justify-between items-center min-h-[40px] mb-6 shrink-0 gap-4 md:gap-0">
          <div className="w-full md:w-auto flex justify-start">
            <h1 className="text-[20px] font-bold text-app-text-primary tracking-tight">
              Project Tracker
            </h1>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto">
            <GlobalPresence />
            <div className="h-5 w-px bg-app-border hidden md:block"></div>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>
        
        <FilterBar />

        <main className="flex-1 bg-transparent overflow-hidden flex flex-col relative rounded-lg">
          {currentView === 'kanban' && <KanbanBoard />}
          {currentView === 'list' && <ListView />}
          {currentView === 'timeline' && <TimelineView />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <ThemeProvider>
        <CollaborationProvider>
          <FilterProvider>
            <GlobalAvatarLayer />
            <AppContent />
          </FilterProvider>
        </CollaborationProvider>
      </ThemeProvider>
    </TaskProvider>
  );
}

export default App;
