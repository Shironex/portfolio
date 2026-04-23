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
    <div className="rounded-2xl border border-rule-2 bg-surf-solid overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-rule bg-surf-soft">
        <span className="flex-1 font-mono text-xs font-bold text-ink">
          ~/kacper — zsh
        </span>
      </div>

      <div className="p-4 font-mono text-xs text-ink-2 min-h-[200px]">
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
                  <span className="mx-1.5 text-miku font-bold">❯</span>
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
                  <span className="mx-1.5 text-miku font-bold">❯</span>
                  <span
                    aria-hidden
                    className="animate-blink motion-reduce:animate-none ml-0.5 text-miku"
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
