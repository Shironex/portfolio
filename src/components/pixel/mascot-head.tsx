'use client'

import { useEffect, useRef } from 'react'

import { SHELL_ROOT_ATTRIBUTE } from '@/components/os/noscript-fallback'

import { AMBIENT_ATTRIBUTE, AMBIENT_PAUSED } from '@/lib/os/dom'
import { schedule } from '@/lib/os/ticker'
import { cn } from '@/lib/utils'

import sheet from '@/assets/pixel/avatar/mascot-head.png'
import '@/styles/sprites/mascot-head.css'

/** The blink plays once: half, then shut (the `blink` tag). */
const PLAY_CLASSES = [
  'px-mascot-head-blink',
  'animate-(--px-loop)',
  '[animation-iteration-count:1]',
]

/**
 * After the tag the lid holds half shut for as long as it did on the way
 * down (frame 2 of `mascot-head.aseprite`, 60 ms), so the blink reads as
 * half, shut, half (SPEC section 9).
 */
const HALF_MS = 60

/** Blinks come at random gaps of 3 to 6 s. */
const GAP_MS = [3000, 6000] as const

interface MascotHeadProps {
  /**
   * Whether it blinks. Off for copies nobody sees move (the server hero
   * under the shell).
   */
  animated?: boolean
  /**
   * Whether it holds still while the desktop is covered (`data-ambient`):
   * true on the desktop, false inside the layer that covers it (the Start
   * menu), where it is the thing in view.
   */
  pausesWithDesktop?: boolean
  className?: string
}

/**
 * The 16x16 mascot head (SPEC 1.4): the hero author row and the Start menu
 * footer. Decorative; the name next to it is the label.
 *
 * It blinks on the shared ticker at random gaps, never under reduced motion
 * or the Pause setting, and not while the tab is hidden (the ticker sleeps).
 */
export function MascotHead({
  animated = true,
  pausesWithDesktop = true,
  className,
}: MascotHeadProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !animated) return
    const html = document.documentElement
    const shell = el.closest(`[${SHELL_ROOT_ATTRIBUTE}]`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let hold: ReturnType<typeof setTimeout> | null = null
    const gap = () => GAP_MS[0] + Math.random() * (GAP_MS[1] - GAP_MS[0])
    const held = () =>
      reduced.matches ||
      html.dataset.motion === 'paused' ||
      (pausesWithDesktop &&
        shell?.getAttribute(AMBIENT_ATTRIBUTE) === AMBIENT_PAUSED)

    const onEnd = () => {
      el.classList.remove(...PLAY_CLASSES.slice(1))
      hold = setTimeout(() => {
        el.classList.remove(PLAY_CLASSES[0])
        hold = null
      }, HALF_MS)
    }
    el.addEventListener('animationend', onEnd)
    const task = schedule(
      {
        run: (now) => {
          if (!held() && hold === null) el.classList.add(...PLAY_CLASSES)
          return now + gap()
        },
      },
      performance.now() + gap()
    )
    return () => {
      task.cancel()
      if (hold !== null) clearTimeout(hold)
      el.removeEventListener('animationend', onEnd)
      el.classList.remove(...PLAY_CLASSES)
    }
  }, [animated, pausesWithDesktop])

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'px-mascot-head px-mascot-head-still block flex-none',
        className
      )}
      style={{ backgroundImage: `url(${sheet.src})` }}
    />
  )
}
