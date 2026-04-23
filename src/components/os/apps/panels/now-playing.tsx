'use client'

import { LyricStrip } from '@/components/os/apps/panels/lyric-strip'
import { PanelControls } from '@/components/os/apps/panels/panel-controls'

/**
 * NowPlaying — "currently listening" panel with a static cover disc and
 * animated EQ bars. Ported from new-design/index.html `function NowPlaying()`.
 *
 * Purely decorative and self-contained; no props and no external data.
 */
const EQ_DELAYS = [0.1, 0.25, 0.4, 0.2, 0.3] as const
const EQ_HEIGHTS = ['50%', '80%', '40%', '90%', '60%'] as const

export function NowPlaying() {
  return (
    <div className="rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-rule bg-surf-1">
        <span className="flex-1 font-mono text-xs font-bold text-ink">
          now.playing ♪
        </span>
        <span className="font-mono text-[10px] text-ink-4">∞</span>
        <PanelControls />
      </div>

      <div className="flex items-center gap-4 p-4">
        <div className="relative size-16 shrink-0 rounded-full bg-gradient-to-br from-miku via-pink to-lav shadow-lg">
          <span className="absolute left-[22%] top-[22%] size-2 rounded-full bg-cloud" />
          <span className="absolute inset-0 grid place-items-center text-cloud text-xl [text-shadow:0_2px_6px_rgba(0,0,0,0.25)]">
            ♪
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-miku font-bold">
            ♪ now playing
          </div>
          <div className="font-display text-base text-ink font-bold mt-0.5">
            lofi + a little black metal
          </div>
          <div className="font-mono text-xs text-ink-4">
            shuffle · ∞ hours queued
          </div>
          <div className="flex items-end gap-0.5 h-4 mt-2">
            {EQ_DELAYS.map((delay, i) => (
              <span
                key={i}
                className="w-1 bg-miku rounded-sm animate-eq-bar origin-bottom"
                style={{
                  height: EQ_HEIGHTS[i],
                  animationDelay: `-${delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-rule px-4 py-3">
        <LyricStrip />
      </div>
    </div>
  )
}
