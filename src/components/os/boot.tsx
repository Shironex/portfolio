'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'

const STEPS = [
  { label: 'Mounting desk', detail: '42ms' },
  { label: 'Loading projects', detail: '218ms' },
  { label: 'Priming panels', detail: '96ms' },
  { label: 'Waking windows', detail: '12ms' },
] as const

const BOOT_STORAGE_KEY = 'shiroos:booted'

/**
 * ShiroOS boot splash. Shown only once per tab session; skippable via Esc or
 * the "skip" button. Respects `prefers-reduced-motion` by collapsing to an
 * instant dismiss. Auto-dismisses at ~3.7s for first-time visitors.
 */
export function Boot() {
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)
  const [step, setStep] = useState(0)
  const skipButtonRef = useRef<HTMLButtonElement>(null)

  // Determine whether to show the boot splash at all. We can't read session
  // storage during SSR, so we defer the decision to a mount effect and render
  // nothing until we've made up our mind.
  useEffect(() => {
    if (typeof window === 'undefined') {
      setGone(true)
      return
    }
    const alreadyBooted = window.sessionStorage.getItem(BOOT_STORAGE_KEY)
    if (alreadyBooted || reducedMotion) {
      setGone(true)
      return
    }
    setReady(true)
  }, [reducedMotion])

  // Mark the session as booted once we've committed to showing (or skipping)
  // the splash — so subsequent navigations don't replay it.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (ready || gone) {
      window.sessionStorage.setItem(BOOT_STORAGE_KEY, '1')
    }
  }, [ready, gone])

  useEffect(() => {
    if (!ready) return
    const timers = [
      window.setTimeout(() => setStep(1), 650),
      window.setTimeout(() => setStep(2), 1450),
      window.setTimeout(() => setStep(3), 2250),
      window.setTimeout(() => setStep(4), 3000),
      window.setTimeout(() => setGone(true), 3700),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [ready])

  useEffect(() => {
    if (!ready) return
    skipButtonRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setGone(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready])

  if (gone || !ready) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ShiroOS boot sequence"
      className="fixed inset-0 z-[9999] overflow-hidden bg-sky-1 animate-boot-out motion-reduce:animate-none"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[8vh] -right-[4vw] select-none font-display text-[48vh] font-bold leading-none text-ink/[0.06] dark:text-ink/[0.08]"
      >
        白
      </span>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full motion-reduce:hidden"
            style={{
              inset: '-1rem',
              border: '2px solid transparent',
              borderTopColor: 'var(--color-miku)',
              borderRightColor:
                'color-mix(in oklab, var(--color-miku) 45%, transparent)',
              animation: 'spinSlow 1.8s linear infinite',
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full motion-reduce:hidden"
            style={{
              inset: '-0.4rem',
              border: '2px solid transparent',
              borderTopColor: 'var(--color-pink-2)',
              borderLeftColor:
                'color-mix(in oklab, var(--color-pink-2) 35%, transparent)',
              animation: 'spinSlow 2.6s linear infinite reverse',
            }}
          />
          <div className="relative flex size-[110px] items-center justify-center animate-logo-pop motion-reduce:animate-none">
            <Image
              src="/mascot.png"
              alt="ShiroOS mascot"
              width={220}
              height={220}
              priority
              draggable={false}
              className="size-full object-contain [filter:drop-shadow(0_10px_22px_color-mix(in_oklab,var(--color-miku)_45%,transparent))_drop-shadow(0_0_14px_color-mix(in_oklab,var(--color-cloud)_28%,transparent))]"
            />
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-5 -right-5 text-[28px] text-pink-2 [text-shadow:0_2px_6px_color-mix(in_oklab,var(--color-surf-solid)_80%,transparent)] animate-bob-note motion-reduce:animate-none"
          >
            ♪
          </span>
        </div>

        <div className="text-center">
          <div className="font-display text-[22px] font-semibold tracking-tight text-ink">
            <b className="font-bold text-miku-2">ShiroOS</b>
            <span className="mx-1">·</span>
            <span>booting with love</span>
            <span
              aria-hidden
              className="ml-1 inline-block animate-bob-note text-pink-2 motion-reduce:animate-none"
            >
              ♪
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-4">
            シロOS · portfolio build
          </div>
        </div>

        <div className="grid w-[300px] gap-1" role="status" aria-live="polite">
          {STEPS.map((s, i) => {
            const state: 'done' | 'run' | 'wait' =
              i < step ? 'done' : i === step ? 'run' : 'wait'
            return (
              <div
                key={s.label}
                className="grid grid-cols-[16px_1fr_auto] items-center gap-2 rounded-md border border-rule bg-surf-0 px-2.5 py-1.5 font-body text-[11px] text-ink-2"
              >
                <span
                  aria-hidden
                  className={`flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
                    state === 'done'
                      ? 'border border-mint bg-mint/30 text-ink-2'
                      : state === 'run'
                        ? 'border border-miku bg-miku/20 text-miku animate-blink motion-reduce:animate-none'
                        : 'border border-rule bg-ink/5 text-ink-4'
                  }`}
                >
                  {state === 'done' ? '✓' : state === 'run' ? '●' : '○'}
                </span>
                <span>{s.label}</span>
                <span className="font-mono text-[9px] tracking-[0.1em] text-ink-4">
                  {state === 'wait' ? '—' : s.detail}
                </span>
              </div>
            )
          })}
        </div>

        <button
          ref={skipButtonRef}
          type="button"
          onClick={() => setGone(true)}
          className="focus-ring rounded-full border border-rule-2 bg-surf-0 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:bg-surf-1 hover:text-ink"
        >
          skip · esc
        </button>
      </div>
    </div>
  )
}
