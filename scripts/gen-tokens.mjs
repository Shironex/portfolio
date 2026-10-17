/**
 * Colour tokens of ShiroOS and their contrast gate (SPEC 2.2 and 4.1).
 *
 *   pnpm tokens            write src/styles/tokens.css and src/lib/os/tokens.generated.ts
 *   pnpm tokens:check      fail if a gated pair is too faint or either file is stale
 *   node scripts/gen-tokens.mjs --report   print every gated pair with its ratio
 *
 * Every colour comes from the README palette (`scripts/pixel/palette.mjs`).
 * There are two body modes and four skies:
 *
 *   - Night (Lamp off) is the default and the server render: `<html class="dark">`.
 *   - Paper (Lamp on) turns window, sheet and card bodies into warm paper. The
 *     ground, the menu bar, the taskbar, the boot screen and the wallpaper stay
 *     night: a subtree marked `.os-night` gets the night values back.
 *   - A sky (`data-sky` on `<html>`) only paints the wallpaper. No text sits on
 *     a sky (labels sit on ground plates), so skies add no pairs to the gate.
 *
 * The gate keeps the thresholds of the palette gate it replaces: AA text 4.5,
 * icons and other non-text 3, each with a 0.1 margin so a browser's rounding
 * of a blend cannot land a pair a hundredth short. It covers every pair of
 * SPEC 4.1 plus the legacy names the components still use until Phases 2 to
 * 4 move them onto the new tokens, and the tints (`TINT`) a component sets
 * in an inline style.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { formatSource, isMain } from './pixel/cli.mjs'
import {
  PALETTE_HEX,
  PAPER_RECOLOUR,
  SKY_COLOURS,
  normalizeHex,
} from './pixel/palette.mjs'

/** The night-to-paper recolour of the chrome art lives with the tokens. */
export { PAPER_RECOLOUR }

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSS_OUT = join(ROOT, 'src', 'styles', 'tokens.css')
const TS_OUT = join(ROOT, 'src', 'lib', 'os', 'tokens.generated.ts')

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

/**
 * Night mode, SPEC 2.2. `heading` is the lamp; paper gives it its own value.
 * `heading-shadow` is the 1 art px shadow under lamp lettering (SPEC 2.3).
 */
export const NIGHT = {
  ground: '#0b1420',
  surf: '#13253a',
  'surf-raised': '#173a45',
  select: '#1f5058',
  rule: '#1f5058',
  frame: '#4fa3a0',
  'frame-dim': '#2e6e6e',
  ink: '#e8e4dc',
  'ink-hi': '#d8fff2',
  meta: '#9aa4a8',
  lamp: '#f0c070',
  'lamp-hi': '#fff2c8',
  'lamp-shadow': '#6e4030',
  heading: '#f0c070',
  'heading-shadow': '#6e4030',
  link: '#8fe0cf',
  'fill-primary': '#4fa3a0',
  'fill-primary-ink': '#0b1420',
  'fill-warm': '#c98a4a',
  'fill-warm-ink': '#2a1a1c',
  danger: '#c23a3a',
  'danger-fill': '#7a1e2a',
  'danger-fill-ink': '#e8e4dc',
  error: '#f0a068',
  outline: '#2a1a1c',
}

/**
 * Paper mode, SPEC 2.2: only what changes. `select`, `rule` and `ink-hi`
 * are not in the spec table; on paper they take the lamp fill (a highlighter
 * under navy ink), the neutral grey (a decorative rule) and the ground navy
 * (emphasis darker than body ink). Paper headings are already the shadow
 * brown, so they drop the shadow.
 */
export const PAPER = {
  surf: '#e8e4dc',
  'surf-raised': '#fff2c8',
  select: '#f0c070',
  rule: '#9aa4a8',
  ink: '#13253a',
  'ink-hi': '#0b1420',
  heading: '#6e4030',
  'heading-shadow': 'transparent',
  link: '#1f5058',
  meta: '#4a2b25',
  error: '#7a1e2a',
  frame: '#2e6e6e',
}

