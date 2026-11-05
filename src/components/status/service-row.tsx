import type { ReactNode } from 'react'

import { ExternalLink } from '@/components/os/external-link'

import type { ServiceState, ServiceStatus } from '@/lib/status/fetch-status'
import { formatCheckTime, formatUptime } from '@/lib/status/summary'
import { cn } from '@/lib/utils'
import { plural } from '@/lib/utils/plural'

/**
 * State tags: the notched chip 9-slices, night in both Lamp modes like every
 * chip, each with its night ink (link on teal, error on warm, meta on
 * ground). The word carries the state, so colour is never the only cue.
 */
const STATE_CHIP: Record<ServiceState, { label: string; className: string }> = {
  up: { label: 'up', className: 'px-chip text-(--link)' },
  down: { label: 'down', className: 'px-chip-warm text-(--error)' },
  unknown: { label: 'no data', className: 'px-chip-ground text-(--meta)' },
}

export function StateChip({
  state,
  children,
}: {
  state: ServiceState
  children?: ReactNode
}) {
  const chip = STATE_CHIP[state]
  return (
    <span
      className={cn(
        'os-night text-label inline-block shrink-0 px-2 whitespace-nowrap uppercase',
        chip.className
      )}
    >
      {children ?? chip.label}
    </span>
  )
}

interface HistoryBarProps {
  service: ServiceStatus
  length: number
}

/**
 * The recent checks as a strip of ticks, oldest on the left, stretched to
 * the column: teal for a pass, the error colour and full height for a fail,
 * a dim stub for a slot with no check yet. A narrow list (under 34rem)
 * shows the newest half. One image to assistive tech, named by its counts.
 */
function HistoryBar({ service, length }: HistoryBarProps) {
  const { history } = service
  const failed = history.filter((tick) => !tick.ok).length
  const empty = Math.max(0, length - history.length)
  const label =
    history.length === 0
      ? 'No checks yet'
      : `Last ${plural(history.length, 'check', 'checks')}: ${
          failed === 0 ? 'all passed' : `${failed} failed`
        }`
  // The older half of the slots, hidden on a narrow list.
  const older = (slot: number) =>
    slot < length / 2 ? '@max-[34rem]:hidden' : undefined
  return (
    <div role="img" aria-label={label} className="flex h-8 items-end gap-px">
      {Array.from({ length: empty }, (_, i) => (
        <span
          key={`empty-${i}`}
          className={cn('h-2 min-w-px flex-1 bg-(--rule)', older(i))}
        />
      ))}
      {history.map((tick, i) => (
        <span
          key={tick.at}
          title={`${formatCheckTime(tick.at)}: ${tick.ok ? 'passed' : 'failed'}`}
          className={cn(
            'min-w-px flex-1',
            tick.ok ? 'h-6 bg-(--frame)' : 'h-8 bg-(--error)',
            older(empty + i)
          )}
        />
      ))}
    </div>
  )
}

interface ServiceRowProps {
  service: ServiceStatus
  historyLength: number
}

/**
 * One check: its name (a link for a public site), state tag, recent history
 * and the 30 day uptime with the mean response time. Stacks on a narrow
 * list, one line from 34rem of list width up.
 */
export function ServiceRow({ service, historyLength }: ServiceRowProps) {
  return (
    <li className="col-span-full grid grid-cols-subgrid items-center gap-y-3 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <StateChip state={service.state} />
        {service.href ? (
          <ExternalLink
            href={service.href}
            className="focus-ring text-body truncate text-(--ink-hi) underline decoration-transparent decoration-(length:--px) underline-offset-[calc(2*var(--px))] hover:text-(--heading) hover:decoration-current"
          >
            {service.name}
          </ExternalLink>
        ) : (
          <span className="text-body truncate text-(--ink-hi)">
            {service.name}
          </span>
        )}
      </div>
      <div className="col-span-2 row-start-2 @min-[34rem]:col-span-1 @min-[34rem]:col-start-2 @min-[34rem]:row-start-1">
        <HistoryBar service={service} length={historyLength} />
      </div>
      <dl className="text-label col-start-2 row-start-1 flex flex-col items-end text-right @min-[34rem]:col-start-3">
        <div className="flex gap-2">
          <dt className="sr-only">Uptime, 30 days</dt>
          <dd className="text-(--ink-hi)">{formatUptime(service.uptime30d)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Mean response time</dt>
          <dd className="text-(--meta)">
            {service.avgMs === null ? 'n/a' : `${service.avgMs} ms`}
          </dd>
        </div>
      </dl>
    </li>
  )
}
