import React, { useState } from 'react';
import { useTodo } from '../../contexts/TodoContext';
import { FiSun, FiMoon, FiSettings, FiDownload, FiUpload } from 'react-icons/fi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

const Header: React.FC = () => {
  const { state, actions } = useTodo();
  const [showSettings, setShowSettings] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showNewListModal, setShowNewListModal] = useState(false);

  const handleCreateList = () => {
    if (newListName.trim()) {
      actions.createList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  const handleExport = () => {
    actions.exportData();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const success = actions.importData(data);
          if (success) {
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                TodoApp
              </h1>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowNewListModal(true)}
              >
                New List
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.setTheme(state.theme === 'light' ? 'dark' : 'light')}
                title="Toggle theme"
              >
                {state.theme === 'light' ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                title="Export data"
              >
                <FiDownload className="w-4 h-4" />
              </Button>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  as="span"
                  title="Import data"
                >
                  <FiUpload className="w-4 h-4" />
                </Button>
              </label>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                <FiSettings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={showNewListModal}
        onClose={() => setShowNewListModal(false)}
        title="Create New List"
      >
        <div className="space-y-4">
          <Input
            label="List Name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateList();
              }
            }}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowNewListModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateList}
              disabled={!newListName.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Theme
            </h3>
            <div className="flex space-x-2">
              <Button
                variant={state.theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => actions.setTheme('light')}
              >
                <FiSun className="w-4 h-4 mr-1" />
                Light
              </Button>
              <Button
                variant={state.theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => actions.setTheme('dark')}
              >
                <FiMoon className="w-4 h-4 mr-1" />
                Dark
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>New List</span>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between">
                <span>Search</span>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Theme</span>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl + T</kbd>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;