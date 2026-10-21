import type { MoonPiece } from './moon'
import {
  BAND_DITHER,
  BRIGHT_FRAMES,
  INITIAL_LIT,
  LAYOUT,
  MOON_FAINT,
  PIECES,
  SKIES,
  STAR_FRAMES,
  STAR_ROWS,
  TIMING,
  WINDOWS,
} from './scene-data.generated'
import { paintSky } from './sky'

/**
 * The wallpaper renderer (SPEC 2.5): draws the scene into a canvas one art
 * pixel per canvas pixel, which CSS scales by `--px` with
 * `image-rendering: pixelated`.
 *
 * Two layers are cached: the sky (bands and dither, per sky and size) and the
 * front (strips, lit windows, road and lamps, redrawn when a window switches
 * or the parallax moves). A twinkle or a cloud step then draws the sky, the
 * corner glow, the stars, the moon and the clouds, and the front on top:
 * about 40 `drawImage` calls into a 720x450 canvas.
 *
 * `step(now)` advances whatever is due and returns when the next thing is,
 * for the shared ticker; frame 0 (no step yet) is the static frame the server
 * renders, so the swap from the static frame to the canvas is invisible.
 */

export type SkyName = keyof typeof SKIES
export type Strip = 'far' | 'mid' | 'near'
type Rect = readonly [number, number, number, number]
type Piece = keyof typeof PIECES
type Layout = 'desktop' | 'mobile'
type Source = HTMLCanvasElement | HTMLImageElement

export const STRIPS: readonly Strip[] = ['far', 'mid', 'near']

/** Below this many art px across, the scene uses its phone layout. */
const MOBILE_COLS = 360

/** A cloud steps 1 art px this often. */
export const CLOUD_STEP_MS = 1400

/** The share of switchable windows the street keeps lit, as in frame 0. */
const LIT_SHARE = 6 / 7

/** The moon of each fixed sky, as in the mocks; Live shows the real phase. */
export const FIXED_MOON = {
  night: 'moon_waxing_gibbous',
  dusk: 'moon_waxing_gibbous',
  dawn: 'moon_waxing_gibbous',
  day: 'moon_waxing_gibbous',
} as const satisfies Record<SkyName, MoonPiece>

/** The parallax eases toward the pointer in steps this far apart. */
const PARALLAX_STEP_MS = 70
/** And this much of the way (of -1..1) per step. */
const PARALLAX_EASE = 0.2

function canvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function context(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('no 2d canvas')
  ctx.imageSmoothingEnabled = false
  return ctx
}

const mod = (n: number, m: number) => ((n % m) + m) % m

function mirrored(strip: Strip): boolean {
  const layout = LAYOUT.strips[strip]
  return 'tile' in layout && layout.tile === 'mirror'
}

/** What a sky shows, widened from the generated literals. */
interface Visible {
  stars: boolean
  moon: boolean | 'faint'
  clouds: boolean
  lights: boolean
  cone: boolean
  glow: boolean
}

function visibility(sky: SkyName): Visible {
  return SKIES[sky].visible
}

/** Recolour `rects` of `ctx` through `map` (all at once; null clears). */
function recolour(
  ctx: CanvasRenderingContext2D,
  rects: readonly Rect[],
  map: Readonly<Record<string, string | null>>
) {
  const lookup = new Map<number, number[] | null>()
  for (const [from, to] of Object.entries(map)) {
    const key = Number.parseInt(from.slice(1), 16)
    lookup.set(
      key,
      to === null
        ? null
        : [
            Number.parseInt(to.slice(1, 3), 16),
            Number.parseInt(to.slice(3, 5), 16),
            Number.parseInt(to.slice(5, 7), 16),
          ]
    )
  }
  for (const [x, y, w, h] of rects) {
    const image = ctx.getImageData(x, y, w, h)
    const p = image.data
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] === 0) continue
      const key = (p[i] << 16) | (p[i + 1] << 8) | p[i + 2]
      if (!lookup.has(key)) continue
      const to = lookup.get(key)
      if (to === null || to === undefined) p[i + 3] = 0
      else [p[i], p[i + 1], p[i + 2]] = to
    }
    ctx.putImageData(image, x, y)
  }
}

/** The atlas recoloured for one sky, plus mirrored copies of the tiled strips. */
interface Skin {
  atlas: HTMLCanvasElement
  flipped: Partial<Record<Strip | `${Strip}_lights`, HTMLCanvasElement>>
}

