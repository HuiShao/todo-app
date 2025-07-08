import type { AppState, ExportData } from '../types';

const STORAGE_KEY = 'todo-app-data';
const THEME_KEY = 'todo-app-theme';
const HISTORY_KEY = 'todo-app-history';

export const storage = {
  // Save app state to localStorage
  saveAppState: (state: Partial<AppState>): void => {
    try {
      const existingData = localStorage.getItem(STORAGE_KEY);
      const currentState = existingData ? JSON.parse(existingData) : {};
      
      const updatedState = {
        ...currentState,
        ...state,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Load app state from localStorage
  loadAppState: (): Partial<AppState> | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      if (parsed.lists) {
        parsed.lists = parsed.lists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt),
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
          })),
        }));
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  // Save theme preference
  saveTheme: (theme: string): void => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  // Load theme preference
  loadTheme: (): string | null => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      console.error('Error loading theme:', error);
      return null;
    }
  },

  // Save action history for undo/redo
  saveHistory: (history: any[]): void => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  },

  // Load action history
  loadHistory: (): any[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  // Export data
  exportData: (): ExportData | null => {
    try {
      const state = storage.loadAppState();
      if (!state || !state.lists) return null;
      
      return {
        lists: state.lists,
        exportedAt: new Date(),
        version: '1.0.0',
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  },

  // Import data
  importData: (data: ExportData): boolean => {
    try {
      if (!data.lists || !Array.isArray(data.lists)) {
        throw new Error('Invalid data format');
      }
      
      // Validate data structure
      const validLists = data.lists.filter(list => 
        list.id && list.name && list.items && Array.isArray(list.items)
      );
      
      if (validLists.length === 0) {
        throw new Error('No valid lists found');
      }
      
      storage.saveAppState({ lists: validLists });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  // Get storage usage
  getStorageUsage: (): { used: number; total: number; percentage: number } => {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || '';
      const used = new Blob([data]).size;
      const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
      
      return {
        used,
        total,
        percentage: (used / total) * 100,
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, total: 0, percentage: 0 };
    }
  },
};