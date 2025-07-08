import React, { useEffect } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import TodoListView from './components/TodoList/TodoListView';
import { useTodo } from './contexts/TodoContext';

const AppContent: React.FC = () => {
  const { state, actions } = useTodo();

  useEffect(() => {
    // Create a default list if none exists
    if (state.lists.length === 0) {
      actions.createList('My Tasks');
    }
  }, [state.lists.length, actions]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            // This would trigger new list creation
            break;
          case 't':
            event.preventDefault();
            actions.setTheme(state.theme === 'light' ? 'dark' : 'light');
            break;
          case 'f':
            event.preventDefault();
            // This would focus the search input
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions, state.theme]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <TodoListView />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;