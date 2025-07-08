import { format, isToday, isTomorrow, isThisWeek, isPast, differenceInDays } from 'date-fns';

export const dateUtils = {
  // Format date for display
  formatDate: (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'MMM d, yyyy');
  },

  // Format date and time for display
  formatDateTime: (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'MMM d, yyyy h:mm a');
  },

  // Format date for input field
  formatDateForInput: (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  },

  // Format time for input field
  formatTimeForInput: (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'HH:mm');
  },

  // Get relative date description
  getRelativeDate: (date: Date | null): string => {
    if (!date) return '';
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    
    const days = differenceInDays(date, new Date());
    if (days > 0 && days <= 7) return `In ${days} days`;
    if (days < 0 && days >= -7) return `${Math.abs(days)} days ago`;
    
    return dateUtils.formatDate(date);
  },

  // Check if date is overdue
  isOverdue: (date: Date | null): boolean => {
    if (!date) return false;
    return isPast(date) && !isToday(date);
  },

  // Check if date is due soon (within 3 days)
  isDueSoon: (date: Date | null): boolean => {
    if (!date) return false;
    const days = differenceInDays(date, new Date());
    return days >= 0 && days <= 3;
  },

  // Get date category for grouping
  getDateCategory: (date: Date | null): 'today' | 'tomorrow' | 'this-week' | 'later' | 'overdue' | 'no-date' => {
    if (!date) return 'no-date';
    
    if (dateUtils.isOverdue(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isThisWeek(date)) return 'this-week';
    
    return 'later';
  },

  // Create date from date and time strings
  createDateTime: (dateString: string, timeString: string): Date => {
    const date = new Date(dateString);
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
    }
    return date;
  },

  // Get date range for filtering
  getDateRange: (range: 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'this-month'): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'tomorrow':
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + (6 - dayOfWeek));
        end.setHours(23, 59, 59, 999);
        break;
      case 'next-week':
        const nextWeekStart = start.getDate() + (7 - start.getDay());
        start.setDate(nextWeekStart);
        start.setHours(0, 0, 0, 0);
        end.setDate(nextWeekStart + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }
    
    return { start, end };
  },
};