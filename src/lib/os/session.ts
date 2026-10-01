import { isAppId } from '@/components/os/constants'
import type { WindowState } from '@/components/os/types'

import { measureDesktopArea } from '@/lib/os/dom'
import {
  INITIAL_Z,
  type Rect,
  type SnapZone,
  clampWindowRect,
  clampWindowToViewport,
  dockFlags,
  rectOf,
  snapBounds,
} from '@/lib/os/geometry'
import {
  createAppWindow,
  createProjectWindow,
  isProjectWindowId,
  projectSlugForWindow,
} from '@/lib/os/window-factory'
import { isRecord } from '@/lib/utils'
import { findProjectBySlug } from '@/lib/utils/projects'

export const SESSION_STORAGE_KEY = 'shiroos:windows'

/** Quiet time after the last change before tab-session state is written. */
export const SESSION_WRITE_DEBOUNCE_MS = 250

/** The part of a window worth remembering; the rest is rebuilt from its id. */
type StoredWindow = Pick<
  WindowState,
  | 'id'
  | 'x'
  | 'y'
  | 'w'
  | 'h'
  | 'z'
  | 'minimized'
  | 'maximized'
  | 'snapped'
  | 'prevGeometry'
>

function parseRect(value: unknown): Rect | null {
  if (!isRecord(value)) return null
  const { x, y, w, h } = value
  if (![x, y, w, h].every(Number.isFinite)) return null
  return rectOf(value as unknown as Rect)
}

/** A fresh window for a stored id, or `null` when the app or project is gone. */
function windowForId(id: unknown, z: number): WindowState | null {
  if (typeof id !== 'string') return null
  if (isAppId(id)) return createAppWindow(id, z)
  if (!isProjectWindowId(id)) return null
  const project = findProjectBySlug(projectSlugForWindow(id))
  return project ? createProjectWindow(project, z, 0) : null
}

/**
 * Size clamped like a resize, position clamped like a move, so a window
 * parked low or far to the right comes back where it was left.
 */
function fitToViewport(rect: Rect, win: WindowState): Rect {
  const { w, h } = clampWindowRect(win, rect, {})
  return { ...clampWindowToViewport(rect.x, rect.y), w, h }
}

function parseZone(value: Record<string, unknown>): SnapZone | null {
  if (value.maximized === true) return 'top'
  return value.snapped === 'left' || value.snapped === 'right'
    ? value.snapped
    : null
}

/**
 * Rebuild one window from untyped storage. Rects are fitted to the viewport
 * as it is now, and a docked window is re-docked against the current desktop
 * area instead of trusting the stored pixels. The stored `z` only orders the
 * windows; {@link readStoredSession} renumbers them.
 */
function parseWindow(value: unknown): WindowState | null {
  if (!isRecord(value)) return null
  const rect = parseRect(value)
  if (!rect || !Number.isFinite(value.z)) return null
  const win = windowForId(value.id, value.z as number)
  if (!win) return null

  const zone = parseZone(value)
  const prev = zone ? (parseRect(value.prevGeometry) ?? rect) : null

  return {
    ...win,
    ...(zone
      ? snapBounds(zone, measureDesktopArea(), win.minW)
      : fitToViewport(rect, win)),
    ...dockFlags(zone),
    minimized: value.minimized === true,
    prevGeometry: prev ? fitToViewport(prev, win) : undefined,
  }
}

/**
 * Windows left open earlier in this tab. sessionStorage is untyped input and
 * can throw outright (blocked site data, sandboxed iframe), so anything
 * unreadable, malformed or pointing at a removed app or project is dropped.
 * Z-indexes are renumbered from the bottom of the stack up: stored values keep
 * growing with every raise and would climb over the taskbar across reloads.
 */
export function readStoredSession(): WindowState[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed
      .flatMap((entry) => {
        const win = parseWindow(entry)
        if (!win || seen.has(win.id)) return []
        seen.add(win.id)
        return [win]
      })
      .sort((a, b) => a.z - b.z)
      .map((win, i) => ({ ...win, z: INITIAL_Z + 1 + i }))
  } catch {
    return []
  }
}

/** The stack as the string that goes into storage. */
export function serializeSession(windows: readonly WindowState[]): string {
  const stored: StoredWindow[] = windows.map(
    ({ id, x, y, w, h, z, minimized, maximized, snapped, prevGeometry }) => ({
      id,
      x,
      y,
      w,
      h,
      z,
      minimized,
      maximized,
      snapped,
      prevGeometry,
    })
  )
  return JSON.stringify(stored)
}

/** Writing fails silently: an unrecordable session is a fresh desktop next time. */
export function writeStoredSession(serialized: string): void {
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, serialized)
  } catch {
    /* Blocked storage or an exhausted quota. The desktop still works. */
  }
}
