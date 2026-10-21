/**
 * Window chrome as CSS border-image (SPEC 2.4, 9-slice pipeline).
 *
 *   pnpm art:chrome            write src/styles/pixel-chrome.css,
 *                              src/styles/coarse-chrome.css and
 *                              src/styles/mobile-chrome.css
 *   pnpm art:chrome --check    fail if any of them is stale
 *   node scripts/pixel/gen-chrome.mjs --in <sheet.json> --out <file.css>
 *     [--coarse-out <file.css>] [--mobile-out <file.css>]
 *
 * Atlas contract (os-chrome.aseprite, exported by `pnpm art:export`):
 *   - one slice per piece, named in kebab case; the class is `.px-<name>`
 *   - a slice with a 9-slice centre (set in Aseprite) becomes a border-image:
 *     the border widths are the distances from the centre to the edges, in
 *     art px (`--px<n>` on `:root`), and the centre fills the box (`fill`). When the centre is one
 *     colour the box also gets it as its `background-color`, clipped to the
 *     padding box (the notched corners stay clear): what a contrast probe or
 *     forced colours mode reads, since neither sees a border image
 *   - a slice without a centre is a tile (`background-image`, repeated at
 *     its size, also published as `--px-<name>` for pseudo-elements); if its
 *     pixels change across frames it steps through them with the frame
 *     durations (add `ambient-loop` where it is used)
 *   - slices `<base>-rest`, `<base>-hover` and `<base>-pressed` are one
 *     control, `.px-<base>`: rest, hover under a hovering pointer, pressed
 *     while active or `aria-pressed`, and `<kind>-disabled` (the base minus
 *     its last word, so `button-disabled` for `button-primary`) when
 *     disabled. A pressed slice that draws its bevel lower moves the content
 *     down with it (its border widths change)
 *   - slice user data, space separated:
 *       repeat=round|space|repeat   edge repeat (default stretch); patterned
 *                                   edges such as a grip or dotted rule use round
 *       paper                       a body: recoloured for paper mode
 *       night                       chrome: stays night (the default)
 *
 * Paper mode (Lamp on: `<html>` without `.dark`) recolours bodies only,
 * through `PAPER_RECOLOUR` (SPEC 2.2: window, sheet and card bodies turn to
 * paper, the chrome stays night). A body inside an `.os-night` subtree stays
 * night too, like the tokens there. The bodies of `os-chrome.aseprite` carry
 * no slice data, so they are listed in `CHROME_OPTIONS.paper`.
 *
 * Code adds what the atlas does not draw (`CHROME_OPTIONS`):
 *   - variants: a slice recoloured, as its own class (chip tones)
 *   - paper colours of one body on top of `PAPER_RECOLOUR` (the well's
 *     ground fill, which is not a body colour anywhere else)
 *   - states: a 9-slice recoloured under an attribute selector, in night and
 *     paper (the well's rim when its field is invalid)
 *
 * Each piece becomes an SVG of merged pixel runs with `crispEdges`, inlined as
 * a data URI (CSP allows `data:` images), so there is no request and no
 * resampling blur.
 *
 * Grown slices: a slice redrawn taller by repeating its first and last
 * centre row (`growGrid`), so what is drawn between them (the title bar's
 * grip) keeps its size and lands in the middle, with flat rows above and
 * below. The title bar only maps 1:1 at its drawn height of 16 rows.
 *
 * Two more stylesheets keep the main budget where it is:
 *   - `src/styles/coarse-chrome.css` (`COARSE_CHROME_OPTIONS`): the title
 *     bars grown to 24 art px, swapped in under a coarse pointer, so a window
 *     control is 44 css or more at every DPR (45.7 at 2.625). globals.css
 *     imports it after the main stylesheet, whose rules it overrides.
 *   - `src/styles/mobile-chrome.css` (`MOBILE_CHROME_OPTIONS`): the chrome
 *     only the phone shell draws, loaded with the sheet that imports it:
 *     copies of a slice under a new class, grown to another height (the
 *     sheet title bar, 24 art px).
 *
 * Both read the border width variables of the main stylesheet, which every
 * page loads; neither may need one it does not declare.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { artPx, cssName } from './gen-sprites.mjs'
import { PAPER_RECOLOUR } from './palette.mjs'
import { loadSheet, readRegion, sliceKey, sliceOptions } from './sheet.mjs'
import { gridToSvg, recolourGrid, svgDataUri } from './svg.mjs'

const DEFAULT_IN = join(
  ROOT,
  'src',
  'assets',
  'pixel',
  'chrome',
  'os-chrome.json'
)
const DEFAULT_OUT = join(ROOT, 'src', 'styles', 'pixel-chrome.css')
const COARSE_OUT = join(ROOT, 'src', 'styles', 'coarse-chrome.css')
const MOBILE_OUT = join(ROOT, 'src', 'styles', 'mobile-chrome.css')
const REPEATS = new Set(['stretch', 'round', 'space', 'repeat'])
const STATES = ['rest', 'hover', 'pressed']

/** Paper mode: the Lamp is on when `<html>` is not `.dark`. */
export const PAPER_SCOPE = ':root:not(.dark)'

