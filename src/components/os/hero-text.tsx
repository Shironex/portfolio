import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import type { HeadingLevel } from './types'

const HERO_COPY = {
  eyebrow: 'Full-stack developer · TypeScript + Rust · remote, CET',
  greeting: "hi, I'm Kacper.",
  availability:
    'Open to full-time remote roles and to contracts or MVPs. Based in Poland, working on CET (UTC+1).',
  proof: [
    'Shiranami 2.0: moved my music player from Electron to Rust + Tauri, installer from 110 MB to 12.5 MB.',
    'AutoMaker: I was the #1 contributor to an open-source AI dev studio (3k+ stars).',
    '@noctcore/eslint-plugins: 13 packages, 110+ rules for bugs code review kept catching.',
  ],
} as const

interface HeroTextProps {
  /**
   * Level of the headline. The page `h1` everywhere except on a route whose
   * own content already has one, where it steps down to `h2`.
   */
  headingLevel?: HeadingLevel
}

/**
 * Text block of the hero (SPEC 1.4): the role line in meta grey, the
 * headline in lamp lettering (`text-display`, 36px on the desktop) with its
 * 1 art px shadow, and the availability and proof points in `text-body`
 * with a pixel chevron. Rendered by both the server StaticHero and the
 * client HeroPlate so the first paint matches the hydrated desktop.
 */
export function HeroText({ headingLevel = 1 }: HeroTextProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <>
      <p className="text-label text-(--meta)">{HERO_COPY.eyebrow}</p>

      <Heading className="text-display lamp-heading mt-4">
        {HERO_COPY.greeting}
        <br />I build typed{' '}
        <span className="whitespace-nowrap">full-stack</span> systems and
        desktop apps.
      </Heading>

      <p className="text-body mt-5 text-(--ink)">{HERO_COPY.availability}</p>

      {/* A column that wraps: on a desktop too short for the whole hero the
          list is squeezed, and the lines that do not fit wrap into a
          second column out of sight, whole, from the last one up. */}
      <ul className="text-body mt-4 flex min-h-0 flex-col flex-wrap gap-2 overflow-hidden text-(--meta)">
        {HERO_COPY.proof.map((line) => (
          <li key={line} className="flex w-full gap-3">
            <PixelIcon
              name="chevron-right"
              aria-hidden
              className="mt-3 flex-none text-(--accent-warm-icon)"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
