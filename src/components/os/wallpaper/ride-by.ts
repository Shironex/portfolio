import { RIDE_SHEET } from '../pets/sheet-data.generated'

/**
 * The mini-me ride-by (SPEC 3.7): she crosses the road strip on her bike,
 * left to right, inside the wallpaper canvas, so she sits behind every
 * window and needs no DOM. The first ride comes after 60 s of visible time,
 * then one every 4 to 6 minutes, three at most per session.
 *
 * Visible time is the time the wallpaper's clock runs: the scene only steps
 * while it does, so nothing here starts while the desktop is paused, under
 * reduced motion, in a hidden tab or under a maximized window. A ride that
 * is under way when the clock stops holds where it is, like the rest of the
 * scene, and goes on from there.
 */

/** About 120 art px/s: some 6 s across a 1440 css px desktop. */
const SPEED = 0.12

/** The first ride, in ms of visible time. */
const FIRST_AFTER = 60_000

/** Between rides, in ms of visible time. */
const GAP: readonly [number, number] = [240_000, 360_000]

/** Rides per browser tab. */
export const MAX_RIDES = 3

/** How many rides this tab has seen (`sessionStorage`). */
export const RIDES_STORAGE_KEY = 'shiroos:rides'

/** Where the exhaust puff plays once, when she is in view (art px). */
const PUFF_AT = 24

/** Her shadow line sits this far below the horizon, on the near lane. */
const LANE = 15

/** Movement per step is capped, so a long gap never jumps her across. */
export const MAX_STEP_MS = 100

/** Steps between counted visible time are capped too (a stall, a sleep). */
const MAX_GAP_MS = 2000

type Frame = readonly [number, number, number]

/** One ride under way: where she is and which frame shows. */
export interface Ride {
  x: number
  /** The tag playing and where in it she is. */
  frames: readonly Frame[]
  index: number
  /** Time into the current frame. */
  elapsed: number
  puffed: boolean
}

/** A ride starting at `x` art px (default: just off the left edge). */
export function newRide(x: number = -RIDE_SHEET.frame.w): Ride {
  return {
    x,
    frames: RIDE_SHEET.tags.ride.frames,
    index: 0,
    elapsed: 0,
    puffed: false,
  }
}

/**
 * Moves a ride on by `ms` at `speed` art px per ms: the ride loop, and the
 * exhaust puff once, where she is in view. Shared by the wallpaper and the
 * phone feed footer.
 */
export function advanceRide(ride: Ride, ms: number, speed: number) {
  ride.x += speed * ms
  ride.elapsed += ms
  while (ride.elapsed >= ride.frames[ride.index][2]) {
    ride.elapsed -= ride.frames[ride.index][2]
    ride.index++
    if (ride.index < ride.frames.length) continue
    // The puff plays once, then the ride loop again.
    ride.frames = RIDE_SHEET.tags.ride.frames
    ride.index = 0
  }
  if (ride.puffed || ride.x < PUFF_AT) return
  ride.puffed = true
  ride.frames = RIDE_SHEET.tags.puff.frames
  ride.index = 0
  ride.elapsed = 0
}

function storedRides(): number {
  try {
    return Number(window.sessionStorage.getItem(RIDES_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

function storeRides(count: number) {
  try {
    window.sessionStorage.setItem(RIDES_STORAGE_KEY, String(count))
  } catch {
    // Storage blocked: this page still stops at the cap.
  }
}

export class RideBy {
  private visible = 0
  private nextAt = FIRST_AFTER
  private last: number | null = null
  private ride: Ride | null = null
  private rides = storedRides()

  constructor(
    private readonly image: CanvasImageSource,
    private readonly random: () => number = Math.random
  ) {}

  /** Whether a ride is under way (`data-ride` on the canvas). */
  get active(): boolean {
    return this.ride !== null
  }

  /** The clock (re)starts at `now`: time it was stopped does not count. */
  start(now: number) {
    this.last = now
  }

  /** Back to frame 0 (reduced motion): no rider on the road. */
  reset() {
    this.ride = null
  }

  /**
   * Advances to `now` on a road `cols` wide. Returns whether she moved or
   * changed frame, and when she next needs a step.
   */
  step(now: number, cols: number): { changed: boolean; next: number } {
    const dt = this.last === null ? 0 : Math.max(0, now - this.last)
    this.last = now
    const ride = this.ride
    if (!ride) {
      this.visible += Math.min(dt, MAX_GAP_MS)
      if (this.rides >= MAX_RIDES) {
        return { changed: false, next: Number.POSITIVE_INFINITY }
      }
      if (this.visible < this.nextAt) {
        return { changed: false, next: now + (this.nextAt - this.visible) }
      }
      this.begin()
      return { changed: true, next: now }
    }

    const move = Math.min(dt, MAX_STEP_MS)
    const before = `${Math.round(ride.x)} ${ride.frames[ride.index][0]}`
    advanceRide(ride, move, SPEED)
    if (ride.x >= cols) {
      this.finish()
      return { changed: true, next: now + (this.nextAt - this.visible) }
    }
    const after = `${Math.round(ride.x)} ${ride.frames[ride.index][0]}`
    return { changed: before !== after, next: now }
  }

  private begin() {
    this.ride = newRide()
  }

  private finish() {
    this.ride = null
    this.rides++
    storeRides(this.rides)
    const [min, max] = GAP
    this.nextAt = this.visible + min + this.random() * (max - min)
  }

  /** Draws her over the road, whose top is `horizon`. */
  draw(ctx: CanvasRenderingContext2D, horizon: number) {
    const ride = this.ride
    if (!ride) return
    const [fx, fy] = ride.frames[ride.index]
    const { w, h } = RIDE_SHEET.frame
    ctx.drawImage(
      this.image,
      fx,
      fy,
      w,
      h,
      Math.round(ride.x),
      horizon + LANE - h,
      w,
      h
    )
  }
}
