import {
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteId,
} from '@/lib/os/palettes.generated'

export { DEFAULT_PALETTE, PALETTES }
export type { PaletteId }

/** Light or dark ground. Orthogonal to the palette — every palette has both. */
export type Mode = 'light' | 'dark'

/**
 * Appearance is two independent axes. Keeping them as one value means the
 * hook, the boot script, and storage all agree on what "current" means
 * instead of each tracking half of it.
 */
export interface Appearance {
  mode: Mode
  palette: PaletteId
}

export const MODE_STORAGE_KEY = 'shiroos:theme'
export const PALETTE_STORAGE_KEY = 'shiroos:palette'

export const DEFAULT_APPEARANCE: Appearance = {
  mode: 'light',
  palette: DEFAULT_PALETTE,
}

const PALETTE_IDS: readonly string[] = PALETTES.map((p) => p.id)

export function isPaletteId(value: unknown): value is PaletteId {
  return typeof value === 'string' && PALETTE_IDS.includes(value)
}

export function isMode(value: unknown): value is Mode {
  return value === 'light' || value === 'dark'
}

/**
 * localStorage is untyped input, so both axes are parsed rather than cast.
 * A key written by an older build (or by hand) falls back to the default.
 */
export function readStoredAppearance(): Appearance {
  if (typeof window === 'undefined') return DEFAULT_APPEARANCE
  try {
    const mode = window.localStorage.getItem(MODE_STORAGE_KEY)
    const palette = window.localStorage.getItem(PALETTE_STORAGE_KEY)
    return {
      mode: isMode(mode) ? mode : DEFAULT_APPEARANCE.mode,
      palette: isPaletteId(palette) ? palette : DEFAULT_APPEARANCE.palette,
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

export function writeStoredAppearance(next: Appearance) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, next.mode)
    window.localStorage.setItem(PALETTE_STORAGE_KEY, next.palette)
  } catch {
    // Private mode or a full quota. The class and attribute are already on
    // the document, so the current session still looks right.
  }
}

/** Both axes land on <html>: the mode as a class, the palette as an attribute. */
export function applyAppearance({ mode, palette }: Appearance) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.dataset.palette = palette
}

/**
 * Runs before first paint, from a blocking inline <script> in the document
 * head. Without it the server-rendered default paints for a frame before
 * React applies the stored appearance, which reads as a flash of the wrong
 * palette on every load.
 *
 * The default is written first so a throwing localStorage (private mode,
 * blocked cookies) still leaves the document with a palette; every token in
 * palettes.css is attribute-scoped, so an unset attribute renders unstyled.
 */
export const APPEARANCE_BOOT_SCRIPT = [
  '(function(){var r=document.documentElement;',
  `r.dataset.palette=${JSON.stringify(DEFAULT_PALETTE)};`,
  'try{',
  `var m=localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});`,
  "if(m==='dark')r.classList.add('dark');",
  `var p=localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});`,
  `if(${JSON.stringify(PALETTE_IDS)}.indexOf(p)>-1)r.dataset.palette=p;`,
  '}catch(e){}})()',
].join('')
