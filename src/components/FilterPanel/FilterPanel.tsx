import React, { useState, useEffect } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import type { Priority, Status } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FiX, FiFilter } from 'react-icons/fi';
import { helpers } from '../../utils/helpers';

interface FilterPanelProps {
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { state, actions } = useTodo();
  const [localFilters, setLocalFilters] = useState(state.filters);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);

  useEffect(() => {
    const activeList = state.lists.find(list => list.id === state.activeListId);
    if (activeList) {
      setAvailableLabels(helpers.getUniqueLabels(activeList.items));
    }
  }, [state.lists, state.activeListId]);

  const handlePriorityChange = (priority: Priority) => {
    setLocalFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  const handleStatusChange = (status: Status) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleLabelChange = (label: string) => {
    setLocalFilters(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label],
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value ? new Date(value) : null,
      },
    }));
  };

  const handleApplyFilters = () => {
    actions.setFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priority: [],
      status: [],
      labels: [],
      dateRange: { start: null, end: null },
      searchQuery: '',
    };
    setLocalFilters(clearedFilters);
    actions.clearFilters();
  };

  const hasActiveFilters = localFilters.priority.length > 0 ||
    localFilters.status.length > 0 ||
    localFilters.labels.length > 0 ||
    localFilters.dateRange.start ||
    localFilters.dateRange.end;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <FiFilter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <FiX className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <div className="space-y-2">
            {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
              <label key={priority} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.priority.includes(priority)}
                  onChange={() => handlePriorityChange(priority)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {(['pending', 'in-progress', 'completed'] as Status[]).map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {status.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Labels Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Labels
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableLabels.length > 0 ? (
              availableLabels.map((label) => (
                <label key={label} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.labels.includes(label)}
                    onChange={() => handleLabelChange(label)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No labels available
              </p>
            )}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date Range
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="Start date"
              value={localFilters.dateRange.start ? 
                localFilters.dateRange.start.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
            <Input
              type="date"
              placeholder="End date"
              value={localFilters.dateRange.end ? 
                localFilters.dateRange.end.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear All
            </Button>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
