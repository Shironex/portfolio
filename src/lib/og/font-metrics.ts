/**
 * Advance widths of a TrueType or OpenType font, read from its `cmap`
 * (format 4, the Basic Multilingual Plane) and `hmtx` tables, so a card can
 * wrap its lines before the renderer sees them. The pixel faces have no
 * kerning pairs and no ligatures, so a line is as wide as its advances.
 */

export interface FontMetrics {
  unitsPerEm: number
  /** Advance of one character in font units (`.notdef`'s when missing). */
  advance: (char: string) => number
  /** Whether the font draws the character. */
  has: (char: string) => boolean
}

function tables(view: DataView): Map<string, number> {
  const out = new Map<string, number>()
  const count = view.getUint16(4)
  for (let i = 0; i < count; i++) {
    const at = 12 + i * 16
    const tag = String.fromCharCode(
      view.getUint8(at),
      view.getUint8(at + 1),
      view.getUint8(at + 2),
      view.getUint8(at + 3)
    )
    out.set(tag, view.getUint32(at + 8))
  }
  return out
}

/** The glyph lookup of the font's format 4 Unicode subtable. */
function cmapLookup(view: DataView, cmap: number): (code: number) => number {
  const count = view.getUint16(cmap + 2)
  let sub = -1
  for (let i = 0; i < count; i++) {
    const at = cmap + 4 + i * 8
    const platform = view.getUint16(at)
    const encoding = view.getUint16(at + 2)
    const offset = cmap + view.getUint32(at + 4)
    const unicode =
      (platform === 3 && encoding === 1) || (platform === 0 && encoding === 3)
    if (unicode && view.getUint16(offset) === 4) sub = offset
  }
  if (sub < 0) throw new Error('font has no format 4 Unicode cmap')
  const segments = view.getUint16(sub + 6) / 2
  const ends = sub + 14
  const starts = ends + segments * 2 + 2
  const deltas = starts + segments * 2
  const ranges = deltas + segments * 2
  return (code) => {
    for (let i = 0; i < segments; i++) {
      if (code > view.getUint16(ends + i * 2)) continue
      const start = view.getUint16(starts + i * 2)
      if (code < start) return 0
      const delta = view.getInt16(deltas + i * 2)
      const rangeAt = ranges + i * 2
      const range = view.getUint16(rangeAt)
      if (range === 0) return (code + delta) & 0xffff
      const glyph = view.getUint16(rangeAt + range + (code - start) * 2)
      return glyph === 0 ? 0 : (glyph + delta) & 0xffff
    }
    return 0
  }
}

/** Read the metrics of a font file. */
export function readFontMetrics(data: Uint8Array): FontMetrics {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const at = tables(view)
  const head = at.get('head')
  const hhea = at.get('hhea')
  const hmtx = at.get('hmtx')
  const cmap = at.get('cmap')
  if (head === undefined || hhea === undefined)
    throw new Error('font has no head or hhea table')
  if (hmtx === undefined || cmap === undefined)
    throw new Error('font has no hmtx or cmap table')
  const unitsPerEm = view.getUint16(head + 18)
  const metrics = view.getUint16(hhea + 34)
  const glyphOf = cmapLookup(view, cmap)
  const advanceOf = (glyph: number) =>
    view.getUint16(hmtx + Math.min(glyph, metrics - 1) * 4)
  const code = (char: string) => char.codePointAt(0) ?? 0
  return {
    unitsPerEm,
    advance: (char) => advanceOf(glyphOf(code(char))),
    has: (char) => glyphOf(code(char)) !== 0,
  }
}

/** Width of `text` at `size` px. */
export function textWidth(
  metrics: FontMetrics,
  text: string,
  size: number
): number {
  let units = 0
  for (const char of text) units += metrics.advance(char)
  return (units * size) / metrics.unitsPerEm
}