function buildSkin(atlas: HTMLImageElement, sky: SkyName): Skin {
  const c = canvas(atlas.naturalWidth, atlas.naturalHeight)
  const ctx = context(c)
  ctx.drawImage(atlas, 0, 0)
  const { recolor } = SKIES[sky]
  const visible = visibility(sky)
  const maps: Record<string, Readonly<Record<string, string | null>>> = recolor
  const groups: [readonly Rect[], string][] = [
    [[PIECES.far], 'far'],
    [[PIECES.mid], 'mid'],
    [[PIECES.near], 'near'],
    [[PIECES.cloud_a, PIECES.cloud_b, PIECES.cloud_c], 'clouds'],
    [[PIECES.lamp], 'lamp'],
  ]
  for (const [rects, key] of groups) {
    if (maps[key]) recolour(ctx, rects, maps[key])
  }
  if (visible.moon === 'faint') {
    const moons = Object.entries(PIECES)
      .filter(([name]) => name.startsWith('moon_') && name !== 'moon_faint')
      .map(([, rect]) => rect)
    recolour(ctx, moons, MOON_FAINT)
  }
  const flipped: Skin['flipped'] = {}
  for (const strip of STRIPS) {
    if (!mirrored(strip)) continue
    for (const name of [strip, `${strip}_lights`] as const) {
      const [x, y, w, h] = PIECES[name]
      const f = canvas(w, h)
      const fctx = context(f)
      fctx.scale(-1, 1)
      fctx.drawImage(c, x, y, w, h, -w, 0, w, h)
      flipped[name] = f
    }
  }
  return { atlas: c, flipped }
}

export class WallpaperScene {
  private readonly image: HTMLImageElement
  private readonly skins = new Map<SkyName, Skin>()
  private sky: SkyName = 'night'
  private moon: MoonPiece = FIXED_MOON.night
  private cols = 0
  private rows = 0
  private layout: Layout = 'desktop'
  private skyLayer: HTMLCanvasElement | null = null
  private front: HTMLCanvasElement | null = null
  private frontDirty = true

  // Animation state; all zero is frame 0.
  private twinkle = 0
  private drift = 0
  private lit: Record<Strip, boolean[][]> = { far: [], mid: [], near: [] }
  private direction = 0
  private target = 0
  private due = { twinkle: 0, cloud: 0, window: 0, parallax: 0 }

  constructor(image: HTMLImageElement) {
    this.image = image
  }

  private skin(): Skin {
    let skin = this.skins.get(this.sky)
    if (!skin) {
      skin = buildSkin(this.image, this.sky)
      this.skins.set(this.sky, skin)
    }
    return skin
  }

  /** Back to frame 0: no twinkle, no drift, the first lights, no parallax. */
  reset() {
    this.twinkle = 0
    this.drift = 0
    this.direction = 0
    this.target = 0
    this.lit = { far: [], mid: [], near: [] }
    this.frontDirty = true
  }

  setSky(sky: SkyName, moon: MoonPiece) {
    if (sky === this.sky && moon === this.moon) return
    this.sky = sky
    this.moon = moon
    this.skyLayer = null
    this.frontDirty = true
  }

  /** The canvas size in art px; returns whether it changed. */
  resize(cols: number, rows: number): boolean {
    if (cols === this.cols && rows === this.rows) return false
    this.cols = cols
    this.rows = rows
    this.layout = cols < MOBILE_COLS ? 'mobile' : 'desktop'
    this.skyLayer = null
    this.front = null
    this.frontDirty = true
    return true
  }

  /** Point the parallax at a pointer position, -1 (left) to 1 (right). */
  aim(direction: number) {
    if (this.layout === 'mobile') return
    this.target = Math.max(-1, Math.min(1, direction))
  }

  private get horizon() {
    return this.rows - LAYOUT.road.height
  }

  private offset(layer: keyof typeof LAYOUT.parallax.max): number {
    return -Math.round(this.direction * LAYOUT.parallax.max[layer])
  }

  /** The lights of repetition `k` of a strip, from the first frame's pattern. */
  private lights(strip: Strip, k: number): boolean[] {
    const index = k + 1
    const row = this.lit[strip]
    row[index] ??= INITIAL_LIT[strip][mod(k, 2)].map((on) => on === 1)
    return row[index]
  }

  private repetitions(strip: Strip): number[] {
    const width = PIECES[strip][2]
    const out: number[] = []
    for (let k = -1; k * width - 4 < this.cols; k++) out.push(k)
    return out
  }

