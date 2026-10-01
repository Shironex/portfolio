'use client'

import {
  type CSSProperties,
  type MouseEvent,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  EYEBROW_CLASS,
  INLINE_LINK_CLASS,
  LABEL_CLASS,
  SKELETON_BAR,
} from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'

import { GITHUB_URL } from '@/lib/constants'
import {
  type ContributionDay,
  GithubActivitySchema,
} from '@/lib/github/activity-schema'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils/format-date'
import { pluralWord } from '@/lib/utils/plural'

import { useApiFeed } from '@/hooks/use-api-feed'

type Day = ContributionDay

const LEVEL_BG: Record<Day['level'], string> = {
  0: 'bg-rule',
  1: 'bg-miku/25',
  2: 'bg-miku/50',
  3: 'bg-miku/75',
  4: 'bg-miku',
}

const WEEKS_SHOWN = 26
const DAYS_PER_WEEK = 7
const DAYS_SHOWN = WEEKS_SHOWN * DAYS_PER_WEEK

/** Cell edge and gap in px; keep in step with `size-[11px]` and `gap-[2px]`. */
const CELL = 11
const GAP = 2
const PITCH = CELL + GAP

/** Attribute a cell carries its index into the shown days in. */
const DAY_INDEX_ATTRIBUTE = 'data-day'

const cellMask = (direction: string) =>
  `repeating-linear-gradient(${direction}, black 0 ${CELL}px, transparent ${CELL}px ${PITCH}px)`

/**
 * The loading grid as one block the size of the real one: a fill, masked
 * down to cells by two crossed gradients.
 */
const SKELETON_STYLE: CSSProperties = {
  width: WEEKS_SHOWN * PITCH - GAP,
  height: DAYS_PER_WEEK * PITCH - GAP,
  maskImage: `${cellMask('to right')}, ${cellMask('to bottom')}`,
  maskComposite: 'intersect',
}

function describeDay(d: Day) {
  const count = d.count === 0 ? 'No' : d.count.toLocaleString()
  const noun = pluralWord(d.count, 'contribution', 'contributions')
  const when =
    formatDate(d.date, {
      anchorToMidnight: true,
      format: { weekday: 'short', month: 'short', day: 'numeric' },
    }) ?? d.date
  return `${count} ${noun} on ${when}`
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
 * A single tooltip is shared across all cells: hovering a cell updates its
 * position + content. Beats rendering ~182 always-mounted tooltip nodes.
 * The cells carry no handlers either: one on the graph reads which cell the
 * pointer is over, and the grid is memoized so a hover re-renders only the
 * tooltip.
 *
 * The graph is one `role="img"` with the total as its name. The cells are
 * decoration inside it: not focusable, so the strip adds no tab stops.
 */
export function GithubActivityStrip() {
  const state = useApiFeed('/api/github-activity', GithubActivitySchema)
  const [hover, setHover] = useState<HoverState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const days = useMemo(
    () => (state.kind === 'ready' ? state.data.days.slice(-DAYS_SHOWN) : null),
    [state]
  )

  const grid = useMemo(() => {
    if (!days) return null
    const weeks: Day[][] = []
    for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
      weeks.push(days.slice(i, i + DAYS_PER_WEEK))
    }
    return (
      <div className="flex gap-[2px]">
        {weeks.map((week, w) => (
          <div key={week[0].date} className="flex flex-col gap-[2px]">
            {week.map((d, i) => (
              <div
                key={d.date}
                {...{ [DAY_INDEX_ATTRIBUTE]: w * DAYS_PER_WEEK + i }}
                className={cn('size-[11px] rounded-[2px]', LEVEL_BG[d.level])}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }, [days])

  const total = state.kind === 'ready' ? state.data.total : null

  const handleLeave = () => setHover(null)

  const handleOver = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const cell = event.target as HTMLElement
    const index = cell.getAttribute(DAY_INDEX_ATTRIBUTE)
    const day = index === null ? undefined : days?.[Number(index)]
    // The gaps between cells are not a day.
    if (!container || !day) {
      handleLeave()
      return
    }
    const containerRect = container.getBoundingClientRect()
    const rect = cell.getBoundingClientRect()
    setHover({
      day,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    })
  }

  return (
    <div
      ref={containerRef}
      className="border-rule bg-surf-0 relative mt-4 rounded-2xl border p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={cn(EYEBROW_CLASS, 'text-miku-ink')}>Activity</div>
          <div className="font-display text-ink text-sm font-bold tabular-nums">
            {total !== null
              ? `${total.toLocaleString()} contributions`
              : 'recent contributions'}
          </div>
        </div>
        <div className="text-ink-4 font-mono text-xs">last 6 months</div>
      </div>

      {state.kind === 'unconfigured' ? (
        <div className="text-ink-3 font-mono text-[11px]">
          github widget · set{' '}
          <code className="bg-surf-1 text-ink-2 rounded px-1 py-0.5">
            GITHUB_TOKEN
          </code>{' '}
          to enable
        </div>
      ) : state.kind === 'error' ? (
        <div className="text-ink-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
          <span>couldn&apos;t reach github</span>
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={state.retry}
            className={INLINE_LINK_CLASS}
          >
            retry
          </button>
          <span aria-hidden>·</span>
          <ExternalLink href={GITHUB_URL} className={INLINE_LINK_CLASS}>
            view my profile
          </ExternalLink>
        </div>
      ) : (
        <div
          role="img"
          aria-label={
            total !== null
              ? `${total.toLocaleString()} contributions in the last 6 months`
              : 'GitHub contribution graph'
          }
          onMouseOver={handleOver}
          onMouseLeave={handleLeave}
          className="relative overflow-x-auto"
        >
          {grid ?? (
            <div aria-hidden className={SKELETON_BAR} style={SKELETON_STYLE} />
          )}
        </div>
      )}

      {hover && (
        <div
          aria-hidden
          className="border-rule-2 bg-surf-solid text-ink shadow-elev-2 animate-fade-in pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border px-2 py-1 font-mono text-xs motion-reduce:animate-none"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          {describeDay(hover.day)}
        </div>
      )}

      {state.kind === 'ready' && (
        <div
          className={cn(
            LABEL_CLASS,
            'text-ink-4 mt-2 flex items-center gap-1.5'
          )}
        >
          <span>less</span>
          <span aria-hidden className="bg-rule size-2 rounded-[2px]" />
          <span aria-hidden className="bg-miku/25 size-2 rounded-[2px]" />
          <span aria-hidden className="bg-miku/50 size-2 rounded-[2px]" />
          <span aria-hidden className="bg-miku/75 size-2 rounded-[2px]" />
          <span aria-hidden className="bg-miku size-2 rounded-[2px]" />
          <span>more</span>
        </div>
      )}
    </div>
  )
}
