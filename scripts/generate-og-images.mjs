#!/usr/bin/env node
/**
 * Generate the small thumbnails the per-project Open Graph cards embed.
 *
 * Source : the `image` of every project in src/data/projects/*.ts
 * Output : public/projects/og/<slug>.jpg   800x450, JPEG
 *
 * The card renderer cannot decode webp and has no use for a full-size
 * screenshot in a 400x225 slot, so each thumbnail gets a JPEG copy at twice
 * the slot size. Projects without an image are skipped and keep the text-only
 * card. Rerun after adding or changing a project thumbnail:
 *
 *   pnpm generate:og
 *
 * Uses sharp only, so it runs the same on macOS, Windows and Linux.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'src/data/projects')
const publicDir = join(root, 'public')
const outDir = join(publicDir, 'projects/og')

/** Twice the 400x225 slot on the card, for a crisp downscale. */
const SIZE = { width: 800, height: 450 }
/** Card surface colour, behind any transparent pixels. */
const BACKGROUND = '#fdfaf0'

/** Top-level `slug` and `image` fields of a project data file. */
function readProject(file) {
  const source = readFileSync(join(dataDir, file), 'utf8')
  const slug = /^ {2}slug: '([^']+)'/m.exec(source)?.[1]
  const image = /^ {2}image: '([^']+)'/m.exec(source)?.[1]
  return { file, slug, image }
}

async function generate() {
  mkdirSync(outDir, { recursive: true })
  const projects = readdirSync(dataDir)
    .filter((file) => file.endsWith('.ts'))
    .map(readProject)

  let failed = false
  for (const { file, slug, image } of projects) {
    if (!slug) {
      console.error(`  ${file}: no slug found`)
      failed = true
      continue
    }
    if (!image) {
      console.log(`  ${slug}: no image, text-only card`)
      continue
    }
    const source = join(publicDir, image)
    if (!existsSync(source)) {
      console.error(`  ${slug}: ${image} is missing`)
      failed = true
      continue
    }
    const target = join(outDir, `${slug}.jpg`)
    await sharp(source)
      .resize({ ...SIZE, fit: 'cover', position: 'left top' })
      .flatten({ background: BACKGROUND })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target)
    const kb = Math.round(statSync(target).size / 1024)
    console.log(`  ${slug}: projects/og/${slug}.jpg (${kb} KB)`)
  }
  if (failed) process.exit(1)
}

generate().catch((err) => {
  console.error('Failed to generate Open Graph thumbnails:', err)
  process.exit(1)
})
