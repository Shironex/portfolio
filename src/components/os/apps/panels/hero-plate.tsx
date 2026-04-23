'use client'

import Image from 'next/image'

import { GithubActivityStrip } from './github-activity-strip'

interface HeroPlateProps {
  onOpenCmd: () => void
  onOpenContact: () => void
}

/**
 * HeroPlate — large hero card that sits on the desktop canvas behind the
 * windows. Carries the name, the one-line what-I-build, the primary CTAs,
 * and the GitHub contribution strip underneath. Vertical density is tight
 * on purpose — the activity strip needs to stay above the fold on 1080p
 * at 100% zoom.
 */
export function HeroPlate({ onOpenCmd, onOpenContact }: HeroPlateProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-rule-2 bg-surf-solid px-5 py-6 md:px-8 md:py-7 shadow-elev-3">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full opacity-60 blur-3xl animate-floaty motion-reduce:animate-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-miku-3), transparent 70%)',
        }}
      />

      <div className="relative font-mono text-[11px] text-ink-3 mb-3">
        Junior full-stack · Gdańsk, PL
      </div>

      <h1 className="relative font-display text-[clamp(32px,8vw,44px)] md:text-[clamp(40px,4.6vw,60px)] leading-[1.05] tracking-[-0.02em] text-ink font-bold">
        hi, I&apos;m Kacper.
        <br />I build Electron apps and typed full-stack systems.
      </h1>

      <p className="relative font-body text-ink-2 text-[15px] leading-relaxed max-w-xl mt-3">
        AutoMaker passed 3k stars with a team of four. Omniscribe runs twelve
        parallel Claude sessions on my laptop without setting it on fire. This
        portfolio is the third tool in that line.
      </p>

      <div className="relative flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={onOpenContact}
          className="focus-ring bg-miku text-cloud rounded-lg px-4 py-2 font-semibold text-sm flex items-center gap-2 hover:bg-miku-2 transition-colors"
        >
          Say hi
          <kbd className="font-mono text-[11px] bg-cloud/20 rounded px-1">
            ⏎
          </kbd>
        </button>
        <button
          type="button"
          onClick={onOpenCmd}
          className="focus-ring bg-surf-0 border border-rule-2 rounded-lg px-4 py-2 text-sm flex items-center gap-2 text-ink hover:bg-surf-soft transition-colors"
        >
          Command palette
          <kbd className="font-mono text-[11px] bg-surf-solid/80 rounded px-1">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="relative flex items-center gap-3 mt-4 pt-4 border-t border-rule">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-rule-2 bg-miku/15">
          <Image
            src="/mascot.png"
            alt=""
            width={72}
            height={72}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col">
          <strong className="font-display text-sm font-bold text-ink">
            Kacper · @shironex
          </strong>
          <span className="font-mono text-xs text-ink-4">
            Four years of TypeScript · replies within 24h
          </span>
        </div>
      </div>

      <div className="relative">
        <GithubActivityStrip />
      </div>
    </div>
  )
}
