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
    <div className="from-sky-0 via-sky-1 to-sky-2 relative min-h-screen overflow-hidden bg-gradient-to-br">
      <span aria-hidden className="grain-layer" />
      <span
        aria-hidden
        className="text-miku/20 animate-drift pointer-events-none absolute top-[15%] left-[12%] text-4xl motion-reduce:animate-none"
      >
        ♪
      </span>
      <span
        aria-hidden
        className="text-pink/20 animate-drift pointer-events-none absolute top-[35%] right-[18%] text-5xl motion-reduce:animate-none"
        style={{ animationDelay: '-4s' }}
      >
        ♫
      </span>
      <span
        aria-hidden
        className="text-lav/25 animate-drift pointer-events-none absolute top-[65%] left-[22%] text-3xl motion-reduce:animate-none"
        style={{ animationDelay: '-8s' }}
      >
        ♪
      </span>
      <span
        aria-hidden
        className="text-miku-3/20 animate-drift pointer-events-none absolute top-[80%] right-[12%] text-4xl motion-reduce:animate-none"
        style={{ animationDelay: '-12s' }}
      >
        ✧
      </span>

      <span
        aria-hidden
        className="bg-pink/10 animate-floaty pointer-events-none absolute top-[20%] right-[10%] size-64 rounded-full blur-3xl motion-reduce:animate-none"
      />
      <span
        aria-hidden
        className="bg-miku/10 animate-floaty pointer-events-none absolute bottom-[15%] left-[10%] size-72 rounded-full blur-3xl motion-reduce:animate-none"
        style={{ animationDelay: '-3s' }}
      />

      {children}
    </div>
  )
}
