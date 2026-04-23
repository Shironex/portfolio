'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface Day {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface Activity {
  total: number
  days: Day[]
}

const LEVEL_BG: Record<Day['level'], string> = {
  0: 'bg-rule',
  1: 'bg-miku/25',
  2: 'bg-miku/50',
  3: 'bg-miku/75',
  4: 'bg-miku',
}

const WEEKS_SHOWN = 26
const DAYS_SHOWN = WEEKS_SHOWN * 7

type FetchState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: Activity }
  | { kind: 'unconfigured' }
  | { kind: 'error' }

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function describeDay(d: Day) {
  const count = d.count === 0 ? 'No' : d.count.toLocaleString()
  const plural = d.count === 1 ? 'contribution' : 'contributions'
  return `${count} ${plural} on ${formatDate(d.date)}`
}

interface HoverState {
  day: Day
  x: number
  y: number
}

/**
 * GitHub contribution heatmap strip. Fetches from `/api/github-activity`
 * (which hits GitHub's GraphQL API with a 6h `unstable_cache`). Shows the
 * last ~26 weeks as a 7-row grid. Gracefully degrades when `GITHUB_TOKEN`
 * isn't set (returns 501 → "not configured" copy).
 *
 * A single tooltip is shared across all cells — hover/focus on a cell
 * updates its position + content. Beats rendering ~182 always-mounted
 * tooltip nodes.
 */
export function GithubActivityStrip() {
  const [state, setState] = useState<FetchState>({ kind: 'loading' })
  const [hover, setHover] = useState<HoverState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/github-activity')
      .then(async (r) => {
        if (cancelled) return
        if (r.status === 501) {
          setState({ kind: 'unconfigured' })
          return
        }
        if (!r.ok) {
          setState({ kind: 'error' })
          return
        }
        const data = (await r.json()) as Activity
        setState({ kind: 'ready', data })
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const weeks = useMemo(() => {
    if (state.kind !== 'ready') return null
    const tail = state.data.days.slice(-DAYS_SHOWN)
    const cols: Day[][] = []
    for (let i = 0; i < tail.length; i += 7) {
      cols.push(tail.slice(i, i + 7))
    }
    return cols
  }, [state])

  const total = state.kind === 'ready' ? state.data.total : null

  const handleEnter = (day: Day, target: HTMLElement) => {
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    setHover({
      day,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    })
  }

  const handleLeave = () => setHover(null)

  return (
    <div
      ref={containerRef}
      className="relative mt-5 rounded-2xl border border-rule bg-surf-0 p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-miku">
            ✧ activity
          </div>
          <div className="font-display text-sm font-bold text-ink">
            {total !== null
              ? `${total.toLocaleString()} contributions`
              : 'recent contributions'}
          </div>
        </div>
        <div className="font-mono text-[10px] text-ink-4">last 6 months</div>
      </div>

      {state.kind === 'unconfigured' ? (
        <div className="font-mono text-[11px] text-ink-3">
          github widget · set{' '}
          <code className="rounded bg-surf-1 px-1 py-0.5 text-ink-2">
            GITHUB_TOKEN
          </code>{' '}
          to enable
        </div>
      ) : state.kind === 'error' ? (
        <div className="font-mono text-[11px] text-ink-3">
          couldn&apos;t reach github · try again later
        </div>
      ) : (
        <div
          role="img"
          aria-label={
            total !== null
              ? `${total.toLocaleString()} contributions in the last 6 months`
              : 'GitHub contribution graph'
          }
          className="relative overflow-x-auto"
        >
          <div className="flex gap-[3px]">
            {(weeks ?? Array.from({ length: WEEKS_SHOWN }, () => null)).map(
              (w, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {w
                    ? w.map((d) => (
                        <button
                          key={d.date}
                          type="button"
                          aria-label={describeDay(d)}
                          onMouseEnter={(e) =>
                            handleEnter(d, e.currentTarget)
                          }
                          onFocus={(e) => handleEnter(d, e.currentTarget)}
                          onMouseLeave={handleLeave}
                          onBlur={handleLeave}
                          className={`focus-ring size-[12px] rounded-[2px] ${LEVEL_BG[d.level]}`}
                        />
                      ))
                    : Array.from({ length: 7 }).map((_, j) => (
                        <div
                          key={j}
                          aria-hidden
                          className="size-[12px] rounded-[2px] bg-rule animate-pulse-slow motion-reduce:animate-none"
                        />
                      ))}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {hover && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border border-rule-2 bg-surf-solid px-2 py-1 font-mono text-[10px] text-ink shadow-elev-2"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          {describeDay(hover.day)}
        </div>
      )}

      {state.kind === 'ready' && (
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-4">
          <span>less</span>
          <span aria-hidden className="size-2.5 rounded-[2px] bg-rule" />
          <span aria-hidden className="size-2.5 rounded-[2px] bg-miku/25" />
          <span aria-hidden className="size-2.5 rounded-[2px] bg-miku/50" />
          <span aria-hidden className="size-2.5 rounded-[2px] bg-miku/75" />
          <span aria-hidden className="size-2.5 rounded-[2px] bg-miku" />
          <span>more</span>
        </div>
      )}
    </div>
  )
}
