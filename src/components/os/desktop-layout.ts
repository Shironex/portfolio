/**
 * The desktop's layout, in art px (Tailwind spacing counts `--px`), shared
 * by OsShell and the server `StaticHero` so the first paint and the shell
 * put the hero in the same place (SPEC 4.5).
 *
 * At 1440x900 the desktop is 720x450 art px at DPR 1 and 2, and 600x375 at
 * DPR 1.25, where the whole UI is 20% larger. Everything sits between the
 * menu bar (20) and the floating taskbar (28 plus 4 below), 4 clear of it:
 *
 *   icons    a column at the left edge, 44 wide
 *   hero     from x 58, up to 384 wide, as tall as its content; from y 44,
 *            under the moon (the wallpaper's, at 168, 26), or from y 26 on
 *            a desktop under 436 art px tall (`short-desk`), which also
 *            drops the activity strip
 *   panels   the terminal and featured work, 224 wide at the right edge,
 *            from 1280 css px up (below that the hero has the desktop);
 *            the terminal drops under 344 art px (`low-desk`); new
 *            windows open left of them (`panelColumnLeft`)
 *
 * The space between the hero and the panels is wallpaper. On a desktop too
 * short for the whole hero even so, its proof lines drop from the last one
 * up (`HeroText`), so nothing reaches under the taskbar.
 */

/** Under the menu bar, over the taskbar, right of the icon column. */
export const DESKTOP_CONTENT_CLASS =
  'relative flex h-dvh flex-col pt-44 pr-6 pb-36 pl-58 md:short-desk:pt-26'

/** The hero on the left, the panels pinned right, wallpaper between. */
export const DESKTOP_ROW_CLASS =
  'flex min-h-0 flex-1 items-start justify-between gap-8'

/** The hero's slot in the row: never taller than the row. */
export const DESKTOP_HERO_CLASS = 'max-h-full min-w-0 max-w-384 flex-1'

/** The panel column. */
export const DESKTOP_PANELS_CLASS =
  'flex w-224 flex-none flex-col gap-8 max-xl:hidden'

/** The terminal's slot in the panel column. */
export const DESKTOP_TERMINAL_CLASS = 'low-desk:hidden'

/**
 * The panel column in numbers, for script that keeps new windows off it
 * (`lib/os/window-factory.ts`): its width and the content's right padding
 * in art px, and the query it shows from (Tailwind's `xl`). They match
 * `w-224`, `pr-6` and `max-xl:hidden` above; change them together.
 */
export const PANEL_COLUMN = {
  width: 224,
  rightPad: 6,
  query: '(width >= 80rem)',
} as const

/**
 * The left edge of the panel column in CSS px at art pixel `px`, or `null`
 * where the column is hidden (under `xl`, or on the server).
 */
export function panelColumnLeft(px: number): number | null {
  if (typeof window === 'undefined') return null
  if (!window.matchMedia(PANEL_COLUMN.query).matches) return null
  return window.innerWidth - (PANEL_COLUMN.width + PANEL_COLUMN.rightPad) * px
}
