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
          <h2 className="font-display text-ink mb-2 text-3xl font-semibold tracking-tight">
            I&apos;m <em className="text-ink font-bold not-italic">Kacper</em>,
            a full-stack developer from Poland
          </h2>
          <p className="text-ink-2 text-sm leading-relaxed">
            I work in TypeScript and Rust, remotely, on CET (UTC+1). Most of
            what I build started as a tool I wanted for myself: a music player I
            later rewrote from Electron to Rust, a desktop app for running AI
            coding sessions in parallel, ESLint plugins for the bugs code review
            kept catching.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="font-display text-ink mb-2 text-lg font-semibold">
          What I work on
        </h3>
        <p className="text-ink-2 text-sm leading-relaxed">
          Desktop apps with Rust and Tauri or Electron, typed backends on Node
          (NestJS, tRPC) with PostgreSQL, and React frontends. I spend more than
          the usual amount of time on the parts most people skip:{' '}
          <em className="text-ink font-semibold not-italic">
            empty states, 404s, focus rings
          </em>
          . The second click matters.
        </p>
        <p className="text-ink-2 mt-3 text-sm leading-relaxed">
          For more than two years I have self-hosted everything I run: Coolify
          on Hetzner and OVH, Cloudflare Tunnels, Tailscale, S3-compatible
          storage, and my own DNS and mail. Before that I used AWS with
          Terraform.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="font-display text-ink mb-2 text-lg font-semibold">
          Recent work
        </h3>
        <ul className="text-ink-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          <li>
            <span className="text-ink font-semibold">Shiranami 2.0</span>: moved
            my music player from Electron to a Rust core in Tauri. The Windows
            installer went from 110 MB to 12.5 MB and idle memory from about 688
            MB to about 291 MB, with 1,500+ Rust tests and no user data lost.
          </li>
          <li>
            <span className="text-ink font-semibold">AutoMaker</span>: I was the
            #1 contributor to this open-source AI development studio, which
            passed 3,000 GitHub stars.
          </li>
          <li>
            <span className="text-ink font-semibold">
              @noctcore/eslint-plugins
            </span>
            : 13 packages with 110+ rules for cross-file boundaries, IO
            contracts and production-only bugs.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="font-display text-ink mb-2 text-lg font-semibold">
          Working with me
        </h3>
        <p className="text-ink-2 text-sm leading-relaxed">
          I&apos;m open to full-time remote roles and to contracts or MVPs. I
          work in English (C1) and Polish. Remote from Poland, CET (UTC+1).
        </p>
      </section>

      <section>
        <h3 className="font-display text-ink mb-3 text-lg font-semibold">
          Outside the editor
        </h3>
        <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
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
