/**
 * The README pixel palette, the only colours ShiroOS art and tokens use.
 *
 * Source of truth: `aseprite-demo/readme/STYLE.md` (the GitHub profile set the
 * OS has to belong with). Shared by `scripts/gen-tokens.mjs` (tokens and the
 * contrast gate) and the art scripts next to this file (`check-art.mjs` for
 * palette membership, `gen-chrome.mjs` for the paper recolour).
 *
 * STYLE.md allows at most three added colours; the OS adds none.
 */

/** Ramps in STYLE.md order, dark to light where a ramp has a direction. */
export const PALETTE = {
  night: [
    '#0b1420',
    '#13253a',
    '#173a45',
    '#1f5058',
    '#2e6e6e',
    '#4fa3a0',
    '#8fe0cf',
    '#d8fff2',
  ],
  warm: [
    '#2a1a1c',
    '#4a2b25',
    '#6e4030',
    '#9a5f3c',
    '#c98a4a',
    '#f0c070',
    '#fff2c8',
  ],
  peach: ['#82383a', '#c86848', '#f0a068', '#f2b07a'],
  skin: [
    '#a8604c',
    '#d89070',
    '#f0b890',
    '#94584a',
    '#b27868',
    '#c48470',
    '#e2a684',
  ],
  red: ['#c23a3a', '#7a1e2a'],
  neutral: ['#e8e4dc', '#9aa4a8', '#3b3040', '#5a5e8c'],
  accent: ['#3a6ac8', '#3a9a4a'],
}

/** Every palette colour, lower-case `#rrggbb`. */
export const PALETTE_HEX = Object.values(PALETTE).flat()

/**
 * Colours only the procedural sky bands use, never a sprite pixel or a token
 * behind text. The first three are the `skyOnlyColors` of the wallpaper
 * document (`portfolio-os/art/wallpaper-palette.json`); the last two are the
 * blues of the living README's day sky (`living/layers/sky_day.png`).
 */
export const SKY_COLOURS = [
  '#201e3e',
  '#62305c',
  '#9a88b4',
  '#5f8fce',
  '#8fb9de',
]

/**
 * Night colour of a window, sheet or card body and the paper colour it becomes
 * when the Lamp is on (SPEC 2.2). The chrome generator applies it to the
 * slices that are bodies; menu bar, taskbar and wallpaper stay night in both
 * modes, so their slices are not recoloured.
 *
 * Keys and values are palette colours, so a recoloured slice still passes
 * the palette check.
 */
export const PAPER_RECOLOUR = {
  // surfaces
  '#13253a': '#e8e4dc', // --surf: window bodies
  '#173a45': '#fff2c8', // --surf-raised: cards, wells
  // foregrounds drawn into the art
  '#e8e4dc': '#13253a', // --ink
  '#9aa4a8': '#4a2b25', // --meta
  '#f0c070': '#6e4030', // lamp heading -> --heading
  '#8fe0cf': '#1f5058', // --link
  '#f0a068': '#7a1e2a', // --error
  '#4fa3a0': '#2e6e6e', // --frame: input borders
}

/** `#rgb`, `#rrggbb` or `#rrggbbaa` to lower-case `#rrggbb` (alpha dropped). */
export function normalizeHex(value) {
  const hex = value.trim().toLowerCase()
  if (/^#[0-9a-f]{3}$/.test(hex)) {
    return `#${[...hex.slice(1)].map((c) => c + c).join('')}`
  }
  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(hex)) return hex.slice(0, 7)
  throw new Error(`not a hex colour: ${value}`)
}

/** `[r, g, b]` (0..255) to `#rrggbb`. */
export function toHex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}
