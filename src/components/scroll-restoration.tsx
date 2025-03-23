'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [pathname])

  return null
}
