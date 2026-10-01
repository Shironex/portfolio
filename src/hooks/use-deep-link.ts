'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { WindowId } from '@/components/os/types'

import { documentTitle } from '@/lib/metadata-config'
import {
  type DeepLinkTarget,
  deepLinkHref,
  initialDeepLinkTarget,
  targetForWindow,
  windowIdForTarget,
} from '@/lib/os/deep-link'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'
import { findProjectBySlug } from '@/lib/utils/projects'

import type { OsWindowsApi } from './use-os-windows'

/**
 * Two-way binding between the window stack and the URL.
 *
 * On mount it opens the window named by `initialWindow` (handed in by the
 * `/projects/<slug>` route) or, failing that, by the `?open=` / `?project=`
 * param. After that it mirrors the topmost window back into the address bar
 * with `history.replaceState`, so focus changes never add history entries:
 * `/projects/<slug>` for a project, `/?open=<app>` for an app, `/` once the
 * last window closes.
 *
 * The write can cross pathnames (`/` to `/projects/<slug>` and back) without
 * a navigation. Next wraps `replaceState` only to keep `usePathname` and
 * `useSearchParams` in step; the mounted tree, and with it the window stack,
 * stays as it is. The document title is set alongside, since nothing
 * re-renders the metadata.
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
  // the mount-time empty stack cannot wipe the link it was just read from.
  const pendingId = useRef<WindowId | null>(null)
  const syncedId = useRef<WindowId | null>(null)

  useEffect(() => {
    if (opened.current) return
    opened.current = true
    const target = initialDeepLinkTarget(initialWindow)
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
      pendingId.current = null
    } else if (topmostId === syncedId.current) {
      return
    }
    syncedId.current = topmostId
    const { pathname, search, hash } = window.location
    const target = topmostId ? targetForWindow(topmostId) : null
    const href = deepLinkHref(target, search)
    // No navigation means no new metadata, so the tab title is kept in step
    // with the path by hand.
    document.title = documentTitle(
      target?.kind === 'project'
        ? findProjectBySlug(target.slug)?.title
        : undefined
    )
    // Already there on a fresh load of a canonical link; a legacy
    // `/?project=<slug>` link is rewritten to its route here.
    if (href === pathname + search) return
    window.history.replaceState(null, '', href + hash)
  }, [topmostId])

  const copyLink = useCallback((id: WindowId) => {
    const url = new URL(deepLinkHref(targetForWindow(id)), window.location.href)
    return copyToClipboard(url.href, 'Link copied')
  }, [])

  return { copyLink }
}
