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
      // Only handle shortcuts when not typing in an input/textarea
      const target = event.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || 
                           target.tagName === 'TEXTAREA' || 
                           target.contentEditable === 'true';
      
      if ((event.ctrlKey || event.metaKey) && !isInputFocused) {
        switch (event.key.toLowerCase()) {
          case 'l': {
            event.preventDefault();
            // Create a new list directly (Ctrl+L)
            actions.createList(`New List ${state.lists.length + 1}`);
            break;
          }
          case 'd': {
            event.preventDefault();
            // Toggle dark/light theme (Ctrl+D)
            actions.setTheme(state.theme === 'light' ? 'dark' : 'light');
            break;
          }
          case 'k': {
            event.preventDefault();
            // Focus the search input (Ctrl+K - common in many apps)
            const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
            break;
          }
        }
      }
    };

    // Add event listener with capture to ensure it runs before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [actions, state.theme, state.lists.length]);

  return (
    <div className="h-screen flex flex-col">
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