/**
 * Accent roles (`accent-map.ts`): a fill, its text (`ink`, 4.5:1 on every
 * surface and on its own tint) and its icon (3:1). Night inks are the bright
 * and lamp values; paper inks are `#1f5058` and `#6e4030` (SPEC 2.2).
 * `neutral` reads as body ink on its tint and as meta for an icon.
 */
export const ROLES = {
  night: {
    primary: ['#4fa3a0', '#8fe0cf', '#4fa3a0'],
    deep: ['#2e6e6e', '#8fe0cf', '#4fa3a0'],
    bright: ['#8fe0cf', '#8fe0cf', '#8fe0cf'],
    warm: ['#f0c070', '#f0c070', '#f0c070'],
    'warm-2': ['#c98a4a', '#f0c070', '#c98a4a'],
    neutral: ['#9aa4a8', '#e8e4dc', '#9aa4a8'],
  },
  paper: {
    primary: ['#4fa3a0', '#1f5058', '#2e6e6e'],
    deep: ['#2e6e6e', '#1f5058', '#2e6e6e'],
    bright: ['#8fe0cf', '#1f5058', '#1f5058'],
    warm: ['#f0c070', '#6e4030', '#6e4030'],
    'warm-2': ['#c98a4a', '#6e4030', '#6e4030'],
    neutral: ['#9aa4a8', '#13253a', '#4a2b25'],
  },
}

/**
 * Strongest tint, in percent, behind a foreground (as the palette gate had it):
 * `text` under text of the tint's own role, `icon` under its icon, `row`
 * of the primary fill under body ink on a selected row, `kbd` of ink under
 * the fill text on a filled button. A weaker tint is always safe. Pixel art
 * has no translucency, so these go when Phases 2 to 4 draw the chips, tiles
 * and rows; until then they are gated like any other pair.
 */
export const TINT = { text: 20, icon: 15, row: 10, kbd: 20 }

/**
 * Old token names, mapped onto the new tokens, so every component keeps
 * compiling and passing the gate until Phases 2 to 4 move it. Values are
 * token names (or a role slot), resolved per mode.
 */
const LEGACY = {
  '--color-miku': 'role:primary:0',
  '--color-miku-2': 'role:deep:0',
  '--color-miku-3': 'role:bright:0',
  '--color-peach': 'role:warm:0',
  '--color-peach-2': 'role:warm-2:0',
  '--color-cloud': 'fill-primary-ink',
  '--color-danger': 'danger',
  '--color-danger-ink': 'error',
  '--color-miku-ink': 'role:primary:1',
  '--color-miku-icon': 'role:primary:2',
  '--color-miku-2-ink': 'role:deep:1',
  '--color-miku-2-icon': 'role:deep:2',
  '--color-miku-3-ink': 'role:bright:1',
  '--color-miku-3-icon': 'role:bright:2',
  '--color-peach-ink': 'role:warm:1',
  '--color-peach-icon': 'role:warm:2',
  '--color-peach-2-ink': 'role:warm-2:1',
  '--color-peach-2-icon': 'role:warm-2:2',
  '--color-sky-0': 'ground',
  '--color-sky-1': 'ground',
  '--color-sky-2': 'ground',
  '--color-sky-3': 'ground',
  '--color-surf-0': 'surf-raised',
  '--color-surf-1': 'surf-raised',
  '--color-surf-2': 'surf',
  '--color-surf-solid': 'surf',
  '--color-surf-soft': 'surf-raised',
  '--color-ink': 'ink',
  '--color-ink-2': 'ink',
  '--color-ink-3': 'meta',
  '--color-ink-4': 'meta',
  '--color-rule': 'rule',
  '--color-rule-2': 'frame-dim',
}

/**
 * Elevations as hard offset shadows in art px, on the ground navy: the soft
 * blurred shadows go, and Phase 2 replaces these with the dithered window
 * shadow.
 */
const ELEVATION = [1, 2, 3, 4]

/**
 * The sky bands of each sky, top to bottom, from the wallpaper document
 * (`portfolio-os/art/wallpaper-palette.json`, version 2). `rows` are art px;
 * the `fill` band takes whatever is left above the others. A `mix` band (a
 * 1 px checker in the canvas, Phase 3) is drawn as its own colour here.
 */
