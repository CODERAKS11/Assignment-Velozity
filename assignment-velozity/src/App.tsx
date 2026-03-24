import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { FilterProvider, useFilterContext } from './context/FilterContext';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { useURLSync } from './hooks/useURLSync';
import { KanbanBoard } from './components/kanban/KanbanBoard';

function URLSyncManager() {
  const { filters, dispatch } = useFilterContext();
  useURLSync(filters, dispatch);
  return null;
}

function App() {
  const [currentView, setCurrentView] = useState<'kanban' | 'list' | 'timeline'>('kanban');

  return (
    <TaskProvider>
      <FilterProvider>
        <URLSyncManager />
        <div className="h-screen flex flex-col pt-4 px-4 bg-gray-50 pb-4">
          <header className="flex justify-between items-center mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">Project Tracker</h1>
            <div className="flex items-center gap-4">
              <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </header>
          
          <main className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col relative">
            {currentView === 'kanban' && <KanbanBoard />}
            {currentView === 'list' && <div className="p-8 text-center text-gray-500">List View</div>}
            {currentView === 'timeline' && <div className="p-8 text-center text-gray-500">Timeline View</div>}
          </main>
        </div>
      </FilterProvider>
    </TaskProvider>
  );
}

export default App;
