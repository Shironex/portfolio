'use client'

import type { ReactNode } from 'react'

interface DesktopCanvasProps {
  children?: ReactNode
}

/**
 * Wallpaper layer with floating note decorations and orb blobs.
 * Children will be populated by OsShell (real hero/panel content in Phase D).
 */
export function DesktopCanvas({ children }: DesktopCanvasProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-0 via-sky-1 to-sky-2">
      <span aria-hidden className="grain-layer" />
      <span className="pointer-events-none absolute top-[15%] left-[12%] text-4xl text-miku/20 animate-drift">
        ♪
      </span>
      <span
        className="pointer-events-none absolute top-[35%] right-[18%] text-5xl text-pink/20 animate-drift"
        style={{ animationDelay: '-4s' }}
      >
        ♫
      </span>
      <span
        className="pointer-events-none absolute top-[65%] left-[22%] text-3xl text-lav/25 animate-drift"
        style={{ animationDelay: '-8s' }}
      >
        ♪
      </span>
      <span
        className="pointer-events-none absolute top-[80%] right-[12%] text-4xl text-miku-3/20 animate-drift"
        style={{ animationDelay: '-12s' }}
      >
        ✧
      </span>

      <span className="pointer-events-none absolute top-[20%] right-[10%] size-64 rounded-full bg-pink/10 blur-3xl animate-floaty" />
      <span
        className="pointer-events-none absolute bottom-[15%] left-[10%] size-72 rounded-full bg-miku/10 blur-3xl animate-floaty"
        style={{ animationDelay: '-3s' }}
      />

      {children}
    </div>
  )
}
