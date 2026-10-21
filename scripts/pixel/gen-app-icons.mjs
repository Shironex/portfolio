/**
 * The app icon sheets the OS ships (SPEC 2.4, Icons), cut from the export of
 * `os-app-icons.aseprite`.
 *
 *   pnpm art:icons            write src/assets/pixel/icons/app-icons-{32,16}
 *   pnpm art:icons --check    fail if those sheets are stale
 *   node scripts/pixel/gen-app-icons.mjs --in <sheet.json> --out-dir <dir>
 *
 * Atlas contract (exported by `pnpm art:export --only os-app-icons`): a
 * 32x32 slice `app-<name>-32` and a 16x16 slice `app-<name>-16` per app, a
 * `logo-16` slice, and one tag per app named `<name>`, whose first frame is
 * the still. Outside its own tag every icon shows its still.
 *
 * The export is the whole 192x48 canvas per frame, so every frame repeats
 * the five icons that hold still. The shipped sheets keep only what moves:
 *
 *   app-icons-32  one row per app, its tag's frames left to right, the tag
 *                 kept (renumbered) with the frame durations as drawn
 *   app-icons-16  the 16x16 icons of frame 0 and the logo, one frame each,
 *                 named `<name>` (`logo` for the logo), no tags
 *
 * Both are json-array sheets like Aseprite's, so `check-art.mjs` checks them
 * and `gen-sprites.mjs` writes their CSS. The export stays a generator input
 * and never ships.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

import { flag, isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { optimizePng, samePixels } from './png.mjs'
import { loadSheet, pixelAt, sliceKey } from './sheet.mjs'

const DEFAULT_IN = join(
  ROOT,
  'src',
  'assets',
  'pixel',
  'app-icons',
  'os-app-icons.json'
)
const DEFAULT_OUT_DIR = join(ROOT, 'src', 'assets', 'pixel', 'icons')

/** The two sheets, by file stem. */
export const APP_ICON_SHEETS = { large: 'app-icons-32', small: 'app-icons-16' }

const LARGE = 32
const SMALL = 16

function sliceNamed(sheet, name) {
  const slice = sheet.data.meta.slices.find((s) => s.name === name)
  if (!slice) throw new Error(`${sheet.json}: no slice "${name}"`)
  return slice
}

/**
 * A cell to copy: canvas `bounds` of source frame `from`, at `x, y` out.
 * A cell may name the `sheet` it comes from, when a layout draws on more
 * than one export (the project icons); otherwise it reads the one passed to
 * `sheetPixels`.
 */
export function cell(from, bounds, x, y, duration, filename) {
  return { from, bounds, x, y, duration, filename }
}

/**
 * The layout of both sheets for a loaded export: cells, tags and sizes. Pure,
 * so tests can read it without writing files.
 */
export function appIconLayout(sheet) {
  const tags = sheet.data.meta.frameTags
  if (tags.length === 0) throw new Error(`${sheet.json}: no tags`)

  const large = { cells: [], tags: [], w: 0, h: tags.length * LARGE }
  for (const [row, tag] of tags.entries()) {
    const slice = sliceNamed(sheet, `app-${tag.name}-${LARGE}`)
    const from = large.cells.length
    for (let f = tag.from; f <= tag.to; f++) {
      const { bounds } = sliceKey(slice, f)
      if (bounds.w !== LARGE || bounds.h !== LARGE) {
        throw new Error(`slice "${slice.name}" is not ${LARGE}x${LARGE}`)
      }
      const col = f - tag.from
      large.cells.push(
        cell(
          f,
          bounds,
          col * LARGE,
          row * LARGE,
          sheet.data.frames[f].duration,
          `${tag.name}:${col}`
        )
      )
      large.w = Math.max(large.w, (col + 1) * LARGE)
    }
    large.tags.push({
      name: tag.name,
      from,
      to: large.cells.length - 1,
      direction: tag.direction,
    })
  }

  const smallSlices = [
    ...tags.map((tag) => sliceNamed(sheet, `app-${tag.name}-${SMALL}`)),
    sliceNamed(sheet, `logo-${SMALL}`),
  ]
  const small = { cells: [], tags: [], w: smallSlices.length * SMALL, h: SMALL }
  for (const [i, slice] of smallSlices.entries()) {
    const { bounds } = sliceKey(slice, 0)
    if (bounds.w !== SMALL || bounds.h !== SMALL) {
      throw new Error(`slice "${slice.name}" is not ${SMALL}x${SMALL}`)
    }
    const name = slice.name.replace(/^app-/, '').replace(/-\d+$/, '')
    small.cells.push(
      cell(0, bounds, i * SMALL, 0, sheet.data.frames[0].duration, name)
    )
  }
  return { large, small }
}

