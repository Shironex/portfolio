'use client'

import { useEffect, useState } from 'react'

import { PanelControls } from '@/components/os/apps/panels/panel-controls'
import { BOOT_LINES, QUIPS } from '@/components/os/constants'

/**
 * TerminalPanel — animated zsh-style boot log that sits on the desktop canvas.
 * Ported from new-design/index.html `function TerminalPanel()`.
 *
 * Behavior:
 *  - On mount, `BOOT_LINES` are revealed one at a time with a staggered delay
 *    (~180–300ms per line) via a chained `setTimeout` driven by the `shown`
 *    counter.
 *  - Once all lines are on screen, a prompt line appears cycling through
 *    `QUIPS` every 3.6s with a blinking caret.
 */
export function TerminalPanel() {
  const [shown, setShown] = useState(0)
  const [quipIdx, setQuipIdx] = useState(0)

  useEffect(() => {
    if (shown >= BOOT_LINES.length) return
    const t = setTimeout(
      () => setShown((s) => s + 1),
      180 + Math.random() * 120
    )
    return () => clearTimeout(t)
  }, [shown])

  useEffect(() => {
    const t = setInterval(
      () => setQuipIdx((i) => (i + 1) % QUIPS.length),
      3600
    )
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-rule bg-surf-1">
        <span className="flex-1 font-mono text-xs font-bold text-ink">
          ~/kacper — zsh ♪
        </span>
        <span className="font-mono text-[10px] text-ink-4">80×24</span>
        <PanelControls />
      </div>

      <div className="p-4 font-mono text-xs text-ink-2 min-h-[200px]">
        {BOOT_LINES.slice(0, shown).map((line, i) => {
          const isOk = line.includes('[ ok ]')
          return (
            <div key={i} className="opacity-0 animate-term-in">
              {isOk ? (
                <>
                  <span className="text-miku font-semibold">[ ok ]</span>
                  {line.replace('[ ok ]', '')}
                </>
              ) : (
                line
              )}
            </div>
          )
        })}

        {shown >= BOOT_LINES.length && (
          <div className="mt-2 text-miku-2">
            <span className="text-pink font-bold">~/kacper</span>
            <span className="mx-1.5 text-miku-3 font-bold">❯</span>
            echo &quot;{QUIPS[quipIdx]}&quot;
            <span className="animate-blink ml-0.5">|</span>
          </div>
        )}
      </div>
    </div>
  )
}
