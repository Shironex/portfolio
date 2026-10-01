'use client'

import { useCallback } from 'react'

import type { AppId } from '@/components/os/types'

import {
  createAppWindow,
  createProjectWindow,
  projectWindowId,
} from '@/lib/os/window-factory'

import type { Project } from '@/types'

import { useWindowStack } from './use-window-stack'

/**
 * Public ShiroOS window-management API.
 *
 * Thin composition layer: {@link useWindowStack} owns the window-stack state
 * machine (CRUD, z-ordering, minimize/maximize), and the window factories
 * collapse the shared open-app / open-project construction. The returned shape
 * is the stable contract every OS surface (os-shell, mobile-shell, taskbar,
 * menubar, start-menu, cmd-palette) consumes.
 */
export function useOsWindows() {
  const stack = useWindowStack()
  const { windows, pushWindow, focus, isOpen } = stack

  const openApp = useCallback(
    (appId: AppId) => {
      if (isOpen(appId)) {
        focus(appId)
        return
      }
      pushWindow((z) => createAppWindow(appId, z))
    },
    [isOpen, focus, pushWindow]
  )

  const openProject = useCallback(
    (project: Project) => {
      const id = projectWindowId(project.slug)
      if (isOpen(id)) {
        focus(id)
        return
      }
      const openCount = windows.length
      pushWindow((z) => createProjectWindow(project, z, openCount))
    },
    [windows, isOpen, focus, pushWindow]
  )

  return {
    windows,
    openApp,
    openProject,
    close: stack.close,
    closeAll: stack.closeAll,
    focus,
    move: stack.move,
    resize: stack.resize,
    minimize: stack.minimize,
    toggleMaximize: stack.toggleMaximize,
    snap: stack.snap,
    restore: stack.restore,
    activate: stack.activate,
    hydrate: stack.hydrate,
    topmostId: stack.topmostId,
    isOpen,
  }
}

export type OsWindowsApi = ReturnType<typeof useOsWindows>