export const SKY_BANDS = {
  night: [
    ['#0b1420', 'fill'],
    ['#13253a', 84],
    ['#13253a', 12],
    ['#173a45', 32],
    ['#1f5058', 96],
  ],
  dusk: [
    ['#201e3e', 'fill'],
    ['#62305c', 34],
    ['#94584a', 24],
    ['#b27868', 18],
    ['#d89070', 14],
    ['#f0a068', 12],
    ['#f0c070', 76],
  ],
  dawn: [
    ['#13253a', 'fill'],
    ['#13253a', 8],
    ['#5a5e8c', 44],
    ['#9a88b4', 22],
    ['#e2a684', 16],
    ['#f0b890', 12],
    ['#fff2c8', 74],
  ],
  day: [
    ['#5f8fce', 'fill'],
    ['#8fb9de', 120],
    ['#e8e4dc', 84],
  ],
}

/** Art px under the horizon (the road strip of Phase 3); the lowest band covers it for now. */
const ROAD_ROWS = 24

/** Picker order (SPEC 2.2): the four skies, then Live (Warsaw time of day). */
const SKY_NAMES = {
  night: 'Night',
  dusk: 'Dusk',
  dawn: 'Dawn',
  day: 'Day',
  live: 'Live',
}

/* ------------------------------------------------------------------ */
/* colour maths                                                        */
/* ------------------------------------------------------------------ */

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toLinear(v) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => toLinear(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * `fg` at `percent` over `bg`, blended in gamma space the way a browser
 * composites `color-mix(in oklab, fg N%, transparent)` or `bg-x/N` on an
 * opaque colour.
 */
export function over(fg, percent, bg) {
  const top = rgb(fg)
  const a = percent / 100
  const mixed = rgb(bg).map((v, i) => Math.round(top[i] * a + v * (1 - a)))
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/* ------------------------------------------------------------------ */
/* modes                                                               */
/* ------------------------------------------------------------------ */

/** Every token of a mode, resolved to a hex. */
export function modeTokens(mode) {
  return mode === 'paper' ? { ...NIGHT, ...PAPER } : { ...NIGHT }
}

function resolve(ref, mode) {
  const t = modeTokens(mode)
  if (ref.startsWith('role:')) {
    const [, role, slot] = ref.split(':')
    return ROLES[mode][role][Number(slot)]
  }
  if (!(ref in t)) throw new Error(`unknown token ${ref}`)
  return t[ref]
}

/** `--name: value` pairs of a mode, in emit order. */
function declarations(mode) {
  const t = modeTokens(mode)
  const out = []
  for (const [name, value] of Object.entries(t)) out.push([`--${name}`, value])
  for (const [role, [fill, ink, icon]] of Object.entries(ROLES[mode])) {
    out.push([`--accent-${role}`, fill])
    out.push([`--accent-${role}-ink`, ink])
    out.push([`--accent-${role}-icon`, icon])
  }
  for (const [name, ref] of Object.entries(LEGACY))
    out.push([name, resolve(ref, mode)])
  for (const n of ELEVATION) {
    out.push([
      `--shiro-elev-${n}`,
      `calc(${n} * var(--px)) calc(${n} * var(--px)) 0 ${t.ground}`,
    ])
  }
  return out
}

/* ------------------------------------------------------------------ */
/* gate                                                                */
/* ------------------------------------------------------------------ */

const AA_TEXT = 4.5
const AA_ICON = 3
const MARGIN = 0.1

/**
 * Every gated pair of a mode: `[label, foreground, background, minimum]`.
 * SPEC 4.1 first (its tables, in its order), then the legacy names and the
 * tints.
 */
export function pairs(mode) {
  const t = modeTokens(mode)
  const list = []
  const text = (fg, bg, label) =>
    list.push([label ?? `${fg} on ${bg}`, t[fg] ?? fg, t[bg] ?? bg, AA_TEXT])
  const icon = (fg, bg, label) =>
    list.push([label ?? `${fg} on ${bg}`, t[fg] ?? fg, t[bg] ?? bg, AA_ICON])

  const bodies =
    mode === 'night'
      ? ['surf', 'surf-raised', 'ground']
      : ['surf', 'surf-raised']

  if (mode === 'night') {
    for (const bg of ['surf', 'surf-raised', 'ground', 'select'])
      text('ink', bg)
    for (const bg of ['surf-raised', 'surf']) text('ink-hi', bg)
    for (const bg of ['surf', 'surf-raised', 'ground']) text('meta', bg)
    for (const bg of ['surf', 'surf-raised', 'ground', 'select'])
      text('lamp', bg)
    for (const bg of ['surf', 'surf-raised', 'ground']) text('link', bg)
    for (const bg of ['surf', 'ground']) text('error', bg)
    text('fill-primary-ink', 'fill-primary', 'primary button')
    text('fill-warm-ink', 'fill-warm', 'warm button')
    text('ground', 'lamp', 'lamp fill (selection, active toggle)')
    text('danger-fill-ink', 'danger-fill', 'danger button')
    text('lamp', '#4a2b25', 'in-progress chip')

    for (const bg of ['surf', 'surf-raised', 'ground'])
      icon('lamp', bg, `focus ring on ${bg}`)
    for (const bg of ['ground', 'surf']) icon('frame', bg)
    icon('frame-dim', 'ground', 'unfocused rim, scrollbar thumb')
    icon('danger-fill-ink', 'danger', 'close glyph on its hover fill')
    icon('frame', 'ground', 'scrollbar thumb, hover')
  } else {
    for (const bg of ['surf', 'surf-raised']) text('ink', bg)
    for (const bg of ['surf', 'surf-raised']) text('heading', bg)
    text('link', 'surf')
    for (const bg of ['surf', 'surf-raised']) text('meta', bg)
    text('error', 'surf')
    text('ink', 'select', 'selected row')
    text('ink-hi', 'surf', 'emphasis')

    icon('ground', 'surf', 'focus ring, inner navy on paper')
    for (const bg of ['surf-raised', 'surf']) icon('frame', bg)
    icon('#13253a', 'surf', 'paper button outline')
  }

  // Legacy names on the legacy surfaces they sit on.
  const legacy = Object.fromEntries(
    Object.entries(LEGACY).map(([name, ref]) => [name, resolve(ref, mode)])
  )
  const surfaces = [
    '--color-surf-0',
    '--color-surf-1',
    '--color-surf-2',
    '--color-surf-solid',
    '--color-surf-soft',
  ]
  for (const fg of [
    '--color-ink',
    '--color-ink-2',
    '--color-ink-3',
    '--color-ink-4',
    '--color-danger-ink',
  ]) {
    for (const bg of surfaces) {
      list.push([`${fg} on ${bg}`, legacy[fg], legacy[bg], AA_TEXT])
    }
  }
  for (const fill of ['--color-miku', '--color-peach', '--color-peach-2']) {
    list.push([
      `--color-cloud on ${fill}`,
      legacy['--color-cloud'],
      legacy[fill],
      AA_TEXT,
    ])
  }

  // Roles: ink and icon on every body, and on their own tint of it.
  for (const [role, [fill, ink, glyph]] of Object.entries(ROLES[mode])) {
    for (const bg of bodies) {
      list.push([`${role} ink on ${bg}`, ink, t[bg], AA_TEXT])
      list.push([`${role} icon on ${bg}`, glyph, t[bg], AA_ICON])
      list.push([
        `${role} ink on ${TINT.text}% ${role} over ${bg}`,
        ink,
        over(fill, TINT.text, t[bg]),
        AA_TEXT,
      ])
      list.push([
        `${role} icon on ${TINT.icon}% ${role} over ${bg}`,
        glyph,
        over(fill, TINT.icon, t[bg]),
        AA_ICON,
      ])
    }
  }
  const primary = ROLES[mode].primary[0]
  for (const bg of bodies) {
    list.push([
      `ink on ${TINT.row}% primary over ${bg} (selected row)`,
      t.ink,
      over(primary, TINT.row, t[bg]),
      AA_TEXT,
    ])
  }
  list.push([
    `fill text on ${TINT.kbd}% ink over the primary fill (keycap on a button)`,
    t['fill-primary-ink'],
    over(t.ink, TINT.kbd, t['fill-primary']),
    AA_TEXT,
  ])
  return list
}

function measured(mode) {
  return pairs(mode).map(([label, fg, bg, min]) => ({
    label,
    fg,
    bg,
    min,
    ratio: contrast(fg, bg),
  }))
}

/** Gate failures and palette violations, as lines. */
export function problems() {
  const out = []
  for (const mode of ['night', 'paper']) {
    for (const { label, fg, bg, min, ratio } of measured(mode)) {
      if (ratio < min + MARGIN) {
        out.push(
          `${mode} ${label}: ${ratio.toFixed(2)}:1, needs ${min} + ${MARGIN} (${fg} on ${bg})`
        )
      }
    }
    for (const [name, value] of declarations(mode)) {
      for (const hex of value.match(/#[0-9a-f]{6}/gi) ?? []) {
        if (!PALETTE_HEX.includes(normalizeHex(hex))) {
          out.push(`${mode} ${name}: ${hex} is not a README palette colour`)
        }
      }
    }
  }
  for (const [sky, bands] of Object.entries(SKY_BANDS)) {
    if (bands.filter(([, rows]) => rows === 'fill').length !== 1) {
      out.push(`sky ${sky}: needs exactly one "fill" band`)
    }
    for (const [hex] of bands) {
      const c = normalizeHex(hex)
      if (!PALETTE_HEX.includes(c) && !SKY_COLOURS.includes(c)) {
        out.push(`sky ${sky}: ${hex} is neither a palette nor a sky colour`)
      }
    }
  }
  return out
}

/* ------------------------------------------------------------------ */
/* emit                                                                */
/* ------------------------------------------------------------------ */

/** Consecutive bands of one colour merged, bottom first, with their top edge in art px. */
function bandsFromHorizon(bands) {
  const merged = []
  for (const [color, rows] of bands) {
    const last = merged.at(-1)
    if (last && last.color === color) {
      last.rows =
        last.rows === 'fill' || rows === 'fill' ? 'fill' : last.rows + rows
    } else merged.push({ color, rows })
  }
  let top = ROAD_ROWS
  return merged.reverse().map(({ color, rows }) => {
    if (rows === 'fill') return { color, top: null }
    top += rows
    return { color, top }
  })
}

/** The wallpaper sky of a fixed sky: hard bands from the bottom edge up. */
function skyGradient(bands) {
  const stops = bandsFromHorizon(bands).map(({ color, top }) => {
    const end = top === null ? '' : ` calc(${top} * var(--px))`
    return `${color} 0${end}`
  })
  return `linear-gradient(to top, ${stops.join(', ')})`
}

/** A small preview of a sky for a swatch: its distinct bands, evenly. */
function skySwatch(bands) {
  const colours = bandsFromHorizon(bands)
    .map((b) => b.color)
    .reverse()
  const share = 100 / colours.length
  const stops = colours.map((c, i) => {
    const end =
      i === colours.length - 1 ? '' : ` ${+(share * (i + 1)).toFixed(2)}%`
    return `${c} 0${end}`
  })
  return `linear-gradient(${stops.join(', ')})`
}

/** Live previews every sky: one column each, in the order of a day. */
function liveSwatch() {
  const order = ['night', 'dawn', 'day', 'dusk']
  const stops = order.map((sky, i) => {
    const bands = bandsFromHorizon(SKY_BANDS[sky])
    const colour = bands[Math.min(1, bands.length - 1)].color
    const end = i === order.length - 1 ? '' : ` ${25 * (i + 1)}%`
    return `${colour} 0${end}`
  })
  return `linear-gradient(to right, ${stops.join(', ')})`
}

function block(selectors, decls, comment) {
  const body = decls.map(([name, value]) => `  ${name}: ${value};`).join('\n')
  return `/* ${comment} */\n${selectors.join(',\n')} {\n${body}\n}`
}

function buildCss() {
  const night = declarations('night')
  const nightMap = new Map(night)
  const paper = declarations('paper').filter(
    ([name, value]) => nightMap.get(name) !== value
  )
  const skies = Object.entries(SKY_BANDS).map(([sky, bands]) =>
    block(
      [`[data-sky='${sky}']`],
      [['--sky-bands', skyGradient(bands)]],
      `${SKY_NAMES[sky]} sky`
    )
  )
  return [
    '/*',
    ' * GENERATED by scripts/gen-tokens.mjs. Do not edit by hand: edit the tables',
    ' * in that script and run `pnpm tokens`.',
    ' *',
    ' * Night is the default and the server render (`<html class="dark">`). Paper',
    ' * (the Lamp on: `<html>` without `.dark`) changes window, sheet and card',
    ' * bodies only; an `.os-night` subtree (menu bar, taskbar, boot screen,',
    ' * desktop labels) keeps the night values in paper mode. Skies only paint',
    ' * the wallpaper. The `--color-*` and `--shiro-elev-*` names are the old',
    ' * palette tokens, mapped onto these until the components move to the new',
    ' * ones (Phases 2 to 4).',
    ' */',
    '',
    block([':root', '.os-night'], night, 'Night: the Lamp off'),
    '',
    block([':root:not(.dark)'], paper, 'Paper: the Lamp on'),
    '',
    skies.join('\n\n'),
    '',
  ].join('\n')
}

function buildTs() {
  const skies = Object.keys(SKY_NAMES).map((id) => ({
    id,
    name: SKY_NAMES[id],
    swatch: id === 'live' ? liveSwatch() : skySwatch(SKY_BANDS[id]),
  }))
  return `/**
 * GENERATED by scripts/gen-tokens.mjs. Do not edit by hand.
 *
 * Mirrors the token tables that produced src/styles/tokens.css, for the
 * places a CSS variable cannot reach.
 */

/**
 * The skies of the Sky picker, in its order. \`live\` follows the time of day
 * in Warsaw and resolves to one of the others; \`swatch\` is a preview
 * gradient for the picker.
 */
export const SKIES = ${JSON.stringify(skies, null, 2)} as const

export type SkyId = (typeof SKIES)[number]['id']

export const DEFAULT_SKY: SkyId = 'night'

/**
 * The ground navy, which stays night in both Lamp modes: the \`theme-color\`
 * meta, the manifest and the page behind every window.
 */
export const GROUND = '${NIGHT.ground}'

/**
 * Strongest tint, in percent, the contrast gate allows behind a foreground:
 * \`text\` under text of the tint's own role, \`icon\` under its icon, \`row\`
 * of the primary fill under body ink on a selected row, \`kbd\` of ink under
 * the fill text of a filled button. A weaker tint is always safe.
 */
export const TINT = ${JSON.stringify(TINT)} as const
`
}

async function outputs() {
  return [
    [CSS_OUT, await formatSource(buildCss(), CSS_OUT)],
    [TS_OUT, await formatSource(buildTs(), TS_OUT)],
  ]
}

function report() {
  for (const mode of ['night', 'paper']) {
    console.log(`\n${mode}`)
    for (const { label, min, ratio } of measured(mode)) {
      const flag = ratio < min + MARGIN ? '  FAIL' : ''
      console.log(
        `  ${ratio.toFixed(2).padStart(6)}  (${min})  ${label}${flag}`
      )
    }
  }
}

async function main(argv) {
  if (argv.includes('--report')) {
    report()
    return
  }
  const failed = problems()
  if (failed.length) {
    console.error('token gate failed:')
    for (const line of failed) console.error(`  ${line}`)
    process.exit(1)
  }
  const files = await outputs()
  const count = pairs('night').length + pairs('paper').length
  if (argv.includes('--check')) {
    const stale = files.filter(([file, want]) => {
      try {
        return readFileSync(file, 'utf8') !== want
      } catch {
        return true
      }
    })
    if (stale.length) {
      for (const [file] of stale)
        console.error(`${relative(ROOT, file)} is stale.`)
      console.error('Run: pnpm tokens')
      process.exit(1)
    }
    console.log(`tokens up to date: ${count} pairs pass the gate`)
    return
  }
  for (const [file, content] of files) writeFileSync(file, content)
  console.log(`wrote ${files.length} files: ${count} pairs pass the gate`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
