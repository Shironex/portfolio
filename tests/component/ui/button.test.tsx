import { Button } from '@/components/ui/button'
import { render, screen, userEvent } from '@tests/setup/test-utils'
import { describe, expect, it, vi } from 'vitest'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    )

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Default</Button>)
      const button = screen.getByRole('button', { name: /default/i })
      expect(button).toBeInTheDocument()
    })

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: /delete/i })
      expect(button).toBeInTheDocument()
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button', { name: /outline/i })
      expect(button).toBeInTheDocument()
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button', { name: /secondary/i })
      expect(button).toBeInTheDocument()
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button', { name: /ghost/i })
      expect(button).toBeInTheDocument()
    })

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button', { name: /link/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Default Size</Button>)
      expect(screen.getByRole('button', { name: /default size/i })).toBeInTheDocument()
    })

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument()
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument()
    })

    it('should render icon size', () => {
      render(
        <Button size="icon" aria-label="Icon button">
          🔍
        </Button>,
      )
      expect(screen.getByRole('button', { name: /icon button/i })).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button', { name: /custom/i })
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('asChild prop', () => {
    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      )
      const link = screen.getByRole('link', { name: /link button/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('button type', () => {
    it('should support submit type', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button', { name: /submit/i })
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should support reset type', () => {
      render(<Button type="reset">Reset</Button>)
      const button = screen.getByRole('button', { name: /reset/i })
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(<Button aria-label="Accessible button">Icon</Button>)
      expect(screen.getByRole('button', { name: /accessible button/i })).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button', { name: /keyboard/i })

      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })
})
