/**
 * Gate on the exported pixel art (part of `pnpm lint`, SPEC 4.1 and 4.6).
 *
 *   pnpm art:check                  check src/assets/pixel
 *   node scripts/pixel/check-art.mjs --dir <dir> [--allow-empty]
 *
 * For every PNG under the folder:
 *   - it belongs to a source in `art-manifest.mjs` (`<name>.png` or `<name>@<n>x.png`)
 *     and sits in that source's group folder
 *   - its JSON is next to it and agrees with it: `meta.size` is the PNG size,
 *     every frame rectangle is inside the sheet, every frame has the same
 *     canvas, tags and slices stay inside the frames and the canvas
 *   - alpha is 0 or 255 only (pixel art has no soft edges)
 *   - every opaque pixel is a README palette colour, unless the source keeps
 *     its own palette (`ownPalette`) or is 1-bit (`oneBit`: one colour,
 *     whichever it is, since code recolours it)
 * and per budget set, the PNG bytes stay under SPEC 4.6; generated outputs
 * (chrome CSS, glyph component, sprite CSS) are held to their budgets when
 * they exist.
 *
 * An empty folder fails unless `--allow-empty` is passed: a gate that
 * matches nothing must not read as a pass.
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import sharp from 'sharp'

import { ART_SOURCES, GENERATED_BUDGETS, PNG_BUDGETS } from './art-manifest.mjs'
import { flag, isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { PALETTE_HEX, toHex } from './palette.mjs'
import { readSheetJson } from './sheet.mjs'

const PALETTE = new Set(PALETTE_HEX)

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

/** The manifest entry a PNG was exported from, by file name. */
function entryFor(file, sources) {
  const stem = basename(file, '.png').replace(/@\d+x$/, '')
  return sources.find((s) => s.name === stem)
}

function inside(rect, w, h) {
  return (
    rect.x >= 0 && rect.y >= 0 && rect.x + rect.w <= w && rect.y + rect.h <= h
  )
}

/** Problems with a sheet JSON against its PNG size. */
export function sheetProblems(data, width, height) {
  const out = []
  if (data.meta.size.w !== width || data.meta.size.h !== height) {
    out.push(
      `meta.size ${data.meta.size.w}x${data.meta.size.h} but the PNG is ${width}x${height}`
    )
  }
  const canvas = data.frames[0].sourceSize
  data.frames.forEach((f, i) => {
    if (!inside(f.frame, width, height))
      out.push(`frame ${i} lies outside the sheet`)
    if (f.sourceSize.w !== canvas.w || f.sourceSize.h !== canvas.h) {
      out.push(`frame ${i} has a different canvas size`)
    }
    if (f.duration <= 0) out.push(`frame ${i} has duration ${f.duration}`)
  })
  for (const tag of data.meta.frameTags) {
    if (tag.from < 0 || tag.to >= data.frames.length || tag.from > tag.to) {
      out.push(
        `tag "${tag.name}" spans ${tag.from}..${tag.to} of ${data.frames.length} frames`
      )
    }
  }
  for (const slice of data.meta.slices) {
    for (const key of slice.keys) {
      if (!inside(key.bounds, canvas.w, canvas.h)) {
        out.push(
          `slice "${slice.name}" lies outside the ${canvas.w}x${canvas.h} canvas`
        )
      }
      if (key.center && !inside(key.center, key.bounds.w, key.bounds.h)) {
        out.push(
          `slice "${slice.name}" has its 9-slice centre outside its bounds`
        )
      }
    }
  }
  return out
}

/**
 * Pixel problems: partial alpha, and off-palette colours (unless exempt), or
 * a second colour in 1-bit art.
 */
