'use client'

import { useEffect, useRef } from 'react'

import { artLength as art } from '@/lib/os/pixel'
import { type TickerHandle, schedule } from '@/lib/os/ticker'

import rideSheet from '@/assets/pixel/pets/minime-ride.png'
import '@/styles/sprites/minime-ride.css'

import {
  MAX_STEP_MS,
  type Ride,
  advanceRide,
  newRide,
} from '../wallpaper/ride-by'
import { LAYOUT } from '../wallpaper/scene-data.generated'
import { WallpaperStrip } from '../wallpaper/wallpaper-static'
import { type CameoState, watchCameo } from './cameo-watch'
import { RIDE_SHEET } from './sheet-data.generated'

/**
 * About 80 art px/s: some 3 s across a 390 css phone. Slower than the
 * desktop's 120, so on a road this short she is there long enough to see.
 */
const SPEED = 0.08

/** Where she waits on her parked bike, from the left, in art px. */
const PARK_X = 16

/**
 * The strip: the 114 art px skyline tile and the sky over it, up into the
 * night band that is one step off the feed's ground.
 */
const STRIP_HEIGHT = 160

/** Her shadow line, this far below the top of the road (as on the desktop). */
const LANE = 15

/** The share of the strip on screen that starts her (SPEC 3.8). */
const THRESHOLD = 0.6

const PARKED = RIDE_SHEET.tags.parked.frames[0]

/** Once per page view: the module outlives the shell's remounts. */
let rodeThisView = false

/**
 * The phone feed's footer (SPEC 3.8): the static skyline of the sky on
 * <html>, and on its road the mini-me, who rides across once, left to right,
 * the first time the strip is 60% on screen. One ride per page view.
 *
 * Under reduced motion or Pause she waits on her parked bike instead (and
 * rides off from there once motion is back and the strip is in view). A
 * ride under way holds where it is while Pause is on or a sheet covers the
 * feed. With Pets off she is hidden by CSS and never sets off.
 *
 * `data-ride` on the strip says where she is: `waiting`, `parked`,
 * `riding`, `held` or `done`.
 */
export function FooterRide() {
  const stripRef = useRef<HTMLDivElement>(null)
  const spriteRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const strip = stripRef.current
    const sprite = spriteRef.current
    if (!strip || !sprite) return

    let ride: Ride | null = null
    let parked = false
    let task: TickerHandle | null = null
    let last = 0
    let road = 0

    const show = (
      x: number,
      frame: readonly [number, number, number],
      mode: string
    ) => {
      sprite.style.visibility = 'visible'
      sprite.style.translate = `${art(Math.round(x))} 0`
      sprite.style.backgroundPosition = `${art(-frame[0])} ${art(-frame[1])}`
      strip.dataset.ride = mode
    }
    const hide = (mode: 'waiting' | 'done') => {
      sprite.style.visibility = 'hidden'
      strip.dataset.ride = mode
    }

    const run = (now: number) => {
      if (!ride) return null
      advanceRide(ride, Math.min(now - last, MAX_STEP_MS), SPEED)
      last = now
      if (ride.x >= road) {
        ride = null
        task = null
        hide('done')
        return null
      }
      show(ride.x, ride.frames[ride.index], 'riding')
      return now
    }
    const go = () => {
      last = performance.now()
      task = schedule({ run })
    }

    const update = (s: CameoState) => {
      const still = s.paused || s.reduced
      if (ride) {
        const moves = !still && !s.hidden && !s.covered
        if (moves && !task) {
          go()
          strip.dataset.ride = 'riding'
        } else if (!moves && task) {
          task.cancel()
          task = null
          strip.dataset.ride = 'held'
        }
        return
      }
      if (rodeThisView) return hide('done')
      if (still) {
        parked = true
        return show(PARK_X, PARKED, 'parked')
      }
      if (!s.inView || s.hidden || s.covered) {
        if (!parked) hide('waiting')
        return
      }
      rodeThisView = true
      // The road's length in art px, read once as she sets off.
      const px = sprite.getBoundingClientRect().width / RIDE_SHEET.frame.w
      road = strip.getBoundingClientRect().width / px
      ride = newRide(parked ? PARK_X : undefined)
      parked = false
      show(ride.x, ride.frames[0], 'riding')
      go()
    }

    const unwatch = watchCameo(strip, THRESHOLD, update)
    return () => {
      unwatch()
      task?.cancel()
    }
  }, [])

  return (
    <div
      ref={stripRef}
      aria-hidden
      data-ride="waiting"
      className="relative overflow-hidden"
      style={{ height: art(STRIP_HEIGHT) }}
    >
      <WallpaperStrip />
      <span
        ref={spriteRef}
        className="px-minime-ride px-minime-ride-parked invisible absolute left-0 in-data-[pets=hidden]:hidden"
        style={{
          bottom: art(LAYOUT.road.height - LANE),
          backgroundImage: `url(${rideSheet.src})`,
        }}
      />
    </div>
  )
}
