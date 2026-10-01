/**
 * Pure geometry math for the ShiroOS window manager.
 *
 * Two surfaces share this math but with intentionally different offset
 * constants, preserved here as named values rather than blind-merged:
 *
 * - `useOsWindows` (move + maximize + new-window cascade) uses
 *   {@link MOVE_VIEWPORT_MARGIN} / {@link MAXIMIZED_INSET} / {@link CASCADE_OFFSET}.
 * - `Window` (pointer-resize clamp) uses {@link RESIZE_VIEWPORT_MARGIN}.
 *
 * Functions are SSR-safe: they read `window` only at call time and fall back
 * to sensible defaults when it is unavailable.
 */

/** Margins used when clamping a moved window into the viewport (use-os-windows). */
export const MOVE_VIEWPORT_MARGIN = {
  /** Smallest allowed left edge. */
  minX: 4,
  /** Smallest allowed top edge. */
  minY: 32,
  /** Right edge keeps this much of the window reachable past `innerWidth`. */
  right: 200,
  /** Bottom edge keeps this much of the window reachable past `innerHeight`. */
  bottom: 100,
} as const

/** Inset of the usable desktop area from the viewport edges. */
export const MAXIMIZED_INSET = { top: 44, bottom: 64, side: 8 } as const

/** Cascade origin + per-window step for newly opened project windows. */
export const CASCADE_OFFSET = {
  baseX: 200,
  baseY: 110,
  stepX: 20,
  stepY: 18,
} as const

/** Margins used when clamping a resized window (window.tsx pointer resize). */
export const RESIZE_VIEWPORT_MARGIN = {
  /** Reserved width past `innerWidth` (matches the desktop chrome gutter). */
  right: 16,
  /** Reserved height past `innerHeight` (taskbar + menubar). */
  bottom: 80,
  /** Smallest allowed left edge. */
  minX: 0,
  /** Smallest allowed top edge. */
  minY: 32,
  /** Fallback dimension when there is no viewport (SSR). */
  ssrFallback: 4096,
} as const

/** Smallest size a window can be resized to unless it sets its own. */
export const DEFAULT_MIN_SIZE = { w: 320, h: 240 } as const

/** Pointer travel before a drag pulls a snapped or maximized window loose. */
export const UNDOCK_DRAG_THRESHOLD = 4

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
 * Matches the original `clampToViewport` in `use-os-windows.ts`.
 */
export function clampWindowToViewport(
  x: number,
  y: number
): { x: number; y: number } {
  if (typeof window === 'undefined') return { x, y }
  const nx = Math.max(
    MOVE_VIEWPORT_MARGIN.minX,
    Math.min(window.innerWidth - MOVE_VIEWPORT_MARGIN.right, x)
  )
  const ny = Math.max(
    MOVE_VIEWPORT_MARGIN.minY,
    Math.min(window.innerHeight - MOVE_VIEWPORT_MARGIN.bottom, y)
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
  if (typeof window === 'undefined') {
    return { x: MAXIMIZED_INSET.side, y: MAXIMIZED_INSET.top, w: 1200, h: 600 }
  }
  return {
    x: MAXIMIZED_INSET.side,
    y: MAXIMIZED_INSET.top,
    w: window.innerWidth - MAXIMIZED_INSET.side * 2,
    h:
      window.innerHeight -
      MAXIMIZED_INSET.top -
      MAXIMIZED_INSET.bottom -
      safeBottom,
  }
}

/**
 * Cascade origin for a newly opened window, offset by how many windows are
 * already open. Matches the original inline math in `openProject`.
 */
export function cascadeOrigin(openCount: number): { x: number; y: number } {
  return {
    x: CASCADE_OFFSET.baseX + openCount * CASCADE_OFFSET.stepX,
    y: CASCADE_OFFSET.baseY + openCount * CASCADE_OFFSET.stepY,
  }
}

/**
 * Clamp a resize patch against the viewport and per-window min size.
 * Matches the original clamp inside `resize` in `use-os-windows.ts`
 * (mins 0/32, margins 16/80, 4096 SSR fallback).
 */
export function clampResize(
  current: Rect,
  patch: Partial<Rect>,
  minW: number,
  minH: number
): Rect {
  const nextW = Math.max(minW, patch.w ?? current.w)
  const nextH = Math.max(minH, patch.h ?? current.h)
  const maxWidth =
    typeof window !== 'undefined'
      ? window.innerWidth - RESIZE_VIEWPORT_MARGIN.right
      : RESIZE_VIEWPORT_MARGIN.ssrFallback
  const maxHeight =
    typeof window !== 'undefined'
      ? window.innerHeight - RESIZE_VIEWPORT_MARGIN.bottom
      : RESIZE_VIEWPORT_MARGIN.ssrFallback
  return {
    x: Math.max(
      RESIZE_VIEWPORT_MARGIN.minX,
      Math.min(maxWidth - minW, patch.x ?? current.x)
    ),
    y: Math.max(
      RESIZE_VIEWPORT_MARGIN.minY,
      Math.min(maxHeight - minH, patch.y ?? current.y)
    ),
    w: Math.min(maxWidth, nextW),
    h: Math.min(maxHeight, nextH),
  }
}

/** {@link clampResize} with the window's own minimum size, or the default. */
export function clampWindowRect(
  win: MinSize,
  rect: Rect,
  patch: Partial<Rect>
): Rect {
  return clampResize(
    rect,
    patch,
    win.minW ?? DEFAULT_MIN_SIZE.w,
    win.minH ?? DEFAULT_MIN_SIZE.h
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
  if (point.y <= MOVE_VIEWPORT_MARGIN.minY) return 'top'
  return null
}

/**
 * Rect a window takes when dropped on `zone`: a half, or the whole area. A
 * half is never narrower than `minW`, up to the full width of the area.
 */
export function snapBounds(
  zone: SnapZone,
  area: Rect,
  minW: number = DEFAULT_MIN_SIZE.w
): Rect {
  if (zone === 'top') return area
  const w = Math.min(area.w, Math.max(minW, Math.floor(area.w / 2)))
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
    x: Math.round(point.x - size.w * Math.min(1, Math.max(0, fraction))),
    y: docked.y,
    w: size.w,
    h: size.h,
  }
}
