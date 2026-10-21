import type { WindowId } from '@/components/os/types'

import { type Box, PET_ANCHOR, PET_HITBOX, SIT_HALF_WIDTH } from './pet-sheet'

/**
 * Where the pet can stand (SPEC 3.3), all in art px in the windows layer,
 * whose origin is the viewport's: the top edge of every open window, the
 * top edges of the desktop panels, and the floor (the top of the taskbar
 * row). Built from the window store and from rects measured on stack and
 * size changes, never in the frame loop.
 */
export interface Perch {
  /** `window:<id>`, `panel:<n>` or `floor`. */
  key: string
  windowId?: WindowId
  /** The surface line: the y her feet (or her seat) rest on. */
  y: number
  /** The edge's ends. */
  left: number
  right: number
  /** Her z-index while she stands on it: the window's, or 0. */
  z: number
  floor: boolean
  /** Ranges her centre may sit in, clear of the title and the controls. */
  slots: ReadonlyArray<readonly [number, number]>
  /** Room to stand under the menu bar; without it she only passes through. */
  roomy: boolean
}

/** A window as the pet sees it: its rect and z, in art px. */
export interface WindowBox extends Box {
  id: WindowId
  z: number
}

/** What the title bar of a window takes, measured from its left edge. */
export interface TitleBarMetrics {
  /** Where the title text ends. */
  titleEnd: number
  /** Where the controls start. */
  controlsStart: number
}

/** How far she reaches above a perch standing, and seated (art px). */
export const STAND_HEIGHT = PET_ANCHOR.idle.y - PET_HITBOX.idle.y
export const SIT_HEIGHT = PET_ANCHOR.sit.y - PET_HITBOX.sit.y

/** Room left clear on both sides of a sit slot (SPEC 3.3). */
const SLOT_MARGIN = 4

/** How far in from either end of an edge her centre turns or steps off. */
const EDGE_INSET = 4

/** How far from the screen's sides her centre stays on the floor. */
const FLOOR_INSET = 16

/**
 * A window's top edge. Its sit slot is the bar between the end of the title
 * and the start of the controls, less the margins and half her seated width
 * on each side; a bar with no room for her has none (she still walks it).
 */
export function windowPerch(
  win: WindowBox,
  bar: TitleBarMetrics,
  ceiling: number
): Perch {
  const from = win.x + bar.titleEnd + SLOT_MARGIN + SIT_HALF_WIDTH
  const to = win.x + bar.controlsStart - SLOT_MARGIN - SIT_HALF_WIDTH
  return {
    key: `window:${win.id}`,
    windowId: win.id,
    y: win.y,
    left: win.x,
    right: win.x + win.w,
    z: win.z,
    floor: false,
    slots: to >= from ? [[from, to]] : [],
    roomy: win.y - ceiling >= STAND_HEIGHT,
  }
}

/**
 * Whether a window's top edge is a perch at all: it must leave room under
 * the menu bar (`ceiling`) for her seated, or her head would be behind the
 * bar. Lower than that and she still can stand there with the top of her
 * hair under it, which reads as her ducking; she does not spawn there.
 */
export function windowHasRoom(win: Box, ceiling: number): boolean {
  return win.y - ceiling >= SIT_HEIGHT
}

/**
 * Whether a panel's top edge is a perch: she must fit standing between it
 * and the menu bar, and clear of every other panel (`others`).
 */
export function panelHasRoom(
  rect: Box,
  ceiling: number,
  others: readonly Box[]
): boolean {
  if (rect.y - ceiling < STAND_HEIGHT) return false
  const band = {
    x: rect.x,
    y: rect.y - STAND_HEIGHT,
    w: rect.w,
    h: STAND_HEIGHT,
  }
  return !others.some((other) => other !== rect && overlaps(band, other))
}

/** A desktop panel's top edge: walkable, no sit slot. */
export function panelPerch(rect: Box, index: number): Perch {
  return {
    key: `panel:${index}`,
    y: rect.y,
    left: rect.x,
    right: rect.x + rect.w,
    z: 0,
    floor: false,
    slots: [],
    roomy: true,
  }
}

/** The floor, across the whole width. */
export function floorPerch(width: number, y: number): Perch {
  return {
    key: 'floor',
    y,
    left: 0,
    right: width,
    z: 0,
    floor: true,
    slots: [],
    roomy: true,
  }
}

/** The range her centre may walk on a perch. */
export function walkSpan(perch: Perch): readonly [number, number] {
  const inset = perch.floor ? FLOOR_INSET : EDGE_INSET
  return [perch.left + inset, perch.right - inset]
}

/** Whether her centre at `x` is in a sit slot of the perch. */
export function inSlot(perch: Perch, x: number): boolean {
  return perch.slots.some(([from, to]) => x >= from && x <= to)
}

function contains(box: Box, x: number, y: number): boolean {
  return x >= box.x && x < box.x + box.w && y >= box.y && y < box.y + box.h
}

/**
 * Whether a window above the perch hides the spot her feet would take at
 * `x` (the art pixel just over the surface).
 */
export function spotCovered(
  perch: Perch,
  x: number,
  windows: readonly WindowBox[]
): boolean {
  return windows.some((win) => win.z > perch.z && contains(win, x, perch.y - 1))
}

/**
 * The share of `box` that windows above z `z` cover, sampled on a 5x5
 * grid: enough to tell "about half" from "barely", at 25 point tests.
 */
export function coveredShare(
  box: Box,
  z: number,
  windows: readonly WindowBox[]
): number {
  const above = windows.filter((win) => win.z > z)
  if (above.length === 0) return 0
  let hidden = 0
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const x = box.x + ((i + 0.5) * box.w) / 5
      const y = box.y + ((j + 0.5) * box.h) / 5
      if (above.some((win) => contains(win, x, y))) hidden++
    }
  }
  return hidden / 25
}

/**
 * The first surface a fall from `fromY` to `toY` at `x` meets: the highest
 * perch under her whose spot is in view. Strictly below `fromY`, so the
 * edge she left is not met again.
 */
export function surfaceBetween(
  perches: readonly Perch[],
  windows: readonly WindowBox[],
  x: number,
  fromY: number,
  toY: number
): Perch | null {
  let hit: Perch | null = null
  for (const perch of perches) {
    if (perch.y <= fromY || perch.y > toY) continue
    if (x < perch.left || x > perch.right) continue
    if (hit && perch.y >= hit.y) continue
    if (!perch.floor && spotCovered(perch, x, windows)) continue
    hit = perch
  }
  return hit
}

/** Whether two boxes overlap. */
export function overlaps(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  )
}
