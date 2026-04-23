import Image from 'next/image'

/**
 * about.me window — bio, hobby cards, timeline.
 * Ported from new-design/components/apps.jsx `function AboutApp()`.
 */

interface Hobby {
  icon: string
  title: string
  desc: string
  accent: 'pink' | 'lav' | 'peach' | 'miku'
}

const hobbies: Hobby[] = [
  {
    icon: '♪',
    title: 'Music',
    desc: 'lofi to black metal. always shuffling.',
    accent: 'pink',
  },
  {
    icon: '◆',
    title: "Rubik's cubes",
    desc: 'sub-2-minute on a good day.',
    accent: 'lav',
  },
  {
    icon: '🏍',
    title: 'CFMoto 450 SSR',
    desc: "saving up. one day she's mine.",
    accent: 'peach',
  },
  {
    icon: '▣',
    title: 'Anime',
    desc: 'enough that I built a tracker for it.',
    accent: 'miku',
  },
]

const hobbyAccent: Record<Hobby['accent'], string> = {
  pink: 'text-pink-2',
  lav: 'text-lav',
  peach: 'text-peach',
  miku: 'text-miku-2',
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
        <div className="relative size-20 shrink-0 overflow-hidden rounded-3xl border border-rule-2 bg-miku/15 shadow-[0_10px_30px_-8px_rgba(255,95,168,0.5)]">
          <Image
            src="/mascot.png"
            alt=""
            width={160}
            height={160}
            className="size-full object-contain"
          />
        </div>
        <div>
          <div className="font-mono text-xs text-miku tracking-[0.1em] uppercase mb-1">
            ✧ hello, friend
          </div>
          <h2 className="font-display text-2xl text-ink font-semibold tracking-tight mb-2">
            I&apos;m{' '}
            <em className="gradient-text-miku not-italic font-bold">Kacper</em>{' '}
            — I make small software
          </h2>
          <p className="text-sm text-ink-2 leading-relaxed">
            A junior full-stack developer in Gdańsk, PL. I turn ideas into tools
            for myself, my friends, and my family.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="font-display text-lg text-ink mb-2">
          ♪ what I care about
        </h3>
        <p className="text-sm text-ink-2 leading-relaxed">
          Electron shells, typed backends, careful empty states. The focus ring,
          the 404 page, the second click.{' '}
          <em className="not-italic font-semibold text-ink">
            Small, opinionated software
          </em>{' '}
          — the kind you can hold in your head.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="font-display text-lg text-ink mb-3">
          ✧ things that make me go
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {hobbies.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-rule bg-surf-0 p-4 shadow-[0_2px_6px_rgba(57,197,187,0.08)]"
            >
              <div className={`text-xl mb-1 ${hobbyAccent[h.accent]}`}>
                {h.icon}
              </div>
              <div className="font-display text-sm font-bold text-ink">
                {h.title}
              </div>
              <div className="text-xs text-ink-3 font-medium mt-0.5">
                {h.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg text-ink mb-3">♪ the timeline</h3>
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
