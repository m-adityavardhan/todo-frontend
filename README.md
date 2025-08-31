# Todo App Frontend

A modern, responsive Todo application built with Next.js, TypeScript, and Tailwind CSS. Features a beautiful dark theme design with color-coded tasks and intuitive user interface.

## 🚀 Features

- **Modern UI/UX** with dark theme and gradient accents
- **Responsive Design** that works on all devices
- **Color-coded Tasks** with custom color picker
- **Real-time Updates** with seamless state management
- **TypeScript** for type safety and better development
- **Tailwind CSS** for rapid styling and consistency
- **Next.js 14** with App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Custom API client
- **Icons**: Lucide React + Custom SVG assets
- **Development**: ESLint + Next.js defaults

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Backend API** running (see backend README)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```


### 4. Start Development Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 🔌 Connecting to Backend

### Backend Requirements

Ensure your backend is running and accessible:

- **Backend URL**: `http://localhost:5000`
- **API Endpoint**: `http://localhost:5000/api`
- **CORS**: Backend must allow requests from `http://localhost:3000`

### API Configuration

The frontend automatically connects to the backend using the `NEXT_PUBLIC_API_URL` environment variable. The API client is configured in `lib/api.ts`.

### Testing the Connection

1. Start your backend server
2. Start the frontend development server
3. Try creating a task - it should save to the backend database

## 📁 Project Structure

```
todo-frontend/
├── app/                    # Next.js App Router
│   ├── create/            # Create task page
│   ├── edit/[id]/         # Edit task page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── ColorPicker.tsx    # Color selection component
│   ├── EmptyState.tsx     # Empty state component
│   └── TaskCard.tsx       # Individual task component
├── lib/                    # Utility libraries
│   ├── api.ts             # API client
│   └── models.ts          # TypeScript interfaces
├── public/                 # Static assets
│   └── assets/            # Images and icons
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Key Components

### TaskCard Component

Displays individual tasks with:
- Color-coded checkboxes
- Task title with completion status
- Delete functionality
- Hover effects and animations

### ColorPicker Component

Allows users to select task colors:
- Visual color swatches
- Consistent with design system
- Responsive grid layout

### EmptyState Component

Shows when no tasks exist:
- Friendly messaging
- Visual illustration
- Consistent with app theme

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🔧 Development

### Adding New Features

1. **Components**: Add new components in `components/` directory
2. **Pages**: Create new pages in `app/` directory
3. **API**: Extend `lib/api.ts` for new endpoints
4. **Types**: Update `lib/models.ts` for new data structures

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Leverage custom CSS variables for theme colors
- Maintain responsive design principles
- Follow the established design system

### State Management

The app uses React hooks for state management:
- `useState` for local component state
- `useEffect` for side effects and API calls
- Custom hooks for reusable logic (if needed)

## API Integration

The frontend communicates with the backend through the `apiClient` in `lib/api.ts`:

- `getTasks()` - Fetch all tasks
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update existing task
- `deleteTask(id)` - Delete task

## Features in Detail

### Home View
- **Task List**: Displays all tasks with completion status
- **Summary**: Shows total tasks and completion count
- **Create Button**: Prominent button to add new tasks
- **Task Actions**: Click to edit, toggle completion, or delete

### Create/Edit Forms
- **Title Input**: Required field with validation
- **Color Picker**: Visual color selection
- **Navigation**: Back button to return to home
- **Error Handling**: Displays validation and API errors

### Task Management
- **Toggle Completion**: Click checkbox to mark complete/incomplete
- **Delete Confirmation**: Prevents accidental deletions
- **Real-time Updates**: UI updates immediately after actions
- **Error Recovery**: Reloads data on API failures


## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Verify backend is running on correct port
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Ensure CORS is configured on backend

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check custom CSS variables in `globals.css`

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test Scripts

- `test` - Run all tests once
- `test:watch` - Run tests in watch mode for development
- `test:coverage` - Generate coverage report
- `test:ci` - Run tests for continuous integration


## 📱 Responsive Design

The app is designed to work on all devices:

- **Mobile**: Optimized touch interactions
- **Tablet**: Adaptive layouts and spacing
- **Desktop**: Full-featured experience
- **Large Screens**: Enhanced spacing and typography

## 🎨 Customization

### Adding New Colors

1. Update `tailwind.config.js` with new color values
2. Add corresponding CSS variables in `globals.css`
3. Update `ColorPicker.tsx` to include new options

### Theme Modifications

1. Modify CSS variables in `globals.css`
2. Update Tailwind configuration
3. Ensure consistency across all components

## Coming Soon 
- Add Keyboard Shortcuts - Ctrl+N for new task, Enter to save, Esc to cancel
- Split into Task and completed tasks
- Collapse completed tasks under normal tasks
- Drag & Drop reordering within the respected groups
- Add internationalization 

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Hooks Documentation](https://react.dev/reference/react)


## 🔗 Related Repositories

- **Backend**: [Todo App Backend](https://github.com/m-adityavardhan/todo-backend) - API and database
- **Frontend**: [Todo App Frontend](https://github.com/m-adityavardhan/todo-frontend) - User interface


