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
    <div className="border-rule-2 bg-surf-solid shadow-elev-3 relative flex h-full w-full flex-col overflow-hidden rounded-3xl border px-5 py-6 md:px-8 md:py-7">
      <span
        aria-hidden
        className="animate-floaty pointer-events-none absolute -top-16 -right-10 size-56 rounded-full opacity-60 blur-3xl motion-reduce:animate-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-miku-3), transparent 70%)',
        }}
      />

      <div className="text-ink-3 relative mb-3 font-mono text-[11px]">
        Junior full-stack · Gdańsk, PL
      </div>

      <h1 className="font-display text-ink relative text-[clamp(32px,8vw,44px)] leading-[1.05] font-bold tracking-[-0.02em] md:text-[clamp(40px,4.6vw,60px)]">
        hi, I&apos;m Kacper.
        <br />I build Electron apps and typed full-stack systems.
      </h1>

      <p className="font-body text-ink-2 relative mt-3 max-w-xl text-[15px] leading-relaxed">
        AutoMaker passed 3k stars with a team of four. Omniscribe runs twelve
        parallel Claude sessions on my laptop without setting it on fire. This
        portfolio is the third tool in that line.
      </p>

      <div className="relative mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenContact}
          className="focus-ring bg-miku text-cloud hover:bg-miku-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          Say hi
          <kbd className="bg-cloud/20 rounded px-1 font-mono text-[11px]">
            ⏎
          </kbd>
        </button>
        <button
          type="button"
          onClick={onOpenCmd}
          className="focus-ring bg-surf-0 border-rule-2 text-ink hover:bg-surf-soft flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Command palette
          <kbd className="bg-surf-solid/80 rounded px-1 font-mono text-[11px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="border-rule relative mt-4 flex items-center gap-3 border-t pt-4">
        <div className="border-rule-2 bg-miku/15 relative size-9 shrink-0 overflow-hidden rounded-full border">
          <Image
            src="/mascot.png"
            alt=""
            width={72}
            height={72}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col">
          <strong className="font-display text-ink text-sm font-bold">
            Kacper · @shironex
          </strong>
          <span className="text-ink-4 font-mono text-xs">
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
