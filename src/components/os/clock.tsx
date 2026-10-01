'use client'

import { memo } from 'react'

import { cn } from '@/lib/utils'

import { useClock } from '@/hooks/use-clock'

interface ClockProps {
  className?: string
  /** Render the date in addition to the time. */
  showDate?: boolean
}

/**
 * Leaf clock — owns its own tick so siblings (menubar / taskbar chrome) stop
 * re-rendering each cadence. Memoized so upstream re-renders don't thrash it
 * either.
 */
function ClockImpl({ className, showDate = true }: ClockProps) {
  const now = useClock()

  // Pre-hydration there is no trustworthy clock — hold the space instead so the
  // chrome doesn't jump when the real time lands a frame later.
  if (!now) {
    return (
      <time className={cn('tabular-nums', className)}>
        <span className="invisible">00:00</span>
        {showDate && <span className="invisible ml-2">Mon, Jan 00</span>}
      </time>
    )
  }

  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const date = showDate
    ? now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    // No `aria-label`: a <time> has no role to hang a name on, so the text
    // itself is what gets read. The comma only exists for that reading.
    <time
      dateTime={now.toISOString()}
      className={cn('tabular-nums', className)}
    >
      <span>{time}</span>
      {date && (
        <>
          <span className="sr-only">, </span>
          <span className="ml-2">{date}</span>
        </>
      )}
    </time>
  )
}

export const Clock = memo(ClockImpl)
