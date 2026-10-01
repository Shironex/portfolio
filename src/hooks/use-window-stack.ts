'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { WindowId, WindowState } from '@/components/os/types'

import {
  INITIAL_Z,
  type Rect,
  type SnapZone,
  clampWindowRect,
  clampWindowToViewport,
  desktopArea,
  dockFlags,
  dockZoneOf,
  rectOf,
  snapBounds,
} from '@/lib/os/geometry'

/**
 * Next z-index for the stack, derived from the current windows array rather
 * than a separate counter. Reading it inside the functional updater (where
 * `ws` is the freshly-committed array) is what fixes the old stale-counter
 * focus/raise desync.
 */
function nextZ(ws: WindowState[]): number {
  return Math.max(INITIAL_Z, ...ws.map((w) => w.z)) + 1
}

/** The visible window with the highest z-index, if any. */
function topmostOf(ws: WindowState[]): WindowState | null {
  return ws.reduce<WindowState | null>(
    (top, w) => (w.minimized || (top && top.z >= w.z) ? top : w),
    null
  )
}

function patchWindow(
  ws: WindowState[],
  id: WindowId,
  patch: (w: WindowState) => WindowState
): WindowState[] {
  return ws.map((w) => (w.id === id ? patch(w) : w))
}

/**
 * Bring a window to the front and un-minimize it. Returns `ws` itself when it
 * is already the visible top window, so a press on the focused window neither
 * re-renders the stack nor spends a z-index.
 */
function raise(ws: WindowState[], id: WindowId): WindowState[] {
  const target = ws.find((w) => w.id === id)
  if (!target) return ws
  if (!target.minimized && topmostOf(ws)?.id === id) return ws
  const z = nextZ(ws)
  return patchWindow(ws, id, (w) => ({ ...w, z, minimized: false }))
}

/** Dock a window on `zone` and raise it; see `snap`. */
function dock(
  ws: WindowState[],
  id: WindowId,
  zone: SnapZone,
  restoreTo?: Rect
): WindowState[] {
  const area = desktopArea()
  return raise(
    patchWindow(ws, id, (w) => ({
      ...w,
      ...snapBounds(zone, area, w.minW),
      ...dockFlags(zone),
      prevGeometry: restoreTo ?? w.prevGeometry ?? rectOf(w),
    })),
    id
  )
}

/** Undock a window and raise it, or return `ws` when it is not docked. */
function undock(ws: WindowState[], id: WindowId, rect?: Rect): WindowState[] {
  const target = ws.find((w) => w.id === id)
  const next = rect ?? target?.prevGeometry
  if (!target || !next || dockZoneOf(target) === null) return ws
  return raise(
    patchWindow(ws, id, (w) => ({
      ...w,
      ...next,
      ...dockFlags(null),
      prevGeometry: undefined,
    })),
    id
  )
}

/**
 * Window-stack state machine for ShiroOS: open/focus/close/move/resize plus the
 * minimize/maximize toggles, edge snapping and z-ordering. Pure state: no rendering, no
 * project-vs-app identity. `useOsWindows` composes this with the window
 * factories to expose the public OS API.
 */
export function useWindowStack() {
  const [windows, setWindows] = useState<WindowState[]>([])

  // Docked windows follow the desktop area when the viewport changes size.
  useEffect(() => {
    let frame = 0
    const redock = () => {
      frame = 0
      setWindows((ws) => {
        if (!ws.some((w) => dockZoneOf(w) !== null)) return ws
        const area = desktopArea()
        return ws.map((w) => {
          const zone = dockZoneOf(w)
          return zone ? { ...w, ...snapBounds(zone, area, w.minW) } : w
        })
      })
    }
    const onResize = () => {
      if (frame === 0) frame = window.requestAnimationFrame(redock)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  const focus = useCallback((id: WindowId) => {
    setWindows((ws) => raise(ws, id))
  }, [])

  /**
   * Push a window built by `make(z)`, where `z` is the freshly-derived top
   * z-index. Both app and project opening flow through here. Callers dedupe
   * against the rendered stack first; the check here covers a window that
   * landed in the same tick (a restored session), which is raised instead.
   */
  const pushWindow = useCallback((make: (z: number) => WindowState) => {
    setWindows((ws) => {
      const next = make(nextZ(ws))
      return ws.some((w) => w.id === next.id)
        ? raise(ws, next.id)
        : [...ws, next]
    })
  }, [])

  /**
   * Put a stored session on an empty desktop. A window opened after this in
   * the same tick (a deep link) goes through `pushWindow`, which opens it on
   * top or raises its restored copy.
   */
  const hydrate = useCallback((stored: WindowState[]) => {
    setWindows((ws) => (ws.length === 0 ? stored : ws))
  }, [])

  const close = useCallback((id: WindowId) => {
    setWindows((ws) => ws.filter((w) => w.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setWindows([])
  }, [])

  const move = useCallback((id: WindowId, x: number, y: number) => {
    const clamped = clampWindowToViewport(x, y)
    setWindows((ws) =>
      patchWindow(ws, id, (w) => ({ ...w, x: clamped.x, y: clamped.y }))
    )
  }, [])

  const resize = useCallback((id: WindowId, patch: Partial<Rect>) => {
    setWindows((ws) =>
      patchWindow(ws, id, (w) => ({
        ...w,
        ...clampWindowRect(w, rectOf(w), patch),
        // Resizing exits maximized and snapped state (matches Windows
        // behavior)
        ...dockFlags(null),
        prevGeometry: undefined,
      }))
    )
  }, [])

  const minimize = useCallback((id: WindowId) => {
    setWindows((ws) => patchWindow(ws, id, (w) => ({ ...w, minimized: true })))
  }, [])

  /**
   * Dock a window on a snap zone: a half of the desktop, or maximized for the
   * top edge. `restoreTo` is the rect to return to; it defaults to the rect
   * the window had before it was first docked.
   */
  const snap = useCallback((id: WindowId, zone: SnapZone, restoreTo?: Rect) => {
    setWindows((ws) => dock(ws, id, zone, restoreTo))
  }, [])

  /**
   * Undock a snapped or maximized window, back to `rect` when given (a drag
   * pulling it loose) or to the rect it had before docking. Leaves a window
   * that is not docked alone.
   */
  const restore = useCallback((id: WindowId, rect?: Rect) => {
    setWindows((ws) => undock(ws, id, rect))
  }, [])

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((ws) => {
      const target = ws.find((w) => w.id === id)
      if (!target) return ws
      return target.maximized && target.prevGeometry
        ? undock(ws, id)
        : dock(ws, id, 'top')
    })
  }, [])

  const topmostId = useMemo(() => topmostOf(windows)?.id ?? null, [windows])

  /**
   * Taskbar click on an open window: restore it when minimized, minimize it
   * when it is already on top, otherwise bring it to the front.
   */
  const activate = useCallback(
    (id: WindowId) => {
      if (id === topmostId) minimize(id)
      else focus(id)
    },
    [topmostId, focus, minimize]
  )

  const isOpen = useCallback(
    (id: WindowId) => windows.some((w) => w.id === id),
    [windows]
  )

  return {
    windows,
    pushWindow,
    hydrate,
    focus,
    close,
    closeAll,
    move,
    resize,
    minimize,
    toggleMaximize,
    snap,
    restore,
    activate,
    topmostId,
    isOpen,
  }
}