export async function pixelProblems(
  file,
  { ownPalette = false, oneBit = false } = {}
) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const partial = { count: 0, first: [] }
  const offPalette = new Map()
  const colours = new Map()
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a === 0) continue
    const x = (i / 4) % info.width
    const y = Math.floor(i / 4 / info.width)
    if (a !== 255) {
      partial.count++
      if (partial.first.length < 3) partial.first.push(`${x},${y} (alpha ${a})`)
      continue
    }
    const hex = toHex(data[i], data[i + 1], data[i + 2])
    if (oneBit) {
      if (!colours.has(hex)) colours.set(hex, `${x},${y}`)
      continue
    }
    if (ownPalette) continue
    if (!PALETTE.has(hex) && !offPalette.has(hex))
      offPalette.set(hex, `${x},${y}`)
  }
  const out = []
  if (partial.count) {
    out.push(
      `${partial.count} pixel(s) with partial alpha, first at ${partial.first.join(', ')}`
    )
  }
  for (const [hex, at] of offPalette)
    out.push(`off-palette colour ${hex}, first at ${at}`)
  if (colours.size > 1) {
    const [, [hex, at]] = colours
    out.push(`1-bit art in ${colours.size} colours: ${hex} first at ${at}`)
  }
  return { problems: out, width: info.width, height: info.height }
}

/**
 * Check a folder of exported art. Returns `{ files, failures, budgets }`;
 * `failures` is empty when everything passes.
 */
export async function checkArt({
  dir,
  sources = ART_SOURCES,
  pngBudgets = PNG_BUDGETS,
  generatedBudgets = GENERATED_BUDGETS,
  root = ROOT,
  allowEmpty = false,
}) {
  const failures = []
  const fail = (file, why) => failures.push(`${relative(root, file)}: ${why}`)
  const files = walk(dir)
  const pngs = files.filter((f) => f.endsWith('.png'))
  const bytesByGroup = {}

  for (const json of files.filter((f) => f.endsWith('.json'))) {
    if (!existsSync(json.replace(/\.json$/, '.png')))
      fail(json, 'no PNG next to this JSON')
  }

  for (const png of pngs) {
    const group = relative(dir, dirname(png)).split(sep)[0]
    const entry = entryFor(png, sources)
    if (!entry) {
      fail(
        png,
        'not exported from any source in scripts/pixel/art-manifest.mjs'
      )
      continue
    }
    if (entry.group !== group) {
      fail(png, `belongs in ${entry.group}/, found in ${group}/`)
    }
    const size = statSync(png).size
    bytesByGroup[group] = (bytesByGroup[group] ?? 0) + size

    const pixels = await pixelProblems(png, entry)
    for (const why of pixels.problems) fail(png, why)

    const json = png.replace(/\.png$/, '.json')
    if (!existsSync(json)) {
      fail(png, 'no JSON next to this PNG')
      continue
    }
    try {
      const data = readSheetJson(json)
      for (const why of sheetProblems(data, pixels.width, pixels.height))
        fail(json, why)
    } catch (error) {
      fail(json, error.message)
    }
  }

  if (pngs.length === 0 && !allowEmpty) {
    failures.push(
      `${relative(root, dir) || dir}: no PNG found, nothing was checked`
    )
  }

  const budgets = []
  for (const budget of pngBudgets) {
    const bytes = budget.groups.reduce(
      (sum, g) => sum + (bytesByGroup[g] ?? 0),
      0
    )
    budgets.push({ label: budget.label, bytes, limit: budget.bytes })
    if (bytes > budget.bytes) {
      failures.push(
        `budget "${budget.label}": ${bytes} bytes, limit ${budget.bytes}`
      )
    }
  }
  for (const budget of generatedBudgets) {
    const file = join(root, budget.file)
    if (!existsSync(file)) continue
    const bytes = statSync(file).size
    budgets.push({ label: budget.file, bytes, limit: budget.bytes })
    if (bytes > budget.bytes) {
      failures.push(
        `budget ${budget.file}: ${bytes} bytes, limit ${budget.bytes}`
      )
    }
  }

  return { files: pngs.length, failures, budgets }
}

async function main(argv) {
  const dir = flag(argv, '--dir', join(ROOT, 'src', 'assets', 'pixel'))
  const result = await checkArt({
    dir,
    allowEmpty: argv.includes('--allow-empty'),
  })
  if (result.failures.length) {
    console.error('art check failed:')
    for (const f of result.failures) console.error(`  ${f}`)
    process.exit(1)
  }
  const used = result.budgets
    .filter((b) => b.bytes > 0)
    .map((b) => `${b.label} ${b.bytes}/${b.limit}`)
    .join('; ')
  console.log(
    `art ok: ${result.files} PNG(s) on palette, budgets: ${used || 'nothing yet'}`
  )
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