  private drawSky(ctx: CanvasRenderingContext2D) {
    if (!this.skyLayer) {
      const { cols, rows } = this
      const pixels = paintSky(
        SKIES[this.sky].bands,
        cols,
        rows,
        LAYOUT.road.height,
        BAND_DITHER
      )
      this.skyLayer = canvas(cols, rows)
      context(this.skyLayer).putImageData(
        new ImageData(pixels, cols, rows),
        0,
        0
      )
    }
    ctx.drawImage(this.skyLayer, 0, 0)
  }

  private piece(
    ctx: CanvasRenderingContext2D,
    source: Source,
    r: Rect,
    x: number,
    y: number
  ) {
    ctx.drawImage(source, r[0], r[1], r[2], r[3], x, y, r[2], r[3])
  }

  private drawFront() {
    const { cols, rows } = this
    this.front ??= canvas(cols, rows)
    const ctx = context(this.front)
    ctx.clearRect(0, 0, cols, rows)
    const { atlas, flipped } = this.skin()
    const visible = visibility(this.sky)
    const horizon = this.horizon

    for (const strip of STRIPS) {
      const rect = PIECES[strip]
      const [, , w, h] = rect
      const y = horizon - LAYOUT.strips[strip].bottomAboveHorizon - h
      const o = this.offset(strip)
      const lightsRect = PIECES[`${strip}_lights`]
      for (const k of this.repetitions(strip)) {
        const x = k * w + o
        const flip = mirrored(strip) && mod(k, 2) === 1
        const body = flip ? flipped[strip] : undefined
        if (body) ctx.drawImage(body, x, y)
        else this.piece(ctx, atlas, rect, x, y)
        if (!visible.lights) continue
        const lit = this.lights(strip, k)
        const lightsFlipped = flip ? flipped[`${strip}_lights`] : undefined
        WINDOWS[strip].forEach(([wx, wy, ww, wh], i) => {
          if (!lit[i]) return
          const lx = flip ? w - wx - ww : wx
          if (lightsFlipped) {
            ctx.drawImage(lightsFlipped, lx, wy, ww, wh, x + lx, y + wy, ww, wh)
          } else {
            ctx.drawImage(
              atlas,
              lightsRect[0] + lx,
              lightsRect[1] + wy,
              ww,
              wh,
              x + lx,
              y + wy,
              ww,
              wh
            )
          }
        })
      }
    }

    const road = PIECES.road
    const roadOffset = this.offset('road')
    for (let x = mod(roadOffset, road[2]) - road[2]; x < cols; x += road[2]) {
      this.piece(ctx, atlas, road, x, horizon)
    }

    const { x0, spacing, footBelowHorizon, coneDx, coneDy } = LAYOUT.lamps
    const lampTop = horizon + footBelowHorizon - PIECES.lamp[3]
    for (let n = -1; x0 + n * spacing + roadOffset + coneDx < cols; n++) {
      const x = x0 + n * spacing + roadOffset
      if (visible.cone) {
        this.piece(ctx, atlas, PIECES.lamp_cone, x + coneDx, lampTop + coneDy)
      }
      this.piece(ctx, atlas, PIECES.lamp, x, lampTop)
    }
    this.frontDirty = false
  }

  /** Draws the current frame into `ctx`, a canvas `cols` by `rows`. */
  draw(ctx: CanvasRenderingContext2D) {
    if (this.cols === 0 || this.rows === 0) return
    ctx.imageSmoothingEnabled = false
    const { atlas } = this.skin()
    const visible = visibility(this.sky)
    const layout = this.layout
    const horizon = this.horizon
    this.drawSky(ctx)

    if (visible.glow) {
      const { dx, dy } = LAYOUT.glow[layout]
      this.piece(ctx, atlas, PIECES.glow, this.cols - PIECES.glow[2] + dx, dy)
    }

    const clear = horizon - LAYOUT.stars.clearAboveHorizon
    if (visible.stars && clear > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, this.cols, clear)
      ctx.clip()
      const tile = STAR_FRAMES[this.twinkle]
      const [, , tw, th] = tile
      for (let row = 0; row * th < clear; row++) {
        const shift = ((row % STAR_ROWS) * LAYOUT.stars.rowShift) % tw
        for (let x = shift - tw; x < this.cols; x += tw) {
          this.piece(ctx, atlas, tile, x, row * th)
        }
      }
      // As in the mocks: the listed point is the star's top left.
      for (const [x, y, phase] of LAYOUT.brightStars[layout]) {
        const frame =
          BRIGHT_FRAMES[(this.twinkle + phase) % BRIGHT_FRAMES.length]
        this.piece(ctx, atlas, frame, x, y)
      }
      ctx.restore()
    }

