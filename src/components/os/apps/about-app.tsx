import Image from 'next/image'

import { Bike, Film, Music, Puzzle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

export default function AboutApp() {
  return (
    <div className="font-body max-w-3xl">
      <div className="mb-8 flex items-start gap-5">
        <div className="border-rule-2 bg-miku/15 shadow-elev-2 relative size-20 shrink-0 overflow-hidden rounded-3xl border">
          <Image
            src="/mascot.png"
            alt=""
            width={160}
            height={160}
            className="size-full object-contain"
          />
        </div>
        <div>
          <h2 className="font-display text-ink mb-2 text-2xl font-semibold tracking-tight">
            I&apos;m <em className="text-ink font-bold not-italic">Kacper</em> —
            junior full-stack, Gdańsk, PL
          </h2>
          <p className="text-ink-2 text-sm leading-relaxed">
            Four years in, mostly TypeScript, with a soft spot for Electron. I
            build the tools I wanted to use: a file renamer that turned into
            AutoMaker, a multi-session CLI that turned into Omniscribe.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="font-display text-ink mb-2 text-lg font-semibold">
          What I ship
        </h3>
        <p className="text-ink-2 text-sm leading-relaxed">
          Desktop apps with Electron, typed backends on Node and NestJS, Next.js
          App Router for the web. I spend more than the usual amount of time on
          the parts most people skip —{' '}
          <em className="text-ink font-semibold not-italic">
            empty states, 404s, focus rings
          </em>
          . The second click matters.
        </p>
      </section>

      <section>
        <h3 className="font-display text-ink mb-3 text-lg font-semibold">
          Outside the editor
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {hobbies.map((h) => {
            const Icon = h.icon
            return (
              <div
                key={h.title}
                className="border-rule bg-surf-0 shadow-elev-1 rounded-2xl border p-4"
              >
                <div className={`mb-2 ${hobbyTint[h.tint]}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="font-display text-ink text-sm font-bold">
                  {h.title}
                </div>
                <div className="text-ink-3 mt-0.5 text-xs font-medium">
                  {h.desc}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
