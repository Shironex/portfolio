import {
  type Perch,
  type WindowBox,
  coveredShare,
  inSlot,
  overlaps,
  spotCovered,
  surfaceBetween,
  walkSpan,
} from './perches'
import {
  type Box,
  PET_ANCHOR,
  PET_FRAME,
  PET_HITBOX,
  type PetTag,
  type Point,
  petFrames,
  playsOnce,
} from './pet-sheet'

/**
 * The mascot's state machine (SPEC 3.2), in art px and `performance.now()`
 * ms, with no DOM: the controller feeds it perches, input and time, and
 * draws what `view()` says.
 *
 * Frames advance on their own drawn durations, and the walk moves her at
 * each frame boundary by the time that frame showed, so the planted foot
 * stays put (PET.md). Only a fall moves her between frames.
 */

/** Physics, in art px and ms (SPEC 3.2; the walk speed is PET.md's). */
export const PHYSICS = {
  /** 900 art px/s². */
  gravity: 0.0009,
  /** 600 art px/s. */
  terminal: 0.6,
  /** 24 art px/s: the planted foot holds still at this speed (PET.md). */
  walk: 0.024,
  /** A window dragged faster than this throws her off. */
  rideFall: 1.5,
} as const

/** Timings in ms (SPEC 3.2 and 3.3). */
export const PET_TIMING = {
  spawn: [3000, 8000],
  idle: [2000, 6000],
  sit: [6000, 20000],
  sleepAfter: 45_000,
  occluded: 2000,
  /** One frame of `wave` under reduced motion. */
  stillWave: 1000,
} as const

/** A pointer this close (art px) wakes her. */
const WAKE_RADIUS = 60

/** `wave` plays two cycles. */
const WAVE_LOOPS = 2

/** Idle frames 6 to 8 are a blink: she wakes on it. */
const BLINK_FRAME = 5

/** Under a fall this long she is clearly lost; she lands on the floor. */
const LOST_BELOW = 200

/** A walk picks a target at least this far away. */
const MIN_WALK = 16

/** Where she sits still under reduced motion: in from the right end. */
const STILL_FROM_RIGHT = 40

/** The ground and where her still pose sits (art px). */
export interface PetGround {
  width: number
  /** The floor: the top of the taskbar row. */
  floorY: number
  /** The kerb of the wallpaper's road, where the still pose sits. */
  kerbY: number
  /** Spans the taskbar hides the kerb in; there she sits on the floor. */
  kerbHidden: readonly (readonly [number, number])[]
}

export type PetState =
  'out' | 'idle' | 'walk' | 'sit' | 'sleep' | 'drag' | 'fall' | 'land' | 'wave'

/** States in which she stands (or sits) on a perch. */
const PERCHED: ReadonlySet<PetState> = new Set([
  'idle',
  'walk',
  'sit',
  'sleep',
  'land',
  'wave',
])

/** What the controller draws. */
export interface PetView {
  state: PetState
  tag: PetTag
  frame: number
  /** The frame's top left in the layer, whole art px. */
  left: number
  top: number
  /** Facing left: the walk is drawn facing right. */
  flip: boolean
  z: number
  /** The pointer box in frame coordinates. */
  hitbox: Box
}

const TAG_OF: Record<Exclude<PetState, 'out'>, PetTag> = {
  idle: 'idle',
  walk: 'walk',
  sit: 'sit',
  sleep: 'sleep',
  drag: 'drag',
  fall: 'fall',
  land: 'land',
  wave: 'wave',
}

export type Random = () => number

