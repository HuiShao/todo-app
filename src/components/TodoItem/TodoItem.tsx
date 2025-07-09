import React, { useState } from 'react';
import type { TodoItem as TodoItemType } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import { FiEdit2, FiTrash2, FiCalendar, FiCheck } from 'react-icons/fi';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import TodoItemForm from './TodoItemForm';
import { dateUtils } from '../../utils/dateUtils';

interface TodoItemProps {
  item: TodoItemType;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showCheckbox?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  item,
  selected = false,
  onSelect,
  showCheckbox = false,
}) => {
  const { actions } = useTodo();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleToggleStatus = () => {
    actions.toggleTodoStatus(item.id);
  };

  const handleDelete = () => {
    actions.deleteTodoItem(item.id);
    setShowDeleteModal(false);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(item.id, !selected);
    }
  };

  const isOverdue = dateUtils.isOverdue(item.dueDate);
  const isDueSoon = dateUtils.isDueSoon(item.dueDate);

  return (
    <>
      <div
        className={`card p-4 transition-all duration-200 ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${item.status === 'completed' ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start space-x-3">
          {showCheckbox && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selected}
                onChange={handleSelect}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <button
              onClick={handleToggleStatus}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                item.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {item.status === 'completed' && <FiCheck className="w-3 h-3" />}
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`text-sm font-medium cursor-pointer ${
                    item.status === 'completed'
                      ? 'line-through text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                  onClick={() => setShowDescription(!showDescription)}
                >
                  {item.title}
                </h3>
                
                {item.description && showDescription && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="priority" priority={item.priority}>
                    {item.priority}
                  </Badge>
                  
                  <Badge variant="status" status={item.status}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                  
                  {item.dueDate && (
                    <div className={`flex items-center space-x-1 text-xs ${
                      isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      <FiCalendar className="w-3 h-3" />
                      <span>{dateUtils.getRelativeDate(item.dueDate)}</span>
                    </div>
                  )}
                  
                  {item.labels.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {item.labels.map((label) => (
                        <Badge key={label} className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="p-1"
                >
                  <FiEdit2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {item.description && !showDescription && (
          <button
            onClick={() => setShowDescription(true)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Show description...
          </button>
        )}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        size="lg"
      >
        <TodoItemForm
          item={item}
          listId={item.listId}
          onSuccess={() => setShowEditModal(false)}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{item.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TodoItem;
