'use client'

import { memo } from 'react'

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
    <time
      dateTime={now.toISOString()}
      aria-label={date ? `${time}, ${date}` : time}
      className={className}
    >
      <span>{time}</span>
      {date && <span className="ml-2">{date}</span>}
    </time>
  )
}

export const Clock = memo(ClockImpl)
