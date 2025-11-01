import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'

/**
 * Custom render function with providers
 * Wraps components with necessary providers for testing
 */

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark' | 'system'
}

function AllTheProviders({ children, theme = 'light' }: { children: React.ReactNode; theme?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}

export function renderWithProviders(ui: React.ReactElement, options?: CustomRenderOptions) {
  const { theme, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders theme={theme}>{children}</AllTheProviders>,
    ...renderOptions,
  })
}

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

/**
 * Custom render as default export
 */
export { renderWithProviders as render }
