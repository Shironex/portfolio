'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { readBootFlag, writeBootFlag } from '@/lib/os/boot-flag'
import { type DeepLinkTarget, initialDeepLinkTarget } from '@/lib/os/deep-link'
import { cn } from '@/lib/utils'

import bootSheet from '@/assets/pixel/boot/os-boot.png'
import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import '@/styles/sprites/os-boot.css'

import { Kbd } from './kbd'

const STEPS = [
  'Mounting desk',
  'Loading projects',
  'Priming panels',
  'Waking windows',
] as const

type StepState = 'done' | 'run' | 'wait'

/** Each step's text: done in ink, the current one in lamp, the rest in meta. */
const STEP_TEXT: Record<StepState, string> = {
  done: 'text-(--ink)',
  run: 'text-(--lamp)',
  wait: 'text-(--meta)',
}

/** Its 7x7 mark from the boot sheet: a check, the spinning ring, dots. */
const STEP_MARK: Record<StepState, string> = {
  done: 'px-os-boot-check',
  run: 'px-os-boot-run',
  wait: 'px-os-boot-wait',
}

/** What the mark says, for the live region. */
const STEP_STATUS: Record<StepState, string> = {
  done: ', done',
  run: ', in progress',
  wait: ', waiting',
}

const SHEET = { backgroundImage: `url(${bootSheet.src})` }

/** Nothing on the splash moves under reduced motion or the Pause setting. */
const HELD_STILL =
  'motion-reduce:animate-none in-data-[motion=paused]:animate-none'

// Step advancement timings in ms; final entry auto-dismisses the splash.
// Kept tight (~2.4s total): the splash is a greeting, not a loading screen,
// and first-time visitors shouldn't wait on it. The CSS fade
// (--animate-boot-out) starts at total minus its 0.5s duration.
const BOOT_STEP_TIMINGS_MS = [420, 950, 1500, 1950, 2400] as const

/**
 * ShiroOS boot splash (SPEC 2.6): a black monitor powering on, the pixel
 * wordmark with シロOS under it, and a checklist in Departure Mono with the
 * run, check and wait marks. Shown only once per tab session; skippable via
 * Esc or the "skip" button. Respects `prefers-reduced-motion` by collapsing
 * to an instant dismiss. Auto-dismisses at ~2.4s for first-time visitors.
 * While it shows it is a modal layer: focus stays on it and the desktop
 * behind is inert.
 *
 * A deep link skips it too: someone sent to a specific window should land on
 * that window, not on a greeting. `initialWindow` is a window handed in by a
 * server route; without one the `?open=` / `?project=` params are read on mount.
 */
export function Boot({ initialWindow }: { initialWindow?: DeepLinkTarget }) {
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)
  const [step, setStep] = useState(0)
  const skipButtonRef = useRef<HTMLButtonElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const showing = ready && !gone

  // Determine whether to show the boot splash at all. We can't read session
  // storage during SSR, so we defer the decision to a mount effect and render
  // nothing until we've made up our mind.
  useEffect(() => {
    if (typeof window === 'undefined') {
      setGone(true)
      return
    }
    const alreadyBooted = readBootFlag()
    const deepLinked = initialDeepLinkTarget(initialWindow) !== null
    if (alreadyBooted || reducedMotion || deepLinked) {
      setGone(true)
      return
    }
    setReady(true)
  }, [reducedMotion, initialWindow])

  // Mark the session as booted once we've committed to showing (or skipping)
  // the splash, so subsequent navigations don't replay it.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (ready || gone) {
      writeBootFlag()
    }
  }, [ready, gone])

  useEffect(() => {
    if (!ready) return
    const timers = [
      window.setTimeout(() => setStep(1), BOOT_STEP_TIMINGS_MS[0]),
      window.setTimeout(() => setStep(2), BOOT_STEP_TIMINGS_MS[1]),
      window.setTimeout(() => setStep(3), BOOT_STEP_TIMINGS_MS[2]),
      window.setTimeout(() => setStep(4), BOOT_STEP_TIMINGS_MS[3]),
      window.setTimeout(() => setGone(true), BOOT_STEP_TIMINGS_MS[4]),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [ready])

  const dismiss = useCallback(() => setGone(true), [])
  useEscapeLayer('boot', dismiss, showing)
  useFocusTrap(splashRef, showing)

  useEffect(() => {
    // Once dismissed the component renders null but stays mounted, so this
    // listener must detach on `gone` too, otherwise it keeps swallowing every
    // Space/Enter on the page (e.g. typing in the contact form).
    if (!ready || gone) return
    skipButtonRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      setGone(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, gone])

  if (gone || !ready) return null

  return (
    <div
      ref={splashRef}
      role="dialog"
      aria-modal="true"
      aria-label="ShiroOS boot sequence"
      className={cn(
        'os-night animate-boot-out z-boot fixed inset-0 overflow-hidden bg-black',
        HELD_STILL
      )}
    >
      {/* The monitor powering on: the picture opens from the middle line in
          four steps while the scanline steps down to its rest. */}
      <div
        aria-hidden
        className={cn('boot-scanline absolute inset-x-0 h-6', HELD_STILL)}
      />
      <div
        className={cn(
          'animate-boot-open absolute inset-0 flex flex-col items-center pt-[calc(50dvh-75*var(--px))]',
          HELD_STILL
        )}
      >
        <span
          aria-hidden
          className="px-os-boot px-os-boot-wordmark block"
          style={SHEET}
        />
        <span
          aria-hidden
          className="px-os-boot px-os-boot-kana mt-6 block"
          style={SHEET}
        />

        <ul
          className="text-heading mt-16 flex flex-col leading-11"
          role="status"
          aria-live="polite"
        >
          {STEPS.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'run' : 'wait'
            return (
              <li
                key={label}
                className={cn('flex items-center gap-4', STEP_TEXT[state])}
              >
                <span
                  aria-hidden
                  className={cn(
                    'px-os-boot block flex-none',
                    STEP_MARK[state],
                    state === 'run' && cn('animate-(--px-loop)', HELD_STILL)
                  )}
                  style={SHEET}
                />
                {label}
                <span className="sr-only">{STEP_STATUS[state]}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <button
        ref={skipButtonRef}
        type="button"
        onClick={dismiss}
        aria-keyshortcuts="Escape Enter Space"
        className="focus-ring text-label absolute inset-x-0 bottom-16 mx-auto flex w-fit items-center gap-3 px-3 py-1 text-(--meta) hover:text-(--ink)"
      >
        skip
        <Kbd>esc</Kbd>
      </button>
    </div>
  )
}
