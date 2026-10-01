'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { WindowId } from '@/components/os/types'

import {
  type DeepLinkTarget,
  deepLinkHref,
  parseDeepLink,
  targetForWindow,
  windowIdForTarget,
} from '@/lib/os/deep-link'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'
import { findProjectBySlug } from '@/lib/utils/projects'

import type { OsWindowsApi } from './use-os-windows'

/**
 * Two-way binding between the window stack and the URL.
 *
 * On mount it opens the window named by `initialWindow` (handed in by a server
 * route) or, failing that, by the `?open=` / `?project=` param. After that it
 * mirrors the topmost window back into the address bar with
 * `history.replaceState`, so focus changes never add history entries. Closing
 * the last window clears the param.
 *
 * Returns `copyLink`, which puts a shareable link for a window on the
 * clipboard.
 */
export function useDeepLink(
  os: Pick<OsWindowsApi, 'openApp' | 'openProject' | 'topmostId'>,
  initialWindow?: DeepLinkTarget
) {
  const { openApp, openProject, topmostId } = os
  // Survives the StrictMode double-invoke, so the window opens exactly once.
  const opened = useRef(false)
  // Window the load path asked for; URL writes hold off until it is on top, so
  // the mount-time empty stack cannot wipe the param it was just read from.
  const pendingId = useRef<WindowId | null>(null)
  const syncedId = useRef<WindowId | null>(null)

  useEffect(() => {
    if (opened.current) return
    opened.current = true
    const target = initialWindow ?? parseDeepLink(window.location.search)
    if (!target) return
    if (target.kind === 'app') {
      openApp(target.appId)
    } else {
      const project = findProjectBySlug(target.slug)
      if (!project) return
      openProject(project)
    }
    pendingId.current = windowIdForTarget(target)
  }, [initialWindow, openApp, openProject])

  useEffect(() => {
    if (pendingId.current !== null) {
      if (topmostId !== pendingId.current) return
      // The URL (or the server route) already describes this window.
      pendingId.current = null
      syncedId.current = topmostId
      return
    }
    if (topmostId === syncedId.current) return
    syncedId.current = topmostId
    const href = deepLinkHref(
      topmostId ? targetForWindow(topmostId) : null,
      window.location.search
    )
    window.history.replaceState(null, '', href + window.location.hash)
  }, [topmostId])

  const copyLink = useCallback((id: WindowId) => {
    const url = new URL(deepLinkHref(targetForWindow(id)), window.location.href)
    return copyToClipboard(url.href, 'Link copied')
  }, [])

  return { copyLink }
}
