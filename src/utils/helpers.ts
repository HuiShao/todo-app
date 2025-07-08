import { v4 as uuidv4 } from 'uuid';
import { TodoItem, TodoList, Priority, Status } from '../types';

export const helpers = {
  // Generate unique ID
  generateId: (): string => uuidv4(),

  // Create new todo item
  createTodoItem: (
    title: string,
    listId: string,
    options: Partial<TodoItem> = {}
  ): TodoItem => ({
    id: helpers.generateId(),
    title,
    description: '',
    dueDate: null,
    priority: 'medium',
    status: 'pending',
    labels: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    listId,
    ...options,
  }),

  // Create new todo list
  createTodoList: (name: string): TodoList => ({
    id: helpers.generateId(),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
  }),

  // Sort items by priority
  sortByPriority: (items: TodoItem[]): TodoItem[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...items].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  },

  // Sort items by due date
  sortByDueDate: (items: TodoItem[]): TodoItem[] => {
    return [...items].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  },

  // Sort items by status
  sortByStatus: (items: TodoItem[]): TodoItem[] => {
    const statusOrder = { pending: 3, 'in-progress': 2, completed: 1 };
    return [...items].sort((a, b) => statusOrder[b.status] - statusOrder[a.status]);
  },

  // Sort items by creation date
  sortByCreatedDate: (items: TodoItem[]): TodoItem[] => {
    return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Filter items by search query
  filterBySearch: (items: TodoItem[], query: string): TodoItem[] => {
    if (!query.trim()) return items;
    
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.labels.some(label => label.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Filter items by priority
  filterByPriority: (items: TodoItem[], priorities: Priority[]): TodoItem[] => {
    if (priorities.length === 0) return items;
    return items.filter(item => priorities.includes(item.priority));
  },

  // Filter items by status
  filterByStatus: (items: TodoItem[], statuses: Status[]): TodoItem[] => {
    if (statuses.length === 0) return items;
    return items.filter(item => statuses.includes(item.status));
  },

  // Filter items by labels
  filterByLabels: (items: TodoItem[], labels: string[]): TodoItem[] => {
    if (labels.length === 0) return items;
    return items.filter(item =>
      labels.some(label => item.labels.includes(label))
    );
  },

  // Filter items by date range
  filterByDateRange: (items: TodoItem[], start: Date | null, end: Date | null): TodoItem[] => {
    if (!start && !end) return items;
    
    return items.filter(item => {
      if (!item.dueDate) return false;
      
      if (start && item.dueDate < start) return false;
      if (end && item.dueDate > end) return false;
      
      return true;
    });
  },

  // Get unique labels from items
  getUniqueLabels: (items: TodoItem[]): string[] => {
    const labels = new Set<string>();
    items.forEach(item => item.labels.forEach(label => labels.add(label)));
    return Array.from(labels).sort();
  },

  // Get completion percentage
  getCompletionPercentage: (items: TodoItem[]): number => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.status === 'completed').length;
    return Math.round((completed / items.length) * 100);
  },

  // Get priority color
  getPriorityColor: (priority: Priority): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // Get status color
  getStatusColor: (status: Status): string => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Truncate text
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Download file
  downloadFile: (content: string, filename: string, type: string = 'application/json'): void => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Copy to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },
};