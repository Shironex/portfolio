'use client'

import type { ComponentProps, HTMLAttributes } from 'react'

import { useHydrated } from '@/hooks/use-hydrated'

/**
 * `<main>` for server-rendered content that the shell then covers and shows
 * again inside a window. It is ordinary, readable content in the HTML the
 * server sends, and turns `inert` once the page has hydrated: from then on the
 * shell is the live copy, so the layer leaves the accessibility tree and the
 * tab order and nobody meets the same content twice. `aria-hidden` says the
 * same thing to anything that does not honour `inert` yet. The shell brings
 * its own `<main>` (see {@link ShellMain}) and page `h1`, so exactly one of
 * each is exposed both before and after the switch.
 */
export function StaticLayer(props: ComponentProps<'main'>) {
  const shellLive = useHydrated()
  return (
    <main {...props} inert={shellLive} aria-hidden={shellLive || undefined} />
  )
}

interface ShellMainProps extends HTMLAttributes<HTMLElement> {
  /** Whether a {@link StaticLayer} sits under the shell on this route. */
  overStaticLayer?: boolean
}

/**
 * The shell's `<main>`. Over a `StaticLayer` it is a plain `div` in the
 * server HTML, so the static content's `main` is the only one exposed, and it
 * takes the `main` role as that layer goes inert. The role changes rather
 * than the tag: a different element would remount everything inside it.
 */
export function ShellMain({ overStaticLayer, ...props }: ShellMainProps) {
  const shellLive = useHydrated()
  if (!overStaticLayer) return <main {...props} />
  return <div {...props} role={shellLive ? 'main' : undefined} />
}
