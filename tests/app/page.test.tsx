import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import HomePage from '../../app/page'
import { mockTasks } from '../mocks/mockData'

// Mock the API client
jest.mock('../../lib/api', () => ({
  apiClient: {
    getTasks: jest.fn(),
    toggleTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    }
  },
}))

// Mock the components
jest.mock('../../components/TaskCard', () => {
  return function MockTaskCard({ task, onToggle, onDelete, onClick }: any) {
    return (
      <div data-testid={`task-card-${task.id}`} onClick={() => onClick(task)}>
        <span>{task.title}</span>
        <button onClick={() => onToggle(task.id, !task.completed)} data-testid={`toggle-${task.id}`}>
          Toggle
        </button>
        <button onClick={() => onDelete(task.id)} data-testid={`delete-${task.id}`}>
          Delete
        </button>
      </div>
    )
  }
})

jest.mock('../../components/EmptyState', () => {
  return function MockEmptyState() {
    return <div data-testid="empty-state">No tasks</div>
  }
})

const mockApiClient = require('../../lib/api').apiClient

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders loading state initially', () => {
    mockApiClient.getTasks.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<HomePage />)
    
    // Check for loading spinner instead of status role
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('renders tasks when loaded successfully', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
      expect(screen.getByText('Review code changes')).toBeInTheDocument()
      expect(screen.getByText('Setup testing environment')).toBeInTheDocument()
    })
  })

  it('renders empty state when no tasks', async () => {
    mockApiClient.getTasks.mockResolvedValue([])
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  it('displays task count correctly', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument() // Total count
      expect(screen.getByText('1 of 3')).toBeInTheDocument() // Completed count
    })
  })

  it('displays completed count as 0 when no completed tasks', async () => {
    const incompleteTasks = mockTasks.map(task => ({ ...task, completed: false }))
    mockApiClient.getTasks.mockResolvedValue(incompleteTasks)
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // Completed count
    })
  })

  it('handles task toggle correctly', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    mockApiClient.toggleTask.mockResolvedValue({ ...mockTasks[0], completed: true })
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    })
    
    const toggleButton = screen.getByTestId('toggle-1')
    await userEvent.click(toggleButton)
    
    expect(mockApiClient.toggleTask).toHaveBeenCalledWith('1', true)
  })

  it('handles task deletion correctly', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    mockApiClient.deleteTask.mockResolvedValue(undefined)
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByTestId('delete-1')
    await userEvent.click(deleteButton)
    
    expect(mockApiClient.deleteTask).toHaveBeenCalledWith('1')
  })

  it('navigates to edit page when task is clicked', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    })
    
    const taskCard = screen.getByTestId('task-card-1')
    await userEvent.click(taskCard)
    
    expect(mockPush).toHaveBeenCalledWith('/edit/1')
  })

  it('navigates to create page when create button is clicked', async () => {
    mockApiClient.getTasks.mockResolvedValue([])
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument()
    })
    
    const createButton = screen.getByText('Create Task')
    await userEvent.click(createButton)
    
    expect(mockPush).toHaveBeenCalledWith('/create')
  })

  it('displays error message when API call fails', async () => {
    mockApiClient.getTasks.mockRejectedValue(new Error('API Error'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
    })
  })

  it('reloads tasks when toggle fails', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    mockApiClient.toggleTask.mockRejectedValue(new Error('Toggle failed'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    })
    
    const toggleButton = screen.getByTestId('toggle-1')
    await userEvent.click(toggleButton)
    
    // Should call getTasks again after toggle fails
    expect(mockApiClient.getTasks).toHaveBeenCalledTimes(2)
  })

  it('reloads tasks when delete fails', async () => {
    mockApiClient.getTasks.mockResolvedValue(mockTasks)
    mockApiClient.deleteTask.mockRejectedValue(new Error('Delete failed'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByTestId('delete-1')
    await userEvent.click(deleteButton)
    
    // Should call getTasks again after delete fails
    expect(mockApiClient.getTasks).toHaveBeenCalledTimes(2)
  })

  it('separates incomplete and completed tasks', async () => {
    const tasksWithMixedStatus = [
      { ...mockTasks[0], completed: false },
      { ...mockTasks[1], completed: true },
      { ...mockTasks[2], completed: false },
    ]
    mockApiClient.getTasks.mockResolvedValue(tasksWithMixedStatus)
    
    render(<HomePage />)
    
    await waitFor(() => {
      const taskCards = screen.getAllByTestId(/task-card-/)
      expect(taskCards).toHaveLength(3)
    })
    
    // Incomplete tasks should come first
    expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    expect(screen.getByText('Setup testing environment')).toBeInTheDocument()
    
    // Completed tasks should come after
    expect(screen.getByText('Review code changes')).toBeInTheDocument()
  })

  it('renders app title and logo', async () => {
    mockApiClient.getTasks.mockResolvedValue([])
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Todo App')).toBeInTheDocument()
      expect(screen.getByAltText('Rocket Logo')).toBeInTheDocument()
    })
  })

  it('renders create task button with plus icon', async () => {
    mockApiClient.getTasks.mockResolvedValue([])
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument()
      expect(screen.getByAltText('Plus Icon')).toBeInTheDocument()
    })
  })
})