/** Outside every `.os-night` subtree, which keeps night in paper mode. */
export const OUTSIDE_NIGHT = ':not(.os-night, .os-night *)'

/** Disabled, natively or by ARIA. */
const DISABLED = ":is(:disabled, [aria-disabled='true'])"
const ENABLED = ":not(:disabled, [aria-disabled='true'])"

/**
 * What code adds to `os-chrome.aseprite` (see the header): its bodies, the
 * chip tones, the well's paper fill and its invalid state.
 */
export const CHROME_OPTIONS = {
  paper: [
    'window-focused',
    'window-unfocused',
    'panel',
    'card',
    'well',
    'tile-skeleton',
  ],
  variants: [
    // In progress: lamp text on the warm brown, 7.50:1.
    { name: 'chip-warm', from: 'chip', recolour: { '#1f5058': '#4a2b25' } },
    // Archived: meta grey on the ground, 7.27:1.
    { name: 'chip-ground', from: 'chip', recolour: { '#1f5058': '#0b1420' } },
  ],
  // The field well on paper: cream fill (`--surf-raised`, 13.88:1 under the
  // ink), the rim teal through PAPER_RECOLOUR (5.26:1 as a boundary).
  paperRecolour: { well: { '#0b1420': '#fff2c8' } },
  states: [
    // An invalid field: the rim in `--error` (8.75:1 on the ground at night,
    // 9.18:1 on cream in paper), as its message is.
    {
      slice: 'well',
      selector: "[aria-invalid='true']",
      recolour: { '#4fa3a0': '#f0a068' },
    },
  ],
}

/**
 * The coarse pointer title bars (`coarse-chrome.css`): 24 art px, so the
 * window controls that fill them are 44 css or more at every DPR (SPEC 4.4
 * and 11). The grip keeps its drawn size in the middle of the left cap.
 */
export const COARSE_CHROME_OPTIONS = {
  media: '(pointer: coarse)',
  grow: [
    { slice: 'titlebar-focused', height: 24 },
    { slice: 'titlebar-unfocused', height: 24 },
  ],
}

/**
 * The phone shell's own pieces (`mobile-chrome.css`): the sheet title bar is
 * the focused title bar grown to 24 art px with flat rows, its grip kept the
 * drawn size in the middle (SPEC 1.3 and section 9: "its own slice or flat
 * padding").
 */
export const MOBILE_CHROME_OPTIONS = {
  copies: [{ name: 'titlebar-sheet', from: 'titlebar-focused', height: 24 }],
}

function url(grid) {
  return `url("${svgDataUri(gridToSvg(grid))}")`
}

