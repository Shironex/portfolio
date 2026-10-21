import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/**
 * The parts of the activity strip with no state, shared by the strip and
 * the server `StaticHero`, whose copy is the strip's loading frame.
 */

export const WEEKS_SHOWN = 26
export const DAYS_PER_WEEK = 7

/** Cell edge and gap in art px: 26 weeks are 155 art px (312 css at --px 2). */
export const CELL = 5
const GAP = 1
const PITCH = CELL + GAP
const art = (n: number) => `calc(${n} * var(--px))`

export const GRID_SIZE: CSSProperties = {
  width: art(WEEKS_SHOWN * PITCH - GAP),
  height: art(DAYS_PER_WEEK * PITCH - GAP),
}

export const CELL_STYLE: CSSProperties = {
  width: art(CELL),
  height: art(CELL),
}

const cellMask = (direction: string) =>
  `repeating-linear-gradient(${direction}, black 0 ${art(CELL)}, transparent 0 ${art(PITCH)})`

/**
 * The loading grid as one block the size of the real one: the stepped
 * dither of the skeleton tile, masked down to cells by two crossed
 * gradients.
 */
const SKELETON_STYLE: CSSProperties = {
  ...GRID_SIZE,
  maskImage: `${cellMask('to right')}, ${cellMask('to bottom')}`,
  maskComposite: 'intersect',
}

/** The strip's well, under the hero's author row. */
export const ACTIVITY_STRIP_CLASS =
  'os-night px-well relative mt-6 flex flex-col gap-3 px-4 pt-3 pb-3'

/** The strip's header: the total, or `recent contributions` until it loads. */
export function ActivityHeader({ total }: { total: number | null }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-label text-(--link) uppercase">Activity</p>
        <p className="text-title text-(--ink) tabular-nums">
          {total !== null
            ? `${total.toLocaleString()} contributions`
            : 'recent contributions'}
        </p>
      </div>
      <p className="text-label text-(--meta)">last 6 months</p>
    </div>
  )
}

/** The loading grid; `still` holds its dither (the server copy). */
export function ActivitySkeleton({ still = false }: { still?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'px-tile-skeleton',
        still ? 'animate-none' : 'ambient-loop'
      )}
      style={SKELETON_STYLE}
    />
  )
}
