'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { GithubActivityStrip } from './github-activity-strip'

/**
 * HeroPlate — large decorative hero card that sits on the desktop canvas
 * behind the windows. Ported from new-design/index.html `function HeroPlate()`.
 *
 * The "Kacper" name uses a mount-time typewriter effect: on first render the
 * text is empty and a `setInterval` ticks every 110ms, appending one character
 * until the full name is on screen, at which point the interval clears. A
 * blinking caret renders unconditionally next to the name.
 */
interface HeroPlateProps {
  onOpenCmd: () => void
  onOpenProjects: () => void
}

const FULL_NAME = 'Kacper'
const TAGS = ['react', 'nextjs', 'electron', 'nestjs', 'claude-sdk', 'postgres']

export function HeroPlate({ onOpenCmd, onOpenProjects }: HeroPlateProps) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i += 1
      setTyped(FULL_NAME.slice(0, i))
      if (i >= FULL_NAME.length) clearInterval(t)
    }, 110)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-rule-2 bg-surf-1 backdrop-blur-xl px-5 py-7 md:px-8 md:py-10 shadow-[0_20px_60px_-10px_rgba(13,27,42,0.15)]">
      <span
        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full opacity-60 blur-3xl animate-floaty"
        style={{
          background:
            'radial-gradient(circle, var(--color-miku-3), transparent 70%)',
        }}
      />
      <span
        className="pointer-events-none absolute -bottom-10 -left-8 size-44 rounded-full opacity-55 blur-3xl animate-floaty"
        style={{
          background:
            'radial-gradient(circle, var(--color-pink), transparent 70%)',
          animationDelay: '1s',
          animationDirection: 'reverse',
        }}
      />

      <div className="absolute top-4 right-5 flex items-center gap-2 font-mono text-[10px] font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-miku/30 bg-miku/15 px-2 py-0.5 uppercase tracking-widest text-miku-2">
          <span className="size-1.5 rounded-full bg-miku shadow-[0_0_6px_var(--color-miku)]" />
          online
        </span>
        <span className="text-ink-4">v4.2.6</span>
      </div>

      <div className="relative font-mono text-[11px] uppercase tracking-widest text-ink-3 mb-4">
        full-stack · gdańsk, pl · open to work
      </div>

      <h1 className="relative font-display text-[clamp(32px,9vw,48px)] md:text-[clamp(44px,5.4vw,72px)] leading-tight tracking-[-0.02em] text-ink font-bold">
        hi, I&apos;m{' '}
        <em className="gradient-text-miku not-italic">{typed}</em>
        <span className="animate-blink ml-1 font-normal text-miku">|</span>
        <br />I make <em className="gradient-text-miku not-italic">small software</em>
        <br />
        with big feelings ♪
      </h1>

      <p className="relative font-body text-ink-2 text-base leading-relaxed max-w-xl mt-4">
        Electron shells, typed backends, careful empty states. I care about the
        edges — the focus ring, the 404 page, the second click. Sprinkle love
        on everything.
      </p>

      <div className="relative flex flex-wrap gap-1.5 mt-5">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full border border-rule bg-surf-0 text-xs font-mono text-ink-2"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <button
          type="button"
          onClick={onOpenProjects}
          className="bg-gradient-to-r from-miku to-pink text-cloud rounded-lg px-4 py-2 font-semibold text-sm flex items-center gap-2"
        >
          open projects
          <kbd className="font-mono text-[10px] bg-cloud/20 rounded px-1">⏎</kbd>
        </button>
        <button
          type="button"
          onClick={onOpenCmd}
          className="bg-surf-0 border border-rule-2 rounded-lg px-4 py-2 text-sm flex items-center gap-2 text-ink"
        >
          command palette
          <kbd className="font-mono text-[10px] bg-surf-solid/80 rounded px-1">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="relative flex items-center gap-3 mt-6 pt-5 border-t border-dashed border-miku/30">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-rule-2 bg-miku/15 shadow-[0_4px_12px_rgba(57,197,187,0.35)]">
          <Image
            src="/mascot.png"
            alt=""
            width={80}
            height={80}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col">
          <strong className="font-display text-sm font-bold text-ink">
            Kacper · @shironex
          </strong>
          <span className="font-mono text-xs text-ink-4">
            junior full-stack · 4+ yrs · replying within a day ♪
          </span>
        </div>
      </div>

      <div className="relative">
        <GithubActivityStrip />
      </div>
    </div>
  )
}
