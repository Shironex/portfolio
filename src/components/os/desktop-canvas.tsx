'use client'

import type { ReactNode } from 'react'

interface DesktopCanvasProps {
  children?: ReactNode
}

/**
 * Wallpaper layer: the bands of the chosen sky (`--sky-bands`, from
 * `data-sky` on <html>) with floating note decorations. Children are the
 * desktop content OsShell puts on it.
 *
 * The notes are `ambient-loop`s: they only animate `transform`, and
 * `AmbientPause` holds them still while something covers the desktop.
 */
export function DesktopCanvas({ children }: DesktopCanvasProps) {
  return (
    <div className="sky-bands relative min-h-dvh overflow-hidden">
      <span
        aria-hidden
        className="text-miku/20 animate-drift ambient-loop pointer-events-none absolute top-[15%] left-[12%] text-4xl motion-reduce:animate-none"
      >
        ♪
      </span>
      <span
        aria-hidden
        className="text-miku/20 animate-drift ambient-loop pointer-events-none absolute top-[35%] right-[18%] text-5xl motion-reduce:animate-none"
        style={{ animationDelay: '-4s' }}
      >
        ♫
      </span>
      <span
        aria-hidden
        className="text-ink-3/25 animate-drift ambient-loop pointer-events-none absolute top-[65%] left-[22%] text-3xl motion-reduce:animate-none"
        style={{ animationDelay: '-8s' }}
      >
        ♪
      </span>
      <span
        aria-hidden
        className="text-miku-3/20 animate-drift ambient-loop pointer-events-none absolute top-[80%] right-[12%] text-4xl motion-reduce:animate-none"
        style={{ animationDelay: '-12s' }}
      >
        ✧
      </span>

      {children}
    </div>
  )
}
