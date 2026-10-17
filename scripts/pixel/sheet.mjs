/**
 * Reading what `aseprite -b --sheet x.png --data x.json --format json-array
 * --list-tags --list-slices --list-layers` writes.
 *
 * The JSON shape, as the CLI writes it (see test/fixtures/ for real files):
 *
 *   frames[i]  { filename, frame: {x,y,w,h}, trimmed, spriteSourceSize: {x,y,w,h},
 *                sourceSize: {w,h}, duration }      (ms; i is the frame index)
 *   meta       { image, size: {w,h}, frameTags: [{ name, from, to, direction }],
 *                layers: [{ name, ... }],
 *                slices: [{ name, data?, keys: [{ frame, bounds, center?, pivot? }] }] }
 *
 * A packed sheet reuses one rectangle for identical frames, so a frame's
 * pixels are always found through its own `frame` rectangle, never by index
 * arithmetic. Slice and canvas coordinates are canvas coordinates; a trimmed
 * frame keeps its offset in `spriteSourceSize`.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

import { toHex } from './palette.mjs'

/** Parse and shape-check a sheet JSON. Throws with the file name on a bad shape. */
export function readSheetJson(file) {
  const data = JSON.parse(readFileSync(file, 'utf8'))
  const fail = (why) => {
    throw new Error(`${file}: not an Aseprite json-array sheet (${why})`)
  }
  if (!Array.isArray(data.frames)) fail('`frames` is not an array')
  if (data.frames.length === 0) fail('no frames')
  if (!data.meta?.image) fail('no `meta.image`')
  if (!data.meta.size) fail('no `meta.size`')
  for (const [i, f] of data.frames.entries()) {
    if (!f.frame || !f.sourceSize || !f.spriteSourceSize) fail(`frame ${i}`)
    if (typeof f.duration !== 'number') fail(`frame ${i} has no duration`)
  }
  data.meta.frameTags ??= []
  data.meta.slices ??= []
  data.meta.layers ??= []
  return data
}

/**
 * A sheet with its pixels decoded to RGBA. `pngFile` defaults to
 * `meta.image` next to the JSON.
 */
export async function loadSheet(jsonFile, pngFile) {
  const data = readSheetJson(jsonFile)
  const png = pngFile ?? join(dirname(jsonFile), data.meta.image)
  const { data: pixels, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (info.width !== data.meta.size.w || info.height !== data.meta.size.h) {
    throw new Error(
      `${png} is ${info.width}x${info.height}, but ${jsonFile} says ` +
        `${data.meta.size.w}x${data.meta.size.h}`
    )
  }
  return {
    json: jsonFile,
    png,
    data,
    width: info.width,
    height: info.height,
    pixels,
  }
}

/** Canvas size of the sprite (every frame has the same `sourceSize`). */
export function canvasSize(sheet) {
  const { w, h } = sheet.data.frames[0].sourceSize
  return { w, h }
}

/**
 * RGBA of one canvas pixel in one frame. Outside the frame's trimmed area
 * (or outside the canvas) the pixel is transparent.
 */
export function pixelAt(sheet, frameIndex, cx, cy) {
  const f = sheet.data.frames[frameIndex]
  if (!f) throw new Error(`${sheet.json}: no frame ${frameIndex}`)
  const lx = cx - f.spriteSourceSize.x
  const ly = cy - f.spriteSourceSize.y
  if (lx < 0 || ly < 0 || lx >= f.frame.w || ly >= f.frame.h) {
    return [0, 0, 0, 0]
  }
  const i = ((f.frame.y + ly) * sheet.width + f.frame.x + lx) * 4
  const p = sheet.pixels
  return [p[i], p[i + 1], p[i + 2], p[i + 3]]
}

/**
 * The pixels of `rect` (canvas coordinates) in one frame, as rows of
 * `#rrggbb` or `null` for transparent. Pixel art has no partial alpha: a
 * semi-transparent pixel throws, with its location.
 */
export function readRegion(sheet, frameIndex, rect) {
  const rows = []
  for (let y = 0; y < rect.h; y++) {
    const row = []
    for (let x = 0; x < rect.w; x++) {
      const [r, g, b, a] = pixelAt(sheet, frameIndex, rect.x + x, rect.y + y)
      if (a === 0) row.push(null)
      else if (a === 255) row.push(toHex(r, g, b))
      else {
        throw new Error(
          `${sheet.png}: partial alpha ${a} at frame ${frameIndex}, ` +
            `canvas ${rect.x + x},${rect.y + y}`
        )
      }
    }
    rows.push(row)
  }
  return rows
}

/** The slice key in effect at `frameIndex`: the last key at or before it. */
export function sliceKey(slice, frameIndex = 0) {
  const keys = [...slice.keys].sort((a, b) => a.frame - b.frame)
  let key = keys[0]
  for (const k of keys) if (k.frame <= frameIndex) key = k
  return key
}

/** Frame indices a tag plays, in order, honouring its direction. */
export function tagFrames(tag) {
  const forward = []
  for (let i = tag.from; i <= tag.to; i++) forward.push(i)
  const back = [...forward].reverse()
  switch (tag.direction) {
    case 'reverse':
      return back
    case 'pingpong':
      return [...forward, ...back.slice(1, -1)]
    case 'pingpong_reverse':
      return [...back, ...forward.slice(1, -1)]
    default:
      return forward
  }
}

/** Parse slice user data written as `key=value` pairs (space or comma separated). */
export function sliceOptions(slice) {
  const out = {}
  for (const part of (slice.data ?? '').split(/[\s,;]+/)) {
    if (!part) continue
    const [k, v = 'true'] = part.split('=')
    out[k] = v
  }
  return out
}
