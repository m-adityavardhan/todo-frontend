import React from 'react'
import { render, screen } from '../../utils/test-utils'
import EmptyState from '../../components/EmptyState'

describe('EmptyState', () => {
  it('renders the clipboard icon', () => {
    render(<EmptyState />)
    
    const clipboardIcon = screen.getByAltText('Clipboard Icon')
    expect(clipboardIcon).toBeInTheDocument()
  })

  it('displays the main heading text', () => {
    render(<EmptyState />)
    
    expect(screen.getByText("You don't have any tasks registered yet.")).toBeInTheDocument()
  })

  it('displays the descriptive text', () => {
    render(<EmptyState />)
    
    expect(screen.getByText('Create tasks and organize your to-do items.')).toBeInTheDocument()
  })

  it('renders with correct styling classes', () => {
    const { container } = render(<EmptyState />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-12', 'text-center')
  })

  it('has proper icon dimensions', () => {
    render(<EmptyState />)
    
    const clipboardIcon = screen.getByAltText('Clipboard Icon')
    expect(clipboardIcon).toHaveClass('w-16', 'h-16')
  })

  it('applies correct text styling to headings', () => {
    const { container } = render(<EmptyState />)
    
    const headings = container.querySelectorAll('h3')
    expect(headings).toHaveLength(2)
    
    // First heading should have font-bold
    expect(headings[0]).toHaveClass('font-bold')
    
    // Second heading should have font-normal
    expect(headings[1]).toHaveClass('font-normal')
  })

  it('has proper spacing between elements', () => {
    const { container } = render(<EmptyState />)
    
    const iconContainer = container.querySelector('.w-16.h-16')
    expect(iconContainer).toHaveClass('mb-4')
    
    const firstHeading = container.querySelector('h3.font-bold')
    expect(firstHeading).toHaveClass('mb-2')
  })

  it('renders with correct text content structure', () => {
    render(<EmptyState />)
    
    const mainHeading = screen.getByText("You don't have any tasks registered yet.")
    const description = screen.getByText('Create tasks and organize your to-do items.')
    
    expect(mainHeading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    
    // Check that they are different elements
    expect(mainHeading).not.toBe(description)
  })

  it('has accessible text content', () => {
    render(<EmptyState />)
    
    // Check that the text is readable and makes sense
    expect(screen.getByText("You don't have any tasks registered yet.")).toBeInTheDocument()
    expect(screen.getByText('Create tasks and organize your to-do items.')).toBeInTheDocument()
  })

  it('maintains consistent layout structure', () => {
    const { container } = render(<EmptyState />)
    
    const wrapper = container.firstChild as HTMLElement
    const children = wrapper.children
    
    // Should have exactly 3 children: icon container, first heading, second heading
    expect(children).toHaveLength(3)
    
    // First child should be the icon container
    expect(children[0]).toHaveClass('w-16', 'h-16', 'flex', 'items-center', 'justify-center', 'mb-4')
    
    // Second child should be the first heading
    expect(children[1].tagName).toBe('H3')
    
    // Third child should be the second heading
    expect(children[2].tagName).toBe('H3')
  })
})
