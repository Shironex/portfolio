'use client'

import type { ReactNode } from 'react'

import { GLOW } from '@/lib/os/palettes.generated'

import { glowStyle } from './accent-map'

interface DesktopCanvasProps {
  children?: ReactNode
}

/**
 * Wallpaper layer with floating note decorations and orb blobs.
 * Children will be populated by OsShell (real hero/panel content in Phase D).
 *
 * The notes and orbs are `ambient-loop`s: they only animate `transform`, and
 * `AmbientPause` holds them still while something covers the desktop. An orb is a
 * gradient (`orb`), sized to hold the whole falloff, so it is never blurred
 * live; the offsets keep its centre where the old 256px and 288px discs sat.
 */
export function DesktopCanvas({ children }: DesktopCanvasProps) {
  return (
    <div className="from-sky-0 via-sky-1 to-sky-2 relative min-h-dvh overflow-hidden bg-linear-to-br">
      <span aria-hidden className="grain-layer" />
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

      <span
        aria-hidden
        className="orb animate-floaty ambient-loop pointer-events-none absolute top-[calc(20%-10rem)] right-[calc(10%-10rem)] size-[36rem] motion-reduce:animate-none"
        style={glowStyle('primary', GLOW.wallpaper[0])}
      />
      <span
        aria-hidden
        className="orb animate-floaty ambient-loop pointer-events-none absolute bottom-[calc(15%-10rem)] left-[calc(10%-10rem)] size-[38rem] motion-reduce:animate-none"
        style={{
          ...glowStyle('primary', GLOW.wallpaper[1]),
          animationDelay: '-3s',
        }}
      />

      {children}
    </div>
  )
}
