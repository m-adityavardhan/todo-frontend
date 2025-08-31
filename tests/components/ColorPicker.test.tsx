import React from 'react'
import { render, screen } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import ColorPicker from '../../components/ColorPicker'

describe('ColorPicker', () => {
  const defaultProps = {
    selectedColor: 'blue',
    onColorChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all color options', () => {
    render(<ColorPicker {...defaultProps} />)
    
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
    colors.forEach(color => {
      const colorButton = screen.getByTitle(color)
      expect(colorButton).toBeInTheDocument()
    })
  })

  it('displays the correct label', () => {
    render(<ColorPicker {...defaultProps} />)
    
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('calls onColorChange when a color is selected', async () => {
    const user = userEvent.setup()
    render(<ColorPicker {...defaultProps} />)
    
    const redColorButton = screen.getByTitle('red')
    await user.click(redColorButton)
    
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('red')
  })

  it('highlights the selected color', () => {
    render(<ColorPicker {...defaultProps} selectedColor="green" />)
    
    const greenColorButton = screen.getByTitle('green')
    expect(greenColorButton).toHaveClass('selected')
  })

  it('applies correct color classes to each option', () => {
    const { container } = render(<ColorPicker {...defaultProps} />)
    
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
    colors.forEach(color => {
      const colorButton = screen.getByTitle(color)
      expect(colorButton).toHaveClass(`bg-task-${color}`)
    })
  })

  it('renders with different selected colors', () => {
    const { rerender } = render(<ColorPicker {...defaultProps} selectedColor="red" />)
    expect(screen.getByTitle('red')).toHaveClass('selected')
    
    rerender(<ColorPicker {...defaultProps} selectedColor="purple" />)
    expect(screen.getByTitle('purple')).toHaveClass('selected')
    expect(screen.getByTitle('red')).not.toHaveClass('selected')
  })

  it('calls onColorChange with correct color value for each option', async () => {
    const user = userEvent.setup()
    render(<ColorPicker {...defaultProps} />)
    
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
    
    for (const color of colors) {
      const colorButton = screen.getByTitle(color)
      await user.click(colorButton)
      expect(defaultProps.onColorChange).toHaveBeenCalledWith(color)
    }
    
    expect(defaultProps.onColorChange).toHaveBeenCalledTimes(colors.length)
  })

  it('has proper accessibility attributes', () => {
    render(<ColorPicker {...defaultProps} />)
    
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'brown']
    colors.forEach(color => {
      const colorButton = screen.getByTitle(color)
      expect(colorButton).toHaveAttribute('type', 'button')
      expect(colorButton).toHaveAttribute('title', color)
    })
  })

  it('renders with proper spacing and layout classes', () => {
    const { container } = render(<ColorPicker {...defaultProps} />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('space-y-2')
    
    const colorButtonsContainer = wrapper.querySelector('div:last-child')
    expect(colorButtonsContainer).toHaveClass('flex', 'gap-2')
  })

  it('handles rapid color changes correctly', async () => {
    const user = userEvent.setup()
    render(<ColorPicker {...defaultProps} />)
    
    const redButton = screen.getByTitle('red')
    const blueButton = screen.getByTitle('blue')
    
    await user.click(redButton)
    await user.click(blueButton)
    
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('red')
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('blue')
    expect(defaultProps.onColorChange).toHaveBeenCalledTimes(2)
  })
})
