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

/** Inset used to compute maximize bounds (use-os-windows). */
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

interface Rect {
  x: number
  y: number
  w: number
  h: number
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
 * Maximize bounds for a window. Matches the original `viewportGeometry`
 * in `use-os-windows.ts` (1200×600 SSR fallback).
 */
export function maximizeBounds(): Rect {
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
