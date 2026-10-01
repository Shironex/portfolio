import { isAppId } from '@/components/os/constants'
import type { AppId, WindowId } from '@/components/os/types'

import { projectSlugForWindow, projectWindowId } from '@/lib/os/window-factory'
import { projectPath } from '@/lib/utils/project-meta'
import { findProjectBySlug } from '@/lib/utils/projects'

/** Query param naming the app window to open: `/?open=about`. */
export const OPEN_PARAM = 'open'
/**
 * Legacy query param naming the project window to open: `/?project=<slug>`.
 * Still read on load so old links work; new links use `/projects/<slug>`.
 */
export const PROJECT_PARAM = 'project'

/**
 * A window the shell can be asked to open, either from the URL or from a
 * server route. Plain data, so it crosses the server/client boundary as a prop.
 */
export type DeepLinkTarget =
  { kind: 'app'; appId: AppId } | { kind: 'project'; slug: string }

/**
 * Read a deep link out of a query string (`location.search`, with or without
 * the leading `?`). Unknown app ids and slugs yield `null`, so a stale or
 * mistyped link just lands on the plain desktop. `project` wins when both
 * params are present, since it is the more specific one.
 */
export function parseDeepLink(search: string): DeepLinkTarget | null {
  const params = new URLSearchParams(search)
  const slug = params.get(PROJECT_PARAM)
  if (slug && findProjectBySlug(slug)) return { kind: 'project', slug }
  const appId = params.get(OPEN_PARAM)
  if (appId && isAppId(appId)) return { kind: 'app', appId }
  return null
}

/**
 * The window a page load asks for: the one its server route handed in, or
 * failing that the one named in the query string. Browser only.
 */
export function initialDeepLinkTarget(
  initialWindow?: DeepLinkTarget
): DeepLinkTarget | null {
  return initialWindow ?? parseDeepLink(window.location.search)
}

/** The deep-link target that reopens the window with this id. */
export function targetForWindow(id: WindowId): DeepLinkTarget {
  if (isAppId(id)) return { kind: 'app', appId: id }
  return { kind: 'project', slug: projectSlugForWindow(id) }
}

/** The window id a target opens; the inverse of {@link targetForWindow}. */
export function windowIdForTarget(target: DeepLinkTarget): WindowId {
  return target.kind === 'app' ? target.appId : projectWindowId(target.slug)
}

/**
 * Root-relative href for a target, or for the bare desktop when `target` is
 * `null`. Apps live in a query param on the desktop (`/?open=about`); projects
 * have their own server-rendered route (`/projects/<slug>`). Unrelated params
 * in `currentSearch` (campaign tags and the like) are kept; only the two
 * deep-link params are dropped.
 */
export function deepLinkHref(
  target: DeepLinkTarget | null,
  currentSearch = ''
): string {
  const params = new URLSearchParams(currentSearch)
  params.delete(OPEN_PARAM)
  params.delete(PROJECT_PARAM)
  if (target?.kind === 'app') params.set(OPEN_PARAM, target.appId)
  const path = target?.kind === 'project' ? projectPath(target.slug) : '/'
  const query = params.toString()
  return query ? `${path}?${query}` : path
}
