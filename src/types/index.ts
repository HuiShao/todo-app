export type Priority = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'in-progress' | 'completed';
export type GroupBy = 'none' | 'priority' | 'status' | 'date' | 'labels';
export type Theme = 'light' | 'dark';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  status: Status;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  listId: string;
}

export interface TodoList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  items: TodoItem[];
}

export interface FilterOptions {
  priority: Priority[];
  status: Status[];
  labels: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
}

export interface AppState {
  lists: TodoList[];
  activeListId: string | null;
  theme: Theme;
  groupBy: GroupBy;
  filters: FilterOptions;
  selectedItems: string[];
}

export interface ActionHistory {
  id: string;
  action: string;
  data: any;
  timestamp: Date;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: string;
}

export interface ExportData {
  lists: TodoList[];
  exportedAt: Date;
  version: string;
}