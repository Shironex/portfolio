'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { WindowId, WindowState } from '@/components/os/types'

import { measureDesktopArea } from '@/lib/os/dom'
import {
  INITIAL_Z,
  type Rect,
  type SnapZone,
  clampWindowRect,
  clampWindowToViewport,
  dockFlags,
  dockZoneOf,
  rectOf,
  snapBounds,
} from '@/lib/os/geometry'
import { rafThrottle } from '@/lib/utils/raf-throttle'

/**
 * Renumber the stack densely from the bottom up (1..n above `INITIAL_Z`),
 * keeping its order and putting `top` last when given. Every change to the
 * stack goes through here, so z never grows with use. Returns `ws` itself
 * when nothing moves.
 */
function rerank(ws: WindowState[], top?: WindowId): WindowState[] {
  const order = (w: WindowState) => (w.id === top ? Infinity : w.z)
  const rank = new Map(
    [...ws]
      .sort((a, b) => order(a) - order(b))
      .map((w, i) => [w.id, INITIAL_Z + 1 + i])
  )
  let changed = false
  const next = ws.map((w) => {
    const z = rank.get(w.id) ?? w.z
    if (z === w.z) return w
    changed = true
    return { ...w, z }
  })
  return changed ? next : ws
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

function setMinimized(ws: WindowState[], id: WindowId): WindowState[] {
  return patchWindow(ws, id, (w) => ({ ...w, minimized: true }))
}

/**
 * Bring a window to the front and un-minimize it. Returns `ws` itself when it
 * is already the visible top window, so a press on the focused window does
 * not re-render the stack.
 */
function raise(ws: WindowState[], id: WindowId): WindowState[] {
  const target = ws.find((w) => w.id === id)
  if (!target) return ws
  if (!target.minimized && topmostOf(ws)?.id === id) return ws
  return rerank(
    patchWindow(ws, id, (w) => ({ ...w, minimized: false })),
    id
  )
}

/** Dock a window on `zone` and raise it; see `snap`. */
function dock(
  ws: WindowState[],
  id: WindowId,
  zone: SnapZone,
  restoreTo?: Rect
): WindowState[] {
  const area = measureDesktopArea()
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
    const redock = rafThrottle(() => {
      setWindows((ws) => {
        if (!ws.some((w) => dockZoneOf(w) !== null)) return ws
        const area = measureDesktopArea()
        return ws.map((w) => {
          const zone = dockZoneOf(w)
          return zone ? { ...w, ...snapBounds(zone, area, w.minW) } : w
        })
      })
    })
    window.addEventListener('resize', redock.schedule)
    return () => {
      window.removeEventListener('resize', redock.schedule)
      redock.cancel()
    }
  }, [])

  const focus = useCallback((id: WindowId) => {
    setWindows((ws) => raise(ws, id))
  }, [])

  /**
   * Push a window built by `make(z, openCount)`: its rank on top of the stack
   * and how many windows are open under it. Both app and project opening flow
   * through here. A window that is already open (or landed in the same tick,
   * from a restored session) is raised instead.
   */
  const pushWindow = useCallback(
    (make: (z: number, openCount: number) => WindowState) => {
      setWindows((ws) => {
        const next = make(INITIAL_Z + ws.length + 1, ws.length)
        return ws.some((w) => w.id === next.id)
          ? raise(ws, next.id)
          : rerank([...ws, next], next.id)
      })
    },
    []
  )

  /**
   * Put a stored session on an empty desktop. A window opened after this in
   * the same tick (a deep link) goes through `pushWindow`, which opens it on
   * top or raises its restored copy.
   */
  const hydrate = useCallback((stored: WindowState[]) => {
    setWindows((ws) => (ws.length === 0 ? stored : ws))
  }, [])

  const close = useCallback((id: WindowId) => {
    setWindows((ws) => rerank(ws.filter((w) => w.id !== id)))
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
    setWindows((ws) => setMinimized(ws, id))
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
  const activate = useCallback((id: WindowId) => {
    setWindows((ws) =>
      topmostOf(ws)?.id === id ? setMinimized(ws, id) : raise(ws, id)
    )
  }, [])

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
