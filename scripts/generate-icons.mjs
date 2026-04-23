#!/usr/bin/env node
/**
 * Generate web favicons + manifest icons from the ShiroOS mascot.
 *
 * Source : public/mascot.png (square PNG, transparent background ideal)
 * Output :
 *   - src/app/icon.png         512x512 — Next.js App Router favicon
 *   - src/app/apple-icon.png   180x180 — Apple touch icon
 *   - public/icon-192.png      192x192 — PWA manifest icon
 *   - public/icon-512.png      512x512 — PWA manifest maskable
 *   - public/favicon.ico       multi-res (16/32/48) — legacy fallback
 *
 * Patterned after the generate-icons scripts in the sibling Shiro-suite
 * projects (shiranami / moekoder). Web-specific: no .icns, no .ico past
 * 48px since browsers pick the PNGs first.
 */
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const source = resolve(root, 'public/mascot.png')

if (!existsSync(source)) {
  console.error(`Source mascot not found at: ${source}`)
  console.error(
    'Drop a square PNG (1024x1024 or larger, transparent bg) there and retry.'
  )
  process.exit(1)
}

const pngOptions = {
  compressionLevel: 9,
  palette: true,
  effort: 10,
  quality: 82,
}

const outputs = [
  { size: 512, path: 'src/app/icon.png', label: 'icon.png              (Next favicon)' },
  {
    size: 180,
    path: 'src/app/apple-icon.png',
    label: 'apple-icon.png        (iOS touch icon)',
  },
  { size: 192, path: 'public/icon-192.png', label: 'public/icon-192.png   (PWA)' },
  { size: 512, path: 'public/icon-512.png', label: 'public/icon-512.png   (PWA maskable)' },
]

async function generate() {
  console.log('Generating web icons from public/mascot.png...\n')

  for (const { size, path, label } of outputs) {
    await sharp(source)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png(pngOptions)
      .toFile(resolve(root, path))
    console.log(`  ${label}  (${size}x${size})`)
  }

  const icoSizes = [16, 32, 48]
  const icoPngs = await Promise.all(
    icoSizes.map((size) =>
      sharp(source)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png(pngOptions)
        .toBuffer()
    )
  )
  const icoBuffer = await pngToIco(icoPngs)
  writeFileSync(resolve(root, 'public/favicon.ico'), icoBuffer)
  console.log(
    `  public/favicon.ico     (multi-res: ${icoSizes.join(', ')})`
  )

  console.log('\nDone.')
}

generate().catch((err) => {
  console.error('Failed to generate icons:', err)
  process.exit(1)
})
