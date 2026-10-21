/**
 * The sky bands of the wallpaper (SPEC 2.5): hard bands from the horizon up,
 * listed top to bottom with one `fill` band taking what is left, a `mix` band
 * drawn as a 1 px checker, and a two-row Bayer dither at each join.
 */

export interface SkyBand {
  readonly color: string
  readonly rows: number | 'fill'
  readonly mix?: string
}

/** 4x4 Bayer thresholds, 0 to 15. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const

function rgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface Row {
  color: string
  mix?: string
  band: number
}

/**
 * Colour per row from the top, for a sky `horizon` rows tall: the fixed bands
 * stack up from the horizon and the fill band takes the rows above them.
 */
export function bandRows(bands: readonly SkyBand[], horizon: number): Row[] {
  const fixed = bands.reduce(
    (sum, b) => sum + (b.rows === 'fill' ? 0 : b.rows),
    0
  )
  const rows: Row[] = []
  bands.forEach((band, index) => {
    const count =
      band.rows === 'fill' ? Math.max(0, horizon - fixed) : band.rows
    for (let i = 0; i < count; i++)
      rows.push({ color: band.color, mix: band.mix, band: index })
  })
  // Short screens lose the top of the sky, never the horizon.
  return rows.slice(Math.max(0, rows.length - horizon))
}

/**
 * The colour of each sky pixel, for a sky `rows` tall whose horizon is
 * `ground` rows above the bottom. Below the horizon the last band continues
 * (the road covers it). `dither` lists, for the row above and the row below
 * each join, the share of the lower band's colour.
 *
 * The checker and the Bayer pattern count rows from the bottom edge, where
 * the bands are anchored, so a row's pattern does not depend on the height
 * of the screen and the static frame can draw it in CSS (`staticSkyRows`).
 * At an even height (the 450 rows of the mocks) that is the same pattern as
 * counting from the top.
 */
export function skyPainter(
  bands: readonly SkyBand[],
  rows: number,
  ground: number,
  dither: readonly number[]
): (x: number, y: number) => string {
  const horizon = Math.max(0, rows - ground)
  const sky = bandRows(bands, horizon)
  const last = sky.at(-1) ?? {
    color: bands.at(-1)?.color ?? '#000000',
    band: bands.length - 1,
  }
  while (sky.length < rows) sky.push({ color: last.color, band: last.band })

  // The two rows at each join blend the bands' colours, a mix band's
  // checker included (its rows next to a join are dithered, not mixed).
  const blend: { other: string; lower: boolean; share: number }[] = []
  for (let y = 1; y < sky.length; y++) {
    const above = sky[y - 1]
    const below = sky[y]
    if (above.band === below.band) continue
    const [up, down] = [dither[0] ?? 0, dither[1] ?? 0]
    blend[y - 1] = { other: below.color, lower: true, share: up }
    blend[y] = { other: above.color, lower: false, share: down }
  }

  return (x, y) => {
    const row = sky[y]
    const mix = blend[y]
    const up = rows - y
    if (mix) {
      // `share` of the lower colour: on the upper row the lower colour is
      // the other one, on the lower row it is the row's own.
      const lowerHere = BAYER[up % 4][x % 4] < mix.share * 16
      return (mix.lower ? lowerHere : !lowerHere) ? mix.other : row.color
    }
    if (row.mix && (x + up) % 2 === 1) return row.mix
    return row.color
  }
}

/** The sky as RGBA, `cols` by `rows` (see `skyPainter`). */
export function paintSky(
  bands: readonly SkyBand[],
  cols: number,
  rows: number,
  ground: number,
  dither: readonly number[]
): Uint8ClampedArray<ArrayBuffer> {
  const at = skyPainter(bands, rows, ground, dither)
  const out = new Uint8ClampedArray(cols * rows * 4)
  const cache = new Map<string, [number, number, number]>()
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const hex = at(x, y)
      let value = cache.get(hex)
      if (!value) cache.set(hex, (value = rgb(hex)))
      const i = (y * cols + x) * 4
      out[i] = value[0]
      out[i + 1] = value[1]
      out[i + 2] = value[2]
      out[i + 3] = 255
    }
  }
  return out
}

/** A patterned row of the sky: its height above the bottom and its 2 colours. */
export interface StaticSkyRow {
  /** Rows between this one and the bottom edge. */
  above: number
  /** The colours of even and odd columns. */
  even: string
  odd: string
}

/**
 * The rows of a sky that are not one colour (the dither at the joins and the
 * mix bands), for the static frame, which paints the plain bands as one
 * gradient and lays a 2 px pattern over each of these rows. Throws when a
 * row repeats wider than 2 px (a dither share other than 0, 50 or 100%).
 */
export function staticSkyRows(
  bands: readonly SkyBand[],
  ground: number,
  dither: readonly number[]
): StaticSkyRow[] {
  const fixed = bands.reduce(
    (sum, b) => sum + (b.rows === 'fill' ? 0 : b.rows),
    0
  )
  const rows = fixed + ground + 4
  const at = skyPainter(bands, rows, ground, dither)
  const out: StaticSkyRow[] = []
  for (let y = 0; y < rows; y++) {
    const [a, b, c, d] = [0, 1, 2, 3].map((x) => at(x, y))
    if (a !== c || b !== d) throw new Error('a sky row repeats wider than 2 px')
    if (a !== b) out.push({ above: rows - 1 - y, even: a, odd: b })
  }
  return out
}
