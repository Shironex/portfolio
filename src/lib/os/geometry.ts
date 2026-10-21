/**
 * Pure geometry math for the ShiroOS window manager.
 *
 * Two surfaces share this math but with intentionally different offset
 * constants, preserved here as named values rather than blind-merged:
 *
 * - `useOsWindows` (move + maximize + new-window cascade) uses
 *   {@link MOVE_VIEWPORT_MARGIN} / {@link MAXIMIZED_INSET} / {@link CASCADE_OFFSET}
 *   (the window factory opens new windows with the cascade and
 *   {@link NEW_WINDOW_HEADROOM}).
 * - `Window` (pointer-resize clamp) uses {@link RESIZE_VIEWPORT_MARGIN}.
 *
 * The constants are in art px (SPEC 2.1); rects are in CSS px, and every rect
 * these functions return is snapped to whole art px, so window chrome lands
 * on device pixels wherever it is dragged or docked. The art pixel is read at
 * call time (`artPixel`), like the viewport.
 *
 * Functions are SSR-safe: they read `window` only at call time and fall back
 * to sensible defaults when it is unavailable.
 */
import { artPixel, artPx, floorToArt, snapToArt } from './pixel'

/** Margins used when clamping a moved window into the viewport, in art px. */
export const MOVE_VIEWPORT_MARGIN = {
  /** Smallest allowed left edge. */
  minX: 2,
  /** Smallest allowed top edge. */
  minY: 16,
  /** Right edge keeps this much of the window reachable past `innerWidth`. */
  right: 100,
  /** Bottom edge keeps this much of the window reachable past `innerHeight`. */
  bottom: 50,
} as const

/** Inset of the usable desktop area from the viewport edges, in art px. */
export const MAXIMIZED_INSET = { top: 22, bottom: 32, side: 4 } as const

/**
 * Room a new window leaves above its top edge, under the top of the desktop
 * area, in art px: the pet's height seated (`SIT_HEIGHT` in
 * `components/os/pets/perches.ts`, 33), so she can sit on any window the
 * moment it opens, at every DPR (decision 1 of SPEC 11). `pets.spec.ts`
 * holds the two together.
 */
export const NEW_WINDOW_HEADROOM = 33

/**
 * Room a new window leaves between its right edge and the desktop's panel
 * column, in art px: the gap between the hero and the panels.
 */
export const NEW_WINDOW_PANEL_GAP = 8

/**
 * The narrowest a new window opens to stay clear of the panel column, in
 * art px at the DPR 1 size (480 css, so 200 art px at DPR 1.25), wider than
 * a phone sheet, where every app already lays out (decision 13 of SPEC 11).
 * An app can ask for more (`openMinWidth`). Where even that does not fit
 * left of the panels, the window overlaps them.
 */
export const NEW_WINDOW_MIN_WIDTH = 240

/** Cascade origin + per-window step for new project windows, in art px. */
export const CASCADE_OFFSET = {
  baseX: 100,
  baseY: 55,
  stepX: 10,
  stepY: 9,
} as const

/** Margins used when clamping a resized window, in art px. */
export const RESIZE_VIEWPORT_MARGIN = {
  /** Reserved width past `innerWidth` (matches the desktop chrome gutter). */
  right: 8,
  /** Reserved height past `innerHeight` (taskbar + menubar). */
  bottom: 40,
  /** Smallest allowed left edge. */
  minX: 0,
  /** Smallest allowed top edge. */
  minY: 16,
  /** Fallback dimension when there is no viewport (SSR), in CSS px. */
  ssrFallback: 4096,
} as const

/** Smallest size a window can be resized to unless it sets its own, in art px. */
export const DEFAULT_MIN_SIZE = { w: 160, h: 120 } as const

/**
 * Pointer travel under which a press and release is a tap, not a drag, in
 * CSS px (it is about the hand, not the art). Below it a window does not
 * move, snap or come loose from where it is docked, so a shaky click or the
 * first tap of a double tap changes nothing.
 */
export const DRAG_SLOP = 6

