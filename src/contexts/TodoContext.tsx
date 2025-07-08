import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TodoItem, TodoList, AppState, FilterOptions, Priority, Status, GroupBy, Theme } from '../types';
import { storage } from '../utils/localStorage';
import { helpers } from '../utils/helpers';

interface TodoContextType {
  state: AppState;
  dispatch: React.Dispatch<TodoAction>;
  actions: {
    createList: (name: string) => void;
    deleteList: (id: string) => void;
    updateList: (id: string, updates: Partial<TodoList>) => void;
    setActiveList: (id: string) => void;
    createTodoItem: (title: string, listId: string, options?: Partial<TodoItem>) => void;
    updateTodoItem: (id: string, updates: Partial<TodoItem>) => void;
    deleteTodoItem: (id: string) => void;
    toggleTodoStatus: (id: string) => void;
    setTheme: (theme: Theme) => void;
    setGroupBy: (groupBy: GroupBy) => void;
    setFilters: (filters: Partial<FilterOptions>) => void;
    clearFilters: () => void;
    selectItems: (ids: string[]) => void;
    bulkUpdateItems: (ids: string[], updates: Partial<TodoItem>) => void;
    bulkDeleteItems: (ids: string[]) => void;
    reorderItems: (listId: string, startIndex: number, endIndex: number) => void;
    exportData: () => void;
    importData: (data: any) => boolean;
  };
}

type TodoAction =
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'CREATE_LIST'; payload: TodoList }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'UPDATE_LIST'; payload: { id: string; updates: Partial<TodoList> } }
  | { type: 'SET_ACTIVE_LIST'; payload: string }
  | { type: 'CREATE_TODO_ITEM'; payload: TodoItem }
  | { type: 'UPDATE_TODO_ITEM'; payload: { id: string; updates: Partial<TodoItem> } }
  | { type: 'DELETE_TODO_ITEM'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_GROUP_BY'; payload: GroupBy }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SELECT_ITEMS'; payload: string[] }
  | { type: 'BULK_UPDATE_ITEMS'; payload: { ids: string[]; updates: Partial<TodoItem> } }
  | { type: 'BULK_DELETE_ITEMS'; payload: string[] }
  | { type: 'REORDER_ITEMS'; payload: { listId: string; startIndex: number; endIndex: number } };

const initialState: AppState = {
  lists: [],
  activeListId: null,
  theme: 'light',
  groupBy: 'none',
  filters: {
    priority: [],
    status: [],
    labels: [],
    dateRange: { start: null, end: null },
    searchQuery: '',
  },
  selectedItems: [],
};