function between([min, max]: readonly [number, number], random: Random) {
  return min + random() * (max - min)
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export class PetBrain {
  state: PetState = 'out'
  /** Her centre. */
  x = 0
  /** The surface line under her (her feet while airborne). */
  y = 0
  private vy = 0
  private perch: Perch | null = null
  private facing: 1 | -1 = 1
  private tag: PetTag = 'idle'
  private frame = 0
  private frameAt = 0
  private last = 0
  private target = 0
  private sitOnArrival = false
  private decideAt = 0
  private lastInput = 0
  private occludedAt: number | null = null
  private returnTo: 'idle' | 'sit' = 'idle'
  private wavesLeft = 0
  private waveQueued = false
  private spawnAt: number | null = null
  private dropAt: number | null = null
  private perches: Perch[] = []
  private windows: WindowBox[] = []
  private floorY = 0
  private kerbY = 0
  private kerbHidden: PetGround['kerbHidden'] = []
  private width = 0
  private topZ = 0
  /** No motion: she holds a pose and moves only by teleporting. */
  private still = false
  /** Under reduced motion, where a drag would drop her. */
  private held: Point | null = null
  /** Under reduced motion, when the one wave frame ends, and what was before. */
  private stillWaveUntil: number | null = null
  private stillWaveBack: PetTag | null = null

  constructor(private readonly random: Random = Math.random) {}

  /** The window whose top edge she is on, if any. */
  get perchWindow(): string | undefined {
    return this.perch?.windowId
  }

  // ---------------------------------------------------------------- input

  /** The perches and windows changed (a stack change, a resize). */
  setWorld(
    perches: Perch[],
    windows: WindowBox[],
    ground: PetGround,
    now: number
  ) {
    this.perches = perches
    this.windows = windows
    this.width = ground.width
    this.floorY = ground.floorY
    this.kerbY = ground.kerbY
    this.kerbHidden = ground.kerbHidden
    this.topZ = windows.reduce((z, w) => Math.max(z, w.z), 0)
    if (this.state === 'out') return
    const current = this.perch
    if (!current) return
    if (this.still && this.state === 'sit' && current.floor) {
      // The still pose keeps its place in from the right end.
      this.placeStill(now)
      return
    }
    const next = perches.find((p) => p.key === current.key)
    if (!next) {
      // Her window closed (its exit animation is over) or went away, or
      // her panel did; a minimize drops her once its animation is over.
      if (this.dropAt === null) this.loseFooting(now)
      return
    }
    // The window moved under her (a keyboard nudge, a snap): ride along.
    this.x += next.left - current.left
    this.y = next.y
    this.perch = next
    const [from, to] = walkSpan(next)
    if (this.x < from || this.x > to) {
      if (this.still) this.x = clamp(this.x, from, to)
      else this.loseFooting(now)
      return
    }
    if (this.state === 'sit' && !inSlot(next, this.x)) this.enter('idle', now)
    this.checkOcclusion(now)
  }

  /** A window she may stand on is going away in `ms` (a minimize). */
  dropSoon(windowId: string, now: number, ms: number) {
    if (this.perch?.windowId !== windowId || !PERCHED.has(this.state)) return
    this.dropAt = now + ms
  }

  /** Reduced motion: a still pose, moved only by teleporting. */
  setStill(still: boolean, now: number) {
    if (this.still === still) return
    this.still = still
    if (this.state === 'out') return
    if (still) this.placeStill(now)
    else this.enter('idle', now)
  }

  /** Pointer or key input anywhere; `point` for a pointer, `press` for a click or key. */
  input(now: number, point: Point | null, press: boolean) {
    this.lastInput = now
    if (this.state !== 'sleep') return
    const near =
      point !== null &&
      Math.hypot(point.x - this.x, point.y - (this.y - 24)) <= WAKE_RADIUS
    if (!press && !near) return
    this.enter('idle', now)
    // Wake on the blink.
    this.frame = BLINK_FRAME
  }

  /** Something asks for a wave (About opened, a message sent, a click). */
  wave(now: number) {
    if (this.state === 'out') return
    if (this.still) {
      this.showStillWave(now)
      return
    }
    if (!PERCHED.has(this.state) || this.state === 'land') {
      this.waveQueued = true
      return
    }
    if (this.state === 'wave') return
    this.returnTo = this.state === 'sit' ? 'sit' : 'idle'
    this.wavesLeft = WAVE_LOOPS
    this.setTag('wave', now)
    this.state = 'wave'
  }

  /** The pointer took hold of her past the slop. */
  grab(point: Point, now: number) {
    if (this.state === 'out') return
    if (this.still) {
      // No motion: she stays put until the drop, then appears there.
      this.held = point
      return
    }
    this.perch = null
    this.dropAt = null
    this.x = point.x
    this.y = point.y
    this.state = 'drag'
    this.setTag('drag', now)
  }

  drag(point: Point) {
    if (this.still) {
      if (this.held) this.held = point
      return
    }
    if (this.state !== 'drag') return
    this.x = point.x
    this.y = point.y
  }

  /** Let go: she falls from where she hangs (or appears there, still). */
  release(now: number) {
    // From the grab point on her head to her feet.
    const drop = PET_ANCHOR.fall.y - PET_ANCHOR.drag.y
    if (this.still) {
      if (!this.held) return
      this.x = this.held.x
      this.y = this.held.y + drop
      this.held = null
      this.landBelow(now)
      return
    }
    if (this.state !== 'drag') return
    this.y += drop
    this.vy = 0
    this.enter('fall', now)
  }

  /** A click on her without a drag: she waves. */
  click(now: number) {
    this.lastInput = now
    if (this.state === 'sleep') {
      this.input(now, null, true)
      return
    }
    this.wave(now)
  }

  /**
   * The window she stands on moved by (dx, dy) art px in `dt` ms (a drag).
   * Every perch of that window moves too, so a fall meets it where it is.
   * Faster than `rideFall` the window is pulled out from under her: she
   * stays where she was and falls.
   */
  ride(windowId: string, dx: number, dy: number, dt: number, now: number) {
    const key = `window:${windowId}`
    this.perches = this.perches.map((p) =>
      p.key === key ? shiftPerch(p, dx, dy) : p
    )
    this.windows = this.windows.map((w) =>
      w.id === windowId ? { ...w, x: w.x + dx, y: w.y + dy } : w
    )
    if (this.perch?.key !== key || !PERCHED.has(this.state)) return
    const speed = Math.hypot(dx, dy) / Math.max(dt, 1)
    if (!this.still && speed > PHYSICS.rideFall) {
      this.loseFooting(now)
      return
    }
    this.perch = shiftPerch(this.perch, dx, dy)
    this.x += dx
    this.y += dy
  }

  /**
   * Keyboard focus moved onto `box` (art px), held by a window at z
   * `ownerZ` (null for the desktop). If she covers it, she leaves at once
   * (SPEC 3.6): she stands up off a title bar, hops along her edge, or
   * drops to the floor, so the focused control is clear the same frame.
   */
  avoid(box: Box, ownerZ: number | null, now: number) {
    if (this.state === 'out' || this.state === 'drag') return
    const z = this.zIndex()
    // A window above her hides her there: she cannot cover its controls.
    if (ownerZ !== null && ownerZ > z) return
    if (!overlaps(this.box(), box)) return
    if (this.state === 'sit') {
      this.enter('idle', now)
      if (!overlaps(this.box(), box)) return
    }
    const perch = this.perch
    const half = PET_FRAME.w / 2
    if (perch) {
      const [from, to] = walkSpan(perch)
      const spots = [box.x - half - 1, box.x + box.w + half + 1]
        .filter((x) => x >= from && x <= to)
        .sort((a, b) => Math.abs(a - this.x) - Math.abs(b - this.x))
      for (const x of spots) {
        if (spotCovered(perch, x, this.windows)) continue
        if (overlaps(this.boxAt(x, perch.y, 'idle'), box)) continue
        this.hop(x, perch, now)
        return
      }
    }
    const floor = this.floor()
    const [from, to] = walkSpan(floor)
    const x = [box.x - half - 1, box.x + box.w + half + 1, to]
      .map((spot) => clamp(spot, from, to))
      .find((spot) => !overlaps(this.boxAt(spot, floor.y, 'idle'), box))
    this.hop(x ?? to, floor, now)
  }

  /** Bring her out: a fall onto a random perch in view. */
  spawn(now: number) {
    this.spawnAt = null
    if (this.still) {
      this.placeStill(now)
      return
    }
    const pick = this.randomSpot()
    this.x = pick.x
    this.y = -PET_FRAME.h
    this.vy = 0
    this.perch = null
    this.enter('fall', now)
  }

  /** Spawn after the drawn delay (3 to 8 s) from `now`. */
  spawnLater(now: number) {
    this.spawnAt = now + between(PET_TIMING.spawn, this.random)
  }

  /** Off the screen: Pets off, a maximized window. */
  hide() {
    this.state = 'out'
    this.perch = null
    this.spawnAt = null
    this.dropAt = null
  }

  /** After a pause: frames resume from now, not from where time went. */
  resume(now: number) {
    this.last = now
    this.frameAt = now
  }

  // ---------------------------------------------------------------- clock

  /**
   * Advances everything due at `now`. Returns when she next needs a step:
   * the next frame, a decision, or the next animation frame while she falls.
   */
  step(now: number): number | null {
    const dt = clamp(now - this.last, 0, 100)
    this.last = now
    if (this.state === 'out') {
      if (this.spawnAt !== null && now >= this.spawnAt) this.spawn(now)
      else return this.spawnAt
    }
    if (this.still) {
      this.endStillWave(now)
      return this.stillWaveUntil
    }
    if (this.dropAt !== null && now >= this.dropAt) {
      this.dropAt = null
      this.loseFooting(now)
    }
    if (this.state === 'fall') this.fall(dt, now)
    this.advanceFrames(now)
    this.decide(now)
    return this.nextDue(now)
  }

  private fall(dt: number, now: number) {
    const v0 = this.vy
    this.vy = Math.min(PHYSICS.terminal, v0 + PHYSICS.gravity * dt)
    const next = this.y + ((v0 + this.vy) / 2) * dt
    const hit = surfaceBetween(this.perches, this.windows, this.x, this.y, next)
    if (hit) {
      this.y = hit.y
      this.settle(hit, now)
      return
    }
    this.y = next
    if (this.y <= this.floorY + LOST_BELOW) return
    const floor = this.floor()
    this.x = clamp(this.x, ...walkSpan(floor))
    this.y = floor.y
    this.settle(floor, now)
  }

  /** Touched down on `perch`: the landing squash, then idle. */
  private settle(perch: Perch, now: number) {
    this.perch = perch
    this.vy = 0
    this.enter('land', now)
    this.checkOcclusion(now)
  }

  private advanceFrames(now: number) {
    // Back from a long gap (a pause, a hidden tab): start the frame afresh.
    if (now - this.frameAt > 1000) this.frameAt = now
    let frames = petFrames(this.tag)
    let guard = 64
    while (guard-- > 0 && now >= this.frameAt + frames[this.frame][2]) {
      const ms = frames[this.frame][2]
      this.frameAt += ms
      if (this.state === 'walk') {
        this.walk(ms, now)
        if (this.state !== 'walk') {
          frames = petFrames(this.tag)
          continue
        }
      }
      this.frame++
      if (this.frame < frames.length) continue
      this.frame = 0
      if (this.endOfTag(now)) frames = petFrames(this.tag)
    }
  }

  /** A tag played through. Returns whether she changed tag. */
  private endOfTag(now: number): boolean {
    if (this.state === 'land') {
      this.enter('idle', now)
      if (this.waveQueued) {
        this.waveQueued = false
        this.wave(now)
      }
      return true
    }
    if (this.state === 'wave') {
      this.wavesLeft--
      if (this.wavesLeft > 0) return false
      this.enter(this.returnTo, now)
      return true
    }
    return playsOnce(this.tag)
  }

  /** One frame's worth of walking. */
  private walk(ms: number, now: number) {
    const perch = this.perch
    if (!perch) return
    this.x += this.facing * PHYSICS.walk * ms
    const [from, to] = walkSpan(perch)
    const arrived =
      this.facing > 0 ? this.x >= this.target : this.x <= this.target
    if (arrived && this.target >= from && this.target <= to) {
      this.x = this.target
      if (this.sitOnArrival && inSlot(perch, this.x)) this.enter('sit', now)
      else this.enter('idle', now)
      return
    }
    if (this.x >= from && this.x <= to) return
    // The end of the edge: turn (80%), or step off (never off the floor).
    this.x = clamp(this.x, from, to)
    if (perch.floor || this.random() < 0.8) {
      this.facing = this.facing > 0 ? -1 : 1
      this.target = this.pickTarget(perch, this.facing)
      this.sitOnArrival = false
      return
    }
    this.x += this.facing * (PET_FRAME.w / 4)
    this.loseFooting(now)
  }

  private decide(now: number) {
    if (
      this.occludedAt !== null &&
      now - this.occludedAt >= PET_TIMING.occluded
    ) {
      this.occludedAt = null
      this.relocate(now)
      return
    }
    if (this.state !== 'idle' && this.state !== 'sit') return
    if (now - this.lastInput >= PET_TIMING.sleepAfter) {
      this.enter('sleep', now)
      return
    }
    if (now < this.decideAt) return
    if (this.state === 'sit') {
      this.enter('idle', now)
      return
    }
    const perch = this.perch
    if (!perch) return
    const roll = this.random()
    if (roll < 0.6) {
      this.startWalk(perch, now, false)
    } else if (roll < 0.85 && perch.slots.length > 0) {
      if (inSlot(perch, this.x)) this.enter('sit', now)
      else this.startWalk(perch, now, true)
    } else {
      this.decideAt = now + between(PET_TIMING.idle, this.random)
    }
  }

  private nextDue(now: number): number {
    if (this.state === 'fall') return now
    let due = this.frameAt + petFrames(this.tag)[this.frame][2]
    if (this.state === 'idle' || this.state === 'sit') {
      due = Math.min(due, this.decideAt, this.lastInput + PET_TIMING.sleepAfter)
    }
    if (this.occludedAt !== null) {
      due = Math.min(due, this.occludedAt + PET_TIMING.occluded)
    }
    if (this.dropAt !== null) due = Math.min(due, this.dropAt)
    return due
  }

  // ------------------------------------------------------------- movement

  private enter(state: Exclude<PetState, 'out'>, now: number) {
    this.state = state
    this.setTag(TAG_OF[state], now)
    if (state === 'idle') {
      this.decideAt = now + between(PET_TIMING.idle, this.random)
    } else if (state === 'sit') {
      this.decideAt = now + between(PET_TIMING.sit, this.random)
    } else if (state === 'fall') {
      this.perch = null
      this.occludedAt = null
    }
  }

  private setTag(tag: PetTag, now: number) {
    this.tag = tag
    this.frame = 0
    this.frameAt = now
  }

  private loseFooting(now: number) {
    this.vy = 0
    this.dropAt = null
    if (this.still) {
      this.landBelow(now)
      return
    }
    this.enter('fall', now)
  }

  private startWalk(perch: Perch, now: number, toSit: boolean) {
    let target: number
    if (toSit) {
      const [from, to] =
        perch.slots[Math.floor(this.random() * perch.slots.length)]
      target = between([from, to], this.random)
    } else {
      const direction = this.random() < 0.5 ? -1 : 1
      target = this.pickTarget(perch, direction)
    }
    if (Math.abs(target - this.x) < 1) {
      if (toSit) this.enter('sit', now)
      else this.decideAt = now + between(PET_TIMING.idle, this.random)
      return
    }
    this.target = target
    this.facing = target > this.x ? 1 : -1
    this.sitOnArrival = toSit
    this.state = 'walk'
    this.setTag('walk', now)
  }

  /** A walk target on the perch, in `direction` if there is room. */
  private pickTarget(perch: Perch, direction: 1 | -1): number {
    const [from, to] = walkSpan(perch)
    const room = direction > 0 ? to - this.x : this.x - from
    if (room < MIN_WALK) {
      // No room this way: past the end, so she reaches it and decides there.
      return direction > 0 ? to + 1 : from - 1
    }
    const distance = MIN_WALK + this.random() * (room - MIN_WALK)
    // A third of the walks run to the end, where she turns or steps off.
    if (this.random() < 0.33) return direction > 0 ? to + 1 : from - 1
    return this.x + direction * distance
  }

  /** Jump to `x` on `perch` and land there (or stand there, still). */
  private hop(x: number, perch: Perch, now: number) {
    this.x = x
    this.y = perch.y
    this.perch = perch
    this.vy = 0
    if (this.still) {
      this.state = 'idle'
      this.tag = 'idle'
      this.frame = 0
      return
    }
    this.enter('land', now)
  }

  /** Under reduced motion: the first surface under her, at once. */
  private landBelow(now: number) {
    const hit =
      surfaceBetween(
        this.perches,
        this.windows,
        this.x,
        this.y - PET_FRAME.h,
        Number.POSITIVE_INFINITY
      ) ?? this.floor()
    this.x = clamp(this.x, ...walkSpan(hit))
    this.hop(this.x, hit, now)
  }

  /**
   * Reduced motion: seated still in from the right end, on the kerb of the
   * road so her legs hang over something, or on the floor line where the
   * taskbar hides the kerb.
   */
  private placeStill(now: number) {
    const floor = this.floor()
    this.perch = floor
    this.x = clamp(floor.right - STILL_FROM_RIGHT, ...walkSpan(floor))
    const half = PET_FRAME.w / 2
    const hidden = this.kerbHidden.some(
      ([from, to]) => this.x + half > from && this.x - half < to
    )
    this.y = hidden ? floor.y : this.kerbY
    this.state = 'sit'
    this.tag = 'sit'
    this.frame = 0
    this.frameAt = now
  }

  /** Reduced motion: one wave frame for a second, then the pose again. */
  private showStillWave(now: number) {
    if (this.stillWaveUntil !== null) return
    this.stillWaveBack = this.tag
    this.tag = 'wave'
    this.frame = 0
    this.stillWaveUntil = now + PET_TIMING.stillWave
  }

  /** Ends the still wave once it is due. */
  private endStillWave(now: number) {
    if (this.stillWaveUntil === null || now < this.stillWaveUntil) return
    this.stillWaveUntil = null
    if (this.stillWaveBack) this.tag = this.stillWaveBack
    this.frame = 0
    this.stillWaveBack = null
  }

  /** Hidden for a while under a higher window: move into view or drop. */
  private relocate(now: number) {
    const perch = this.perch
    if (!perch || !PERCHED.has(this.state)) return
    const [from, to] = walkSpan(perch)
    let best: number | null = null
    for (let x = from; x <= to; x += 4) {
      if (spotCovered(perch, x, this.windows)) continue
      if (
        coveredShare(this.boxAt(x, perch.y, 'idle'), perch.z, this.windows) >=
        0.5
      ) {
        continue
      }
      if (best === null || Math.abs(x - this.x) < Math.abs(best - this.x))
        best = x
    }
    if (best === null) {
      if (perch.floor) return
      this.loseFooting(now)
      return
    }
    if (this.still) {
      this.hop(best, perch, now)
      return
    }
    this.target = best
    this.facing = best > this.x ? 1 : -1
    this.sitOnArrival = false
    this.state = 'walk'
    this.setTag('walk', now)
  }

  private checkOcclusion(now: number) {
    if (!this.perch || !PERCHED.has(this.state)) {
      this.occludedAt = null
      return
    }
    const hidden = coveredShare(this.box(), this.perch.z, this.windows) >= 0.5
    if (!hidden) this.occludedAt = null
    else this.occludedAt ??= now
  }

  /** A random spot in view to drop onto. */
  private randomSpot(): { x: number } {
    // Somewhere with room to stand: a window or panel 70% of the time.
    const roomy = this.perches.filter((p) => p.roomy)
    const candidates = roomy.filter((p) => !p.floor)
    for (let tries = 0; tries < 12; tries++) {
      const pool = this.random() < 0.7 && candidates.length ? candidates : roomy
      const perch = pool[Math.floor(this.random() * pool.length)]
      if (!perch) break
      const [from, to] = walkSpan(perch)
      if (to < from) continue
      const x = between([from, to], this.random)
      if (perch.floor || !spotCovered(perch, x, this.windows)) return { x }
    }
    return { x: this.width / 2 }
  }

  private floor(): Perch {
    return (
      this.perches.find((p) => p.floor) ?? {
        key: 'floor',
        y: this.floorY,
        left: 0,
        right: this.width,
        z: 0,
        floor: true,
        slots: [],
        roomy: true,
      }
    )
  }

  // ----------------------------------------------------------------- view

  private zIndex(): number {
    if (this.state === 'drag' || this.state === 'fall') return this.topZ + 1
    return this.perch?.z ?? 0
  }

  private boxAt(x: number, y: number, tag: PetTag): Box {
    const anchor = PET_ANCHOR[tag]
    const hit = PET_HITBOX[tag]
    return {
      x: Math.round(x) - anchor.x + hit.x,
      y: Math.round(y) - anchor.y + hit.y,
      w: hit.w,
      h: hit.h,
    }
  }

  /** Her pointer box in the layer. */
  box(): Box {
    return this.boxAt(this.x, this.y, this.tag)
  }

  view(): PetView {
    const anchor = PET_ANCHOR[this.tag]
    return {
      state: this.state,
      tag: this.tag,
      frame: this.frame,
      left: Math.round(this.x) - anchor.x,
      top: Math.round(this.y) - anchor.y,
      flip: this.tag === 'walk' && this.facing < 0,
      z: this.zIndex(),
      hitbox: PET_HITBOX[this.tag],
    }
  }
}

function shiftPerch(perch: Perch, dx: number, dy: number): Perch {
  return {
    ...perch,
    y: perch.y + dy,
    left: perch.left + dx,
    right: perch.right + dx,
    slots: perch.slots.map(([from, to]) => [from + dx, to + dx] as const),
  }
}