/** Distances from a 9-slice centre to the edges: top, right, bottom, left. */
export function sliceInsets(key) {
  const { bounds, center } = key
  return [
    center.y,
    bounds.w - center.x - center.w,
    bounds.h - center.y - center.h,
    center.x,
  ]
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** The one colour of a grid's centre region, or `null` when it has more. */
function centreColour(grid, center) {
  const colours = new Set()
  for (let y = center.y; y < center.y + center.h; y++) {
    for (let x = center.x; x < center.x + center.w; x++) {
      colours.add(grid[y][x])
    }
  }
  const [only] = colours
  return colours.size === 1 && only ? only : null
}

/**
 * A slice redrawn `height` rows tall: rows above and below the centre are
 * kept, and the centre's first and last rows repeat to make up the height
 * (half above, the rest below), so whatever is drawn between them keeps its
 * size and lands in the middle.
 */
export function growGrid(grid, center, height) {
  const extra = height - grid.length
  if (extra < 0) throw new Error(`cannot grow ${grid.length} rows to ${height}`)
  const above = Math.floor(extra / 2)
  const first = grid[center.y]
  const last = grid[center.y + center.h - 1]
  return {
    grid: [
      ...grid.slice(0, center.y),
      ...Array.from({ length: above }, () => [...first]),
      ...grid.slice(center.y, center.y + center.h),
      ...Array.from({ length: extra - above }, () => [...last]),
      ...grid.slice(center.y + center.h),
    ],
    center: { ...center, h: center.h + extra },
  }
}

/** A slice as a piece: its frames (runs of equal frames merged) and options. */
function slicePiece(sheet, slice, paperNames, paperMaps) {
  const name = cssName(slice.name)
  if (name !== slice.name) {
    throw new Error(
      `chrome slice "${slice.name}" is not kebab case (would be "${name}")`
    )
  }
  const options = sliceOptions(slice)
  const repeat = options.repeat ?? 'stretch'
  if (!REPEATS.has(repeat))
    throw new Error(`slice "${slice.name}": unknown repeat=${repeat}`)
  const key = sliceKey(slice, 0)
  const frames = []
  sheet.data.frames.forEach((frame, i) => {
    const grid = readRegion(sheet, i, sliceKey(slice, i).bounds)
    const last = frames.at(-1)
    if (last && same(last.grid, grid)) last.ms += frame.duration
    else frames.push({ grid, ms: frame.duration })
  })
  if (key.center && frames.length > 1) {
    throw new Error(
      `9-slice "${slice.name}" changes across frames; draw states as separate slices`
    )
  }
  const paper =
    !('night' in options) && ('paper' in options || paperNames.has(name))
  return {
    name,
    center: key.center,
    w: key.bounds.w,
    h: key.bounds.h,
    frames,
    repeat,
    paper,
    paperMap: { ...PAPER_RECOLOUR, ...paperMaps[name] },
  }
}

/** `n` art px as a border width: one of the `--px<n>` variables. */
const borderPx = (n) => (n === 0 ? '0' : `var(--px${n})`)

/** Four widths (top, right, bottom, left) in their shortest CSS form. */
function boxShorthand([t, r, b, l]) {
  if (r !== l) return `${t} ${r} ${b} ${l}`
  if (t !== b) return `${t} ${r} ${b}`
  return t === r ? t : `${t} ${r}`
}

/**
 * The declarations that draw a 9-slice grid; `base` is what they replace.
 *
 * The slices are drawn at `border-image-width`, a length, and not at the
 * border width: a border width is snapped, and Chromium floors it to a whole
 * px (`4.8px` at DPR 1.25 computes to `4px`), which would squeeze the frame
 * by a device pixel. The border width still insets the content.
 */
function nineSlice(grid, center, repeat, base) {
  const insets = sliceInsets({
    bounds: { w: grid[0].length, h: grid.length },
    center,
  })
  const widths = boxShorthand(insets.map(borderPx))
  const fill = centreColour(grid, center)
  const out = []
  if (!base) out.push('border-style: solid;')
  if (!base || !same(base.insets, insets)) {
    out.push(`border-width: ${widths};`)
    out.push(`border-image-width: ${widths};`)
  }
  out.push(`border-image-source: ${url(grid)};`)
  if (!base || !same(base.insets, insets)) {
    out.push(`border-image-slice: ${insets.join(' ')} fill;`)
  }
  if (!base && repeat !== 'stretch') {
    out.push(`border-image-repeat: ${repeat};`)
  }
  if (fill && fill !== base?.fill) out.push(`background-color: ${fill};`)
  if (!base && fill) out.push('background-clip: padding-box;')
  return { lines: out, insets, fill }
}

function rule(selector, lines) {
  return `${selector} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`
}

function media(query, rules) {
  return `@media ${query} {\n${rules.join('\n').replace(/^(?=.)/gm, '  ')}\n}`
}

/** CSS for one 9-slice piece, its paper copy and states. */
function nineSliceCss(piece, selector, states = []) {
  const paperGrid = (g) => recolourGrid(g, piece.paperMap)
  const { grid } = piece.frames[0]
  const night = nineSlice(grid, piece.center, piece.repeat)
  const rules = [rule(selector, night.lines)]
  const paperSelector = `${PAPER_SCOPE} ${selector}${OUTSIDE_NIGHT}`
  const recoloured = paperGrid(grid)
  const hasPaper = piece.paper && !same(recoloured, grid)
  if (hasPaper) {
    const paper = nineSlice(recoloured, piece.center, piece.repeat, night)
    rules.push(rule(paperSelector, paper.lines))
  }
  for (const state of states) {
    const stateGrid = recolourGrid(grid, state.recolour)
    rules.push(
      rule(`${selector}${state.selector}`, [
        `border-image-source: ${url(stateGrid)};`,
      ])
    )
    if (hasPaper) {
      rules.push(
        rule(`${PAPER_SCOPE} ${selector}${state.selector}${OUTSIDE_NIGHT}`, [
          `border-image-source: ${url(paperGrid(stateGrid))};`,
        ])
      )
    }
  }
  return rules.join('\n')
}

/** CSS for one tile piece: a repeated background, stepped if animated. */
function tileCss(piece) {
  const { name, frames, w, h } = piece
  const paperGrid = (g) => recolourGrid(g, piece.paperMap)
  const total = frames.reduce((sum, f) => sum + f.ms, 0)
  const lines = [
    `background-image: var(--px-${name});`,
    `background-size: ${artPx(w)} ${artPx(h)};`,
    'background-repeat: repeat;',
  ]
  if (frames.length > 1)
    lines.push(`animation: px-${name} ${total}ms step-end infinite;`)
  const rules = [rule(`.px-${name}`, lines)]
  const keyframes = (prefix, map) => {
    let elapsed = 0
    const steps = frames.map((f) => {
      const at = Number(((elapsed / total) * 100).toFixed(4))
      elapsed += f.ms
      return `  ${at}% { background-image: ${url(map(f.grid))}; }`
    })
    steps.push(`  100% { background-image: ${url(map(frames.at(-1).grid))}; }`)
    return `@keyframes ${prefix}px-${name} {\n${steps.join('\n')}\n}`
  }
  if (frames.length > 1) rules.push(keyframes('', (g) => g))
  const hasPaper =
    piece.paper && frames.some((f) => !same(paperGrid(f.grid), f.grid))
  if (hasPaper) {
    const paperLines = [`background-image: ${url(paperGrid(frames[0].grid))};`]
    if (frames.length > 1) paperLines.push(`animation-name: paper-px-${name};`)
    rules.push(rule(`${PAPER_SCOPE} .px-${name}${OUTSIDE_NIGHT}`, paperLines))
    if (frames.length > 1) rules.push(keyframes('paper-', paperGrid))
  }
  return rules.join('\n')
}

/**
 * CSS for a control drawn as `<base>-rest|hover|pressed` slices, plus the
 * disabled slice of its kind when there is one.
 */
function familyCss(base, states, disabled) {
  const selector = `.px-${base}`
  const rest = states.rest
  const night = nineSlice(rest.frames[0].grid, rest.center, rest.repeat)
  const rules = [rule(selector, night.lines)]
  const variant = (piece) =>
    nineSlice(piece.frames[0].grid, piece.center, piece.repeat, night).lines
  if (states.hover) {
    rules.push(
      media('(hover: hover)', [
        rule(`${selector}:hover${ENABLED}`, variant(states.hover)),
      ])
    )
  }
  if (states.pressed) {
    rules.push(
      rule(
        `:is(${selector}:active, ${selector}[aria-pressed='true'])${ENABLED}`,
        variant(states.pressed)
      )
    )
  }
  if (disabled) rules.push(rule(`${selector}${DISABLED}`, variant(disabled)))
  return rules.join('\n')
}

/**
 * Recolour every frame of a piece into a new, named piece. A variant is a
 * body only when it is listed as one itself: the paper recolour is drawn
 * for the slice's own colours, not for the variant's.
 */
function variantPiece(piece, variant, paperNames) {
  return {
    ...piece,
    name: variant.name,
    paper: paperNames.has(variant.name),
    frames: piece.frames.map((f) => ({
      ...f,
      grid: recolourGrid(f.grid, variant.recolour),
    })),
  }
}

/** The whole stylesheet for a loaded chrome sheet. */
export function chromeCss(
  sheet,
  source = 'src/assets/pixel/chrome/os-chrome.json',
  options = CHROME_OPTIONS
) {
  const { slices } = sheet.data.meta
  if (slices.length === 0) throw new Error(`${sheet.json}: no slices`)
  const paperNames = new Set(options.paper ?? [])
  const paperMaps = options.paperRecolour ?? {}
  const pieces = new Map()
  for (const slice of slices) {
    const piece = slicePiece(sheet, slice, paperNames, paperMaps)
    if (pieces.has(piece.name))
      throw new Error(`chrome slice "${piece.name}" appears twice`)
    pieces.set(piece.name, piece)
  }
  for (const variant of options.variants ?? []) {
    const from = pieces.get(variant.from)
    if (!from)
      throw new Error(`variant "${variant.name}": no slice "${variant.from}"`)
    if (pieces.has(variant.name))
      throw new Error(`variant "${variant.name}" is also a slice`)
    pieces.set(variant.name, variantPiece(from, variant, paperNames))
  }
  const states = new Map()
  for (const state of options.states ?? []) {
    if (!pieces.get(state.slice)?.center)
      throw new Error(`state "${state.selector}": no 9-slice "${state.slice}"`)
    states.set(state.slice, [...(states.get(state.slice) ?? []), state])
  }

  // Controls: every `<base>-rest` with its other states.
  const families = new Map()
  for (const name of pieces.keys()) {
    const match = /^(.+)-(rest|hover|pressed)$/.exec(name)
    if (!match) continue
    const states = families.get(match[1]) ?? {}
    states[match[2]] = pieces.get(name)
    families.set(match[1], states)
  }
  const inFamily = new Set()
  const blocks = []
  for (const [base, states] of families) {
    if (!states.rest) continue
    for (const state of STATES)
      if (states[state]) inFamily.add(`${base}-${state}`)
    const disabledName = `${base.replace(/-[^-]+$/, '')}-disabled`
    const disabled = pieces.get(disabledName)
    if (disabled?.center) inFamily.add(disabledName)
    blocks.push({ name: base, css: familyCss(base, states, disabled) })
  }

  const tiles = []
  for (const piece of pieces.values()) {
    if (inFamily.has(piece.name)) continue
    if (piece.center) {
      blocks.push({
        name: piece.name,
        css: nineSliceCss(piece, `.px-${piece.name}`, states.get(piece.name)),
      })
    } else {
      tiles.push(piece)
      blocks.push({ name: piece.name, css: tileCss(piece) })
    }
  }
  blocks.sort((a, b) => a.name.localeCompare(b.name))
  tiles.sort((a, b) => a.name.localeCompare(b.name))

  const header = generatedHeader(source)
  const body = blocks.map((b) => b.css).join('\n\n')
  // The border widths the rules use, once each, and the tiles.
  const widths = [...new Set(body.match(/(?<=var\(--px)\d+(?=\))/g))]
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => `--px${n}: ${n === 1 ? 'var(--px)' : artPx(n)};`)
  const tileVars = tiles.map((t) => `--px-${t.name}: ${url(t.frames[0].grid)};`)
  const variables = [...widths, ...tileVars]
  return [
    ...header,
    ...(variables.length ? [rule(':root', variables), ''] : []),
    body,
    '',
  ].join('\n')
}

