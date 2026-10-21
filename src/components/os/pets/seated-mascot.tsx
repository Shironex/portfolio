'use client'

import { type CSSProperties, useEffect, useRef } from 'react'

import { type TickerHandle, schedule } from '@/lib/os/ticker'
import { cn } from '@/lib/utils'

import '@/styles/sprites/mascot-pet.css'

import { type CameoState, watchCameo } from './cameo-watch'
import {
  PET_ANCHOR,
  PET_HITBOX,
  PET_SHEET_URL,
  type PetTag,
  framePosition,
  petFrames,
} from './pet-sheet'

type SeatTag = Extract<PetTag, 'sit' | 'wave'>

/** A tap plays the wave twice, then she sits back down. */
const WAVE_LOOPS = 2

/** Held, a tap shows one wave frame this long (SPEC 3.6). */
const STILL_WAVE_MS = 1000

/** `n` art px as a CSS length. */
const art = (n: number) => `calc(${n} * var(--px))`

/** The seated pose's pointer box (PET.md); she waves from the same spot. */
const HIT = PET_HITBOX.sit

/**
 * The mascot on the edge of the phone feed's contact card (SPEC 3.8): the
 * `sit` loop, with her seat line on the card's top edge and her legs over
 * it. A tap makes her stand on the edge and wave, twice, then sit again.
 *
 * Decorative and out of the tab order, like the desktop pet. The loop runs
 * on the shared ticker only while she is on screen and nothing covers the
 * feed; Pause holds her frame, reduced motion shows `sit` frame 1 still
 * (a tap then shows one wave frame for a second), and with Pets off she is
 * hidden by CSS and nothing runs.
 *
 * Place it in a positioned card; `className` sets how far from its right.
 */
export function SeatedMascot({ className }: { className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const spriteRef = useRef<HTMLSpanElement>(null)
  const hitRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const sprite = spriteRef.current
    const hit = hitRef.current
    if (!root || !sprite || !hit) return

    let tag: SeatTag = 'sit'
    let index = 0
    let wavesLeft = 0
    let task: TickerHandle | null = null
    let state: CameoState | null = null
    let stillWave: ReturnType<typeof setTimeout> | null = null
    let heldPose: { tag: SeatTag; index: number } = { tag, index }

    const show = () => {
      sprite.style.backgroundPosition = framePosition(tag, index)
      root.style.setProperty('--seat', String(PET_ANCHOR[tag].y))
      root.dataset.cameoTag = tag
      root.dataset.cameoFrame = String(index)
    }
    const due = (now: number) => now + petFrames(tag)[index][2]
    const step = (now: number) => {
      index++
      if (index >= petFrames(tag).length) {
        index = 0
        if (tag === 'wave') {
          wavesLeft -= 1
          if (wavesLeft <= 0) tag = 'sit'
        }
      }
      show()
      return due(now)
    }
    const moves = (s: CameoState) =>
      s.inView && !s.paused && !s.reduced && !s.hidden && !s.covered
    const start = () => {
      task?.cancel()
      task = schedule({ run: step }, due(performance.now()))
    }
    const stop = () => {
      task?.cancel()
      task = null
    }
    const endStillWave = () => {
      if (!stillWave) return
      clearTimeout(stillWave)
      stillWave = null
      ;({ tag, index } = heldPose)
    }

    const update = (next: CameoState) => {
      state = next
      if (moves(next)) endStillWave()
      // Reduced motion: `sit` frame 1, whatever she was doing.
      if (next.reduced && !stillWave) {
        tag = 'sit'
        index = 0
      }
      show()
      root.dataset.cameoState = moves(next) ? 'moving' : 'held'
      if (!moves(next)) stop()
      else if (!task) start()
    }

    const tap = () => {
      if (!state || state.hidden) return
      if (moves(state)) {
        tag = 'wave'
        index = 0
        wavesLeft = WAVE_LOOPS
        show()
        start()
        return
      }
      // Held: one wave frame, then the frame she held.
      if (stillWave) clearTimeout(stillWave)
      else heldPose = { tag, index }
      tag = 'wave'
      index = 0
      show()
      stillWave = setTimeout(() => {
        stillWave = null
        ;({ tag, index } = heldPose)
        show()
      }, STILL_WAVE_MS)
    }

    hit.addEventListener('click', tap)
    const unwatch = watchCameo(root, 0, update)
    return () => {
      unwatch()
      stop()
      if (stillWave) clearTimeout(stillWave)
      hit.removeEventListener('click', tap)
    }
  }, [])

  return (
    <span
      ref={rootRef}
      aria-hidden
      data-cameo="mascot"
      // The frame's top sits her seat line (or, standing, her feet) on the
      // card's top edge.
      style={{ '--seat': PET_ANCHOR.sit.y } as CSSProperties}
      className={cn(
        'pointer-events-none absolute top-[calc(var(--seat)*var(--px)*-1)] block size-48 in-data-[pets=hidden]:hidden',
        className
      )}
    >
      <span
        ref={spriteRef}
        className="px-mascot-pet px-mascot-pet-sit block"
        style={{ backgroundImage: `url(${PET_SHEET_URL})` }}
      />
      <span
        ref={hitRef}
        className="pointer-events-auto absolute"
        style={{
          left: art(HIT.x),
          top: art(HIT.y),
          width: art(HIT.w),
          height: art(HIT.h),
        }}
      />
    </span>
  )
}