    if (visible.moon) {
      const [mx, my] = LAYOUT.moon[layout]
      this.piece(ctx, atlas, PIECES[this.moon], mx, my)
    }

    if (visible.clouds) {
      const o = this.offset('clouds')
      for (const cloud of LAYOUT.clouds[layout]) {
        const rect = PIECES[cloud.piece as Piece]
        const span = this.cols + rect[2]
        const x = mod(cloud.x + this.drift + o + rect[2], span) - rect[2]
        this.piece(ctx, atlas, rect, x, cloud.y)
      }
    }

    if (this.frontDirty || !this.front) this.drawFront()
    if (this.front) ctx.drawImage(this.front, 0, 0)
  }

  /** Whether anything in this sky moves on its own. */
  get animated(): boolean {
    const visible = visibility(this.sky)
    return visible.stars || visible.clouds || visible.lights
  }

  /** Starts the clocks from `now`, as after a pause. */
  start(now: number) {
    this.due = {
      twinkle: now + TIMING.twinkle[this.twinkle],
      cloud: now + CLOUD_STEP_MS,
      window: now + this.windowGap(),
      parallax: now,
    }
  }

  private windowGap() {
    const [min, max] = TIMING.windowSwitch
    return min + Math.random() * (max - min)
  }

  /**
   * Switches windows in one repetition of a strip: half the time one goes
   * dark as another lights (two switches), otherwise one switches toward the
   * share the first frame lights, so the street keeps its look over time.
   */
  private switchWindows() {
    const pick = (list: number[]) =>
      list[Math.floor(Math.random() * list.length)]
    const strip = STRIPS[Math.floor(Math.random() * STRIPS.length)]
    const reps = this.repetitions(strip)
    const lit = this.lights(
      strip,
      reps[Math.floor(Math.random() * reps.length)]
    )
    const switchable = WINDOWS[strip]
      .map((w, i) => (w[5] === 1 ? i : -1))
      .filter((i) => i >= 0)
    const on = switchable.filter((i) => lit[i])
    const off = switchable.filter((i) => !lit[i])
    if (Math.random() < 0.5 && on.length > 0 && off.length > 0) {
      lit[pick(on)] = false
      lit[pick(off)] = true
    } else if (on.length / switchable.length > LIT_SHARE && on.length > 0) {
      lit[pick(on)] = false
    } else if (off.length > 0) {
      lit[pick(off)] = true
    }
    this.frontDirty = true
  }

  /**
   * Advances what is due at `now`. Returns whether the frame changed and when
   * the next step is due.
   */
  step(now: number): { changed: boolean; next: number } {
    const visible = visibility(this.sky)
    let changed = false
    if (visible.stars && now >= this.due.twinkle) {
      this.twinkle = (this.twinkle + 1) % TIMING.twinkle.length
      this.due.twinkle = now + TIMING.twinkle[this.twinkle]
      changed = true
    }
    if (visible.clouds && now >= this.due.cloud) {
      this.drift += TIMING.cloudStep
      this.due.cloud = now + CLOUD_STEP_MS
      changed = true
    }
    if (visible.lights && now >= this.due.window) {
      this.switchWindows()
      this.due.window = now + this.windowGap()
      changed = true
    }
    const easing = this.direction !== this.target
    if (easing && now >= this.due.parallax) {
      const before = this.offsets()
      const gap = this.target - this.direction
      this.direction =
        Math.abs(gap) <= PARALLAX_EASE
          ? this.target
          : this.direction + Math.sign(gap) * PARALLAX_EASE
      this.due.parallax = now + PARALLAX_STEP_MS
      if (this.offsets() !== before) {
        this.frontDirty = true
        changed = true
      }
    }
    const dues: number[] = []
    if (visible.stars) dues.push(this.due.twinkle)
    if (visible.clouds) dues.push(this.due.cloud)
    if (visible.lights) dues.push(this.due.window)
    if (this.direction !== this.target) dues.push(this.due.parallax)
    return {
      changed,
      next: dues.length ? Math.min(...dues) : Number.POSITIVE_INFINITY,
    }
  }

  /** The rounded parallax offsets, as one comparable string. */
  private offsets(): string {
    return Object.keys(LAYOUT.parallax.max)
      .map((layer) => this.offset(layer as keyof typeof LAYOUT.parallax.max))
      .join(',')
  }
}
