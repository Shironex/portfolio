import { Bike, Film, Music, Puzzle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface Hobby {
  icon: LucideIcon
  title: string
  desc: string
  tint: 'teal' | 'teal-deep' | 'teal-light' | 'ochre'
}

const hobbies: Hobby[] = [
  {
    icon: Music,
    title: 'Music',
    desc: 'Lofi to black metal. Always shuffling.',
    tint: 'teal',
  },
  {
    icon: Puzzle,
    title: "Rubik's cubes",
    desc: 'Sub-2-minute on a good day.',
    tint: 'teal-deep',
  },
  {
    icon: Bike,
    title: 'CFMoto 450 SSR',
    desc: "Saving up. One day she's mine.",
    tint: 'ochre',
  },
  {
    icon: Film,
    title: 'Anime',
    desc: 'Enough that I built a tracker for it.',
    tint: 'teal-light',
  },
]

const hobbyTint: Record<Hobby['tint'], string> = {
  teal: 'text-miku',
  'teal-deep': 'text-miku-2',
  'teal-light': 'text-miku-3',
  ochre: 'text-peach',
}

const timeline: Array<[string, string, string]> = [
  ['2022', 'First line shipped', 'A button that did a thing. I was hooked.'],
  [
    '2023',
    'Junior at a Next.js shop',
    'Client work, real users, real deadlines.',
  ],
  ['2024', 'Started open-sourcing', 'AutoMaker hit 3k stars. Team of 4.'],
  [
    '2025',
    'Daily driver: Omniscribe',
    '12 parallel Claude sessions. No terminal chaos.',
  ],
  ['now', 'Available Q2 2026', 'Freelance, full-time, or just to talk.'],
]

export default function AboutApp() {
  return (
    <div className="max-w-3xl font-body">
      <div className="flex items-start gap-5 mb-8">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-3xl border border-rule-2 bg-miku/15 shadow-elev-2">
          <Image
            src="/mascot.png"
            alt=""
            width={160}
            height={160}
            className="size-full object-contain"
          />
        </div>
        <div>
          <h2 className="font-display text-2xl text-ink font-semibold tracking-tight mb-2">
            I&apos;m <em className="not-italic font-bold text-ink">Kacper</em>{' '}
            — junior full-stack, Gdańsk, PL
          </h2>
          <p className="text-sm text-ink-2 leading-relaxed">
            Four years in, mostly TypeScript, with a soft spot for Electron.
            I build the tools I wanted to use: a file renamer that turned into
            AutoMaker, a multi-session CLI that turned into Omniscribe.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="font-display text-lg font-semibold text-ink mb-2">
          What I ship
        </h3>
        <p className="text-sm text-ink-2 leading-relaxed">
          Desktop apps with Electron, typed backends on Node and NestJS,
          Next.js App Router for the web. I spend more than the usual amount
          of time on the parts most people skip —{' '}
          <em className="not-italic font-semibold text-ink">
            empty states, 404s, focus rings
          </em>
          . The second click matters.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="font-display text-lg font-semibold text-ink mb-3">
          Outside the editor
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {hobbies.map((h) => {
            const Icon = h.icon
            return (
              <div
                key={h.title}
                className="rounded-2xl border border-rule bg-surf-0 p-4 shadow-elev-1"
              >
                <div className={`mb-2 ${hobbyTint[h.tint]}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="font-display text-sm font-bold text-ink">
                  {h.title}
                </div>
                <div className="text-xs text-ink-3 font-medium mt-0.5">
                  {h.desc}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold text-ink mb-3">
          Timeline
        </h3>
        <div className="flex flex-col gap-3 font-mono text-[13px]">
          {timeline.map(([year, title, desc]) => (
            <div
              key={year}
              className="grid grid-cols-[60px_1fr] gap-4 items-baseline"
            >
              <div className="text-miku-2 font-bold">{year}</div>
              <div>
                <strong className="text-ink font-semibold">{title}</strong>
                <p className="text-ink-2 text-xs mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
