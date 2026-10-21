/**
 * The project icon sheet the OS ships (SPEC 2.4, Icons; section 9), cut from
 * the two icon exports and the tile under them.
 *
 *   pnpm art:project-icons            write src/assets/pixel/project-icons/project-icons-32
 *   pnpm art:project-icons --check    fail if that sheet is stale
 *
 * Inputs (exported by `pnpm art:export --only project-icon-art`):
 *   os-project-icons  the six icons drawn for the OS, a 32x32 slice
 *                     `project-<slug>` and one 8-frame tag `<slug>` each
 *   readme-icons      the README icons, 32x32 frames, one tag per icon
 *   os-project-tile   the tile layer of os-project-icons alone, frame 0
 *
 * The shipped sheet has one row per icon, its tag's frames left to right,
 * the tag renamed to the project's slug and kept with the frame durations as
 * drawn (frame 0 is the still). The README's `shironedev` icon is the OS
 * logo, not a project, so it stays out. A last one-frame row `tile` is the
 * bare tile, for the letter tiles of the projects with no icon (decision 3).
 */
import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

import { flag, isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { cell, writeCutSheet } from './gen-app-icons.mjs'
import { canvasSize, loadSheet, sliceKey } from './sheet.mjs'

const ART_DIR = join(ROOT, 'src', 'assets', 'pixel', 'project-icon-art')
const DEFAULT_OUT_DIR = join(ROOT, 'src', 'assets', 'pixel', 'project-icons')

export const PROJECT_ICON_STEM = 'project-icons-32'

/** The README icon tags that are projects, and the slug of each. */
export const README_ICON_PROJECTS = {
  automaker: 'automaker',
  erp: 'business-erp',
  noctcore: 'eslint-plugins',
  omniscribe: 'omniscribe',
  shiranami: 'shiranami',
  shiroani: 'shiroani',
  nightmaze: 'night-maze',
}

/** The name of the bare tile's one-frame tag. */
export const TILE_TAG = 'tile'

const SIDE = 32

function sliceNamed(sheet, name) {
  const slice = sheet.data.meta.slices.find((s) => s.name === name)
  if (!slice) throw new Error(`${sheet.json}: no slice "${name}"`)
  return slice
}

function checkSide(bounds, what) {
  if (bounds.w !== SIDE || bounds.h !== SIDE) {
    throw new Error(`${what} is not ${SIDE}x${SIDE}`)
  }
}

/**
 * The layout of the sheet for the loaded exports: cells (each naming the
 * export it reads), tags and size. Pure, so tests can read it.
 */
export function projectIconLayout({ os, readme, tile }) {
  const layout = { cells: [], tags: [], w: 0, h: 0 }
  const row = (sheet, slug, frames, boundsAt) => {
    const y = layout.tags.length * SIDE
    const from = layout.cells.length
    for (const [col, f] of frames.entries()) {
      const bounds = boundsAt(f)
      const c = cell(
        f,
        bounds,
        col * SIDE,
        y,
        sheet.data.frames[f].duration,
        `${slug}:${col}`
      )
      c.sheet = sheet
      layout.cells.push(c)
      layout.w = Math.max(layout.w, (col + 1) * SIDE)
    }
    layout.tags.push({
      name: slug,
      from,
      to: layout.cells.length - 1,
      direction: 'forward',
    })
    layout.h = layout.tags.length * SIDE
  }
  const span = (tag) =>
    Array.from({ length: tag.to - tag.from + 1 }, (_, i) => tag.from + i)

  const osTags = os.data.meta.frameTags
  if (osTags.length === 0) throw new Error(`${os.json}: no tags`)
  for (const tag of osTags) {
    const slice = sliceNamed(os, `project-${tag.name}`)
    row(os, tag.name, span(tag), (f) => {
      const { bounds } = sliceKey(slice, f)
      checkSide(bounds, `slice "${slice.name}"`)
      return bounds
    })
  }

  checkSide(canvasSize(readme), readme.json)
  const canvas = { x: 0, y: 0, w: SIDE, h: SIDE }
  for (const [name, slug] of Object.entries(README_ICON_PROJECTS)) {
    const tag = readme.data.meta.frameTags.find((t) => t.name === name)
    if (!tag) throw new Error(`${readme.json}: no tag "${name}"`)
    row(readme, slug, span(tag), () => canvas)
  }

  const under = sliceNamed(tile, `project-${osTags[0].name}`)
  row(tile, TILE_TAG, [0], () => {
    const { bounds } = sliceKey(under, 0)
    checkSide(bounds, `slice "${under.name}"`)
    return bounds
  })
  return layout
}

/**
 * Write the sheet into `outDir`, or with `check` compare it with what is
 * there. Returns whether it was stale (or written).
 */
export async function writeProjectIcons(inDir, outDir, { check = false } = {}) {
  const sheets = {
    os: await loadSheet(join(inDir, 'os-project-icons.json')),
    readme: await loadSheet(join(inDir, 'readme-icons.json')),
    tile: await loadSheet(join(inDir, 'os-project-tile.json')),
  }
  return writeCutSheet(
    {
      stem: PROJECT_ICON_STEM,
      layout: projectIconLayout(sheets),
      sheet: sheets.os,
      app: 'scripts/pixel/gen-project-icons.mjs',
    },
    outDir,
    { check }
  )
}

async function main(argv) {
  const inDir = flag(argv, '--in-dir', ART_DIR)
  const outDir = flag(argv, '--out-dir', DEFAULT_OUT_DIR)
  for (const name of ['os-project-icons', 'readme-icons', 'os-project-tile']) {
    if (!existsSync(join(inDir, `${name}.json`))) {
      console.error(
        `${relative(ROOT, join(inDir, name))}.json does not exist yet. ` +
          'Run: pnpm art:export --only project-icon-art'
      )
      process.exit(1)
    }
  }
  const check = argv.includes('--check')
  const stale = await writeProjectIcons(inDir, outDir, { check })
  const where = relative(ROOT, outDir).split('\\').join('/')
  if (check) {
    if (stale) {
      console.error(
        `${where}: ${PROJECT_ICON_STEM} stale. Run: pnpm art:project-icons`
      )
      process.exit(1)
    }
    console.log('project icons up to date')
    return
  }
  console.log(`wrote ${where}: ${PROJECT_ICON_STEM}`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
