import React, { useState, useMemo } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { FiPlus, FiSearch, FiFilter, FiList as FiListIcon } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import TodoItemForm from '../TodoItem/TodoItemForm';
import FilterPanel from '../FilterPanel/FilterPanel';
import GroupPanel from '../GroupPanel/GroupPanel';
import { helpers } from '../../utils/helpers';
import { dateUtils } from '../../utils/dateUtils';
import type { TodoItem as TodoItemType, GroupBy } from '../../types';

const TodoListView: React.FC = () => {
  const { state, actions } = useTodo();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(state.filters.searchQuery);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const activeList = state.lists.find(list => list.id === state.activeListId);

  const debouncedSearch = useMemo(
    () => helpers.debounce((query: string) => {
      actions.setFilters({ searchQuery: query });
    }, 300),
    [actions]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const filteredItems = useMemo(() => {
    if (!activeList) return [];
    
    let items = [...activeList.items];
    
    // Apply search filter
    if (state.filters.searchQuery) {
      items = helpers.filterBySearch(items, state.filters.searchQuery);
    }
    
    // Apply priority filter
    if (state.filters.priority.length > 0) {
      items = helpers.filterByPriority(items, state.filters.priority);
    }
    
    // Apply status filter
    if (state.filters.status.length > 0) {
      items = helpers.filterByStatus(items, state.filters.status);
    }
    
    // Apply labels filter
    if (state.filters.labels.length > 0) {
      items = helpers.filterByLabels(items, state.filters.labels);
    }
    
    // Apply date range filter
    if (state.filters.dateRange.start || state.filters.dateRange.end) {
      items = helpers.filterByDateRange(items, state.filters.dateRange.start, state.filters.dateRange.end);
    }
    
    return items;
  }, [activeList, state.filters]);

  const groupedItems = useMemo(() => {
    if (state.groupBy === 'none') {
      return { 'All Items': filteredItems };
    }
    
    const groups: { [key: string]: TodoItemType[] } = {};
    
    filteredItems.forEach(item => {
      let groupKey = '';
      
      switch (state.groupBy) {
        case 'priority':
          groupKey = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
          break;
        case 'status':
          groupKey = item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ');
          break;
        case 'labels':
          if (item.labels.length === 0) {
            groupKey = 'No Labels';
          } else {
            item.labels.forEach(label => {
              if (!groups[label]) groups[label] = [];
              groups[label].push(item);
            });
            return;
          }
          break;
        case 'date':
          groupKey = dateUtils.getDateCategory(item.dueDate);
          groupKey = groupKey.charAt(0).toUpperCase() + groupKey.slice(1).replace('-', ' ');
          break;
        default:
          groupKey = 'All Items';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    
    return groups;
  }, [filteredItems, state.groupBy]);

  const handleSelectItem = (itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = () => {
    const allItemIds = filteredItems.map(item => item.id);
    setSelectedItems(allItemIds);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkStatusChange = (status: string) => {
    actions.bulkUpdateItems(selectedItems, { status: status as any });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (confirm('Are you sure you want to delete the selected items?')) {
      actions.bulkDeleteItems(selectedItems);
      setSelectedItems([]);
    }
  };

  if (!activeList) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FiListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No List Selected
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Select a list from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeList.name}
            </h1>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                leftIcon={<FiSearch className="w-4 h-4 text-gray-400" />}
              />
            </div>
            
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary-100 dark:bg-primary-900' : ''}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Select
              value={state.groupBy}
              onChange={(e) => actions.setGroupBy(e.target.value as GroupBy)}
              options={[
                { value: 'none', label: 'No Grouping' },
                { value: 'priority', label: 'By Priority' },
                { value: 'status', label: 'By Status' },
                { value: 'labels', label: 'By Labels' },
                { value: 'date', label: 'By Date' },
              ]}
            />
          </div>
        </div>

        {showFilters && (
          <FilterPanel onClose={() => setShowFilters(false)} />
        )}

        {selectedItems.length > 0 && (
          <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  {selectedItems.length} items selected
                </span>
                <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkStatusChange('completed')}
                >
                  Mark Complete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkStatusChange('in-progress')}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FiListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tasks found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {state.filters.searchQuery || state.filters.priority.length > 0 || state.filters.status.length > 0
                  ? 'No tasks match your current filters.'
                  : 'Get started by creating your first task.'}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([groupName, items]) => (
                <GroupPanel
                  key={groupName}
                  title={groupName}
                  items={items}
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  onSelectAll={handleSelectAll}
                  showGroupTitle={state.groupBy !== 'none'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Task"
        size="lg"
      >
        <TodoItemForm
          listId={activeList.id}
          onSuccess={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </>
  );
};

export default TodoListView;