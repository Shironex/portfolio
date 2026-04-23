'use client'

import { useCallback, useMemo, useState } from 'react'

import { APP_WINDOW_DEFAULTS } from '@/components/os/constants'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import type { Project } from '@/types'

const INITIAL_Z = 100

const MAXIMIZED_INSET = { top: 44, bottom: 64, side: 8 } as const

function clampToViewport(x: number, y: number) {
  if (typeof window === 'undefined') return { x, y }
  const nx = Math.max(4, Math.min(window.innerWidth - 200, x))
  const ny = Math.max(32, Math.min(window.innerHeight - 100, y))
  return { x: nx, y: ny }
}

function viewportGeometry() {
  if (typeof window === 'undefined') {
    return { x: MAXIMIZED_INSET.side, y: MAXIMIZED_INSET.top, w: 1200, h: 600 }
  }
  return {
    x: MAXIMIZED_INSET.side,
    y: MAXIMIZED_INSET.top,
    w: window.innerWidth - MAXIMIZED_INSET.side * 2,
    h: window.innerHeight - MAXIMIZED_INSET.top - MAXIMIZED_INSET.bottom,
  }
}

export function useOsWindows() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [zCounter, setZCounter] = useState(INITIAL_Z)

  const focus = useCallback(
    (id: WindowId) => {
      setWindows((ws) => {
        const target = ws.find((w) => w.id === id)
        if (!target) return ws
        setZCounter((z) => z + 1)
        const nextZ = zCounter + 1
        return ws.map((w) =>
          w.id === id ? { ...w, z: nextZ, minimized: false } : w
        )
      })
    },
    [zCounter]
  )

  const openApp = useCallback(
    (appId: AppId) => {
      const existing = windows.find((w) => w.id === appId)
      if (existing) {
        focus(appId)
        return
      }
      const cfg = APP_WINDOW_DEFAULTS[appId]
      const nextZ = zCounter + 1
      setZCounter(nextZ)
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
          z: nextZ,
          minimized: false,
          maximized: false,
        },
      ])
    },
    [windows, focus, zCounter]
  )

  const openProject = useCallback(
    (project: Project) => {
      const id: WindowId = `project-${project.slug}`
      const existing = windows.find((w) => w.id === id)
      if (existing) {
        focus(id)
        return
      }
      const offset = windows.length
      const nextZ = zCounter + 1
      setZCounter(nextZ)
      setWindows((ws) => [
        ...ws,
        {
          id,
          title: `${project.slug}.app`,
          icon: '◆',
          x: 200 + offset * 20,
          y: 110 + offset * 18,
          w: 820,
          h: 600,
          z: nextZ,
          minimized: false,
          maximized: false,
          project,
        },
      ])
    },
    [windows, focus, zCounter]
  )

  const close = useCallback((id: WindowId) => {
    setWindows((ws) => ws.filter((w) => w.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setWindows([])
  }, [])

  const move = useCallback((id: WindowId, x: number, y: number) => {
    const clamped = clampToViewport(x, y)
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
          const nextW = Math.max(minW, patch.w ?? w.w)
          const nextH = Math.max(minH, patch.h ?? w.h)
          const maxWidth =
            typeof window !== 'undefined' ? window.innerWidth - 16 : 4096
          const maxHeight =
            typeof window !== 'undefined' ? window.innerHeight - 80 : 4096
          return {
            ...w,
            x: Math.max(0, Math.min(maxWidth - minW, patch.x ?? w.x)),
            y: Math.max(32, Math.min(maxHeight - minH, patch.y ?? w.y)),
            w: Math.min(maxWidth, nextW),
            h: Math.min(maxHeight, nextH),
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
          const max = viewportGeometry()
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
