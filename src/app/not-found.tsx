import type { Metadata } from 'next'

import { NotFoundScreen } from '@/components/not-found-screen'

// A server wrapper, so the 404 gets its own title instead of the home one.
// The root metadata says "index, follow" and points the canonical at the home
// page; neither is true here, so both are overridden.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
  alternates: { canonical: null },
}

export default function NotFound() {
  return <NotFoundScreen />
}