/**
 * Base z-index inside the windows layer; the stack is numbered densely from
 * {@link INITIAL_Z} + 1 up. The layer is its own stacking context, so these
 * never compete with the chrome.
 */
export const INITIAL_Z = 0

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Point {
  x: number
  y: number
}

export interface Size {
  w: number
  h: number
}

/** Half of the desktop a window can be snapped to. */
export type SnapSide = 'left' | 'right'

/** Edge of the desktop a dragged window can be dropped on. */
export type SnapZone = SnapSide | 'top'

/** The two flags a window stores its dock state in. */
interface DockFlags {
  maximized: boolean
  snapped?: SnapSide
}

interface MinSize {
  minW?: number
  minH?: number
}

/** The plain rect of anything that carries one (a window, a stored entry). */
export function rectOf({ x, y, w, h }: Rect): Rect {
  return { x, y, w, h }
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** A rect with every edge on a whole art pixel. */
export function snapRect({ x, y, w, h }: Rect, px = artPixel()): Rect {
  return {
    x: snapToArt(x, px),
    y: snapToArt(y, px),
    w: snapToArt(w, px),
    h: snapToArt(h, px),
  }
}

export function sameRect(a: Rect, b: Rect): boolean {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h
}

/** The viewport as it is now, or `null` when there is none (SSR). */
export function viewportSize(): Size | null {
  if (typeof window === 'undefined') return null
  return { w: window.innerWidth, h: window.innerHeight }
}

/** Zone a window is docked on: `top` when maximized, `null` when it floats. */
export function dockZoneOf(win: DockFlags): SnapZone | null {
  return win.maximized ? 'top' : (win.snapped ?? null)
}

/** Flags for a window docked on `zone`; `null` clears both. */
export function dockFlags(zone: SnapZone | null): {
  maximized: boolean
  snapped: SnapSide | undefined
} {
  return {
    maximized: zone === 'top',
    snapped: zone === 'left' || zone === 'right' ? zone : undefined,
  }
}

/**
 * Clamp a window's top-left position into the viewport for `move`.
 * Matches the original `clampToViewport` in `use-os-windows.ts`. A gesture
 * passes the `viewport` it measured when it started.
 */
export function clampWindowToViewport(
  x: number,
  y: number,
  viewport: Size | null = viewportSize()
): { x: number; y: number } {
  const px = artPixel()
  if (!viewport) return { x: snapToArt(x, px), y: snapToArt(y, px) }
  const m = MOVE_VIEWPORT_MARGIN
  const nx = Math.max(
    artPx(m.minX, px),
    Math.min(floorToArt(viewport.w - artPx(m.right, px), px), snapToArt(x, px))
  )
  const ny = Math.max(
    artPx(m.minY, px),
    Math.min(floorToArt(viewport.h - artPx(m.bottom, px), px), snapToArt(y, px))
  )
  return { x: nx, y: ny }
}

/**
 * Usable desktop area: the viewport minus the menubar, the taskbar and the
 * side gutter. A maximized window fills it (1200x600 SSR fallback).
 * `safeBottom` is the bottom safe-area inset the taskbar is lifted by; pass
 * it in (see `measureDesktopArea`) so a docked window stays clear of it.
 */
export function desktopArea(safeBottom = 0): Rect {
  const px = artPixel()
  const x = artPx(MAXIMIZED_INSET.side, px)
  const y = artPx(MAXIMIZED_INSET.top, px)
  if (typeof window === 'undefined') return { x, y, w: 1200, h: 600 }
  return {
    x,
    y,
    w: floorToArt(window.innerWidth - 2 * x, px),
    h: floorToArt(
      window.innerHeight - y - artPx(MAXIMIZED_INSET.bottom, px) - safeBottom,
      px
    ),
  }
}

/**
 * Clamp a resize patch against the viewport and the minimum size (CSS px),
 * snapped to art px. Matches the original clamp inside `resize` in
 * `use-os-windows.ts` (mins 0/16, margins 8/40 art px, 4096 SSR fallback).
 */
export function clampResize(
  current: Rect,
  patch: Partial<Rect>,
  minW: number,
  minH: number,
  viewport: Size | null = viewportSize()
): Rect {
  const px = artPixel()
  const m = RESIZE_VIEWPORT_MARGIN
  const snap = (value: number) => snapToArt(value, px)
  const nextW = Math.max(snap(minW), snap(patch.w ?? current.w))
  const nextH = Math.max(snap(minH), snap(patch.h ?? current.h))
  const maxWidth = viewport
    ? floorToArt(viewport.w - artPx(m.right, px), px)
    : m.ssrFallback
  const maxHeight = viewport
    ? floorToArt(viewport.h - artPx(m.bottom, px), px)
    : m.ssrFallback
  return {
    x: Math.max(
      artPx(m.minX, px),
      Math.min(maxWidth - snap(minW), snap(patch.x ?? current.x))
    ),
    y: Math.max(
      artPx(m.minY, px),
      Math.min(maxHeight - snap(minH), snap(patch.y ?? current.y))
    ),
    w: Math.min(maxWidth, nextW),
    h: Math.min(maxHeight, nextH),
  }
}

/** {@link clampResize} with the window's own minimum size, or the default. */
export function clampWindowRect(
  win: MinSize,
  rect: Rect,
  patch: Partial<Rect>,
  viewport?: Size | null
): Rect {
  return clampResize(
    rect,
    patch,
    win.minW ?? artPx(DEFAULT_MIN_SIZE.w),
    win.minH ?? artPx(DEFAULT_MIN_SIZE.h),
    viewport
  )
}

/**
 * Snap zone under a pointer, or `null` when it is not at an edge. The side
 * zones start where the desktop area ends; the top zone is the strip of
 * menubar above the highest spot a title bar can sit, so a window parked at
 * the top can still be grabbed without maximizing. Takes a plain point so it
 * works for any input event.
 */
export function snapZoneAt(point: Point, area: Rect): SnapZone | null {
  if (point.x <= area.x) return 'left'
  if (point.x >= area.x + area.w) return 'right'
  if (point.y <= artPx(MOVE_VIEWPORT_MARGIN.minY)) return 'top'
  return null
}

/**
 * A rect moved, and shrunk where it must, to lie inside `area`: a new window
 * opens whole on the desktop, whatever the viewport and the art pixel.
 */
export function fitInArea(rect: Rect, area: Rect): Rect {
  const w = Math.min(rect.w, area.w)
  const h = Math.min(rect.h, area.h)
  return {
    x: Math.max(area.x, Math.min(rect.x, area.x + area.w - w)),
    y: Math.max(area.y, Math.min(rect.y, area.y + area.h - h)),
    w,
    h,
  }
}

/**
 * Rect a window takes when dropped on `zone`: a half, or the whole area (as
 * `desktopArea` measures it, in whole art px). A half is never narrower than
 * `minW`, up to the full width of the area, and is whole art px too.
 */
export function snapBounds(
  zone: SnapZone,
  area: Rect,
  minW: number = artPx(DEFAULT_MIN_SIZE.w)
): Rect {
  if (zone === 'top') return area
  const px = artPixel()
  const half = floorToArt(area.w / 2, px)
  const w = Math.min(area.w, Math.max(snapToArt(minW, px), half))
  return {
    x: zone === 'left' ? area.x : area.x + area.w - w,
    y: area.y,
    w,
    h: area.h,
  }
}

/**
 * Rect for a snapped or maximized window that is being dragged loose: its
 * previous size, placed so the pointer keeps the same relative spot on the
 * title bar (same fraction across, same distance down).
 */
export function undockRect(
  size: { w: number; h: number },
  docked: Rect,
  point: Point
): Rect {
  const fraction = docked.w > 0 ? (point.x - docked.x) / docked.w : 0.5
  return {
    x: snapToArt(point.x - size.w * Math.min(1, Math.max(0, fraction))),
    y: docked.y,
    w: size.w,
    h: size.h,
  }
}
