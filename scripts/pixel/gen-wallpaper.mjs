/**
 * The wallpaper the desktop paints (SPEC 2.5), cut from the export of
 * `os-wallpaper.aseprite` and its companion `wallpaper-palette.json`.
 *
 *   pnpm art:wallpaper            write src/assets/pixel/scene/ and the data module
 *   pnpm art:wallpaper --check    fail if any of them is stale
 *
 * The export is split by layer, every layer a full 256x352 canvas, so it is a
 * generator input and never ships. From it this writes:
 *
 *   wallpaper        the atlas the canvas draws from: every piece of frame 0
 *                    where the document has it, plus the lights strips, the
 *                    twinkle frames of the stars and the faint moon of
 *                    dusk and dawn
 *   stars            the star tile stacked 8 rows high, each row shifted by
 *                    `rowShift`, for the static frame of the night sky
 *   skyline-<sky>    the strips, lit windows and road of one sky, 512 art px
 *                    wide (the period of a mirrored strip), for the static frame
 *   lamps-<sky>      one street lamp and its cone, one lamp spacing wide
 *   scene-data.generated.ts
 *                    the pieces in the atlas, the skies, the layout, the
 *                    windows and which of them start lit, for the canvas
 *
 * The companion lists every window rectangle, and this checks that the
 * `*_lights` layers draw only inside them, so the canvas lights a window by
 * copying its rectangle from the lights strip over the unlit pane of the
 * strip, and darkens it by drawing the strip again. The static frame and the
 * canvas's first frame light
 * the same windows (`INITIAL_LIT`), so the swap after hydration is invisible.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import sharp from 'sharp'

import { WALLPAPER_SKIES } from './art-manifest.mjs'
import { flag, formatSource, isMain } from './cli.mjs'
import { ROOT } from './export-art.mjs'
import { optimizePng, samePixels } from './png.mjs'
import { loadSheet, readRegion } from './sheet.mjs'

const DEFAULT_IN = join(ROOT, 'src', 'assets', 'pixel', 'wallpaper')
const DEFAULT_OUT_DIR = join(ROOT, 'src', 'assets', 'pixel', 'scene')
const DEFAULT_MODULE = join(
  ROOT,
  'src',
  'components',
  'os',
  'wallpaper',
  'scene-data.generated.ts'
)

/** Pieces copied from frame 0 of their layer, in place. */
const BASE_PIECES = [
  'far',
  'mid',
  'near',
  'stars',
  'glow',
  'cloud_a',
  'cloud_b',
  'cloud_c',
  'road',
  'lamp',
  'lamp_cone',
  'moon_new',
  'moon_waxing_crescent',
  'moon_first_quarter',
  'moon_waxing_gibbous',
  'moon_full',
  'moon_waning_gibbous',
  'moon_last_quarter',
  'moon_waning_crescent',
  'star_bright',
]

export const STRIPS = ['far', 'mid', 'near']

/**
 * The moon of the fixed skies, as the mocks draw it (Live shows the real
 * phase); the atlas also holds it in the faint colours of dusk and dawn.
 */
export const FIXED_MOON = 'moon_waxing_gibbous'

/** Rows of star tiles in the static star column before it repeats. */
export const STAR_ROWS = 8

/** Width of the static skyline: two strip periods, so a mirrored pair. */
const SKYLINE_W = 512

/** A grid of `#rrggbb` or null, `w` by `h`. */
function grid(w, h) {
  return { w, h, px: Array.from({ length: w * h }, () => null) }
}

/** Draw `rows` (from readRegion) into `g` at `x, y`; null pixels are skipped. */
function blit(g, rows, x, y, { clip = false } = {}) {
  rows.forEach((row, dy) => {
    row.forEach((hex, dx) => {
      if (hex === null) return
      const tx = x + dx
      const ty = y + dy
      if (tx < 0 || ty < 0 || tx >= g.w || ty >= g.h) {
        if (clip) return
        throw new Error(
          `pixel ${tx},${ty} lands outside the ${g.w}x${g.h} grid`
        )
      }
      g.px[ty * g.w + tx] = hex
    })
  })
}

/** Rows with every colour mapped once (not chained); a null target clears. */
export function recolour(rows, map = {}) {
  return rows.map((row) =>
    row.map((hex) => (hex !== null && hex in map ? map[hex] : hex))
  )
}

