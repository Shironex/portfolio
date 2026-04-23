'use client'

import { useEffect, useState } from 'react'

import { TERMINAL_BLOCKS } from '@/components/os/constants'

/**
 * TerminalPanel — static zsh-style transcript that surfaces three concrete
 * claims (who, what, when). Lines reveal in sequence with a short stagger
 * on mount, then settle into a solid readable state.
 */
export function TerminalPanel() {
  const [revealed, setRevealed] = useState(0)
  const totalLines = TERMINAL_BLOCKS.reduce(
    (n, b) => n + 1 + b.output.length,
    0
  )

  useEffect(() => {
    if (revealed >= totalLines) return
    const t = setTimeout(() => setRevealed((n) => n + 1), 180)
    return () => clearTimeout(t)
  }, [revealed, totalLines])

  let cursor = 0

  return (
    <div className="border-rule-2 bg-surf-solid overflow-hidden rounded-2xl border">
      <div className="border-rule bg-surf-soft flex items-center gap-3 border-b px-3 py-2">
        <span className="text-ink flex-1 font-mono text-xs font-bold">
          ~/kacper — zsh
        </span>
      </div>

      <div className="text-ink-2 min-h-[200px] p-4 font-mono text-xs">
        {TERMINAL_BLOCKS.map((block, blockIdx) => {
          const promptIdx = cursor
          cursor += 1
          const outputIndices = block.output.map(() => cursor++)
          const isLast = blockIdx === TERMINAL_BLOCKS.length - 1
          return (
            <div
              key={block.prompt}
              className={blockIdx > 0 ? 'mt-3' : undefined}
            >
              {revealed > promptIdx && (
                <div className="motion-safe:animate-term-in">
                  <span className="text-miku-2 font-bold">~/kacper</span>
                  <span className="text-miku mx-1.5 font-bold">❯</span>
                  <span className="text-ink">{block.prompt}</span>
                </div>
              )}
              {block.output.map((line, i) =>
                revealed > outputIndices[i] ? (
                  <div
                    key={line}
                    className="motion-safe:animate-term-in text-ink-3"
                  >
                    {line}
                  </div>
                ) : null
              )}
              {isLast && revealed >= totalLines && (
                <div className="mt-3">
                  <span className="text-miku-2 font-bold">~/kacper</span>
                  <span className="text-miku mx-1.5 font-bold">❯</span>
                  <span
                    aria-hidden
                    className="animate-blink text-miku ml-0.5 motion-reduce:animate-none"
                  >
                    ▌
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
