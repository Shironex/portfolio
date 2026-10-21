'use client'

import { type MouseEvent, useMemo, useRef, useState } from 'react'

import { ExternalLink } from '@/components/os/external-link'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { GITHUB_URL } from '@/lib/constants'
import {
  type ContributionDay,
  GithubActivitySchema,
} from '@/lib/github/activity-schema'
import { formatDate } from '@/lib/utils/format-date'
import { pluralWord } from '@/lib/utils/plural'

import { useApiFeed } from '@/hooks/use-api-feed'

import {
  ACTIVITY_STRIP_CLASS,
  ActivityHeader,
  ActivitySkeleton,
  CELL_STYLE,
  DAYS_PER_WEEK,
  GRID_SIZE,
  WEEKS_SHOWN,
} from './github-activity-frame'

type Day = ContributionDay

/**
 * The levels as lit building windows (SPEC 1.4): dark, then warm from a
 * faint brown to the lamp. Art colours on the night well in both Lamp modes.
 */
const LEVEL_COLOUR: Record<Day['level'], string> = {
  0: '#13253a',
  1: '#4a2b25',
  2: '#6e4030',
  3: '#c98a4a',
  4: '#f0c070',
}

const DAYS_SHOWN = WEEKS_SHOWN * DAYS_PER_WEEK

/** Attribute a cell carries its index into the shown days in. */
const DAY_INDEX_ATTRIBUTE = 'data-day'

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
  /** The cell's edge the tooltip lines up with, from the strip's left or right. */
  left?: number
  right?: number
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
      <div key="grid" className="flex gap-1" style={GRID_SIZE}>
        {weeks.map((week, w) => (
          <div key={week[0].date} className="flex flex-col gap-1">
            {week.map((d, i) => (
              <div
                key={d.date}
                {...{ [DAY_INDEX_ATTRIBUTE]: w * DAYS_PER_WEEK + i }}
                style={{ ...CELL_STYLE, background: LEVEL_COLOUR[d.level] }}
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
    const box = container.getBoundingClientRect()
    const rect = cell.getBoundingClientRect()
    // Lined up with the cell's edge on the side with room, never centred on
    // it: half a tooltip is not a whole number of art px.
    const fromLeft = rect.left - box.left
    setHover(
      fromLeft < box.width / 2
        ? { day, left: fromLeft, y: rect.top - box.top }
        : { day, right: box.right - rect.right, y: rect.top - box.top }
    )
  }

  return (
    <div ref={containerRef} className={ACTIVITY_STRIP_CLASS}>
      <ActivityHeader total={total} />

      {state.kind === 'unconfigured' ? (
        <div className="text-label flex items-end gap-3 text-(--meta)">
          {/* A dark building with one lamp window (SPEC 2.7). */}
          <span
            aria-hidden
            className="relative block h-14 w-9 flex-none bg-(--surf-raised)"
          >
            <span className="absolute top-3 left-5 block h-3 w-2 bg-(--lamp)" />
          </span>
          <span>
            github widget · set{' '}
            <code className="text-(--ink)">GITHUB_TOKEN</code> to enable
          </span>
        </div>
      ) : state.kind === 'error' ? (
        <div className="text-label flex flex-wrap items-center gap-x-3 gap-y-2 text-(--error)">
          <PixelIcon name="alert" />
          <span>couldn&apos;t reach github</span>
          <button
            type="button"
            onClick={state.retry}
            className="focus-ring px-button-secondary text-label h-12 px-3 text-(--ink)"
          >
            Retry
          </button>
          <ExternalLink href={GITHUB_URL} inline>
            view my profile
          </ExternalLink>
        </div>
      ) : (
        // The legend sits right of the grid, where there is room, so the
        // loaded strip is as tall as the loading one.
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div
            role="img"
            aria-label={
              total !== null
                ? `${total.toLocaleString()} contributions in the last 6 months`
                : 'GitHub contribution graph'
            }
            onMouseOver={handleOver}
            onMouseLeave={handleLeave}
            className="relative min-w-0 overflow-x-auto"
          >
            {/* Keyed apart: reusing the skeleton's node for the grid counts
                as that node moving, a layout shift scored from the top of
                the page. */}
            {grid ?? <ActivitySkeleton key="skeleton" />}
          </div>
          {state.kind === 'ready' && (
            <div className="text-label flex flex-none items-center gap-1 text-(--meta)">
              <span className="mr-2">less</span>
              {([0, 1, 2, 3, 4] as const).map((level) => (
                <span
                  key={level}
                  aria-hidden
                  style={{ ...CELL_STYLE, background: LEVEL_COLOUR[level] }}
                />
              ))}
              <span className="ml-2">more</span>
            </div>
          )}
        </div>
      )}

      {hover && (
        <div
          aria-hidden
          className="px-tooltip text-label pointer-events-none absolute z-20 -translate-y-full px-2 text-(--ink)"
          style={{ left: hover.left, right: hover.right, top: hover.y }}
        >
          {describeDay(hover.day)}
        </div>
      )}
    </div>
  )
}