function mirror(rows) {
  return rows.map((row) => [...row].reverse())
}

function raw(g) {
  const out = Buffer.alloc(g.w * g.h * 4)
  g.px.forEach((hex, i) => {
    if (hex === null) return
    out[i * 4] = parseInt(hex.slice(1, 3), 16)
    out[i * 4 + 1] = parseInt(hex.slice(3, 5), 16)
    out[i * 4 + 2] = parseInt(hex.slice(5, 7), 16)
    out[i * 4 + 3] = 255
  })
  return out
}

const rect = ([x, y, w, h]) => ({ x, y, w, h })

function overlaps(a, b) {
  return (
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  )
}

/**
 * Whether window `i` of a strip is lit in repetition `k` of the strip in the
 * first frame. Beacons and shops never switch; of the rest six in seven
 * start lit (the mocks light nearly every window), a different one dark in
 * odd and even repetitions.
 */
export function initiallyLit(window, i, k) {
  if (window.kind === 'beacon' || window.kind === 'shop') return true
  return (i * 5 + (k % 2) * 3) % 7 !== 0
}

/** Where a strip window sits in a mirrored repetition. */
export function mirroredX(window, stripW) {
  return stripW - window.x - window.w
}

/**
 * The lamp tile: one lamp and its cone, one spacing wide, placed so that the
 * tile repeats from `x` (art px from the left edge) and its bottom sits
 * `bottom` art px above the canvas bottom.
 */
export function lampTile(layout, pieces) {
  const { x0, spacing, footBelowHorizon, coneDx, coneDy } = layout.lamps
  const lamp = rect(pieces.lamp.rect)
  const cone = rect(pieces.lamp_cone.rect)
  const left = Math.min(0, coneDx)
  const lampTop = footBelowHorizon - lamp.h
  const coneTop = lampTop + coneDy
  const top = Math.min(lampTop, coneTop)
  const bottom = Math.max(lampTop + lamp.h, coneTop + cone.h)
  if (Math.max(lamp.w - left, coneDx - left + cone.w) > spacing) {
    throw new Error('a lamp and its cone are wider than the lamp spacing')
  }
  return {
    w: spacing,
    h: bottom - top,
    x: x0 + left,
    lamp: { x: -left, y: lampTop - top },
    cone: { x: coneDx - left, y: coneTop - top },
    // canvas rows below the horizon, minus the tile's lowest row
    bottom: layout.road.height - bottom,
  }
}

/** The static skyline's rows: from the top of the far strip to the canvas bottom. */
export function skylineTile(layout, pieces) {
  const tops = Object.fromEntries(
    STRIPS.map((s) => [
      s,
      -layout.strips[s].bottomAboveHorizon - pieces[s].rect[3],
    ])
  )
  const above = -Math.min(...Object.values(tops))
  return {
    w: SKYLINE_W,
    h: above + layout.road.height,
    above,
    y: Object.fromEntries(STRIPS.map((s) => [s, tops[s] + above])),
    road: above,
  }
}

/**
 * Check that each `<strip>_lights` layer only holds pixels inside the listed
 * windows, and that every listed window has a lit pixel, so lighting a window
 * is copying its rectangle from the lights piece.
 */
function checkLights(sheet, frames, palette) {
  const { pieces } = palette.atlas
  for (const strip of STRIPS) {
    const r = rect(pieces[strip].rect)
    const lights = readRegion(sheet, frames[`${strip}_lights:0`], r)
    const inside = (x, y) =>
      palette.windows[strip].some(
        (w) => x >= w.x && x < w.x + w.w && y >= w.y && y < w.y + w.h
      )
    lights.forEach((row, y) =>
      row.forEach((hex, x) => {
        if (hex !== null && !inside(x, y)) {
          throw new Error(
            `${strip}_lights: ${x},${y} is lit outside every window`
          )
        }
      })
    )
    for (const w of palette.windows[strip]) {
      const lit = lights
        .slice(w.y, w.y + w.h)
        .some((row) => row.slice(w.x, w.x + w.w).some((hex) => hex !== null))
      if (!lit) throw new Error(`${strip}_lights: ${w.id} has no lit pixel`)
    }
  }
}

