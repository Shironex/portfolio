#!/usr/bin/env node
/**
 * The favicons and manifest icons, from the README `icon-shironedev` tile
 * (SPEC 1.1): every art px a square, scaled by a whole number with nearest
 * neighbour, never resampled.
 *
 *   pnpm generate:icons            write them
 *   pnpm generate:icons --check    fail if one is stale
 *
 * Output:
 *   src/app/favicon.ico          16 and 32, the 16 being the logo cut of the
 *                                tile the menu bar shows, so a 16 px tab
 *                                gets drawn pixels, not a halved 32
 *   src/app/icon.png             32x32    the tile
 *   src/app/apple-icon.png       180x180  the tile on 2 art px of ground, 5x
 *   public/icon-192.png          192x192  the tile at 6x (manifest)
 *   public/icon-512.png          512x512  the tile at 16x (manifest)
 *   public/icon-maskable-512.png 512x512  the tile on 16 art px of ground, 8x,
 *                                         inside a maskable icon's safe circle
 *
 * The tile and the logo come from the sheets `pnpm art:export` and the pixel
 * generators keep in the repo. Uses sharp only, so it runs the same on macOS,
 * Windows and Linux.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'

import { stillPng } from './pixel/sheet.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pixel = join(root, 'src/assets/pixel')
const TILE = [join(pixel, 'project-icon-art/readme-icons.json'), 'shironedev']
const LOGO = [join(pixel, 'icons/app-icons-16.json'), 'logo']

/** The ground navy (`--ground`), behind an icon that must be opaque. */
const GROUND = '#0b1420'

/** Every file, as [path from the repo root, bytes]. */
async function outputs() {
  const tile = (options) => stillPng(...TILE, options)
  const [small, icon] = await Promise.all([
    stillPng(...LOGO),
    tile({ scale: 1 }),
  ])
  return [
    ['src/app/icon.png', icon],
    [
      'src/app/apple-icon.png',
      await tile({ scale: 5, pad: 2, ground: GROUND }),
    ],
    ['public/icon-192.png', await tile({ scale: 6 })],
    ['public/icon-512.png', await tile({ scale: 16 })],
    [
      'public/icon-maskable-512.png',
      await tile({ scale: 8, pad: 16, ground: GROUND }),
    ],
    ['src/app/favicon.ico', await pngToIco([small, icon])],
  ]
}

async function main(argv) {
  const files = await outputs()
  if (argv.includes('--check')) {
    const stale = files.filter(([path, bytes]) => {
      const file = join(root, path)
      return !existsSync(file) || !readFileSync(file).equals(bytes)
    })
    for (const [path] of stale) {
      console.error(`${path} is stale. Run: pnpm generate:icons`)
    }
    if (stale.length) process.exit(1)
    console.log(`icons up to date: ${files.length} file(s)`)
    return
  }
  for (const [path, bytes] of files) {
    writeFileSync(join(root, path), bytes)
    console.log(`  ${path} (${bytes.length} bytes)`)
  }
}

main(process.argv.slice(2)).catch((error) => {
  console.error('Failed to write the icons:', error.message)
  process.exit(1)
})
