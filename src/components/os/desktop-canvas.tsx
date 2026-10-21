'use client'

import type { ReactNode } from 'react'

import { DESKTOP_BARE_ATTRIBUTE, Wallpaper } from './wallpaper/wallpaper'

interface DesktopCanvasProps {
  /** Whether the sky is Live (the moon then shows its real phase). */
  live: boolean
  children?: ReactNode
}

/**
 * The desktop: the wallpaper (SPEC 2.5) under the desktop content OsShell
 * puts on it. `isolate` makes this the stacking context the wallpaper sits
 * at the bottom of, under the content whatever its positioning.
 */
export function DesktopCanvas({ live, children }: DesktopCanvasProps) {
  return (
    <div
      {...{ [DESKTOP_BARE_ATTRIBUTE]: '' }}
      className="relative isolate min-h-dvh overflow-hidden bg-(--ground)"
    >
      <Wallpaper live={live} />
      {children}
    </div>
  )
}
