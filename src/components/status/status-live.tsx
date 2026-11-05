'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { cn } from '@/lib/utils'

import { lampLabel, useTheme } from '@/hooks/use-theme'

/**
 * The small client parts of the status page; the rest is server-rendered
 * from the cached report.
 */

const MINUTE_MS = 60_000

/**
 * Asks the server for a fresh render once a minute while the tab is visible,
 * and again when it comes back into view. Renders nothing.
 */
export function StatusAutoRefresh({ everyMs }: { everyMs: number }) {
  const router = useRouter()
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') router.refresh()
    }
    const id = window.setInterval(refresh, everyMs)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [router, everyMs])
  return null
}

/** `just now`, `1 min ago`, `12 min ago`, `3 h ago`. */
function relative(iso: string, now: number): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / MINUTE_MS))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  return `${Math.round(minutes / 60)} h ago`
}

interface CheckedAgoProps {
  iso: string
  /** The fixed time the server renders (`10:41 UTC`), kept as the title. */
  absolute: string
}

/**
 * When the newest check ran. The server sends the fixed time; once the page
 * runs it turns into how long ago, kept current every half minute.
 */
export function CheckedAgo({ iso, absolute }: CheckedAgoProps) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), MINUTE_MS / 2)
    return () => window.clearInterval(id)
  }, [])
  return (
    <time dateTime={iso} title={absolute}>
      {now === null ? absolute : relative(iso, now)}
    </time>
  )
}

/** The Lamp toggle of the menu bar, for the status window's title bar. */
export function StatusLampToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={lampLabel(theme)}
      className={cn(
        'focus-ring flex h-12 w-14 items-center justify-center hover:bg-(--select) pointer-coarse:size-(--target)',
        theme === 'dark' ? 'text-(--meta)' : 'text-(--lamp)'
      )}
    >
      <PixelIcon name={theme === 'dark' ? 'lamp-off' : 'lamp-on'} />
    </button>
  )
}
