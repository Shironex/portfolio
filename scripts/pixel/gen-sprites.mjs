/**
 * Sprite sheet animation as CSS (SPEC 2.4): one `@keyframes` per Aseprite tag,
 * with the frame durations exactly as drawn (uneven timing is the point).
 *
 *   pnpm art:sprites            write src/styles/sprites/<sheet>.css
 *   pnpm art:sprites --check    fail if any of them is stale or orphaned
 *   node scripts/pixel/gen-sprites.mjs --in <dir|file.json>... --out-dir <dir>
 *
 * One stylesheet per sheet, so a component imports the loops of the art it
 * shows and nothing else: the boot sheet loads with the boot screen, the
 * banners with the panel that shows them (decision 4 of SPEC section 10).
 * Each file puts its rules in the `components` layer, under the utilities,
 * as they were when one file was imported from globals.css.
 *
 * Reads every sheet JSON under src/assets/pixel, except the generator-only
 * groups (chrome, glyphs, the app icon and wallpaper exports), the shipped
 * wallpaper (drawn on a canvas) and the `@<n>x` copies. For a sheet `<sheet>`
 * and a tag `<tag>` it writes:
 *
 *   .px-<sheet>              element size and background size in art px
 *   .px-<sheet>-<tag>        rests on the tag's first frame, and names its
 *                            loop in `--px-loop`
 *   @keyframes px-<sheet>-<tag>
 *
 * A sheet with slices gets a class per slice, `.px-<sheet>-<slice>`, sized to
 * the slice and resting on it in the first frame; a tag named like a slice
 * animates that slice's rectangle instead of the whole frame (the boot
 * sheet's `run` mark spins while its wordmark holds still).
 *
 * A sheet with no tags whose frames are named (`app-icons-16`: `projects`,
 * `logo`) gets a resting class per frame instead, `.px-<sheet>-<frame>`.
 *
 * The loop runs where the component says: `animate-(--px-loop)` always (with
 * `ambient-loop`, so the pause rules hold it), or only under a hover or
 * focus variant, as the app icons do. The component sets `background-image`
 * from the static import of the PNG, so the sheet is served hashed from
 * /_next/static/media. Each keyframe holds its frame until the next one
 * (`step-end`), so frame i shows for exactly its own duration. Under reduced
 * motion the global rule shortens the animation to one 0.01ms run with no
 * fill, which leaves the resting first frame.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, relative } from 'node:path'

import {
  ART_SOURCES,
  DERIVED_SHEETS,
  GENERATOR_INPUT_GROUPS,
} from './art-manifest.mjs'
import { isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { readSheetJson, sliceKey, tagFrames } from './sheet.mjs'

const DEFAULT_IN = join(ROOT, 'src', 'assets', 'pixel')
export const SPRITES_DIR = join(ROOT, 'src', 'styles', 'sprites')

/** `n` art px as CSS: `0` or `calc(n * var(--px))`. */
export function artPx(n) {
  return n === 0 ? '0' : `calc(${n} * var(--px))`
}

/** The same with no spaces, for the sprite CSS, where it repeats per frame. */
function tightPx(n) {
  return n === 0 ? '0' : `calc(${n}*var(--px))`
}

/** Class-safe name: lower case, runs of other characters to one dash. */
export function cssName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function percent(value) {
  return `${Number(value.toFixed(4))}%`
}

/** Whether every frame has a class-safe name of its own (not `x 0.aseprite`). */
export function hasNamedFrames(data) {
  return data.frames.every(
    (f) => f.filename !== '' && cssName(f.filename) === f.filename
  )
}

/**
 * The loop of one tag: its resting class and its keyframes. `at(i)` is the
 * background position that shows frame i; `size` adds declarations to the
 * class (a slice's width and height). A tag of one frame is a pose, not a
 * loop: it gets the resting class only.
 */
function loopCss(id, tag, data, at, size = []) {
  const order = tagFrames(tag)
  const total = order.reduce((sum, i) => sum + data.frames[i].duration, 0)
  if (order.length === 1) {
    return [
      `/* ${tag.name}: frame ${order[0]} */`,
      `.${id} {`,
      ...size,
      `  background-position: ${at(order[0])};`,
      '}',
    ].join('\n')
  }
  // No 0% and no 100%: the missing ends take the resting first frame,
  // and `step-end` holds each frame to the next keyframe, the last one
  // to the end of the loop.
  const steps = []
  let elapsed = order.length ? data.frames[order[0]].duration : 0
  for (const i of order.slice(1)) {
    steps.push(
      `  ${percent((elapsed / total) * 100)} { background-position: ${at(i)}; }`
    )
    elapsed += data.frames[i].duration
  }
  return [
    `/* ${tag.name}: frames ${order.join(', ')}, ${total}ms */`,
    `.${id} {`,
    ...size,
    `  background-position: ${at(order[0])};`,
    `  --px-loop: ${id} ${total}ms step-end infinite;`,
    '}',
    `@keyframes ${id} {`,
    ...steps,
    '}',
  ].join('\n')
}

/**
 * CSS for one sheet: its slices, its tags, or its named frames when it has
 * neither. `name` is the sheet's class stem.
 */
