import React from 'react';
import { cn } from '../../utils/cn';
import { Priority, Status } from '../../types';

interface BadgeProps {
  variant?: 'default' | 'priority' | 'status';
  priority?: Priority;
  status?: Status;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  priority,
  status,
  children,
  className,
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const getVariantClasses = () => {
    if (variant === 'priority' && priority) {
      switch (priority) {
        case 'high':
          return 'priority-high';
        case 'medium':
          return 'priority-medium';
        case 'low':
          return 'priority-low';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
    }
    
    if (variant === 'status' && status) {
      switch (status) {
        case 'pending':
          return 'status-pending';
        case 'in-progress':
          return 'status-in-progress';
        case 'completed':
          return 'status-completed';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
    }
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };
  
  return (
    <span className={cn(baseClasses, getVariantClasses(), className)}>
      {children}
    </span>
  );
};

export default Badge;