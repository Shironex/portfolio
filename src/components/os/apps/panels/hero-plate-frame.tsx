import type { ReactNode } from 'react'

import { HeroText } from '@/components/os/hero-text'
import { Kbd } from '@/components/os/kbd'
import type { HeadingLevel } from '@/components/os/types'
import { MascotHead } from '@/components/pixel/mascot-head'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { PET_PERCH } from '@/lib/os/pets'
import { cn } from '@/lib/utils'

/** The two calls to action share their look; only the handlers differ. */
const CTA_CLASS =
  'focus-ring text-title flex h-18 items-center gap-4 px-5 pointer-coarse:h-(--target)'

/**
 * The activity strip's slot: about 53 art px, more than a desktop under 436
 * art px tall has to spare (`short-desk`: 1440x900 at DPR 1.25, any laptop
 * with a browser bar at 900), so it drops there and the hero stays clear of
 * the taskbar. The phone feed keeps it.
 */
export const HERO_STRIP_CLASS = 'md:short-desk:hidden'

export interface HeroPlateFrameProps {
  headingLevel?: HeadingLevel
  /** `Get in touch`; without it the button is a still copy (the server hero). */
  onOpenContact?: () => void
  /** `Command palette`; as above. */
  onOpenCmd?: () => void
  /** Whether the mascot head blinks. */
  animated?: boolean
  /** The activity strip, under the author row. */
  children?: ReactNode
  className?: string
  /** Whether the desktop pet can stand on its top edge (the shell's hero). */
  perch?: boolean
}

/**
 * The hero panel (SPEC 1.4): a `panel` 9-slice holding the hero text, the
 * two calls to action as pixel buttons with keycaps (an `enter` glyph, since
 * neither font has a return sign), a dotted rule and the author row with the
 * 16x16 mascot head.
 *
 * No hooks, so the server `StaticHero` renders the same panel the shell
 * does (SPEC 4.5); the shell passes the handlers and the activity strip.
 */
export function HeroPlateFrame({
  headingLevel,
  onOpenContact,
  onOpenCmd,
  animated = true,
  children,
  className,
  perch = false,
}: HeroPlateFrameProps) {
  const still = !onOpenContact
  return (
    <div
      {...(perch ? PET_PERCH : undefined)}
      className={cn('px-panel flex flex-col p-10', className)}
    >
      <HeroText headingLevel={headingLevel} />

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onOpenContact}
          tabIndex={still ? -1 : undefined}
          className={cn(
            CTA_CLASS,
            'os-night px-button-primary text-(--ground)'
          )}
        >
          Get in touch
          <Kbd tone="accent" className="pointer-coarse:hidden">
            <PixelIcon name="enter" />
          </Kbd>
        </button>
        <button
          type="button"
          onClick={onOpenCmd}
          tabIndex={still ? -1 : undefined}
          className={cn(CTA_CLASS, 'os-night px-button-secondary text-(--ink)')}
        >
          {/* Keyboard hints are noise on touch: relabel to what it does there. */}
          <span className="pointer-coarse:hidden">Command palette</span>
          <span className="hidden pointer-coarse:inline">Search</span>
          <Kbd className="pointer-coarse:hidden">⌘K</Kbd>
        </button>
      </div>

      <div aria-hidden className="rule-dotted mt-6" />
      <div className="mt-5 flex items-center gap-4">
        <MascotHead animated={animated} />
        <div className="min-w-0">
          <p className="text-title truncate text-(--ink)">
            Kacper Lachowicz · @shironex
          </p>
          <p className="text-label truncate text-(--meta)">
            Remote · CET · replies within 24h
          </p>
        </div>
      </div>

      {children}
    </div>
  )
}
