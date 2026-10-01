import type { WindowState } from '@/components/os/types'

import {
  type Rect,
  type SnapZone,
  dockZoneOf,
  rectOf,
  undockRect,
} from '@/lib/os/geometry'

const KEYBOARD_MOVE_STEP = 20
const KEYBOARD_RESIZE_STEP = 24

const ARROW_SNAP_ZONES: Partial<Record<string, SnapZone>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'top',
}

const ARROW_DELTAS: Partial<Record<string, { x: number; y: number }>> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
}

/** The part of a keyboard event the title bar shortcuts read. */
export interface KeyChord {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}

/** What a key press on a window's title bar asks for. */
export type WindowKeyAction =
  | { type: 'close' }
  | { type: 'minimize' }
  | { type: 'toggle-maximize' }
  | { type: 'snap'; zone: SnapZone }
  | { type: 'restore' }
  /** An arrow chord with nothing to do (Ctrl+Alt+Down on a floating window). */
  | { type: 'none' }
  | { type: 'resize'; patch: Partial<Rect> }
  /** `undockTo` is the rect a docked window comes loose to before it moves. */
  | { type: 'move'; x: number; y: number; undockTo?: Rect }

/**
 * Maps a key press on a title bar to a window action, or `null` when the key
 * is not a window shortcut and must be left to the browser. Four modes:
 * Ctrl/Cmd+W and Ctrl/Cmd+M (Shift for maximize), Ctrl+Alt+Arrow to snap or
 * restore, Shift+Arrow to resize from the bottom-right, plain Arrow to move.
 */
export function windowKeyAction(
  chord: KeyChord,
  win: WindowState
): WindowKeyAction | null {
  const ctrlish = chord.ctrlKey || chord.metaKey
  const key = chord.key.toLowerCase()
  if (ctrlish && key === 'w') return { type: 'close' }
  if (ctrlish && key === 'm') {
    return { type: chord.shiftKey ? 'toggle-maximize' : 'minimize' }
  }

  const delta = ARROW_DELTAS[chord.key]
  if (!delta) return null
  const docked = dockZoneOf(win) !== null

  if (chord.ctrlKey && chord.altKey) {
    const zone = ARROW_SNAP_ZONES[chord.key]
    if (zone) return { type: 'snap', zone }
    return { type: docked ? 'restore' : 'none' }
  }

  if (chord.shiftKey) {
    const step = KEYBOARD_RESIZE_STEP
    const patch: Partial<Rect> = {}
    if (delta.x !== 0) patch.w = Math.max(1, win.w + delta.x * step)
    if (delta.y !== 0) patch.h = Math.max(1, win.h + delta.y * step)
    return { type: 'resize', patch }
  }

  const step = KEYBOARD_MOVE_STEP
  const current = rectOf(win)
  return {
    type: 'move',
    x: win.x + delta.x * step,
    y: win.y + delta.y * step,
    // A docked window comes loose first, the way a drag pulls it loose: its
    // old size, with the corner it is being moved by left in place.
    undockTo: docked
      ? undockRect(win.prevGeometry ?? current, current, win)
      : undefined,
  }
}
