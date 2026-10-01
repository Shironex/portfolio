'use client'

import type { CSSProperties } from 'react'
import { memo } from 'react'

import { TERMINAL_BLOCKS } from '@/components/os/constants'

/** Gap between one line starting to appear and the next. */
const LINE_STAGGER_MS = 180

/** Delays the reveal of the line at `index`; inert without the animation. */
function staggerAt(index: number): CSSProperties {
  return { animationDelay: `${index * LINE_STAGGER_MS}ms` }
}

/**
 * TerminalPanel: static zsh-style transcript that surfaces three concrete
 * claims (who, what, when). Every line is in the markup from the start, so it
 * is there for assistive tech and in the server HTML; the reveal in sequence
 * is CSS only (`animate-term-in` with a per-line delay), and with reduced
 * motion the whole transcript simply shows. The cursor blink is an
 * `ambient-loop`, paused with the wallpaper while the desktop is covered.
 */
function TerminalPanelImpl() {
  let cursor = 0

  return (
    <div className="border-rule-2 bg-surf-solid overflow-hidden rounded-2xl border">
      <div className="border-rule bg-surf-soft flex items-center gap-3 border-b px-3 py-2">
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="bg-danger/50 size-2 rounded-full" />
          <span className="bg-peach/50 size-2 rounded-full" />
          <span className="bg-mint/60 size-2 rounded-full" />
        </span>
        <span className="text-ink flex-1 font-mono text-xs font-bold">
          ~/kacper · zsh
        </span>
      </div>

      <div className="text-ink-2 min-h-[200px] p-4 font-mono text-xs">
        {TERMINAL_BLOCKS.map((block, blockIdx) => {
          const promptIdx = cursor++
          const outputIndices = block.output.map(() => cursor++)
          const isLast = blockIdx === TERMINAL_BLOCKS.length - 1
          return (
            <div
              key={block.prompt}
              className={blockIdx > 0 ? 'mt-3' : undefined}
            >
              <div
                className="motion-safe:animate-term-in"
                style={staggerAt(promptIdx)}
              >
                <span className="text-miku-2 font-bold">~/kacper</span>
                <span className="text-miku mx-1.5 font-bold">❯</span>
                <span className="text-ink">{block.prompt}</span>
              </div>
              {block.output.map((line, i) => (
                <div
                  key={line}
                  className="motion-safe:animate-term-in text-ink-3"
                  style={staggerAt(outputIndices[i])}
                >
                  {line}
                </div>
              ))}
              {isLast && (
                <div
                  className="motion-safe:animate-term-in mt-3"
                  style={staggerAt(cursor)}
                >
                  <span className="text-miku-2 font-bold">~/kacper</span>
                  <span className="text-miku mx-1.5 font-bold">❯</span>
                  <span
                    aria-hidden
                    className="animate-blink ambient-loop text-miku ml-0.5 motion-reduce:animate-none"
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

export const TerminalPanel = memo(TerminalPanelImpl)
