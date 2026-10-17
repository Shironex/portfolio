import { Suspense } from 'react'
import { preload } from 'react-dom'

import { HeroText } from '@/components/os/hero-text'
import OsShell from '@/components/os/os-shell'

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
 * Paint only: a plain `aria-hidden` div, so the page's one `<main>` and one
 * exposed `h1` are the shell's.
 */
function StaticHero() {
  return (
    <div
      aria-hidden
      className="text-ink fixed inset-0 overflow-hidden"
      data-ssr-hero
    >
      <div className="relative flex min-h-dvh flex-col px-12 pt-28 pb-48 md:pr-16 md:pl-64 lg:pr-32 lg:pl-72 xl:pr-48 xl:pl-80">
        <div className="grid flex-1 gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
          <div className="border-rule-2 bg-surf-solid shadow-elev-3 relative flex size-full flex-col overflow-hidden rounded-3xl border px-10 py-12 md:px-16 md:py-14">
            <HeroText />
          </div>
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
