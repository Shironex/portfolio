'use client'

import { type ComponentProps, useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * `<main>` for server-rendered content that the shell then covers and shows
 * again inside a window. It is ordinary, readable content in the HTML the
 * server sends, and turns `inert` once the page has hydrated: from then on the
 * shell is the live copy, so the layer leaves the accessibility tree and the
 * tab order and nobody meets the same content twice. `aria-hidden` says the
 * same thing to anything that does not honour `inert` yet.
 */
export function StaticLayer(props: ComponentProps<'main'>) {
  const shellLive = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  return (
    <main {...props} inert={shellLive} aria-hidden={shellLive || undefined} />
  )
}
