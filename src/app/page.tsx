import { Suspense } from 'react'

import { preload } from 'react-dom'

import {
  ACTIVITY_STRIP_CLASS,
  ActivityHeader,
  ActivitySkeleton,
} from '@/components/os/apps/panels/github-activity-frame'
import {
  HERO_STRIP_CLASS,
  HeroPlateFrame,
} from '@/components/os/apps/panels/hero-plate-frame'
import { MOBILE_GUTTER_CLASS } from '@/components/os/constants'
import {
  DESKTOP_CONTENT_CLASS,
  DESKTOP_HERO_CLASS,
  DESKTOP_PANELS_CLASS,
  DESKTOP_ROW_CLASS,
} from '@/components/os/desktop-layout'
import OsShell from '@/components/os/os-shell'
import { WallpaperStatic } from '@/components/os/wallpaper/wallpaper-static'

import { cn } from '@/lib/utils'

import appIcons16 from '@/assets/pixel/icons/app-icons-16.png'
import appIcons32 from '@/assets/pixel/icons/app-icons-32.png'

/**
 * Static server-rendered hero. OsShell is a client component that bails
 * the route to CSR, so without this the first paint is blank. Keeping the
 * hero in page.tsx (not in the Suspense fallback) means it survives
 * hydration: the h1 stays in the DOM as OsShell mounts a fixed-position
 * overlay on top of it. LCP fires on this h1, not on post-hydration
 * content.
 *
 * It is the desktop's first frame (SPEC 4.5): the wallpaper's static frame
 * and the hero panel where the shell puts them (`desktop-layout.ts`), or on
 * a phone the hero at the top of the feed. The activity strip shows its
 * loading frame, and the panels come with the shell.
 *
 * Paint only: a plain `aria-hidden` div, so the page's one `<main>` and one
 * exposed `h1` are the shell's.
 */
function StaticHero() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 isolate overflow-hidden bg-(--ground) text-(--ink)"
      data-ssr-hero
    >
      <div className="absolute inset-x-0 top-0 -z-1 h-dvh overflow-hidden max-md:hidden">
        <WallpaperStatic />
      </div>
      <div
        className={cn(
          DESKTOP_CONTENT_CLASS,
          'max-md:pt-[calc(3rem+env(safe-area-inset-top)+8*var(--px))] max-md:pb-0',
          MOBILE_GUTTER_CLASS,
          'md:pr-6 md:pl-58'
        )}
      >
        <div className={DESKTOP_ROW_CLASS}>
          <HeroPlateFrame
            animated={false}
            className={cn(
              DESKTOP_HERO_CLASS,
              'max-md:max-h-none max-md:max-w-none'
            )}
          >
            {/* The strip as it loads, and the panels' room, so the hero is
                the size and shape the shell's will be. */}
            <div className={HERO_STRIP_CLASS}>
              <div className={ACTIVITY_STRIP_CLASS}>
                <ActivityHeader total={null} />
                <ActivitySkeleton still />
              </div>
            </div>
          </HeroPlateFrame>
          <div className={cn(DESKTOP_PANELS_CLASS, 'max-md:hidden')} />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  // The app icon sheets (the taskbar, the desktop, title bars) start with
  // the page instead of after the shell mounts and its CSS asks for them.
  preload(appIcons16.src, { as: 'image' })
  preload(appIcons32.src, { as: 'image' })
  return (
    <>
      <StaticHero />
      <Suspense fallback={null}>
        <OsShell />
      </Suspense>
    </>
  )
}