/** RGBA pixels of one laid-out sheet. */
export function sheetPixels(sheet, layout) {
  const raw = Buffer.alloc(layout.w * layout.h * 4)
  for (const c of layout.cells) {
    for (let y = 0; y < c.bounds.h; y++) {
      for (let x = 0; x < c.bounds.w; x++) {
        raw.set(
          pixelAt(c.sheet ?? sheet, c.from, c.bounds.x + x, c.bounds.y + y),
          ((c.y + y) * layout.w + c.x + x) * 4
        )
      }
    }
  }
  return raw
}

/**
 * The sheet JSON, in the shape Aseprite writes, as committed text. `app`
 * names the generator in `meta.app`.
 */
export function appIconSheetJson(
  stem,
  layout,
  app = 'scripts/pixel/gen-app-icons.mjs'
) {
  const data = {
    frames: layout.cells.map((c) => ({
      filename: c.filename,
      frame: { x: c.x, y: c.y, w: c.bounds.w, h: c.bounds.h },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: c.bounds.w, h: c.bounds.h },
      sourceSize: { w: c.bounds.w, h: c.bounds.h },
      duration: c.duration,
    })),
    meta: {
      app,
      image: `${stem}.png`,
      format: 'RGBA8888',
      size: { w: layout.w, h: layout.h },
      scale: '1',
      frameTags: layout.tags,
      layers: [],
      slices: [],
    },
  }
  return `${JSON.stringify(data, null, 2)}\n`
}

async function decoded(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/**
 * Write one laid-out sheet as `<stem>.png` and `<stem>.json` in `outDir`, or
 * with `check` compare it with what is there. Returns whether it was stale
 * (or written).
 */
export async function writeCutSheet(
  { stem, layout, sheet, app },
  outDir,
  { check = false } = {}
) {
  const pixels = sheetPixels(sheet, layout)
  const json = appIconSheetJson(stem, layout, app)
  const pngFile = join(outDir, `${stem}.png`)
  const jsonFile = join(outDir, `${stem}.json`)
  if (check) {
    const fresh =
      existsSync(pngFile) &&
      existsSync(jsonFile) &&
      readFileSync(jsonFile, 'utf8') === json &&
      samePixels(await decoded(pngFile), {
        data: pixels,
        width: layout.w,
        height: layout.h,
      })
    return !fresh
  }
  mkdirSync(outDir, { recursive: true })
  await sharp(pixels, {
    raw: { width: layout.w, height: layout.h, channels: 4 },
  })
    .png()
    .toFile(pngFile)
  await optimizePng(pngFile)
  writeFileSync(jsonFile, json)
  return true
}

/**
 * Write both sheets into `outDir`, or with `check` compare them with what is
 * there. Returns the stale or written file names.
 */
export async function writeAppIcons(input, outDir, { check = false } = {}) {
  const sheet = await loadSheet(input)
  const layouts = appIconLayout(sheet)
  const touched = []
  for (const [key, stem] of Object.entries(APP_ICON_SHEETS)) {
    const layout = layouts[key]
    if (await writeCutSheet({ stem, layout, sheet }, outDir, { check })) {
      touched.push(stem)
    }
  }
  return touched
}

async function main(argv) {
  const input = flag(argv, '--in', DEFAULT_IN)
  const outDir = flag(argv, '--out-dir', DEFAULT_OUT_DIR)
  if (!existsSync(input)) {
    console.error(
      `${relative(ROOT, input)} does not exist yet. Run: pnpm art:export --only os-app-icons`
    )
    process.exit(1)
  }
  const check = argv.includes('--check')
  const touched = await writeAppIcons(input, outDir, { check })
  const where = relative(ROOT, outDir).split('\\').join('/')
  if (check) {
    if (touched.length) {
      console.error(
        `${where}: ${touched.join(', ')} stale. Run: pnpm art:icons`
      )
      process.exit(1)
    }
    console.log('app icons up to date')
    return
  }
  console.log(`wrote ${where}: ${touched.join(', ')}`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