export function spriteCss(name, data) {
  const { w, h } = data.frames[0].sourceSize
  if (data.frames.some((f) => f.trimmed)) {
    throw new Error(
      `${name}: trimmed frames cannot be shown by background-position`
    )
  }
  const sheet = cssName(name)
  const blocks = [
    [
      `.px-${sheet} {`,
      `  width: ${tightPx(w)};`,
      `  height: ${tightPx(h)};`,
      `  background-size: ${tightPx(data.meta.size.w)} ${tightPx(data.meta.size.h)};`,
      '  background-repeat: no-repeat;',
      '  image-rendering: pixelated;',
      '}',
    ].join('\n'),
  ]
  /** Position showing canvas point (dx, dy) of frame i at the element's corner. */
  const at = (i, dx = 0, dy = 0) => {
    const { x, y } = data.frames[i].frame
    return `${tightPx(-(x + dx))} ${tightPx(-(y + dy))}`
  }

  const sliceNames = new Set()
  for (const slice of data.meta.slices) {
    const id = `px-${sheet}-${cssName(slice.name)}`
    sliceNames.add(slice.name)
    const { bounds } = sliceKey(slice, 0)
    const size = [
      `  width: ${tightPx(bounds.w)};`,
      `  height: ${tightPx(bounds.h)};`,
    ]
    const tag = data.meta.frameTags.find((t) => t.name === slice.name)
    if (!tag) {
      blocks.push(
        [
          `.${id} {`,
          ...size,
          `  background-position: ${at(0, bounds.x, bounds.y)};`,
          '}',
        ].join('\n')
      )
      continue
    }
    blocks.push(
      loopCss(
        id,
        tag,
        data,
        (i) => {
          const key = sliceKey(slice, i).bounds
          return at(i, key.x, key.y)
        },
        size
      )
    )
  }

  if (data.meta.frameTags.length === 0 && sliceNames.size === 0) {
    for (const [i, frame] of data.frames.entries()) {
      blocks.push(
        `.px-${sheet}-${cssName(frame.filename)} { background-position: ${at(i)}; }`
      )
    }
    return blocks.join('\n\n')
  }
  for (const tag of data.meta.frameTags) {
    if (sliceNames.has(tag.name)) continue
    blocks.push(loopCss(`px-${sheet}-${cssName(tag.name)}`, tag, data, at))
  }
  return blocks.join('\n\n')
}

/** Sheet JSONs to animate, from folders or files. */
export function sheetFiles(inputs) {
  const skipGroups = new Set([
    ...GENERATOR_INPUT_GROUPS,
    ...ART_SOURCES.filter((s) => s.splitLayers).map((s) => s.group),
    ...DERIVED_SHEETS.filter((s) => s.canvas).map((s) => s.group),
  ])
  const out = []
  const visit = (path, top) => {
    if (!existsSync(path)) return
    if (statSync(path).isDirectory()) {
      for (const name of readdirSync(path).sort()) {
        if (path === top && skipGroups.has(name)) continue
        visit(join(path, name), top)
      }
    } else if (path.endsWith('.json') && !/@\d+x\.json$/.test(path)) {
      out.push(path)
    }
  }
  for (const input of inputs) visit(input, input)
  return out
}

/** Whether a sheet has anything to show by class: tags, slices or named frames. */
function animatable(data) {
  return (
    data.meta.frameTags.length > 0 ||
    data.meta.slices.length > 0 ||
    hasNamedFrames(data)
  )
}

/**
 * The stylesheet of one sheet JSON, as written: `{ name, css }`, where
 * `name` is the file stem (`<name>.css`), or null when the sheet has nothing
 * a class could show.
 */
export function sheetStylesheet(file) {
  const data = readSheetJson(file)
  if (!animatable(data)) return null
  const name = basename(file, '.json')
  const body = spriteCss(name, data)
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')
  const css = [
    '/*',
    ` * GENERATED by scripts/pixel/gen-sprites.mjs from ${relative(ROOT, file).split('\\').join('/')}.`,
    ' * Do not edit by hand: re-export the art and run `pnpm art:sprites`.',
    ' */',
    '',
    '@layer components {',
    body,
    '}',
    '',
  ].join('\n')
  return { name, css }
}

/** The stylesheets for `files`, one per sheet that has something to show. */
export function buildSpriteFiles(files) {
  return files.map(sheetStylesheet).filter(Boolean)
}

function main(argv) {
  const inputs = []
  argv.forEach((arg, i) => {
    if (argv[i - 1] === '--in') inputs.push(arg)
  })
  const outIndex = argv.indexOf('--out-dir')
  const outDir = outIndex > -1 ? argv[outIndex + 1] : SPRITES_DIR
  const files = sheetFiles(inputs.length ? inputs : [DEFAULT_IN])
  const sheets = buildSpriteFiles(files)
  const count = sheets.reduce(
    (sum, s) => sum + (s.css.match(/@keyframes /g) ?? []).length,
    0
  )
  const where = relative(ROOT, outDir).split('\\').join('/')

  if (argv.includes('--check')) {
    const stale = sheets
      .filter(({ name, css }) => {
        const file = join(outDir, `${name}.css`)
        return !existsSync(file) || readFileSync(file, 'utf8') !== css
      })
      .map(({ name }) => `${name}.css`)
    const wanted = new Set(sheets.map(({ name }) => `${name}.css`))
    const orphans = existsSync(outDir)
      ? readdirSync(outDir).filter((f) => f.endsWith('.css') && !wanted.has(f))
      : []
    if (stale.length || orphans.length) {
      if (stale.length) console.error(`${where}: stale ${stale.join(', ')}`)
      if (orphans.length) {
        console.error(
          `${where}: ${orphans.join(', ')} match no sheet; remove them`
        )
      }
      console.error('Run: pnpm art:sprites')
      process.exit(1)
    }
    console.log(
      `sprites up to date: ${sheets.length} sheet(s), ${count} loop(s)`
    )
    return
  }
  mkdirSync(outDir, { recursive: true })
  for (const { name, css } of sheets) {
    writeFileSync(join(outDir, `${name}.css`), css)
  }
  console.log(
    `wrote ${where}: ${sheets.map((s) => `${s.name}.css`).join(', ')} (${count} loop(s))`
  )
}

if (isMain(import.meta.url)) main(process.argv.slice(2))
