import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test/utils'
import { Button } from '../button'

describe('Button', () => {
  it('should render with default variant and size', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary') // default variant
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    
    let button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button', { name: 'Outline' })
    expect(button).toHaveClass('border-input')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByRole('button', { name: 'Secondary' })
    expect(button).toHaveClass('bg-secondary')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button', { name: 'Ghost' })
    expect(button).toHaveClass('hover:bg-accent')
    
    rerender(<Button variant="link">Link</Button>)
    button = screen.getByRole('button', { name: 'Link' })
    expect(button).toHaveClass('underline-offset-4')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    
    let button = screen.getByRole('button', { name: 'Small' })
    expect(button).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button', { name: 'Large' })
    expect(button).toHaveClass('h-11')
    
    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button', { name: 'Icon' })
    expect(button).toHaveClass('h-10', 'w-10')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as different element when asChild is used', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button', { name: 'Custom' })
    expect(button).toHaveClass('custom-class')
  })

  it('should forward ref correctly', () => {
    let buttonRef: HTMLButtonElement | null = null
    
    render(
      <Button ref={(ref) => { buttonRef = ref }}>
        Ref Button
      </Button>
    )
    
    expect(buttonRef).toBeInstanceOf(HTMLButtonElement)
    expect(buttonRef?.textContent).toBe('Ref Button')
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('should handle type attribute', () => {
    render(<Button type="submit">Submit</Button>)
    
    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toHaveAttribute('type', 'submit')
  })
})