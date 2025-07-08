# React Todo App

A modern, full-featured todo application built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- ✅ **Multiple Lists**: Create and manage multiple todo lists
- ✅ **Full CRUD Operations**: Create, read, update, and delete tasks
- ✅ **Rich Task Details**: Title, description, due date/time, priority, status, and labels
- ✅ **Smart Filtering**: Filter by priority, status, labels, date range, and search
- ✅ **Flexible Grouping**: Group tasks by priority, status, labels, or date
- ✅ **Bulk Operations**: Select multiple tasks for batch operations

### User Experience
- ✅ **Dark/Light Theme**: Toggle between dark and light themes
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Keyboard Shortcuts**: Efficient navigation with keyboard shortcuts
- ✅ **Data Persistence**: All data is saved to local storage
- ✅ **Export/Import**: Backup and restore your data

### Advanced Features
- ✅ **Priority System**: High, Medium, Low priority levels with color coding
- ✅ **Status Tracking**: Pending, In Progress, Completed statuses
- ✅ **Label System**: Organize tasks with custom labels/tags
- ✅ **Date Management**: Due dates with overdue and upcoming indicators
- ✅ **Completion Tracking**: Progress indicators for each list

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Storage**: Local Storage API

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating Lists
1. Click "New List" in the header
2. Enter a list name and click "Create"

### Managing Tasks
1. Select a list from the sidebar
2. Click "Add Task" to create a new task
3. Fill in the task details (title, description, due date, priority, status, labels)
4. Click "Create Task" to save

### Filtering and Grouping
1. Use the search bar to find tasks by title or description
2. Click "Filters" to access advanced filtering options
3. Use the grouping dropdown to organize tasks by different criteria

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Create new list
- `Ctrl/Cmd + F`: Focus search input
- `Ctrl/Cmd + T`: Toggle theme

### Data Management
- **Export**: Click the download icon in the header to export your data
- **Import**: Click the upload icon to import data from a backup file

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── TodoList/       # Todo list components
│   ├── TodoItem/       # Todo item components
│   ├── FilterPanel/    # Filtering components
│   ├── GroupPanel/     # Grouping components
│   └── Common/         # Common components (Header, Sidebar)
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── localStorage.ts # Local storage utilities
│   ├── dateUtils.ts    # Date manipulation utilities
│   └── helpers.ts      # General helper functions
└── styles/             # CSS and styling files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Feather Icons](https://feathericons.com/)
- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Developed with [Vite](https://vitejs.dev/)