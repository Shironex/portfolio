/**
 * The art pixel (SPEC 2.1): one pixel of the drawn art is `--px` CSS pixels,
 * a whole number of device pixels (2 at DPR 1 and 2, 2.4 at 1.25, 2.29 at
 * 1.75). The boot script in `appearance.ts` sets it on <html> before first
 * paint, and again when the resolution changes (browser zoom, a move to
 * another screen), firing `shiroos:px` on window. Spacing utilities count in
 * it (`--spacing: var(--px)`); script that places art (window rects, drag
 * deltas, sprites) snaps to it with the helpers here.
 */

/** `--px` before the boot script runs, on the server and without JavaScript. */
export const DEFAULT_ART_PIXEL = 2

/** Fired on window by the boot script after it sets a new `--px`. */
export const ART_PIXEL_EVENT = 'shiroos:px'

let cached: number | null = null

function read(): number {
  if (typeof document === 'undefined') return DEFAULT_ART_PIXEL
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--px')
  )
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_ART_PIXEL
}

if (typeof window !== 'undefined') {
  window.addEventListener(ART_PIXEL_EVENT, () => {
    cached = null
  })
}

/** CSS pixels per art pixel, read once and again after each change. */
export function artPixel(): number {
  cached ??= read()
  return cached
}

/** Calls `listener` with the new size after every change; returns the unsubscribe. */
export function onArtPixelChange(listener: (px: number) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = () => listener(artPixel())
  window.addEventListener(ART_PIXEL_EVENT, handler)
  return () => window.removeEventListener(ART_PIXEL_EVENT, handler)
}

/**
 * A CSS length rid of float noise (`41 * 2.4` is `98.39999999999999`), so a
 * snapped length is written as `98.4px` and compares equal to itself.
 */
function tidy(value: number): number {
  return Math.round(value * 1e4) / 1e4
}

/** `n` art pixels in CSS pixels. */
export function artPx(n: number, px = artPixel()): number {
  return tidy(n * px)
}

/** A CSS length snapped to the nearest whole number of art pixels. */
export function snapToArt(value: number, px = artPixel()): number {
  return tidy(Math.round(value / px) * px)
}

/** A CSS length snapped down to a whole number of art pixels. */
export function floorToArt(value: number, px = artPixel()): number {
  return tidy(Math.floor(value / px + 1e-6) * px)
}
