'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { WindowId, WindowState } from '@/components/os/types'

import {
  WINDOW_ID_ATTRIBUTE,
  WINDOW_TITLE_BAR_ATTRIBUTE,
  canTakeFocus,
  focusedElement,
} from '@/lib/os/dom'

/** How long after a user action a change to the stack still counts as theirs. */
const USER_ACTION_WINDOW_MS = 1000

function windowElement(id: WindowId): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[${WINDOW_ID_ATTRIBUTE}="${CSS.escape(id)}"]`
  )
}

/** The title bar of a rendered window: the stop keyboard users land on. */
function titleBarOf(id: WindowId): HTMLElement | null {
  return (
    windowElement(id)?.querySelector<HTMLElement>(
      `[${WINDOW_TITLE_BAR_ATTRIBUTE}]`
    ) ?? null
  )
}

/** Id of the window an element sits in, or `null` for the desktop and chrome. */
function windowIdOf(element: HTMLElement): string | null {
  return (
    element
      .closest(`[${WINDOW_ID_ATTRIBUTE}]`)
      ?.getAttribute(WINDOW_ID_ATTRIBUTE) ?? null
  )
}

/**
 * Moves keyboard focus with the window stack on the desktop shell.
 *
 * - A window the user opens, restores from minimized or brings to the front
 *   from the taskbar gets focus on its title bar. A press inside a background
 *   window raises it without moving focus off what was pressed.
 * - When a window closes or minimizes and takes focus with it, focus goes
 *   back to the control that launched it when that control sits in the window
 *   now on top (a project opened from the projects list). Otherwise it goes
 *   to the next top window, or with none left to the launcher (desktop icon,
 *   taskbar button, whatever opened the palette), if that is still on the
 *   page. A window minimized from its taskbar button leaves focus on the
 *   button, so the next press restores it.
 * - Windows put back on load (a restored session, a deep link) leave focus
 *   alone: the document starts at the top, and the page title names the
 *   window.
 *
 * `enabled` is off on the mobile shell: its sheets trap focus themselves and
 * nothing there carries a window id.
 *
 * Returns `markUserAction(id)`: call it right before opening or activating
 * window `id` on the user's behalf.
 */
export function useWindowFocus(
  windows: WindowState[],
  topmostId: WindowId | null,
  enabled: boolean
) {
  const userAction = useRef<{ id: WindowId; at: number } | null>(null)
  const seen = useRef<{ visible: Set<WindowId>; topmostId: WindowId | null }>({
    visible: new Set(),
    topmostId: null,
  })
  const launchers = useRef(new Map<WindowId, HTMLElement>())

  const markUserAction = useCallback((id: WindowId) => {
    userAction.current = { id, at: performance.now() }
  }, [])

  // Keyed on ids and minimized flags, which is all the memo reads. A drag or
  // resize hands in a new `windows` array for every frame with the same stack
  // in it, and must not re-run the effect.
  const stackKey = windows
    .map((w) => `${w.minimized ? '-' : '+'}${w.id}`)
    .join(' ')
  const stack = useMemo(
    () => ({
      open: new Set(windows.map((w) => w.id)),
      visible: new Set(windows.filter((w) => !w.minimized).map((w) => w.id)),
    }),
    [stackKey]
  )

  useEffect(() => {
    if (!enabled) return
    const before = seen.current
    const { open, visible } = stack
    seen.current = { visible, topmostId }

    // A mark counts only for the window it was made for. Launching the app
    // that is already on top changes nothing, and its mark must not pass to
    // the next press that raises some other window.
    const mark = userAction.current
    userAction.current = null
    const byUser =
      mark !== null &&
      mark.id === topmostId &&
      performance.now() - mark.at < USER_ACTION_WINDOW_MS

    // Launcher of a window that just closed or minimized, read before the
    // entries of closed windows are dropped.
    const gone = [...before.visible].filter((id) => !visible.has(id))
    const launcherOfGone = gone
      .map((id) => launchers.current.get(id))
      .reverse()
      .find(canTakeFocus)
    for (const id of launchers.current.keys()) {
      if (!open.has(id)) launchers.current.delete(id)
    }

    const active = focusedElement()
    const appeared = topmostId !== null && !before.visible.has(topmostId)
    // The window under one that went away comes to the top by itself; that
    // is not a raise.
    const raised = topmostId !== before.topmostId && gone.length === 0

    if (byUser && topmostId !== null && (appeared || raised)) {
      if (appeared && active && !launchers.current.has(topmostId)) {
        launchers.current.set(topmostId, active)
      }
      titleBarOf(topmostId)?.focus({ preventScroll: true })
      return
    }

    if (gone.length === 0 || active) return
    const backToLauncher =
      launcherOfGone !== undefined &&
      (topmostId === null || windowIdOf(launcherOfGone) === topmostId)
    const next = backToLauncher
      ? launcherOfGone
      : topmostId !== null
        ? titleBarOf(topmostId)
        : null
    next?.focus({ preventScroll: true })
  }, [enabled, stack, topmostId])

  return markUserAction
}