/** The `--px<n>` border widths a stylesheet uses. */
export function widthsIn(css) {
  return new Set(
    [...css.matchAll(/(?<=var\(--px)\d+(?=\))/g)].map((m) => Number(m[0]))
  )
}

/** The two-line header of a generated stylesheet, plus any more lines. */
function generatedHeader(source, ...more) {
  return [
    '/*',
    ` * GENERATED by scripts/pixel/gen-chrome.mjs from ${source}.`,
    ' * Do not edit by hand: re-export the chrome atlas and run `pnpm art:chrome`.',
    ...more.map((line) => ` * ${line}`),
    ' */',
    '',
  ]
}

/**
 * The coarse pointer stylesheet: each grown slice swaps in its taller image
 * (night, and paper for a body) under one media query. The border widths
 * stay the drawn ones, since growing only adds centre rows, so this file
 * needs no `--px<n>` of its own. It must load after `pixel-chrome.css`.
 */
export function coarseChromeCss(
  sheet,
  source = 'src/assets/pixel/chrome/os-chrome.json',
  options = COARSE_CHROME_OPTIONS,
  base = CHROME_OPTIONS
) {
  const paperNames = new Set(base.paper ?? [])
  const blocks = []
  for (const grow of options.grow ?? []) {
    const slice = sheet.data.meta.slices.find((s) => s.name === grow.slice)
    const piece =
      slice && slicePiece(sheet, slice, paperNames, base.paperRecolour ?? {})
    if (!piece?.center)
      throw new Error(`grow "${grow.slice}": no 9-slice of that name`)
    const tall = growGrid(piece.frames[0].grid, piece.center, grow.height)
    const selector = `.px-${piece.name}`
    blocks.push(rule(selector, [`border-image-source: ${url(tall.grid)};`]))
    const paper = recolourGrid(tall.grid, piece.paperMap)
    if (piece.paper && !same(paper, tall.grid)) {
      blocks.push(
        rule(`${PAPER_SCOPE} ${selector}${OUTSIDE_NIGHT}`, [
          `border-image-source: ${url(paper)};`,
        ])
      )
    }
  }
  return [
    ...generatedHeader(
      source,
      'globals.css imports it after pixel-chrome.css.'
    ),
    media(options.media, blocks),
    '',
  ].join('\n')
}

