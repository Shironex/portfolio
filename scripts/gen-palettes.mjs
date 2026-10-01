/**
 * Generates `src/styles/palettes.css` from the palette table below and gates
 * every palette on WCAG AA contrast. Run it after editing a colour:
 *
 *   node scripts/gen-palettes.mjs          write the stylesheet and the TS mirror
 *   node scripts/gen-palettes.mjs --check  fail if either file is stale
 *                                          (`pnpm palettes:check`, part of `pnpm lint`)
 *   node scripts/gen-palettes.mjs --report print every gated pairing with its
 *                                          worst ratio per palette and mode
 *
 * The table is the only place a ShiroOS colour is written down. Component code
 * never carries a hex; it paints with an accent role that resolves to one of
 * these variables (see `src/components/os/accent-map.ts`), so a palette swap
 * reaches every surface at once.
 *
 * `--color-cloud` means "the foreground that sits on a filled accent", not
 * "cream". In light mode that is the paper colour; in dark mode it is the deep
 * ground, because cream on a bright accent lands near 1.5:1.
 */
import { readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSS_OUT = join(ROOT, 'src', 'styles', 'palettes.css')
const TS_OUT = join(ROOT, 'src', 'lib', 'os', 'palettes.generated.ts')

/**
 * Per palette, per mode:
 *   acc/acc2/acc3  accent, pressed, bright        -> --color-miku{,-2,-3}
 *   sec/sec2       warm counterpoint, its light   -> --color-peach{,-2}
 *   sky0..3        wallpaper gradient + fills     -> --shiro-sky-{0..3}
 *   surfSolid/Soft opaque panel surfaces          -> --shiro-surf-{solid,soft}
 *   surfRgb        translucent chrome base        -> --shiro-surf-{0,1,2}
 *   ink..ink4      text, brightest to faintest    -> --shiro-ink{,-2,-3,-4}
 *                  (all four are body text: ink4 is the faintest that still
 *                  reaches 4.5:1 on every ground, a selected row included)
 *   inkRgb         hairlines, shadows, scrollbar
 *   cloud          foreground on a filled accent  -> --color-cloud
 *   danger         destructive fill               -> --color-danger
 *   dangerInk      danger as text on a surface, and the fill under `cloud`
 *                  on a hovered close button      -> --color-danger-ink
 *                  (light only: the dark danger already reads as text)
 *
 * An accent is a fill. As a foreground it is too pale in light mode and, for
 * the pressed shade, too dim in dark mode, so each one also gets two derived
 * foregrounds (see `foregrounds`): `-ink` for text (4.5:1) and `-icon` for
 * icons (3:1), on every surface and on its own tint. Nobody writes those
 * down: they are the accent itself, moved in lightness just far enough, and
 * then far enough from the neighbouring accent to stay a colour of their own.
 */
export const PALETTES = [
  {
    id: 'teal',
    name: 'Teal',
    light: {
      acc: '#0f7c74', acc2: '#0a5954', acc3: '#1ca59b',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fbf7ed', sky1: '#f5efe0', sky2: '#ece4d0', sky3: '#ddd2b8',
      surfSolid: '#fdfaf0', surfSoft: '#f7f2e3', surfRgb: '253, 249, 237',
      ink: '#1a1714', ink2: '#3a3530', ink3: '#5f564b', ink4: '#6d6356',
      inkRgb: '26, 23, 20', cloud: '#fbf7ed', danger: '#ff5b6a', dangerInk: '#b8243a',
    },
    dark: {
      acc: '#42ccc2', acc2: '#22a097', acc3: '#6fdfd6',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#02110f', sky1: '#041816', sky2: '#06211e', sky3: '#082a26',
      surfSolid: '#0a2a26', surfSoft: '#061d1a', surfRgb: '12, 42, 38',
      ink: '#eaf4ec', ink2: '#bfd4cc', ink3: '#93afa5', ink4: '#81a59c',
      inkRgb: '234, 244, 236', cloud: '#02110f', danger: '#ff7c88',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    light: {
      acc: '#9e2f52', acc2: '#78203c', acc3: '#c75d7e',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fcf6f1', sky1: '#f7eee6', sky2: '#efe2d8', sky3: '#e2cfc4',
      surfSolid: '#fefaf6', surfSoft: '#f8f1ea', surfRgb: '254, 250, 246',
      ink: '#1c1512', ink2: '#3d322e', ink3: '#63524d', ink4: '#715f59',
      inkRgb: '28, 21, 18', cloud: '#fdf6f2', danger: '#e0453f', dangerInk: '#b32a25',
    },
    dark: {
      acc: '#e8809f', acc2: '#cf5c7f', acc3: '#f5a8bf',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#150409', sky1: '#1c0710', sky2: '#250a16', sky3: '#2f0e1d',
      surfSolid: '#2b0c18', surfSoft: '#1e0710', surfRgb: '43, 12, 24',
      ink: '#f6e9ec', ink2: '#dcc3cb', ink3: '#b799a2', ink4: '#a58690',
      inkRgb: '246, 233, 236', cloud: '#150409', danger: '#ff7c88',
    },
  },
  {
    id: 'ai',
    name: 'Ai',
    light: {
      acc: '#2f4d99', acc2: '#21376f', acc3: '#5674c4',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#f8f7f2', sky1: '#f1efe6', sky2: '#e6e3d6', sky3: '#d5d1c0',
      surfSolid: '#fbfaf6', surfSoft: '#f3f1e9', surfRgb: '251, 250, 246',
      ink: '#17181c', ink2: '#34363d', ink3: '#565a63', ink4: '#5f626a',
      inkRgb: '23, 24, 28', cloud: '#f8f7f2', danger: '#d84a52', dangerInk: '#b22d36',
    },
    dark: {
      acc: '#7d9bea', acc2: '#5a79cc', acc3: '#a8bdf5',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#05070f', sky1: '#080b18', sky2: '#0b0f20', sky3: '#0f1429',
      surfSolid: '#0f1530', surfSoft: '#080c1c', surfRgb: '15, 21, 48',
      ink: '#e8ecf7', ink2: '#c3cbe0', ink3: '#9aa3bd', ink4: '#858ea8',
      inkRgb: '232, 236, 247', cloud: '#05070f', danger: '#ff7c88',
    },
  },
  {
    id: 'kohaku',
    name: 'Kohaku',
    light: {
      acc: '#8a5a12', acc2: '#63400a', acc3: '#c9902f',
      sec: '#a4472e', sec2: '#c25f43',
      sky0: '#fdf8ea', sky1: '#f8f0dc', sky2: '#f0e5c8', sky3: '#e3d3ac',
      surfSolid: '#fffbef', surfSoft: '#faf3e0', surfRgb: '255, 251, 239',
      ink: '#1c1710', ink2: '#3d352a', ink3: '#635744', ink4: '#70634f',
      inkRgb: '28, 23, 16', cloud: '#fdf8ea', danger: '#c0392b', dangerInk: '#a82f22',
    },
    dark: {
      acc: '#e0a63c', acc2: '#bd8624', acc3: '#f2c877',
      sec: '#d97a55', sec2: '#e89778',
      sky0: '#120c02', sky1: '#191204', sky2: '#221907', sky3: '#2c210a',
      surfSolid: '#2a1f08', surfSoft: '#1c1405', surfRgb: '42, 31, 8',
      ink: '#f6efdd', ink2: '#dccbab', ink3: '#b8a682', ink4: '#a89675',
      inkRgb: '246, 239, 221', cloud: '#120c02', danger: '#ff7c66',
    },
  },
  {
    id: 'fuji',
    name: 'Fuji',
    light: {
      acc: '#6b3d9e', acc2: '#4f2a78', acc3: '#9268c9',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#faf7f6', sky1: '#f3eff0', sky2: '#e8e2e6', sky3: '#d6ced5',
      surfSolid: '#fdfbfb', surfSoft: '#f6f2f4', surfRgb: '253, 251, 251',
      ink: '#1a161d', ink2: '#38323e', ink3: '#5b5363', ink4: '#686170',
      inkRgb: '26, 22, 29', cloud: '#faf7f6', danger: '#cc3b48', dangerInk: '#ad2a38',
    },
    dark: {
      acc: '#b596ea', acc2: '#9370d1', acc3: '#d0bcf7',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#0b0514', sky1: '#10081c', sky2: '#160c26', sky3: '#1d1030',
      surfSolid: '#1b1030', surfSoft: '#120823', surfRgb: '27, 16, 48',
      ink: '#efeaf7', ink2: '#cec5e0', ink3: '#a89dbd', ink4: '#948aa8',
      inkRgb: '239, 234, 247', cloud: '#0b0514', danger: '#ff7c88',
    },
  },
  {
    id: 'sumi',
    name: 'Sumi',
    light: {
      acc: '#3b352d', acc2: '#221e19', acc3: '#6b6154',
      sec: '#b87a1e', sec2: '#cf8a33',
      sky0: '#fbf9f4', sky1: '#f4f1e9', sky2: '#e9e5da', sky3: '#d8d2c3',
      surfSolid: '#fdfcf7', surfSoft: '#f6f3ec', surfRgb: '253, 252, 247',
      ink: '#16130f', ink2: '#37322b', ink3: '#5c5449', ink4: '#696155',
      inkRgb: '22, 19, 15', cloud: '#fbf9f4', danger: '#b03a3a', dangerInk: '#9c3030',
    },
    dark: {
      acc: '#d8d0c2', acc2: '#b5ab9a', acc3: '#efe9dd',
      sec: '#e8b055', sec2: '#f0c477',
      sky0: '#0c0b09', sky1: '#12100d', sky2: '#191713', sky3: '#201d18',
      surfSolid: '#1c1a15', surfSoft: '#131110', surfRgb: '28, 26, 21',
      ink: '#f2eee6', ink2: '#cfc8bb', ink3: '#a49b8c', ink4: '#9c9486',
      inkRgb: '242, 238, 230', cloud: '#0c0b09', danger: '#e06a6a',
    },
  },
]

export const DEFAULT_PALETTE_ID = 'teal'

/* ------------------------------------------------------------------ */
/* colour maths                                                        */
/* ------------------------------------------------------------------ */

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** One sRGB channel, 0..1, to linear light and back. */
function toLinear(v) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function fromLinear(v) {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => toLinear(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function hex([r, g, b]) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

/**
 * `fg` at `alpha` over `bg`, blended in gamma space the way a browser
 * composites a translucent fill (`bg-miku/15`, `color-mix(..., transparent)`).
 */
function over(fg, alpha, bg) {
  const top = rgb(fg)
  return hex(rgb(bg).map((v, i) => top[i] * alpha + v * (1 - alpha)))
}

/** A colour as OKLCH: lightness 0..1, chroma, hue in radians. */
function toOklch(color) {
  const [r, g, b] = rgb(color).map((v) => toLinear(v / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const k = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    Math.hypot(a, k),
    Math.atan2(k, a),
  ]
}

/** Linear sRGB of an OKLCH colour; outside 0..1 when sRGB cannot show it. */
function oklchToLinear([lightness, chroma, hue]) {
  const a = chroma * Math.cos(hue)
  const k = chroma * Math.sin(hue)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * k) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * k) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * k) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/**
 * An OKLCH colour as hex. Where sRGB cannot hold the chroma at that lightness
 * (a deep or a very pale shade of a vivid accent), the chroma comes down to
 * the most the gamut has and the hue stays.
 */
function fromOklch([lightness, chroma, hue]) {
  const fits = (c) =>
    oklchToLinear([lightness, c, hue]).every((v) => v >= -1e-4 && v <= 1.0001)
  let most = chroma
  if (!fits(most)) {
    let none = 0
    for (let i = 0; i < 24; i += 1) {
      const mid = (none + most) / 2
      if (fits(mid)) none = mid
      else most = mid
    }
    most = none
  }
  return hex(
    oklchToLinear([lightness, most, hue]).map(
      (v) => fromLinear(Math.min(1, Math.max(0, v))) * 255
    )
  )
}

/* ------------------------------------------------------------------ */
/* contrast gate                                                       */
/* ------------------------------------------------------------------ */

/** WCAG AA: body text, then large text and meaningful non-text UI. */
const AA_TEXT = 4.5
const AA_ICON = 3

/**
 * Headroom of a derived foreground over its threshold, so the rounding of a
 * blend in a browser cannot land it a hundredth short.
 */
const MARGIN = 0.1

/**
 * Least contrast between the derived foregrounds of two neighbouring accents
 * (see `FAMILIES`). AA pulls every shade of an accent towards the same
 * lightness, and without this the pressed, the plain and the bright teal of an
 * avatar letter or a dock icon come out as one colour (1.02 to 1.07 apart).
 * At 1.3 two shades can be told apart side by side at text size; it holds in
 * every palette and mode, so no pair is exempt.
 */
const SEPARATION = 1.3

/**
 * Tint and glow strengths. A component cannot be gated on a number it writes
 * down itself, so the ones set in an inline style are emitted to
 * `palettes.generated.ts` (`TINT`, `GLOW`) and read from there. A Tailwind
 * class has to be a literal (`bg-miku/10`, `bg-peach/20`): those stay within
 * the ceiling named here.
 */

/** Strongest tint a badge or chip puts behind text of its own accent. */
const TEXT_TINT = 0.2
/** Strongest tint an icon tile puts behind an icon of its own accent. */
const ICON_TINT = 0.15
/** Tint of a selected row (`bg-miku/10`), which holds plain ink text. */
const ROW_TINT = 0.1
/** Ink over a filled button: the chip of a `Kbd` on it. */
const KBD_TINT = 0.2
/** The dots of the boot splash (`boot.tsx`): a finished and a waiting step. */
const BOOT_DONE_TINT = 0.3
const BOOT_WAIT_TINT = 0.05

/**
 * Glows (`orb`), by their strength at the centre: the two on the wallpaper
 * (`desktop-canvas.tsx`), the one in the hero, the one in the mobile closing
 * card, and the one in a project's accent on its detail hero.
 */
const WALLPAPER_GLOWS = [0.086, 0.092]
const HERO_GLOW = 0.2
const CARD_GLOW = 0.103
const DETAIL_GLOW = 0.405
/**
 * What is left of the detail glow at the first line of the summary under the
 * title, which starts about 80px below the centre of a 204px radius: a little
 * over half (see the stops of `orb`). Only the title, in full ink, is closer.
 */
const DETAIL_GLOW_AT_COPY = DETAIL_GLOW * 0.6
/**
 * What is left of a glow under the faint lines near it: the proof points and
 * the byline of the hero, the meta row of a project. Measured from 320px to
 * 1440px wide and for every project, all of them sit outside the glow (0%);
 * they are gated at a tenth of its centre, the strength at 70% of the radius,
 * so a shorter summary or a narrower card has room before a line has to move
 * up to `ink-2`.
 */
const GLOW_AT_EDGE = 0.1

/** The accents that are also used as a foreground, by token suffix. */
const ACCENTS = [
  ['miku', 'acc'],
  ['miku-2', 'acc2'],
  ['miku-3', 'acc3'],
  ['peach', 'sec'],
  ['peach-2', 'sec2'],
]

/**
 * Accents of one hue, darkest fill first: the accent with its pressed and its
 * bright shade, and the warm pair. Hue tells two families apart; within one
 * only lightness can, which is what `SEPARATION` keeps.
 */
const FAMILIES = [
  ['miku-2', 'miku', 'miku-3'],
  ['peach', 'peach-2'],
]

/**
 * Everything opaque that text or an icon can end up on: windows and sheets,
 * the soft chrome, and the three stops of the wallpaper gradient. The
 * translucent chrome (`--shiro-surf-0..2` over the wallpaper) always lands
 * between two of these, so it needs no row of its own.
 */
function grounds(t) {
  return [
    ['surf-solid', t.surfSolid],
    ['surf-soft', t.surfSoft],
    ['sky-0', t.sky0],
    ['sky-1', t.sky1],
    ['sky-2', t.sky2],
  ]
}

/** The wallpaper where the stronger of its glows is strongest. */
function wallpaperGlow(t) {
  const glow = Math.max(...WALLPAPER_GLOWS)
  return [
    ['glow on sky-0', over(t.acc, glow, t.sky0)],
    ['glow on sky-1', over(t.acc, glow, t.sky1)],
    ['glow on sky-2', over(t.acc, glow, t.sky2)],
  ]
}

/** The hero card under its glow, at `part` of the glow's centre. */
function heroGlow(t, part = 1) {
  return ['hero glow', over(t.acc3, HERO_GLOW * part, t.surfSolid)]
}

/** A project's detail hero under the glow of each accent, at `strength`. */
function detailGlows(t, strength) {
  return ACCENTS.map(([name, key]) => [
    `${name} detail glow`,
    over(t[key], strength, t.surfSoft),
  ])
}

/**
 * Every ground under a glow, each at its centre except the detail glow, which
 * is taken at `detail`. Headlines and running copy cross these; badges do not
 * (they are opaque under their tint).
 */
function glows(t, detail) {
  return [
    ...wallpaperGlow(t),
    heroGlow(t),
    ['card glow', over(t.acc, CARD_GLOW, t.surfSolid)],
    ...detailGlows(t, detail),
  ]
}

/** `backgrounds`, each one under a tint of `fill`. */
function under(backgrounds, fill, alpha, label) {
  return backgrounds.map(([name, bg]) => [
    `${label} on ${name}`,
    over(fill, alpha, bg),
  ])
}

/** `backgrounds`, plus each one under a tint of `fill`. */
function tinted(backgrounds, fill, alpha, label) {
  return [...backgrounds, ...under(backgrounds, fill, alpha, label)]
}

/** A strength as the percentage a component writes: `0.103` is `10.3`. */
function percent(strength) {
  return Number((strength * 100).toFixed(1))
}

/** Where text in an accent sits: any ground, bare or under the accent's tint. */
function inkGrounds(t, name, key) {
  return tinted(grounds(t), t[key], TEXT_TINT, `${name}/${percent(TEXT_TINT)}`)
}

/**
 * Where an icon in an accent sits: any ground, bare or under the accent's
 * tile, and the tile of a desktop icon over a wallpaper glow.
 */
function iconGrounds(t, name, key) {
  return tinted(
    [...grounds(t), ...wallpaperGlow(t)],
    t[key],
    ICON_TINT,
    `${name}/${percent(ICON_TINT)}`
  )
}

/** How far one step moves a colour: a quarter of a percent of lightness. */
const LIGHTNESS_STEP = 0.0025

/**
 * `color` with its lightness moved away from the ground, a step at a time,
 * until `passes`. The lightness is the OKLCH one and the hue and the chroma
 * are kept (see `fromOklch`), so the result reads as the same accent, only
 * deeper (or brighter in dark mode). A colour that already passes comes back
 * untouched; one that never does comes back untouched too, and the gate
 * reports it.
 */
function shifted(color, dark, passes) {
  if (passes(color)) return color
  const [lightness, chroma, hue] = toOklch(color)
  for (let step = 1; ; step += 1) {
    const next = lightness + (dark ? step : -step) * LIGHTNESS_STEP
    if (next < 0 || next > 1) return color
    const candidate = fromOklch([next, chroma, hue])
    if (passes(candidate)) return candidate
  }
}

/** `color`, moved until it reaches `min` on every one of `backgrounds`. */
function legible(color, min, backgrounds, dark) {
  return shifted(color, dark, (c) =>
    backgrounds.every(([, bg]) => contrast(c, bg) >= min)
  )
}

/**
 * `color`, moved until it is `SEPARATION` past `neighbour`, the shade of its
 * family that sits nearer the ground. Moving away from the ground only adds
 * to the contrast `legible` already found.
 */
function apart(color, neighbour, dark) {
  const edge = luminance(neighbour)
  return shifted(color, dark, (c) => {
    const beyond = dark ? luminance(c) > edge : luminance(c) < edge
    return beyond && contrast(c, neighbour) >= SEPARATION
  })
}

/** One `foregrounds` per palette and mode, however many callers ask. */
const derived = new Map()

/**
 * The derived foregrounds of one mode: per accent, `ink` for text and `icon`
 * for icons, each legible on every ground and on the accent's own tint, and
 * each `SEPARATION` away from its neighbours in the family. The shade nearest
 * the ground (the bright one in light mode, the pressed one in dark mode)
 * stays where AA put it and the others move on from there, so a role is
 * told apart by going deeper, never by giving up contrast.
 */
function foregrounds(t, mode) {
  const cached = derived.get(t)
  if (cached) return cached
  const dark = mode === 'dark'
  const fg = Object.fromEntries(
    ACCENTS.map(([name, key]) => [
      name,
      {
        ink: legible(t[key], AA_TEXT + MARGIN, inkGrounds(t, name, key), dark),
        icon: legible(
          t[key],
          AA_ICON + MARGIN,
          iconGrounds(t, name, key),
          dark
        ),
      },
    ])
  )
  for (const family of FAMILIES) {
    const outward = dark ? family : family.toReversed()
    for (const kind of ['ink', 'icon']) {
      outward.slice(1).forEach((name, i) => {
        fg[name][kind] = apart(fg[name][kind], fg[outward[i]][kind], dark)
      })
    }
  }
  derived.set(t, fg)
  return fg
}

/**
 * Every pairing the components rely on, for one palette in one mode:
 * `[name, foreground, backgrounds, minimum]`. The gate asserts each row and
 * `--report` prints them, so this list is the contract: a class that puts a
 * token on a ground has to be able to point at its row here.
 */
function pairings(t, mode) {
  const fg = foregrounds(t, mode)
  const row = [
    ...grounds(t),
    ...under(
      [
        ['surf-solid', t.surfSolid],
        ['surf-soft', t.surfSoft],
      ],
      t.acc,
      ROW_TINT,
      `miku/${percent(ROW_TINT)}`
    ),
  ]
  const edge = DETAIL_GLOW * GLOW_AT_EDGE
  return [
    ['ink', t.ink, [...row, ...glows(t, DETAIL_GLOW)], AA_TEXT],
    ['ink-2', t.ink2, [...row, ...glows(t, DETAIL_GLOW_AT_COPY)], AA_TEXT],
    [
      'ink-3',
      t.ink3,
      [...row, heroGlow(t, GLOW_AT_EDGE), ...detailGlows(t, edge)],
      AA_TEXT,
    ],
    ['ink-4', t.ink4, [...row, heroGlow(t, GLOW_AT_EDGE)], AA_TEXT],
    // Error text sits on windows, the soft chrome and the bare wallpaper.
    ['danger-ink', t.dangerInk ?? t.danger, grounds(t), AA_TEXT],
    // Filled buttons: resting, pressed, and the hovered close button.
    ['cloud on miku', t.cloud, [['miku', t.acc]], AA_TEXT],
    ['cloud on miku-2', t.cloud, [['miku-2', t.acc2]], AA_TEXT],
    [
      // `Kbd` on a filled button: a chip of ink over the fill.
      'cloud on an inked fill',
      t.cloud,
      [
        [`ink/${percent(KBD_TINT)} on miku`, over(t.ink, KBD_TINT, t.acc)],
        [`ink/${percent(KBD_TINT)} on miku-2`, over(t.ink, KBD_TINT, t.acc2)],
      ],
      AA_TEXT,
    ],
    [
      'cloud on danger-ink',
      t.cloud,
      [['danger-ink', t.dangerInk ?? t.danger]],
      AA_TEXT,
    ],
    // The `neutral` accent role (`accent-map.ts`): ink-3 on a tile of itself,
    // which in the command palette can sit on the selected row.
    [
      'neutral icon',
      t.ink3,
      tinted(row, t.ink3, ICON_TINT, `ink-3/${percent(ICON_TINT)}`),
      AA_ICON,
    ],
    [
      'neutral ink',
      t.ink2,
      tinted(row, t.ink3, TEXT_TINT, `ink-3/${percent(TEXT_TINT)}`),
      AA_TEXT,
    ],
    // The step dots of the boot splash; a running one is `miku-ink` on its tint.
    [
      'ink on a finished step',
      t.ink,
      under(
        grounds(t),
        t.acc3,
        BOOT_DONE_TINT,
        `miku-3/${percent(BOOT_DONE_TINT)}`
      ),
      AA_TEXT,
    ],
    [
      'ink-3 on a waiting step',
      t.ink3,
      under(
        grounds(t),
        t.ink,
        BOOT_WAIT_TINT,
        `ink/${percent(BOOT_WAIT_TINT)}`
      ),
      AA_TEXT,
    ],
    ...ACCENTS.flatMap(([name, key]) => [
      [`${name}-ink`, fg[name].ink, inkGrounds(t, name, key), AA_TEXT],
      [`${name}-icon`, fg[name].icon, iconGrounds(t, name, key), AA_ICON],
    ]),
    // Neighbouring accents, foreground against foreground.
    ...FAMILIES.flatMap((family) =>
      ['ink', 'icon'].flatMap((kind) =>
        family.slice(1).map((name, i) => [
          `${name}-${kind} from ${family[i]}-${kind}`,
          fg[name][kind],
          [[`${family[i]}-${kind}`, fg[family[i]][kind]]],
          SEPARATION,
        ])
      )
    ),
  ]
}

/** Each pairing with its worst background: `{ name, min, ratio, fg, on, bg }`. */
function measured(t, mode) {
  return pairings(t, mode).map(([name, fg, backgrounds, min]) => {
    const [on, bg] = backgrounds.reduce((worst, next) =>
      contrast(fg, next[1]) < contrast(fg, worst[1]) ? next : worst
    )
    return { name, min, ratio: contrast(fg, bg), fg, on, bg }
  })
}

const failures = []

function gate(palette, mode, t) {
  for (const { name, min, ratio, fg, on, bg } of measured(t, mode)) {
    if (ratio < min) {
      failures.push(
        `${palette}/${mode} ${name} on ${on}: ${ratio.toFixed(2)}:1 (needs ${min})  ${fg} on ${bg}`
      )
    }
  }
}

/* ------------------------------------------------------------------ */
/* emit                                                                */
/* ------------------------------------------------------------------ */

function tokens(t, mode) {
  const dark = mode === 'dark'
  const shadow = dark ? '0, 0, 0' : t.inkRgb
  const accRgb = rgb(t.acc).join(', ')
  const fg = foregrounds(t, mode)
  return [
    ['--color-miku', t.acc],
    ['--color-miku-2', t.acc2],
    ['--color-miku-3', t.acc3],
    ['--color-peach', t.sec],
    ['--color-peach-2', t.sec2],
    ['--color-cloud', t.cloud],
    ['--color-danger', t.danger],
    ['--color-danger-ink', t.dangerInk ?? t.danger],
    ...ACCENTS.flatMap(([name]) => [
      [`--color-${name}-ink`, fg[name].ink],
      [`--color-${name}-icon`, fg[name].icon],
    ]),
    ['--shiro-sky-0', t.sky0],
    ['--shiro-sky-1', t.sky1],
    ['--shiro-sky-2', t.sky2],
    ['--shiro-sky-3', t.sky3],
    ['--shiro-surf-0', `rgba(${t.surfRgb}, ${dark ? 0.5 : 0.6})`],
    ['--shiro-surf-1', `rgba(${t.surfRgb}, ${dark ? 0.7 : 0.8})`],
    ['--shiro-surf-2', `rgba(${t.surfRgb}, ${dark ? 0.9 : 0.95})`],
    ['--shiro-surf-solid', t.surfSolid],
    ['--shiro-surf-soft', t.surfSoft],
    ['--shiro-ink', t.ink],
    ['--shiro-ink-2', t.ink2],
    ['--shiro-ink-3', t.ink3],
    ['--shiro-ink-4', t.ink4],
    ['--shiro-rule', `rgba(${t.inkRgb}, ${dark ? 0.08 : 0.1})`],
    ['--shiro-rule-2', `rgba(${t.inkRgb}, 0.16)`],
    ['--shiro-scrollbar-track', `rgba(${t.inkRgb}, ${dark ? 0.04 : 0.05})`],
    ['--shiro-scrollbar-thumb', `rgba(${t.inkRgb}, ${dark ? 0.22 : 0.2})`],
    ['--shiro-scrollbar-thumb-hover', `rgba(${accRgb}, ${dark ? 0.65 : 0.5})`],
    ['--shiro-elev-1', `0 2px 8px -2px rgba(${shadow}, ${dark ? 0.45 : 0.1})`],
    ['--shiro-elev-2', `0 10px 30px -10px rgba(${shadow}, ${dark ? 0.6 : 0.18})`],
    ['--shiro-elev-3', `0 20px 60px -10px rgba(${shadow}, ${dark ? 0.65 : 0.22})`],
    ['--shiro-elev-4', `0 40px 80px -20px rgba(${shadow}, ${dark ? 0.75 : 0.3})`],
  ]
}

function block(selector, t, mode) {
  const body = tokens(t, mode)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}

function build() {
  const blocks = []
  for (const p of PALETTES) {
    gate(p.id, 'light', p.light)
    gate(p.id, 'dark', p.dark)

    blocks.push(`/* ${p.name} */`)
    blocks.push(block(`[data-palette='${p.id}']`, p.light, 'light'))
    blocks.push(
      block(
        `.dark[data-palette='${p.id}'],\n.dark [data-palette='${p.id}']`,
        p.dark,
        'dark'
      )
    )
  }

  return `/*
 * GENERATED by scripts/gen-palettes.mjs. Do not edit by hand: edit the
 * palette table in that script and re-run it.
 *
 * Every palette-varying token lives here and nowhere else. Selectors are
 * attribute-scoped rather than :root-scoped so a swatch can render in a
 * palette the document is not currently using: put data-palette on any
 * element and its subtree paints with that palette.
 *
 * The descendant form of each dark selector is what makes that work inside
 * dark mode, where .dark sits on <html> and the swatch sits deeper.
 */

${blocks.join('\n\n')}
`
}

function buildTs() {
  const rows = PALETTES.map((p) =>
    [
      '  {',
      `    id: '${p.id}',`,
      `    name: '${p.name}',`,
      `    ground: { light: '${p.light.sky1}', dark: '${p.dark.sky1}' },`,
      '  },',
    ].join('\n')
  ).join('\n')
  const fallback = PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID)
  return `/**
 * GENERATED by scripts/gen-palettes.mjs. Do not edit by hand.
 *
 * Mirrors the palette table that produced src/styles/palettes.css, so the
 * picker cannot offer a palette the stylesheet has no block for.
 *
 * \`ground\` is the page ground (\`--shiro-sky-1\`) per mode, for the places
 * CSS variables cannot reach: the \`theme-color\` meta and the manifest.
 *
 * \`TINT\` and \`GLOW\` are the strengths the contrast gate ran with, for the
 * components that set one in an inline style.
 */

export const PALETTES = [
${rows}
] as const

export type PaletteId = (typeof PALETTES)[number]['id']

export const DEFAULT_PALETTE: PaletteId = '${DEFAULT_PALETTE_ID}'

/** Light accent of the default palette, for the manifest. */
export const DEFAULT_THEME_COLOR = '${fallback.light.acc}'

/**
 * Strongest tint, in percent, the contrast gate allows behind a foreground:
 * \`text\` under text of the tint's own accent, \`icon\` under an icon of it,
 * \`row\` under plain ink on a selected row, \`kbd\` of ink under \`cloud\` on
 * a filled button. A weaker tint is always safe.
 */
export const TINT = {
  text: ${percent(TEXT_TINT)},
  icon: ${percent(ICON_TINT)},
  row: ${percent(ROW_TINT)},
  kbd: ${percent(KBD_TINT)},
} as const

/**
 * Strength of each glow (\`orb\`) at its centre, in percent, as the contrast
 * gate measured the text that crosses it.
 */
export const GLOW = {
  wallpaper: [${WALLPAPER_GLOWS.map(percent).join(', ')}],
  hero: ${percent(HERO_GLOW)},
  card: ${percent(CARD_GLOW)},
  detail: ${percent(DETAIL_GLOW)},
} as const
`
}

/* Importable: only writes when run directly, so other scripts can pull in
   PALETTES without triggering the emit. */
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  main()
}

/** `--report`: the worst ratio of every pairing, per palette and mode. */
function report() {
  const columns = PALETTES.flatMap((p) =>
    ['light', 'dark'].map((mode) => ({
      label: `${p.id} ${mode}`,
      rows: measured(p[mode], mode),
    }))
  )
  const names = columns[0].rows.map((row) => row.name)
  console.log(`| pairing | needs | ${columns.map((c) => c.label).join(' | ')} |`)
  console.log(`| --- | --- | ${columns.map(() => '---').join(' | ')} |`)
  names.forEach((name, i) => {
    const cells = columns.map((c) => c.rows[i].ratio.toFixed(2))
    console.log(`| ${name} | ${columns[0].rows[i].min} | ${cells.join(' | ')} |`)
  })
}

function main() {
  const css = build()
  const ts = buildTs()

  if (failures.length) {
    console.error('contrast gate failed:')
    for (const f of failures) console.error(`  ${f}`)
    process.exit(1)
  }

  if (process.argv.includes('--report')) {
    report()
    return
  }

  const outputs = [
    [CSS_OUT, css, 'src/styles/palettes.css'],
    [TS_OUT, ts, 'src/lib/os/palettes.generated.ts'],
  ]

  if (process.argv.includes('--check')) {
    const stale = outputs.filter(([file, want]) => readFileSync(file, 'utf8') !== want)
    if (stale.length) {
      for (const [, , label] of stale) console.error(`${label} is stale.`)
      console.error('Run: node scripts/gen-palettes.mjs')
      process.exit(1)
    }
    console.log(`palettes up to date: ${PALETTES.length} palettes, gates pass`)
  } else {
    for (const [file, content] of outputs) writeFileSync(file, content)
    console.log(
      `wrote ${outputs.length} files: ${PALETTES.length} palettes x 2 modes, ` +
        `${tokens(PALETTES[0].light, 'light').length} tokens each, gates pass`
    )
  }
}
