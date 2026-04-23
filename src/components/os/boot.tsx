'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Mounting desk', detail: '42ms' },
  { label: 'Loading projects', detail: '218ms' },
  { label: 'Priming panels', detail: '96ms' },
  { label: 'Waking windows', detail: '12ms' },
] as const

/**
 * ShiroOS boot splash. Full-screen overlay with counter-rotating rings,
 * ghosted kanji monogram, and a 4-step staggered checklist. Auto-dismisses
 * at ~3.7s via the `animate-boot-out` token (fade starts at 3.2s).
 */
export function Boot() {
  const [gone, setGone] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 650),
      setTimeout(() => setStep(2), 1450),
      setTimeout(() => setStep(3), 2250),
      setTimeout(() => setStep(4), 3000),
      setTimeout(() => setGone(true), 3700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  if (gone) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-sky-1 animate-boot-out">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[8vh] -right-[4vw] select-none font-display text-[48vh] font-bold leading-none text-ink/[0.04]"
      >
        白
      </span>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: '-1rem',
              border: '2px solid transparent',
              borderTopColor: 'var(--color-miku)',
              borderRightColor: 'rgba(57, 197, 187, 0.45)',
              animation: 'spinSlow 1.8s linear infinite',
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: '-0.4rem',
              border: '2px solid transparent',
              borderTopColor: 'var(--color-pink-2)',
              borderLeftColor: 'rgba(255, 95, 168, 0.35)',
              animation: 'spinSlow 2.6s linear infinite reverse',
            }}
          />
          <div className="relative flex size-[110px] items-center justify-center animate-logo-pop">
            <Image
              src="/mascot.png"
              alt="ShiroOS mascot"
              width={220}
              height={220}
              priority
              draggable={false}
              className="size-full object-contain [filter:drop-shadow(0_10px_22px_rgba(57,197,187,0.45))_drop-shadow(0_0_14px_rgba(255,255,255,0.28))]"
            />
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-5 -right-5 text-[28px] text-pink-2 [text-shadow:0_2px_6px_rgba(255,255,255,0.8)] animate-bob-note"
          >
            ♪
          </span>
        </div>

        <div className="text-center">
          <div className="font-display text-[22px] font-semibold tracking-tight text-ink">
            <b className="gradient-text-miku font-bold">ShiroOS</b>
            <span className="mx-1">·</span>
            <span>booting with love</span>
            <span className="ml-1 inline-block animate-bob-note text-pink-2">
              ♪
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-4">
            シロOS · portfolio build
          </div>
        </div>

        <div className="grid w-[300px] gap-1">
          {STEPS.map((s, i) => {
            const state: 'done' | 'run' | 'wait' =
              i < step ? 'done' : i === step ? 'run' : 'wait'
            return (
              <div
                key={s.label}
                className="grid grid-cols-[16px_1fr_auto] items-center gap-2 rounded-md border border-rule bg-surf-0 px-2.5 py-1.5 font-body text-[11px] text-ink-2"
              >
                <span
                  className={`flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
                    state === 'done'
                      ? 'border border-mint bg-mint/30 text-ink-2'
                      : state === 'run'
                        ? 'border border-miku bg-miku/20 text-miku animate-blink'
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
      </div>
    </div>
  )
}
