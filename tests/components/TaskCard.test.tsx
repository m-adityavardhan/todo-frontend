import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import TaskCard from '../../components/TaskCard'
import { mockSingleTask } from '../mocks/mockData'

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Trash2: () => <span data-testid="trash-icon">🗑️</span>,
  Check: () => <span data-testid="check-icon">✓</span>,
}))

describe('TaskCard', () => {
  const defaultProps = {
    task: mockSingleTask,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.confirm to return true by default
    window.confirm = jest.fn(() => true)
  })

  it('renders task information correctly', () => {
    render(<TaskCard {...defaultProps} />)
    
    expect(screen.getByText('Complete project documentation')).toBeInTheDocument()
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('shows completed state correctly', () => {
    const completedTask = { ...mockSingleTask, completed: true }
    render(<TaskCard {...defaultProps} task={completedTask} />)
    
    expect(screen.getByText('Complete project documentation')).toHaveClass('line-through')
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('calls onClick when task card is clicked', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const taskCard = screen.getByText('Complete project documentation').closest('div')
    await user.click(taskCard!)
    
    expect(defaultProps.onClick).toHaveBeenCalledWith(mockSingleTask)
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const checkbox = screen.getByRole('button', { name: /toggle task/i })
    await user.click(checkbox)
    
    expect(defaultProps.onToggle).toHaveBeenCalledWith('1', true)
  })

  it('calls onDelete when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    await user.click(deleteButton)
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?')
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1')
  })

  it('does not call onDelete when delete is cancelled', async () => {
    window.confirm = jest.fn(() => false)
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    await user.click(deleteButton)
    
    expect(defaultProps.onDelete).not.toHaveBeenCalled()
  })

  it('shows loading state when deleting', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    await user.click(deleteButton)
    
    // The card should have reduced opacity when deleting
    const taskCard = screen.getByText('Complete project documentation').closest('div')
    expect(taskCard).toHaveClass('opacity-50')
  })

  it('handles toggle error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockOnToggle = jest.fn().mockRejectedValue(new Error('Toggle failed'))
    
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} onToggle={mockOnToggle} />)
    
    const checkbox = screen.getByRole('button', { name: /toggle task/i })
    await user.click(checkbox)
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to toggle task:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('handles delete error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockOnDelete = jest.fn().mockRejectedValue(new Error('Delete failed'))
    
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    await user.click(deleteButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete task:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('applies correct color classes for different colors', () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
    
    colors.forEach(color => {
      const taskWithColor = { ...mockSingleTask, color }
      const { container } = render(<TaskCard {...defaultProps} task={taskWithColor} />)
      
      // Check if the color-specific classes are applied
      const checkbox = container.querySelector(`.border-task-${color}`)
      expect(checkbox).toBeInTheDocument()
    })
  })

  it('disables interactions when deleting', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i })
    await user.click(deleteButton)
    
    // Wait for the deleting state to be set
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle task/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /delete task/i })).toBeDisabled()
    })
  })
})