/**
 * The phone stylesheet: each copy is a 9-slice of the atlas, grown to its
 * height, under its own class, in the components layer (it is imported by a
 * component, not by globals.css). `known` are the border widths the main
 * stylesheet declares on `:root`; a copy that needs another one fails.
 */
export function mobileChromeCss(
  sheet,
  source = 'src/assets/pixel/chrome/os-chrome.json',
  options = MOBILE_CHROME_OPTIONS,
  known = new Set([1, 2, 3, 8])
) {
  const blocks = []
  for (const copy of options.copies ?? []) {
    const slice = sheet.data.meta.slices.find((s) => s.name === copy.from)
    const piece = slice && slicePiece(sheet, slice, new Set(), {})
    if (!piece?.center)
      throw new Error(`copy "${copy.name}": no 9-slice "${copy.from}"`)
    const { grid } = piece.frames[0]
    const tall = copy.height
      ? growGrid(grid, piece.center, copy.height)
      : { grid, center: piece.center }
    const { lines } = nineSlice(tall.grid, tall.center, piece.repeat)
    blocks.push(rule(`.px-${copy.name}`, lines))
  }
  const body = blocks.join('\n\n')
  const missing = [...widthsIn(body)].filter((n) => !known.has(n))
  if (missing.length) {
    throw new Error(
      `mobile chrome needs --px${missing.join(', --px')}, which pixel-chrome.css does not declare`
    )
  }
  return [
    ...generatedHeader(
      source,
      'The phone sheet imports it (`mobile-sheet.tsx`).'
    ),
    '@layer components {',
    body.replace(/^(?=.)/gm, '  '),
    '}',
    '',
  ].join('\n')
}

