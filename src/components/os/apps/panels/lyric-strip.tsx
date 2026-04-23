'use client'

import { useEffect, useState } from 'react'

const LYRICS = [
  'midnight is honest, the keyboard agrees',
  'we keep the volume low for the cat',
  'the chorus arrives at exactly 3:14',
  'outside, the rain is mostly metaphor',
  'and nothing is recommended to us',
] as const

export function LyricStrip() {
  const [active, setActive] = useState(2)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % LYRICS.length)
    }, 2400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div aria-hidden className="grid gap-1 font-body text-[11px]">
      {LYRICS.map((line, index) => {
        const distance = Math.abs(index - active)
        const isActive = index === active
        const isDim = distance > 1
        return (
          <div
            key={line}
            className={`border-l-2 pl-2 py-0.5 transition-all duration-500 ${
              isActive
                ? 'border-miku text-ink font-medium translate-x-0.5'
                : isDim
                  ? 'border-transparent text-ink-4 opacity-50'
                  : 'border-transparent text-ink-3'
            }`}
          >
            {line}
          </div>
        )
      })}
    </div>
  )
}