const todoReducer = (state: AppState, action: TodoAction): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'CREATE_LIST':
      return {
        ...state,
        lists: [...state.lists, action.payload],
        activeListId: action.payload.id,
      };

    case 'DELETE_LIST':
      const newLists = state.lists.filter(list => list.id !== action.payload);
      return {
        ...state,
        lists: newLists,
        activeListId: state.activeListId === action.payload
          ? (newLists[0]?.id || null)
          : state.activeListId,
      };

    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, ...action.payload.updates, updatedAt: new Date() }
            : list
        ),
      };

    case 'SET_ACTIVE_LIST':
      return { ...state, activeListId: action.payload };

    case 'CREATE_TODO_ITEM':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.listId
            ? { ...list, items: [...list.items, action.payload], updatedAt: new Date() }
            : list
        ),
      };

    case 'UPDATE_TODO_ITEM':
      return {
        ...state,
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === action.payload.id
              ? { ...item, ...action.payload.updates, updatedAt: new Date() }
              : item
          ),
          updatedAt: list.items.some(item => item.id === action.payload.id) ? new Date() : list.updatedAt,
        })),
      };

    case 'DELETE_TODO_ITEM':
      return {
        ...state,
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.filter(item => item.id !== action.payload),
          updatedAt: list.items.some(item => item.id === action.payload) ? new Date() : list.updatedAt,
        })),
        selectedItems: state.selectedItems.filter(id => id !== action.payload),
      };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_GROUP_BY':
      return { ...state, groupBy: action.payload };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          priority: [],
          status: [],
          labels: [],
          dateRange: { start: null, end: null },
          searchQuery: '',
        },
      };

    case 'SELECT_ITEMS':
      return { ...state, selectedItems: action.payload };

    case 'BULK_UPDATE_ITEMS':
      return {
        ...state,
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            action.payload.ids.includes(item.id)
              ? { ...item, ...action.payload.updates, updatedAt: new Date() }
              : item
          ),
          updatedAt: list.items.some(item => action.payload.ids.includes(item.id)) ? new Date() : list.updatedAt,
        })),
        selectedItems: [],
      };

    case 'BULK_DELETE_ITEMS':
      return {
        ...state,
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.filter(item => !action.payload.includes(item.id)),
          updatedAt: list.items.some(item => action.payload.includes(item.id)) ? new Date() : list.updatedAt,
        })),
        selectedItems: [],
      };

    case 'REORDER_ITEMS':
      return {
        ...state,
        lists: state.lists.map(list => {
          if (list.id !== action.payload.listId) return list;
          
          const items = [...list.items];
          const [reorderedItem] = items.splice(action.payload.startIndex, 1);
          items.splice(action.payload.endIndex, 0, reorderedItem);
          
          return { ...list, items, updatedAt: new Date() };
        }),
      };

    default:
      return state;
  }
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = storage.loadAppState();
    const savedTheme = storage.loadTheme();
    
    if (savedState) {
      dispatch({ type: 'SET_STATE', payload: savedState });
    }
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme as Theme });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    storage.saveAppState(state);
  }, [state.lists, state.activeListId, state.groupBy, state.filters]);

  // Save theme separately
  useEffect(() => {
    storage.saveTheme(state.theme);
    
    // Apply theme to document
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const actions = {
    createList: (name: string) => {
      const newList = helpers.createTodoList(name);
      dispatch({ type: 'CREATE_LIST', payload: newList });
    },

    deleteList: (id: string) => {
      dispatch({ type: 'DELETE_LIST', payload: id });
    },

    updateList: (id: string, updates: Partial<TodoList>) => {
      dispatch({ type: 'UPDATE_LIST', payload: { id, updates } });
    },

    setActiveList: (id: string) => {
      dispatch({ type: 'SET_ACTIVE_LIST', payload: id });
    },

    createTodoItem: (title: string, listId: string, options?: Partial<TodoItem>) => {
      const newItem = helpers.createTodoItem(title, listId, options);
      dispatch({ type: 'CREATE_TODO_ITEM', payload: newItem });
    },

    updateTodoItem: (id: string, updates: Partial<TodoItem>) => {
      dispatch({ type: 'UPDATE_TODO_ITEM', payload: { id, updates } });
    },

    deleteTodoItem: (id: string) => {
      dispatch({ type: 'DELETE_TODO_ITEM', payload: id });
    },

    toggleTodoStatus: (id: string) => {
      const allItems = state.lists.flatMap(list => list.items);
      const item = allItems.find(item => item.id === id);
      if (item) {
        const newStatus: Status = item.status === 'completed' ? 'pending' : 'completed';
        dispatch({ type: 'UPDATE_TODO_ITEM', payload: { id, updates: { status: newStatus } } });
      }
    },

    setTheme: (theme: Theme) => {
      dispatch({ type: 'SET_THEME', payload: theme });
    },

    setGroupBy: (groupBy: GroupBy) => {
      dispatch({ type: 'SET_GROUP_BY', payload: groupBy });
    },

    setFilters: (filters: Partial<FilterOptions>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    },

    clearFilters: () => {
      dispatch({ type: 'CLEAR_FILTERS' });
    },

    selectItems: (ids: string[]) => {
      dispatch({ type: 'SELECT_ITEMS', payload: ids });
    },

    bulkUpdateItems: (ids: string[], updates: Partial<TodoItem>) => {
      dispatch({ type: 'BULK_UPDATE_ITEMS', payload: { ids, updates } });
    },

    bulkDeleteItems: (ids: string[]) => {
      dispatch({ type: 'BULK_DELETE_ITEMS', payload: ids });
    },

    reorderItems: (listId: string, startIndex: number, endIndex: number) => {
      dispatch({ type: 'REORDER_ITEMS', payload: { listId, startIndex, endIndex } });
    },

    exportData: () => {
      const data = storage.exportData();
      if (data) {
        const jsonString = JSON.stringify(data, null, 2);
        const filename = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        helpers.downloadFile(jsonString, filename);
      }
    },

    importData: (data: any): boolean => {
      const success = storage.importData(data);
      if (success) {
        const newState = storage.loadAppState();
        if (newState) {
          dispatch({ type: 'SET_STATE', payload: newState });
        }
      }
      return success;
    },
  };

  return (
    <TodoContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </TodoContext.Provider>
  );
};