async function main(argv) {
  const at = (flag, fallback) => {
    const i = argv.indexOf(flag)
    return i > -1 ? argv[i + 1] : fallback
  }
  const input = at('--in', DEFAULT_IN)
  const out = at('--out', DEFAULT_OUT)
  if (!existsSync(input)) {
    console.error(
      `${relative(ROOT, input)} does not exist yet. Run: pnpm art:export --only chrome`
    )
    process.exit(1)
  }
  const coarseOut = at('--coarse-out', COARSE_OUT)
  const mobileOut = at('--mobile-out', MOBILE_OUT)
  const sheet = await loadSheet(input)
  const source = relative(ROOT, input).split('\\').join('/')
  const css = chromeCss(sheet, source)
  const mobile = mobileChromeCss(
    sheet,
    source,
    MOBILE_CHROME_OPTIONS,
    widthsIn(css)
  )
  const coarse = coarseChromeCss(sheet, source)
  const count = sheet.data.meta.slices.length
  const outputs = [
    [out, css],
    [coarseOut, coarse],
    [mobileOut, mobile],
  ]
  if (argv.includes('--check')) {
    for (const [file, text] of outputs) {
      if (!existsSync(file) || readFileSync(file, 'utf8') !== text) {
        console.error(`${relative(ROOT, file)} is stale. Run: pnpm art:chrome`)
        process.exit(1)
      }
    }
    console.log(`chrome up to date: ${count} slice(s)`)
    return
  }
  for (const [file, text] of outputs) {
    writeFileSync(file, text)
    console.log(`wrote ${relative(ROOT, file)}: ${text.length} bytes`)
  }
  console.log(`${count} slice(s)`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
