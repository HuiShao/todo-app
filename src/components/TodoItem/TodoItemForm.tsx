import React, { useState, useEffect } from 'react';
import { TodoItem as TodoItemType, Priority, Status } from '../../types';
import { useTodo } from '../../contexts/TodoContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { FiX, FiPlus } from 'react-icons/fi';
import { dateUtils } from '../../utils/dateUtils';

interface TodoItemFormProps {
  item?: TodoItemType;
  listId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TodoItemForm: React.FC<TodoItemFormProps> = ({
  item,
  listId,
  onSuccess,
  onCancel,
}) => {
  const { actions } = useTodo();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    status: 'pending' as Status,
    dueDate: '',
    dueTime: '',
    labels: [] as string[],
  });
  const [newLabel, setNewLabel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status,
        dueDate: item.dueDate ? dateUtils.formatDateForInput(item.dueDate) : '',
        dueTime: item.dueDate ? dateUtils.formatTimeForInput(item.dueDate) : '',
        labels: [...item.labels],
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const dueDate = formData.dueDate
      ? dateUtils.createDateTime(formData.dueDate, formData.dueTime)
      : null;
    
    const itemData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate,
      labels: formData.labels,
    };
    
    if (item) {
      actions.updateTodoItem(item.id, itemData);
    } else {
      actions.createTodoItem(formData.title.trim(), listId, itemData);
    }
    
    onSuccess();
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }));
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        error={errors.title}
        placeholder="Enter task title..."
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Enter task description..."
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
          options={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
        />

        <Input
          label="Due Time"
          type="time"
          value={formData.dueTime}
          onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
          disabled={!formData.dueDate}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Labels
        </label>
        
        {formData.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
              >
                {label}
                <button
                  type="button"
                  onClick={() => handleRemoveLabel(label)}
                  className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        <div className="flex space-x-2">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add label..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddLabel}
            disabled={!newLabel.trim()}
          >
            <FiPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {item ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  );
};

export default TodoItemForm;