/** Everything this writes, in memory: sheets as grids plus their JSON, and the module. */
export function buildWallpaper(sheet, palette) {
  const frames = Object.fromEntries(
    sheet.data.frames.map((f, i) => [f.filename, i])
  )
  const { pieces } = palette.atlas
  const read = (name, n = 0, map) => {
    const piece = pieces[name]
    const key = `${piece.layer}:${n}`
    if (!(key in frames)) throw new Error(`the export has no frame ${key}`)
    return recolour(readRegion(sheet, frames[key], rect(piece.rect)), map)
  }
  checkLights(sheet, frames, palette)

  // The atlas: frame 0 in place, the rest in a second column to the right of
  // the document: the lights strips, then the twinkle frames and the faint moon.
  const [docW, docH] = palette.atlas.size
  const atlas = grid(docW * 2, docH)
  const placed = {}
  for (const name of BASE_PIECES) {
    const r = rect(pieces[name].rect)
    for (const [other, o] of Object.entries(placed)) {
      if (overlaps(r, rect(o))) throw new Error(`${name} overlaps ${other}`)
    }
    blit(atlas, read(name), r.x, r.y)
    placed[name] = pieces[name].rect
  }
  const lightsAt = {}
  let lightsY = 0
  for (const s of STRIPS) {
    const [, , w, h] = pieces[`${s}_lights`].rect
    lightsAt[`${s}_lights`] = [docW, lightsY, w, h]
    blit(atlas, read(`${s}_lights`), docW, lightsY)
    lightsY += h
  }
  const starTile = rect(pieces.stars.rect)
  const bright = rect(pieces.star_bright.rect)
  const starFrames = [pieces.stars.rect]
  const brightFrames = [pieces.star_bright.rect]
  for (const n of [1, 2]) {
    const at = [docW + (n - 1) * starTile.w, lightsY, starTile.w, starTile.h]
    blit(atlas, read('stars', n), at[0], at[1])
    starFrames.push(at)
    const b = [
      docW + (n - 1) * (bright.w + 1),
      lightsY + starTile.h,
      bright.w,
      bright.h,
    ]
    blit(atlas, read('star_bright', n), b[0], b[1])
    brightFrames.push(b)
  }
  const moon = rect(pieces[FIXED_MOON].rect)
  const faintAt = [
    docW + 2 * (bright.w + 1) + 1,
    lightsY + starTile.h,
    moon.w,
    moon.h,
  ]
  blit(atlas, read(FIXED_MOON, 0, palette.moon.faint), faintAt[0], faintAt[1])

  // The static star column.
  const { rowShift } = palette.layout.stars
  const stars = grid(starTile.w, starTile.h * STAR_ROWS)
  const tile = read('stars')
  for (let row = 0; row < STAR_ROWS; row++) {
    const shift = (row * rowShift) % starTile.w
    for (const dx of [shift - starTile.w, shift]) {
      blit(stars, tile, dx, row * starTile.h, { clip: true })
    }
  }

  // Initial lights, per strip and per repetition parity.
  const initialLit = Object.fromEntries(
    STRIPS.map((s) => [
      s,
      [0, 1].map((k) =>
        palette.windows[s].map((w, i) => (initiallyLit(w, i, k) ? 1 : 0))
      ),
    ])
  )

  // Static skyline and lamps per sky.
  const sky = skylineTile(palette.layout, pieces)
  const lamps = lampTile(palette.layout, pieces)
  const tiles = {}
  for (const name of WALLPAPER_SKIES) {
    const { recolor = {}, visible } = palette.skies[name]
    const g = grid(sky.w, sky.h)
    for (const s of STRIPS) {
      const strip = rect(pieces[s].rect)
      const mirrored = palette.layout.strips[s].tile === 'mirror'
      const body = read(s, 0, recolor[s])
      const lights = read(`${s}_lights`)
      for (let k = 0; k * strip.w < sky.w; k++) {
        const flip = mirrored && k % 2 === 1
        const x = k * strip.w
        blit(g, flip ? mirror(body) : body, x, sky.y[s], { clip: true })
        if (!visible.lights) continue
        palette.windows[s].forEach((w, i) => {
          if (!initialLit[s][k % 2][i]) return
          const pane = lights
            .slice(w.y, w.y + w.h)
            .map((row) => row.slice(w.x, w.x + w.w))
          const wx = x + (flip ? mirroredX(w, strip.w) : w.x)
          blit(g, flip ? mirror(pane) : pane, wx, sky.y[s] + w.y, {
            clip: true,
          })
        })
      }
    }
    const road = read('road', 0, recolor.road)
    const roadW = pieces.road.rect[2]
    for (let x = 0; x < sky.w; x += roadW) blit(g, road, x, sky.road)
    tiles[`skyline-${name}`] = g

    const l = grid(lamps.w, lamps.h)
    if (visible.cone) blit(l, read('lamp_cone'), lamps.cone.x, lamps.cone.y)
    blit(l, read('lamp', 0, recolor.lamp), lamps.lamp.x, lamps.lamp.y)
    tiles[`lamps-${name}`] = l
  }

  const atlasPieces = {
    ...Object.fromEntries(
      BASE_PIECES.filter((n) => n !== 'stars' && n !== 'star_bright').map(
        (n) => [n, pieces[n].rect]
      )
    ),
    ...lightsAt,
    moon_faint: faintAt,
  }
  const sheets = {
    wallpaper: {
      grid: atlas,
      slices: [
        ...Object.entries(atlasPieces),
        ...starFrames.map((r, i) => [`stars_${i}`, r]),
        ...brightFrames.map((r, i) => [`star_bright_${i}`, r]),
      ],
    },
    stars: { grid: stars, slices: [] },
    ...Object.fromEntries(
      Object.entries(tiles).map(([n, g]) => [n, { grid: g, slices: [] }])
    ),
  }

  const data = {
    pieces: atlasPieces,
    starFrames,
    brightFrames,
    pivots: {
      lamp: pieces.lamp.pivot,
      star_bright: pieces.star_bright.pivot,
    },
    skies: Object.fromEntries(
      WALLPAPER_SKIES.map((n) => {
        const { bands, visible, recolor = {} } = palette.skies[n]
        return [n, { bands, visible, recolor }]
      })
    ),
    moonFaint: palette.moon.faint,
    layout: palette.layout,
    bandDither: palette.bandDither,
    windows: Object.fromEntries(
      STRIPS.map((s) => [
        s,
        palette.windows[s].map((w) => [
          w.x,
          w.y,
          w.w,
          w.h,
          w.color,
          w.kind === 'beacon' || w.kind === 'shop' ? 0 : 1,
        ]),
      ])
    ),
    initialLit,
    timing: {
      twinkle: palette.frames.twinkle.durationsMs,
      windowSwitch: palette.frames.windowSwitch.everyMs,
      cloudStep: palette.frames.cloudDrift.stepPx,
    },
    starRows: STAR_ROWS,
    staticTiles: {
      stars: { w: stars.w, h: stars.h },
      skyline: { w: sky.w, h: sky.h, above: sky.above },
      lamps: { w: lamps.w, h: lamps.h, x: lamps.x, bottom: lamps.bottom },
    },
  }
  return { sheets, data }
}

