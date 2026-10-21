'use client'

import type { CSSProperties, ReactNode } from 'react'
import { memo } from 'react'

import { TERMINAL_BLOCKS } from '@/components/os/constants'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { PET_PERCH as PERCH } from '@/lib/os/pets'

/** Gap between one line starting to appear and the next. */
const LINE_STAGGER_MS = 180

/** Delays the reveal of the line at `index`; inert without the animation. */
function staggerAt(index: number): CSSProperties {
  return { animationDelay: `${index * LINE_STAGGER_MS}ms` }
}

/** The prompt: the path in link teal and a lamp chevron (SPEC 1.4). */
function Prompt({ children }: { children?: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-(--link)">~/kacper</span>
      <PixelIcon name="chevron-right" className="text-(--lamp)" />
      {children}
    </span>
  )
}

/**
 * TerminalPanel: a short zsh transcript that surfaces three concrete claims
 * (who, what, when), in a CRT well in Departure Mono. Night in both Lamp
 * modes (`os-night`): it is a terminal.
 *
 * Every line is in the markup from the start, so it is there for assistive
 * tech and in the server HTML; the reveal in sequence is CSS only
 * (`animate-term-in`, two held steps per line, with a per-line delay), and
 * with reduced motion the whole transcript simply shows. The block cursor
 * blinks as an `ambient-loop`, paused with the wallpaper while the desktop
 * is covered.
 */
function TerminalPanelImpl() {
  let cursor = 0

  return (
    <div
      {...PERCH}
      className="os-night px-panel flex flex-col gap-2 p-2"
    >
      <div className="text-label flex items-center gap-3 px-2 pt-1 text-(--meta)">
        <span aria-hidden className="flex items-center gap-1">
          <span className="block size-2 bg-(--error)" />
          <span className="block size-2 bg-(--lamp)" />
          <span className="block size-2 bg-(--link)" />
        </span>
        <span className="flex-1 truncate">~/kacper · zsh</span>
      </div>

      <div className="px-well text-label flex flex-col gap-3 px-4 pt-3 pb-4 text-(--ink)">
        {TERMINAL_BLOCKS.map((block, blockIdx) => {
          const promptIdx = cursor++
          const outputIndices = block.output.map(() => cursor++)
          const isLast = blockIdx === TERMINAL_BLOCKS.length - 1
          return (
            <div key={block.prompt} className="flex flex-col gap-3">
              <div>
                <div
                  className="motion-safe:animate-term-in"
                  style={staggerAt(promptIdx)}
                >
                  <Prompt>
                    <span>{block.prompt}</span>
                  </Prompt>
                </div>
                {block.output.map((line, i) => (
                  <div
                    key={line}
                    className="motion-safe:animate-term-in text-(--meta)"
                    style={staggerAt(outputIndices[i])}
                  >
                    {line}
                  </div>
                ))}
              </div>
              {isLast && (
                <div
                  className="motion-safe:animate-term-in"
                  style={staggerAt(cursor)}
                >
                  <Prompt>
                    <span
                      aria-hidden
                      className="animate-blink ambient-loop block h-7 w-3 bg-(--lamp) motion-reduce:animate-none"
                    />
                  </Prompt>
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
