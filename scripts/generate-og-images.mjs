#!/usr/bin/env node
/**
 * The pictures the Open Graph cards are drawn from (SPEC 1.1, og/OG.md).
 *
 *   pnpm generate:og              write src/app/_og/
 *   pnpm generate:og --check      fail if a file there is stale
 *   pnpm generate:og --og-dir <dir>   where the card bases are
 *                                     (default ../aseprite-demo/og/export,
 *                                     or PIXEL_OG_DIR)
 *
 * Output, PNG, every art px a 3x3 square:
 *   src/app/_og/home-base.png         the home card's scene, 1200x630
 *   src/app/_og/project-base.png      the project card's scene, 1200x630
 *   src/app/_og/icons/<slug>.png      each drawn project icon's still, 96x96
 *   src/app/_og/icons/tile.png        the bare tile of a project with no icon
 *   src/app/_og/icons/shironedev.png  the README logo tile, for the home card
 *
 * The bases are the art's own 3x exports (the Aseprite CLI commands are in
 * OG.md). The icons are cut from the sheets `pnpm art:export` and the pixel
 * generators keep in the repo, never from the GIFs, whose palette decodes
 * wrong. Rerun after a new project icon or a new base.
 *
 * Uses sharp only, so it runs the same on macOS, Windows and Linux.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

import { readSheetJson, stillPng } from './pixel/sheet.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'src/app/_og')
const pixel = join(root, 'src/assets/pixel')

/** One art px of a card is 3 image px (OG.md). */
const SCALE = 3
const CARD = { width: 400 * SCALE, height: 210 * SCALE }

const PROJECT_ICONS = join(pixel, 'project-icons/project-icons-32.json')
const README_ICONS = join(pixel, 'project-icon-art/readme-icons.json')

function ogDir(argv) {
  const i = argv.indexOf('--og-dir')
  if (i > -1 && argv[i + 1]) return resolve(argv[i + 1])
  // eslint-disable-next-line n/no-process-env -- a local tool's own config, not app env
  const fromEnv = process.env.PIXEL_OG_DIR
  return fromEnv
    ? resolve(fromEnv)
    : resolve(root, '..', 'aseprite-demo', 'og', 'export')
}

/** A card base, checked to be the card's size. */
async function base(dir, name) {
  const file = join(dir, `og-dev-${name}-base.png`)
  if (!existsSync(file)) throw new Error(`${file} does not exist`)
  const { width, height } = await sharp(file).metadata()
  if (width !== CARD.width || height !== CARD.height) {
    throw new Error(`${file} is ${width}x${height}, not 1200x630`)
  }
  return readFileSync(file)
}

/** Every file to write, as [path under src/app/_og, bytes]. */
async function outputs(argv) {
  const dir = ogDir(argv)
  const files = [
    ['home-base.png', await base(dir, 'home')],
    ['project-base.png', await base(dir, 'project')],
    [
      'icons/shironedev.png',
      await stillPng(README_ICONS, 'shironedev', { scale: SCALE }),
    ],
  ]
  for (const tag of readSheetJson(PROJECT_ICONS).meta.frameTags) {
    files.push([
      `icons/${tag.name}.png`,
      await stillPng(PROJECT_ICONS, tag.name, { scale: SCALE }),
    ])
  }
  return files
}

async function main(argv) {
  const files = await outputs(argv)
  if (argv.includes('--check')) {
    const stale = files.filter(([name, bytes]) => {
      const file = join(outDir, name)
      return !existsSync(file) || !readFileSync(file).equals(bytes)
    })
    for (const [name] of stale) {
      console.error(`src/app/_og/${name} is stale. Run: pnpm generate:og`)
    }
    if (stale.length) process.exit(1)
    console.log(`og pictures up to date: ${files.length} file(s)`)
    return
  }
  for (const [name, bytes] of files) {
    const file = join(outDir, name)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, bytes)
    console.log(`  ${relative(root, file)} (${bytes.length} bytes)`)
  }
}

main(process.argv.slice(2)).catch((error) => {
  console.error('Failed to write the Open Graph pictures:', error.message)
  process.exit(1)
})
