import { type Rect, desktopArea } from './geometry'

/**
 * Small DOM predicates and reads shared by the shell's keyboard, focus and
 * window handling.
 */

/** Attribute a rendered window carries its id in. */
export const WINDOW_ID_ATTRIBUTE = 'data-window-id'

/** Marks the title bar of a window: the stop keyboard users land on. */
export const WINDOW_TITLE_BAR_ATTRIBUTE = 'data-window-title-bar'

/**
 * Set on the shell root while the desktop is covered (see `AmbientPause`),
 * and on the document root while a window is dragged or resized: both hold
 * the decorative loops still (`ambient-loop` in globals.css).
 */
export const AMBIENT_ATTRIBUTE = 'data-ambient'
export const AMBIENT_PAUSED = 'paused'
export const GESTURE_ATTRIBUTE = 'data-gesture'

/** Mark a window gesture as running, or as over. */
export function markGesture(active: boolean) {
  document.documentElement.toggleAttribute(GESTURE_ATTRIBUTE, active)
}

const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

/** Whether `node` is a field the user types or picks in. */
export function isEditable(node: unknown): node is HTMLElement {
  return node instanceof HTMLElement && node.matches(EDITABLE_SELECTOR)
}

/** The element focus is on, or `null` when it sits on the page itself. */
export function focusedElement(): HTMLElement | null {
  const active = document.activeElement
  return active instanceof HTMLElement && active !== document.body
    ? active
    : null
}

/** Whether `element` is on the page, rendered, and not under an inert layer. */
export function canTakeFocus(
  element: HTMLElement | null | undefined
): element is HTMLElement {
  return (
    element != null &&
    element.isConnected &&
    element.closest('[inert]') === null &&
    element.getClientRects().length > 0
  )
}

/**
 * Live regions (the toaster, status lines) stay reachable while a modal layer
 * is open: they are never made inert and focus may rest in them.
 */
export function isLiveRegion(node: Element): boolean {
  return node.closest('[aria-live]') !== null
}

/**
 * Bottom safe-area inset in px (the home indicator), read from
 * `--safe-area-bottom` on the root; see globals.css.
 */
export function safeAreaBottom(): number {
  if (typeof document === 'undefined') return 0
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    '--safe-area-bottom'
  )
  return Number.parseFloat(value) || 0
}

/** The desktop area as it is now, clear of the taskbar and its safe area. */
export function measureDesktopArea(): Rect {
  return desktopArea(safeAreaBottom())
}
