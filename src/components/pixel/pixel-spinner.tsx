'use client'

import { useEffect, useState } from 'react'

import { schedule } from '@/lib/os/ticker'

import { PIXEL_GLYPHS, PixelIcon } from './pixel-icon.generated'

/** How often a held spinner looks again whether it may turn. */
const HELD_RECHECK_MS = 500

/**
 * The 4-frame `spinner` glyph turning on the shared ticker, at the frame
 * times it was drawn with. It holds its first frame under reduced motion
 * and the Pause animations setting (`data-motion` on <html>). Decorative:
 * the control it sits in says what is happening.
 */
export function PixelSpinner({ className }: { className?: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const { ms } = PIXEL_GLYPHS.spinner
    const html = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const held = () => reduced.matches || html.dataset.motion === 'paused'
    let at = 0
    const task = schedule(
      {
        run: (now) => {
          if (held()) {
            at = 0
            setFrame(0)
            return now + HELD_RECHECK_MS
          }
          at = (at + 1) % ms.length
          setFrame(at)
          return now + ms[at]
        },
      },
      performance.now() + ms[0]
    )
    return () => task.cancel()
  }, [])

  return <PixelIcon name="spinner" frame={frame} className={className} />
}
