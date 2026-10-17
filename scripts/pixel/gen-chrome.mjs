/**
 * Window chrome as CSS border-image (SPEC 2.4, 9-slice pipeline).
 *
 *   pnpm art:chrome            write src/styles/pixel-chrome.css
 *   pnpm art:chrome --check    fail if that file is stale
 *   node scripts/pixel/gen-chrome.mjs --in <sheet.json> --out <file.css>
 *
 * Atlas contract (os-chrome.aseprite, exported by `pnpm art:export`):
 *   - one slice per piece, named in kebab case; the class is `.px-<name>`
 *   - a slice with a 9-slice centre (set in Aseprite) becomes a border-image:
 *     the border widths are the distances from the centre to the edges, in
 *     art px, and the centre fills the box (`fill`)
 *   - a slice without a centre is a tile (`background-image`, repeated at
 *     its size); if its pixels change across frames it steps through them
 *     with the frame durations (add `ambient-loop` where it is used)
 *   - slice user data, space separated:
 *       repeat=round|space|repeat   edge repeat (default stretch); patterned
 *                                   edges such as a grip or dotted rule use round
 *       night                       chrome that stays night in paper mode
 *
 * Each slice becomes an SVG of merged pixel runs with `crispEdges`, inlined as
 * a data URI (CSP allows `data:` images), so there is no request and no
 * resampling blur. Paper mode (Lamp on: `<html>` without `.dark`) gets a copy
 * recoloured through `PAPER_RECOLOUR`, unless the slice is `night`.
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
const REPEATS = new Set(['stretch', 'round', 'space', 'repeat'])

/** Paper mode: the Lamp is on when `<html>` is not `.dark`. */
export const PAPER_SCOPE = ':root:not(.dark)'

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

/** Every frame's pixels of a slice, as grids. */
function frameGrids(sheet, slice) {
  return sheet.data.frames.map((_, i) =>
    readRegion(sheet, i, sliceKey(slice, i).bounds)
  )
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** CSS rules for one slice. */
export function sliceCss(sheet, slice) {
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
  const night = 'night' in options
  const key = sliceKey(slice, 0)
  const grids = frameGrids(sheet, slice)
  // Frames that repeat the one before add nothing; keep the first of a run.
  const frames = []
  grids.forEach((grid, i) => {
    const last = frames.at(-1)
    if (last && same(last.grid, grid)) last.ms += sheet.data.frames[i].duration
    else frames.push({ grid, ms: sheet.data.frames[i].duration })
  })
  const paper = (grid) => recolourGrid(grid, PAPER_RECOLOUR)
  const rules = []

  if (key.center) {
    if (frames.length > 1) {
      throw new Error(
        `9-slice "${slice.name}" changes across frames; draw states as separate slices`
      )
    }
    const insets = sliceInsets(key)
    const widths = insets.map(artPx).join(' ')
    rules.push(
      [
        `.px-${name} {`,
        '  border-style: solid;',
        `  border-width: ${widths};`,
        `  border-image-source: ${url(frames[0].grid)};`,
        `  border-image-slice: ${insets.join(' ')} fill;`,
        `  border-image-width: ${widths};`,
        `  border-image-repeat: ${repeat};`,
        '}',
      ].join('\n')
    )
    const paperGrid = paper(frames[0].grid)
    if (!night && !same(paperGrid, frames[0].grid)) {
      rules.push(
        `${PAPER_SCOPE} .px-${name} {\n  border-image-source: ${url(paperGrid)};\n}`
      )
    }
    return rules.join('\n')
  }

  const { w, h } = key.bounds
  const total = frames.reduce((sum, f) => sum + f.ms, 0)
  const lines = [
    `.px-${name} {`,
    `  background-image: ${url(frames[0].grid)};`,
    `  background-size: ${artPx(w)} ${artPx(h)};`,
    '  background-repeat: repeat;',
  ]
  if (frames.length > 1)
    lines.push(`  animation: px-${name} ${total}ms step-end infinite;`)
  lines.push('}')
  rules.push(lines.join('\n'))
  if (frames.length > 1) {
    const keyframes = (scope, map) => {
      let elapsed = 0
      const steps = frames.map((f) => {
        const at = Number(((elapsed / total) * 100).toFixed(4))
        elapsed += f.ms
        return `  ${at}% { background-image: ${url(map(f.grid))}; }`
      })
      steps.push(
        `  100% { background-image: ${url(map(frames.at(-1).grid))}; }`
      )
      return `@keyframes ${scope}px-${name} {\n${steps.join('\n')}\n}`
    }
    rules.push(keyframes('', (g) => g))
    if (!night && frames.some((f) => !same(paper(f.grid), f.grid))) {
      rules.push(
        `${PAPER_SCOPE} .px-${name} {\n  background-image: ${url(paper(frames[0].grid))};\n` +
          `  animation-name: paper-px-${name};\n}`
      )
      rules.push(keyframes('paper-', paper))
    }
  } else {
    const paperGrid = paper(frames[0].grid)
    if (!night && !same(paperGrid, frames[0].grid)) {
      rules.push(
        `${PAPER_SCOPE} .px-${name} {\n  background-image: ${url(paperGrid)};\n}`
      )
    }
  }
  return rules.join('\n')
}

/** The whole stylesheet for a loaded chrome sheet. */
export function chromeCss(
  sheet,
  source = 'src/assets/pixel/chrome/os-chrome.json'
) {
  const { slices } = sheet.data.meta
  if (slices.length === 0) throw new Error(`${sheet.json}: no slices`)
  const names = new Set()
  for (const s of slices) {
    if (names.has(s.name))
      throw new Error(`chrome slice "${s.name}" appears twice`)
    names.add(s.name)
  }
  const blocks = [...slices]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((slice) => sliceCss(sheet, slice))
  return [
    '/*',
    ` * GENERATED by scripts/pixel/gen-chrome.mjs from ${source}.`,
    ' * Do not edit by hand: re-export the chrome atlas and run `pnpm art:chrome`.',
    ' */',
    '',
    blocks.join('\n\n'),
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
  const sheet = await loadSheet(input)
  const css = chromeCss(sheet, relative(ROOT, input).split('\\').join('/'))
  const count = sheet.data.meta.slices.length
  if (argv.includes('--check')) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== css) {
      console.error(`${relative(ROOT, out)} is stale. Run: pnpm art:chrome`)
      process.exit(1)
    }
    console.log(`chrome up to date: ${count} slice(s)`)
    return
  }
  writeFileSync(out, css)
  console.log(
    `wrote ${relative(ROOT, out)}: ${count} slice(s), ${css.length} bytes`
  )
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
