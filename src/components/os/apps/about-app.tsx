'use client'

/**
 * about.me window, in pixels (SPEC 1.5): the README `hi` banner as the
 * heading's picture, the mascot as the portrait (the pet's first idle frame
 * at 2x), long text at the readable measure, the open source panel and the
 * hobbies with their glyphs; the motorbike is the mini-me on her parked bike.
 * Opening it asks the desktop pet to wave (SPEC 3.2).
 */
import { type ReactNode, useEffect } from 'react'

import { accentIcon } from '@/components/os/accent-map'
import type { AccentRole } from '@/components/os/accent-map'
import { PROSE_CLASS } from '@/components/os/constants'
import { PetStill, RideStill } from '@/components/pixel/pet-stills'
import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

import { requestPetWave } from '@/lib/os/pets'

import banners from '@/assets/pixel/banners/readme-headers.png'
import '@/styles/sprites/readme-headers.css'

import { OpenSourcePanel } from './panels/open-source-panel'

interface Hobby {
  icon: PixelIconName
  title: string
  desc: string
  accent: AccentRole
  /** A picture in place of the glyph: the mini-me on her bike. */
  ride?: boolean
}

const hobbies: Hobby[] = [
  {
    icon: 'note',
    title: 'Music',
    desc: 'Lofi to black metal. Always shuffling.',
    accent: 'primary',
  },
  {
    icon: 'puzzle',
    title: "Rubik's cubes",
    desc: 'Sub-2-minute on a good day.',
    accent: 'deep',
  },
  {
    icon: 'motorbike',
    title: 'CFMoto 450 SSR',
    desc: "Saving up. One day she's mine.",
    accent: 'warm',
    ride: true,
  },
  {
    icon: 'film',
    title: 'Anime',
    desc: 'Enough that I built a tracker for it.',
    accent: 'bright',
  },
]

/** Emphasis inside running text: the bold weight, no italics. */
function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-(--ink-hi)">{children}</strong>
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-heading lamp-heading">{title}</h3>
      {children}
    </section>
  )
}

export default function AboutApp() {
  useEffect(() => {
    requestPetWave()
  }, [])

  return (
    <div className="@container flex flex-col gap-8">
      <header className="flex flex-col items-start gap-5 @min-[30rem]:flex-row">
        {/* The portrait: the pet's first idle frame at 2x on a night plate. */}
        <span className="os-night px-panel block flex-none p-2">
          <span className="px-scale-2 block">
            <PetStill pose="idle" />
          </span>
        </span>
        {/* Stretched across in the column, so on a 320 css phone the
            banner's sparkle tail is cut at the edge, not the text pushed
            past it. */}
        <div className="flex min-w-0 flex-col items-start gap-3 self-stretch">
          <span
            aria-hidden
            className="os-night px-readme-headers px-readme-headers-hi ambient-loop block max-w-full flex-none animate-(--px-loop)"
            style={{ backgroundImage: `url(${banners.src})` }}
          />
          <h2 className="sr-only">Hi, I&apos;m Kacper</h2>
          <p className="text-title text-(--ink)">
            A full-stack developer from Poland.
          </p>
          <p className={PROSE_CLASS}>
            I work in TypeScript and Rust, remotely, on CET (UTC+1). Most of
            what I build started as a tool I wanted for myself: a music player I
            later rewrote from Electron to Rust, a desktop app for running AI
            coding sessions in parallel, ESLint plugins for the bugs code review
            kept catching.
          </p>
        </div>
      </header>

      <Section title="What I work on">
        <p className={PROSE_CLASS}>
          Desktop apps with Rust and Tauri or Electron, typed backends on Node
          (NestJS, tRPC) with PostgreSQL, and React frontends. I spend more than
          the usual amount of time on the parts most people skip:{' '}
          <Strong>empty states, 404s, focus rings</Strong>. The second click
          matters.
        </p>
        <p className={PROSE_CLASS}>
          For more than two years I have self-hosted everything I run: Coolify
          on Hetzner and OVH, Cloudflare Tunnels, Tailscale, S3-compatible
          storage, and my own DNS and mail. Before that I used AWS with
          Terraform.
        </p>
      </Section>

      <Section title="Recent work">
        <ul className="flex max-w-[66ch] flex-col gap-2">
          {[
            <>
              <Strong>Shiranami 2.0</Strong>: moved my music player from
              Electron to a Rust core in Tauri. The Windows installer went from
              110 MB to 12.5 MB and idle memory from about 688 MB to about 291
              MB, with 1,500+ Rust tests and no user data lost.
            </>,
            <>
              <Strong>AutoMaker</Strong>: I was the #1 contributor to this
              open-source AI development studio, which passed 3,000 GitHub
              stars.
            </>,
            <>
              <Strong>@noctcore/eslint-plugins</Strong>: 13 packages with 110+
              rules for cross-file boundaries, IO contracts and production-only
              bugs.
            </>,
          ].map((item, i) => (
            <li
              key={i}
              className="text-prose flex items-start gap-3 text-(--ink)"
            >
              <PixelIcon
                name="chevron-right"
                className="mt-3 text-(--accent-primary-icon)"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Open source">
        <OpenSourcePanel />
      </Section>

      <Section title="Working with me">
        <p className={PROSE_CLASS}>
          I&apos;m open to full-time remote roles and to contracts or MVPs. I
          work in English (C1) and Polish. Remote from Poland, CET (UTC+1).
        </p>
      </Section>

      <Section title="Outside the editor">
        <ul className="grid grid-cols-1 gap-3 @min-[28rem]:grid-cols-2">
          {hobbies.map((h) => (
            <li key={h.title} className="px-card flex items-start gap-3 p-3">
              {h.ride ? (
                <span className="os-night px-label-plate block flex-none p-1">
                  <RideStill />
                </span>
              ) : (
                <span
                  aria-hidden
                  className="os-night px-label-plate flex size-14 flex-none items-center justify-center"
                  style={{ color: accentIcon(h.accent) }}
                >
                  <PixelIcon name={h.icon} />
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-title text-(--ink)">{h.title}</span>
                <span className="text-prose text-(--meta)">{h.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
