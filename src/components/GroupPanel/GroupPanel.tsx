import React from 'react';
import type { TodoItem as TodoItemType } from '../../types';
import TodoItem from '../TodoItem/TodoItem';
import Button from '../ui/Button';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

interface GroupPanelProps {
  title: string;
  items: TodoItemType[];
  selectedItems: string[];
  onSelectItem: (id: string, selected: boolean) => void;
  onSelectAll: () => void;
  showGroupTitle?: boolean;
}

const GroupPanel: React.FC<GroupPanelProps> = ({
  title,
  items,
  selectedItems,
  onSelectItem,
  onSelectAll: _onSelectAll,
  showGroupTitle = true,
}) => {
  const allItemsSelected = items.length > 0 && items.every(item => selectedItems.includes(item.id));
  const someItemsSelected = items.some(item => selectedItems.includes(item.id));

  const handleSelectGroupAll = () => {
    if (allItemsSelected) {
      // Deselect all items in this group
      items.forEach(item => {
        if (selectedItems.includes(item.id)) {
          onSelectItem(item.id, false);
        }
      });
    } else {
      // Select all items in this group
      items.forEach(item => {
        if (!selectedItems.includes(item.id)) {
          onSelectItem(item.id, true);
        }
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showGroupTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectGroupAll}
            className="flex items-center space-x-1"
          >
            {allItemsSelected ? (
              <FiCheckSquare className="w-4 h-4" />
            ) : (
              <FiSquare className="w-4 h-4" />
            )}
            <span className="text-sm">
              {allItemsSelected ? 'Deselect All' : 'Select All'}
            </span>
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="group">
            <TodoItem
              item={item}
              selected={selectedItems.includes(item.id)}
              onSelect={onSelectItem}
              showCheckbox={selectedItems.length > 0 || someItemsSelected}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPanel;