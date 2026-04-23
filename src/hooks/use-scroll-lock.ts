'use client'

import { useEffect } from 'react'

let lockCount = 0
let previousOverflow: string | null = null

/**
 * Lock `document.body` scroll while mounted. Ref-counted so stacked modals
 * don't fight over the `overflow` style — only the last unmount restores it.
 */
export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return
    if (typeof document === 'undefined') return

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow ?? ''
        previousOverflow = null
      }
    }
  }, [active])
}