/** A one-frame sheet JSON in the shape Aseprite writes, as committed text. */
export function sceneSheetJson(stem, g, slices) {
  const full = { x: 0, y: 0, w: g.w, h: g.h }
  const json = {
    frames: [
      {
        filename: stem,
        frame: full,
        rotated: false,
        trimmed: false,
        spriteSourceSize: full,
        sourceSize: { w: g.w, h: g.h },
        duration: 100,
      },
    ],
    meta: {
      app: 'scripts/pixel/gen-wallpaper.mjs',
      image: `${stem}.png`,
      format: 'RGBA8888',
      size: { w: g.w, h: g.h },
      scale: '1',
      frameTags: [],
      layers: [],
      slices: slices.map(([name, [x, y, w, h]]) => ({
        name,
        color: '#0000ffff',
        keys: [{ frame: 0, bounds: { x, y, w, h } }],
      })),
    },
  }
  return `${JSON.stringify(json, null, 2)}\n`
}

/** The data module as written (Prettier formatted). */
export async function sceneModuleSource(data, file = DEFAULT_MODULE) {
  const consts = [
    ['PIECES', data.pieces, 'Atlas rectangles `[x, y, w, h]` of every piece.'],
    ['STAR_FRAMES', data.starFrames, 'The star tile in each twinkle frame.'],
    [
      'BRIGHT_FRAMES',
      data.brightFrames,
      'The bright star in each twinkle frame.',
    ],
    ['PIVOTS', data.pivots, 'Pivots `[x, y]` of the pieces placed by a point.'],
    [
      'SKIES',
      data.skies,
      'Bands top to bottom, what shows, and the recolour maps.',
    ],
    [
      'MOON_FAINT',
      data.moonFaint,
      'The recolour of the moon in dusk and dawn.',
    ],
    [
      'LAYOUT',
      data.layout,
      'Placement in art px (see wallpaper-palette.json).',
    ],
    [
      'BAND_DITHER',
      data.bandDither,
      'Share of the lower colour in the two rows at a band join.',
    ],
    [
      'WINDOWS',
      data.windows,
      'Per strip: `[x, y, w, h, colour, switches]`, strip-local.',
    ],
    [
      'INITIAL_LIT',
      data.initialLit,
      'Per strip, for even and odd repetitions: 1 where a window starts lit.',
    ],
    [
      'TIMING',
      data.timing,
      'Twinkle frame ms, window switch gap ms, cloud step px.',
    ],
    [
      'STAR_ROWS',
      data.starRows,
      'Star tile rows before the row shift repeats.',
    ],
    [
      'STATIC_TILES',
      data.staticTiles,
      'Sizes and anchors of the static frame tiles.',
    ],
  ]
  const code = [
    '/*',
    ' * GENERATED by scripts/pixel/gen-wallpaper.mjs from the os-wallpaper export',
    ' * and wallpaper-palette.json. Do not edit by hand: run `pnpm art:wallpaper`.',
    ' */',
    '',
    ...consts.map(
      ([name, value, doc]) =>
        `/** ${doc} */\nexport const ${name} = ${JSON.stringify(value)} as const\n`
    ),
  ].join('\n')
  return formatSource(code, file)
}

