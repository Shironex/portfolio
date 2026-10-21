/**
 * Lossless PNG shrinking for exported pixel art.
 *
 * Aseprite writes 32-bit RGBA. Pixel art has a few dozen colours, so an
 * indexed (palette) PNG is a fraction of the size. sharp (libimagequant) does
 * the palette encode; the result is decoded again and kept only when every
 * pixel is identical to the original (transparent pixels compare equal
 * whatever colour they carry), so a lossy quantise can never slip through.
 * If `oxipng` is on the PATH it runs last (`-o max --strip all`, SPEC 4.6);
 * it is lossless by construction and optional.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

async function rgba(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/** True when both images show the same pixels (alpha 0 ignores colour). */
export function samePixels(a, b) {
  if (a.width !== b.width || a.height !== b.height) return false
  for (let i = 0; i < a.data.length; i += 4) {
    const alpha = a.data[i + 3]
    if (alpha !== b.data[i + 3]) return false
    if (alpha === 0) continue
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2]
    ) {
      return false
    }
  }
  return true
}

function hasOxipng() {
  const probe = spawnSync('oxipng', ['--version'], { encoding: 'utf8' })
  return probe.status === 0
}

/**
 * Rewrite `file` with the smallest lossless encoding found. Returns
 * `{ before, after, encoding }` in bytes.
 */
export async function optimizePng(file) {
  const original = readFileSync(file)
  const reference = await rgba(original)
  let best = { buffer: original, encoding: 'aseprite' }

  const candidates = [
    [
      'indexed',
      () =>
        sharp(original)
          .png({
            palette: true,
            colours: 256,
            quality: 100,
            dither: 0,
            effort: 10,
            compressionLevel: 9,
          })
          .toBuffer(),
    ],
    [
      'rgba',
      () =>
        sharp(original)
          .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
          .toBuffer(),
    ],
  ]
  for (const [encoding, encode] of candidates) {
    const buffer = await encode()
    if (buffer.length >= best.buffer.length) continue
    if (samePixels(reference, await rgba(buffer))) best = { buffer, encoding }
  }
  if (best.buffer !== original) writeFileSync(file, best.buffer)

  if (hasOxipng()) {
    spawnSync('oxipng', ['-o', 'max', '--strip', 'all', '--quiet', file])
  }
  const after = readFileSync(file).length
  return { before: original.length, after, encoding: best.encoding }
}
