/**
 * Sprite sheet animation as CSS (SPEC 2.4): one `@keyframes` per Aseprite tag,
 * with the frame durations exactly as drawn (uneven timing is the point).
 *
 *   pnpm art:sprites            write src/styles/pixel-sprites.css
 *   pnpm art:sprites --check    fail if that file is stale
 *   node scripts/pixel/gen-sprites.mjs --in <dir|file.json>... --out <file.css>
 *
 * Reads every sheet JSON under src/assets/pixel, except the generator-only
 * groups (chrome, glyphs, the app icon export), the wallpaper (drawn on a
 * canvas) and the `@<n>x` copies. For a sheet `<sheet>` and a tag `<tag>` it
 * writes:
 *
 *   .px-<sheet>              element size and background size in art px
 *   .px-<sheet>-<tag>        rests on the tag's first frame, and names its
 *                            loop in `--px-loop`
 *   @keyframes px-<sheet>-<tag>
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
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, relative } from 'node:path'

import { ART_SOURCES, GENERATOR_INPUT_GROUPS } from './art-manifest.mjs'
import { isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { readSheetJson, tagFrames } from './sheet.mjs'

const DEFAULT_IN = join(ROOT, 'src', 'assets', 'pixel')
const DEFAULT_OUT = join(ROOT, 'src', 'styles', 'pixel-sprites.css')

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
 * CSS for one sheet: its tags, or its named frames when it has no tags.
 * `name` is the sheet's class stem.
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
  const at = (i) => {
    const { x, y } = data.frames[i].frame
    return `${tightPx(-x)} ${tightPx(-y)}`
  }
  if (data.meta.frameTags.length === 0) {
    for (const [i, frame] of data.frames.entries()) {
      blocks.push(
        `.px-${sheet}-${cssName(frame.filename)} { background-position: ${at(i)}; }`
      )
    }
    return blocks.join('\n\n')
  }
  for (const tag of data.meta.frameTags) {
    const order = tagFrames(tag)
    const total = order.reduce((sum, i) => sum + data.frames[i].duration, 0)
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
    const id = `px-${sheet}-${cssName(tag.name)}`
    blocks.push(
      [
        `/* ${tag.name}: frames ${order.join(', ')}, ${total}ms */`,
        `.${id} {`,
        `  background-position: ${at(order[0])};`,
        `  --px-loop: ${id} ${total}ms step-end infinite;`,
        '}',
        `@keyframes ${id} {`,
        ...steps,
        '}',
      ].join('\n')
    )
  }
  return blocks.join('\n\n')
}

/** Sheet JSONs to animate, from folders or files. */
export function sheetFiles(inputs) {
  const skipGroups = new Set([
    ...GENERATOR_INPUT_GROUPS,
    ...ART_SOURCES.filter((s) => s.splitLayers).map((s) => s.group),
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

/** The whole stylesheet for `files`. */
export function buildSpritesCss(files) {
  const sections = []
  for (const file of files) {
    const data = readSheetJson(file)
    if (data.meta.frameTags.length === 0 && !hasNamedFrames(data)) continue
    const name = basename(file, '.json')
    sections.push(
      `/* ${relative(ROOT, file).split('\\').join('/')} */\n${spriteCss(name, data)}`
    )
  }
  return [
    '/*',
    ' * GENERATED by scripts/pixel/gen-sprites.mjs from the Aseprite sheet JSON in',
    ' * src/assets/pixel. Do not edit by hand: re-export the art and run',
    ' * `pnpm art:sprites`.',
    ' */',
    '',
    sections.join('\n\n'),
    '',
  ].join('\n')
}

function main(argv) {
  const inputs = []
  argv.forEach((arg, i) => {
    if (argv[i - 1] === '--in') inputs.push(arg)
  })
  const outIndex = argv.indexOf('--out')
  const out = outIndex > -1 ? argv[outIndex + 1] : DEFAULT_OUT
  const files = sheetFiles(inputs.length ? inputs : [DEFAULT_IN])
  const css = buildSpritesCss(files)
  const count = (css.match(/@keyframes /g) ?? []).length

  if (argv.includes('--check')) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== css) {
      console.error(`${relative(ROOT, out)} is stale. Run: pnpm art:sprites`)
      process.exit(1)
    }
    console.log(
      `sprites up to date: ${files.length} sheet(s), ${count} loop(s)`
    )
    return
  }
  writeFileSync(out, css)
  console.log(
    `wrote ${relative(ROOT, out)}: ${files.length} sheet(s), ${count} loop(s)`
  )
}

if (isMain(import.meta.url)) main(process.argv.slice(2))