async function decoded(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/**
 * Write every sheet and the module, or with `check` compare them with what is
 * there. Returns the stale or written names.
 */
export async function writeWallpaper(
  inDir,
  outDir,
  moduleFile,
  { check = false } = {}
) {
  const sheet = await loadSheet(join(inDir, 'os-wallpaper.json'))
  const palette = JSON.parse(
    readFileSync(join(inDir, 'wallpaper-palette.json'), 'utf8')
  )
  const { sheets, data } = buildWallpaper(sheet, palette)
  const touched = []
  for (const [stem, { grid: g, slices }] of Object.entries(sheets)) {
    const pixels = raw(g)
    const json = sceneSheetJson(stem, g, slices)
    const pngFile = join(outDir, `${stem}.png`)
    const jsonFile = join(outDir, `${stem}.json`)
    if (check) {
      const fresh =
        existsSync(pngFile) &&
        existsSync(jsonFile) &&
        readFileSync(jsonFile, 'utf8') === json &&
        samePixels(await decoded(pngFile), {
          data: pixels,
          width: g.w,
          height: g.h,
        })
      if (!fresh) touched.push(stem)
      continue
    }
    mkdirSync(outDir, { recursive: true })
    await sharp(pixels, { raw: { width: g.w, height: g.h, channels: 4 } })
      .png()
      .toFile(pngFile)
    await optimizePng(pngFile)
    writeFileSync(jsonFile, json)
    touched.push(stem)
  }
  const source = await sceneModuleSource(data, moduleFile)
  if (check) {
    if (
      !existsSync(moduleFile) ||
      readFileSync(moduleFile, 'utf8') !== source
    ) {
      touched.push(relative(ROOT, moduleFile))
    }
  } else {
    writeFileSync(moduleFile, source)
    touched.push(relative(ROOT, moduleFile))
  }
  return touched
}

async function main(argv) {
  const inDir = flag(argv, '--in', DEFAULT_IN)
  const outDir = flag(argv, '--out-dir', DEFAULT_OUT_DIR)
  const moduleFile = flag(argv, '--module', DEFAULT_MODULE)
  if (!existsSync(join(inDir, 'os-wallpaper.json'))) {
    console.error(
      `${relative(ROOT, inDir)} has no export yet. Run: pnpm art:export --only os-wallpaper`
    )
    process.exit(1)
  }
  const check = argv.includes('--check')
  const touched = await writeWallpaper(inDir, outDir, moduleFile, { check })
  const where = relative(ROOT, outDir).split('\\').join('/')
  if (check) {
    if (touched.length) {
      console.error(
        `${where}: ${touched.join(', ')} stale. Run: pnpm art:wallpaper`
      )
      process.exit(1)
    }
    console.log('wallpaper up to date')
    return
  }
  console.log(`wrote ${where}: ${touched.join(', ')}`)
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
