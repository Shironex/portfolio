/**
 * Pixel grids to compact, crisp SVG.
 *
 * A grid is rows of cells; a cell is a colour string, `true` (1-bit art) or
 * `null` (transparent). Cells of one value are merged into rectangles:
 * horizontal runs per row first, then runs of the same x and width on
 * consecutive rows are stacked into one rectangle. Each rectangle becomes
 * `M x y h w v h h -w z`, so the result has no anti-aliased edges to begin
 * with, and `shape-rendering="crispEdges"` keeps the renderer from adding any.
 */

/** `{ value -> [{x, y, w, h}] }`, rectangles in reading order. */
export function mergeRuns(grid) {
  const open = new Map() // key `${value}|${x}|${w}` -> rect still growing down
  const done = new Map()
  const push = (value, rect) => {
    if (!done.has(value)) done.set(value, [])
    done.get(value).push(rect)
  }
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y]
    const runs = []
    for (let x = 0; x < row.length;) {
      const value = row[x]
      let end = x + 1
      while (end < row.length && row[end] === value) end++
      if (value !== null && value !== undefined && value !== false) {
        runs.push({ value, x, w: end - x })
      }
      x = end
    }
    const seen = new Set()
    for (const run of runs) {
      const key = `${run.value}|${run.x}|${run.w}`
      seen.add(key)
      const rect = open.get(key)
      if (rect && rect.y + rect.h === y) rect.h++
      else {
        if (rect) push(run.value, rect)
        open.set(key, { x: run.x, y, w: run.w, h: 1, value: run.value })
      }
    }
    for (const [key, rect] of open) {
      if (!seen.has(key)) {
        push(rect.value, rect)
        open.delete(key)
      }
    }
  }
  for (const rect of open.values()) push(rect.value, rect)
  const out = {}
  for (const [value, rects] of done) {
    out[value] = rects
      .map(({ x, y, w, h }) => ({ x, y, w, h }))
      .sort((a, b) => a.y - b.y || a.x - b.x)
  }
  return out
}

/** Path data for a list of rectangles. */
export function rectsToPath(rects) {
  return rects.map(({ x, y, w, h }) => `M${x} ${y}h${w}v${h}h-${w}z`).join('')
}

/** One path per colour, largest area first, so a reader sees the base first. */
export function gridToPaths(grid) {
  const area = (rects) => rects.reduce((sum, r) => sum + r.w * r.h, 0)
  return Object.entries(mergeRuns(grid))
    .map(([fill, rects]) => ({
      fill,
      d: rectsToPath(rects),
      area: area(rects),
    }))
    .sort((a, b) => b.area - a.area || a.fill.localeCompare(b.fill))
}

/**
 * A standalone SVG of the grid at 1 user unit per pixel, with an intrinsic
 * size of one CSS px per pixel (what `border-image-slice` numbers count).
 */
export function gridToSvg(grid) {
  const h = grid.length
  const w = grid[0]?.length ?? 0
  const paths = gridToPaths(grid)
    .map(({ fill, d }) => `<path fill="${fill}" d="${d}"/>`)
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${paths}</svg>`
  )
}

/**
 * A CSS-safe `data:` URI for an SVG: double quotes become single quotes and
 * only the characters that break a URL or a CSS string are escaped, which is
 * smaller than base64 and still gzips well.
 */
export function svgDataUri(svg) {
  const body = svg
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
  return `data:image/svg+xml,${body}`
}

/** Replace colours through `map` (`#from -> #to`); others are kept. */
export function recolourGrid(grid, map) {
  return grid.map((row) =>
    row.map((cell) =>
      typeof cell === 'string' && map[cell] ? map[cell] : cell
    )
  )
}
