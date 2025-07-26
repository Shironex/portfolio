'use client'

import { useEffect, useState } from 'react'

import * as Sentry from '@sentry/nextjs'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <div className="relative h-5 w-5" />
      </Button>
    )
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    Sentry.startSpan(
      {
        op: 'ui.click',
        name: 'Theme Toggle',
      },
      (span) => {
        span.setAttributes({
          'theme.from': theme || 'unknown',
          'theme.to': newTheme,
        })
        setTheme(newTheme)
      }
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className="hover:text-primary"
    >
      <div className="relative h-5 w-5">
        {theme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </div>
    </Button>
  )
}
