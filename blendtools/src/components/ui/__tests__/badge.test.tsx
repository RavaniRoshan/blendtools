import { describe, it, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('should render with default variant and size', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary') // default variant
    expect(badge).toHaveClass('px-2.5') // default size
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    
    let badge = screen.getByText('Secondary')
    expect(badge).toHaveClass('bg-secondary')
    
    rerender(<Badge variant="destructive">Destructive</Badge>)
    badge = screen.getByText('Destructive')
    expect(badge).toHaveClass('bg-destructive')
    
    rerender(<Badge variant="outline">Outline</Badge>)
    badge = screen.getByText('Outline')
    expect(badge).toHaveClass('text-foreground')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    
    let badge = screen.getByText('Small')
    expect(badge).toHaveClass('px-2')
    
    rerender(<Badge size="lg">Large</Badge>)
    badge = screen.getByText('Large')
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm')
  })

  it('should accept custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })

  it('should render complex content', () => {
    render(
      <Badge>
        <span>Status: </span>
        <strong>Active</strong>
      </Badge>
    )
    
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should have correct semantic structure', () => {
    render(<Badge>Badge Text</Badge>)
    
    const badge = screen.getByText('Badge Text')
    expect(badge.tagName).toBe('DIV')
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full')
  })

  it('should be accessible', () => {
    render(<Badge role="status" aria-label="Current status">Online</Badge>)
    
    const badge = screen.getByRole('status')
    expect(badge).toHaveAttribute('aria-label', 'Current status')
    expect(badge).toHaveTextContent('Online')
  })

  it('should support data attributes', () => {
    render(<Badge data-testid="status-badge" data-status="active">Active</Badge>)
    
    const badge = screen.getByTestId('status-badge')
    expect(badge).toHaveAttribute('data-status', 'active')
  })

  it('should combine variant and size classes correctly', () => {
    render(<Badge variant="destructive" size="lg">Large Destructive</Badge>)
    
    const badge = screen.getByText('Large Destructive')
    expect(badge).toHaveClass('bg-destructive') // variant
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm') // size
  })
})