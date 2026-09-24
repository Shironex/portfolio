import { Suspense } from 'react'

import { HeroText } from '@/components/os/hero-text'
import OsShell from '@/components/os/os-shell'

/**
 * Static server-rendered hero. OsShell is a client component that bails
 * the route to CSR, so without this the first paint is blank. Keeping the
 * hero in page.tsx (not in the Suspense fallback) means it survives
 * hydration: the h1 stays in the DOM as OsShell mounts a fixed-position
 * overlay on top of it. LCP fires on this h1, not on post-hydration
 * content.
 */
function StaticHero() {
  return (
    <main
      aria-hidden
      className="text-ink fixed inset-0 overflow-hidden"
      data-ssr-hero
    >
      <div className="relative flex min-h-screen flex-col px-6 pt-14 pb-24 md:pr-8 md:pl-32 lg:pr-16 lg:pl-36 xl:pr-24 xl:pl-40">
        <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
          <div className="border-rule-2 bg-surf-solid shadow-elev-3 relative flex h-full w-full flex-col overflow-hidden rounded-3xl border px-5 py-6 md:px-8 md:py-7">
            <HeroText />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function HomePage() {
  return (
    <>
      <StaticHero />
      <Suspense fallback={null}>
        <OsShell />
      </Suspense>
    </>
  )
}
