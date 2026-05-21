'use client'

import { useCallback, useMemo, useState } from 'react'

import { APP_WINDOW_DEFAULTS } from '@/components/os/constants'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import {
  cascadeOrigin,
  clampResize,
  clampWindowToViewport,
  maximizeBounds,
} from '@/lib/os/geometry'

import type { Project } from '@/types'

/** Base z-index; the first window opened sits at {@link INITIAL_Z} + 1. */
const INITIAL_Z = 100

/**
 * Next z-index for the stack, derived from the current windows array rather
 * than a separate counter. Reading it inside the functional updater (where
 * `ws` is the freshly-committed array) fixes the old stale-counter focus/raise
 * desync.
 */
function nextZ(ws: WindowState[]): number {
  return Math.max(INITIAL_Z, ...ws.map((w) => w.z)) + 1
}

export function useOsWindows() {
  const [windows, setWindows] = useState<WindowState[]>([])

  const focus = useCallback((id: WindowId) => {
    setWindows((ws) => {
      const target = ws.find((w) => w.id === id)
      if (!target) return ws
      const z = nextZ(ws)
      return ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w))
    })
  }, [])

  const openApp = useCallback(
    (appId: AppId) => {
      const existing = windows.find((w) => w.id === appId)
      if (existing) {
        focus(appId)
        return
      }
      const cfg = APP_WINDOW_DEFAULTS[appId]
      setWindows((ws) => [
        ...ws,
        {
          id: appId,
          title: cfg.title,
          icon: cfg.icon,
          x: cfg.x,
          y: cfg.y,
          w: cfg.w,
          h: cfg.h,
          z: nextZ(ws),
          minimized: false,
          maximized: false,
        },
      ])
    },
    [windows, focus]
  )

  const openProject = useCallback(
    (project: Project) => {
      const id: WindowId = `project-${project.slug}`
      const existing = windows.find((w) => w.id === id)
      if (existing) {
        focus(id)
        return
      }
      const origin = cascadeOrigin(windows.length)
      setWindows((ws) => [
        ...ws,
        {
          id,
          title: `${project.slug}.app`,
          icon: '◆',
          x: origin.x,
          y: origin.y,
          w: 820,
          h: 600,
          z: nextZ(ws),
          minimized: false,
          maximized: false,
          project,
        },
      ])
    },
    [windows, focus]
  )

  const close = useCallback((id: WindowId) => {
    setWindows((ws) => ws.filter((w) => w.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setWindows([])
  }, [])

  const move = useCallback((id: WindowId, x: number, y: number) => {
    const clamped = clampWindowToViewport(x, y)
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, x: clamped.x, y: clamped.y } : w))
    )
  }, [])

  const resize = useCallback(
    (
      id: WindowId,
      patch: Partial<{ x: number; y: number; w: number; h: number }>
    ) => {
      setWindows((ws) =>
        ws.map((w) => {
          if (w.id !== id) return w
          const minW = w.minW ?? 320
          const minH = w.minH ?? 240
          const next = clampResize(w, patch, minW, minH)
          return {
            ...w,
            x: next.x,
            y: next.y,
            w: next.w,
            h: next.h,
            // Resizing exits maximized state (matches Windows behavior)
            maximized: false,
            prevGeometry: undefined,
          }
        })
      )
    },
    []
  )

  const minimize = useCallback((id: WindowId) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    )
  }, [])

  const toggleMaximize = useCallback(
    (id: WindowId) => {
      setWindows((ws) =>
        ws.map((w) => {
          if (w.id !== id) return w
          if (w.maximized && w.prevGeometry) {
            return {
              ...w,
              maximized: false,
              x: w.prevGeometry.x,
              y: w.prevGeometry.y,
              w: w.prevGeometry.w,
              h: w.prevGeometry.h,
              prevGeometry: undefined,
            }
          }
          const max = maximizeBounds()
          return {
            ...w,
            maximized: true,
            prevGeometry: { x: w.x, y: w.y, w: w.w, h: w.h },
            x: max.x,
            y: max.y,
            w: max.w,
            h: max.h,
          }
        })
      )
      focus(id)
    },
    [focus]
  )

  const toggleMinimize = useCallback(
    (id: WindowId) => {
      const target = windows.find((w) => w.id === id)
      if (!target) return
      if (target.minimized) {
        focus(id)
      } else {
        minimize(id)
      }
    },
    [windows, focus, minimize]
  )

  const topmostId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized)
    if (visible.length === 0) return null
    return visible.reduce((top, w) => (w.z > top.z ? w : top), visible[0]).id
  }, [windows])

  const isOpen = useCallback(
    (id: WindowId) => windows.some((w) => w.id === id),
    [windows]
  )

  return {
    windows,
    openApp,
    openProject,
    close,
    closeAll,
    focus,
    move,
    resize,
    minimize,
    toggleMinimize,
    toggleMaximize,
    topmostId,
    isOpen,
  }
}

export type OsWindowsApi = ReturnType<typeof useOsWindows>
