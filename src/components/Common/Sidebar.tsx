import React, { useState } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { FiList, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { helpers } from '../../utils/helpers';

const Sidebar: React.FC = () => {
  const { state, actions } = useTodo();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleEditList = (listId: string, currentName: string) => {
    setEditingList(listId);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingList && editName.trim()) {
      actions.updateList(editingList, { name: editName.trim() });
      setEditingList(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName('');
  };

  const handleDeleteList = (listId: string) => {
    actions.deleteList(listId);
    setShowDeleteModal(null);
  };

  const getListStats = (listId: string) => {
    const list = state.lists.find(l => l.id === listId);
    if (!list) return { total: 0, completed: 0 };
    
    const total = list.items.length;
    const completed = list.items.filter(item => item.status === 'completed').length;
    return { total, completed };
  };

  return (
    <>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lists
          </h2>
          
          <div className="space-y-2">
            {state.lists.map((list) => {
              const stats = getListStats(list.id);
              const isActive = state.activeListId === list.id;
              const isEditing = editingList === list.id;
              
              return (
                <div
                  key={list.id}
                  className={`group rounded-lg p-3 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => !isEditing && actions.setActiveList(list.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <FiList className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                      
                      {isEditing ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          onBlur={handleSaveEdit}
                          className="text-sm"
                          autoFocus
                        />
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isActive ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'
                          }`}>
                            {list.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.completed}/{stats.total} completed
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {!isEditing && (
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditList(list.id, list.name);
                          }}
                          className="p-1"
                        >
                          <FiEdit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(list.id);
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {!isEditing && stats.total > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {state.lists.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiList className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No lists yet</p>
              <p className="text-xs">Create your first list to get started</p>
            </div>
          )}
        </div>
      </aside>

      <Modal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        title="Delete List"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this list? This action cannot be undone and will remove all tasks in this list.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => showDeleteModal && handleDeleteList(showDeleteModal)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;