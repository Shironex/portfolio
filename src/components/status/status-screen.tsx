import Link from 'next/link'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'

import { PROSE_CLASS } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'
import { WallpaperStatic } from '@/components/os/wallpaper/wallpaper-static'
import { AppIcon } from '@/components/pixel/app-icon'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { STATUS_HOST, STATUS_URL } from '@/lib/constants'
import {
  type GroupStatus,
  HISTORY_LENGTH,
  STATUS_REFRESH_SECONDS,
  type StatusReport,
} from '@/lib/status/fetch-status'
import {
  type OverallState,
  type StatusSummary,
  formatCheckTime,
  formatUptime,
  summarize,
} from '@/lib/status/summary'

import { ServiceRow, StateChip } from './service-row'
import { CheckedAgo, StatusAutoRefresh, StatusLampToggle } from './status-live'

/** The headline and the line under it, for each overall state. */
function headline(summary: StatusSummary): { title: string; lead: string } {
  switch (summary.state) {
    case 'up':
      return {
        title: 'Everything I run is up.',
        lead: 'Live uptime of my sites, APIs and the servers under them, read from my own monitor once a minute.',
      }
    case 'down': {
      const names = summary.down.map((service) => service.name).join(', ')
      return {
        title:
          summary.down.length === 1
            ? 'One of my services is down.'
            : `${summary.down.length} of my services are down.`,
        lead: `Failing right now: ${names}. I get an alert after three failed checks in a row, so I am most likely on it already.`,
      }
    }
    case 'unknown':
      return {
        title: 'Waiting for fresh checks.',
        lead:
          summary.up > 0
            ? `${summary.up} of ${summary.total} checks are up; the rest have no recent results yet. My monitor checks every minute, so this page fills in shortly.`
            : 'My monitor answered but has no recent results yet. It checks every minute, so this page fills in shortly.',
      }
    case 'unreachable':
      return {
        title: `I can't reach my monitor.`,
        lead: `The status monitor did not answer, so I can't say what is up right now. It runs on a server of its own; try ${STATUS_HOST} directly, or come back in a minute.`,
      }
  }
}

/** The pixel glyph beside the headline. */
const STATE_GLYPH: Record<
  OverallState,
  { name: 'check' | 'alert' | 'clock'; className: string }
> = {
  up: { name: 'check', className: 'text-(--link)' },
  down: { name: 'alert', className: 'text-(--error)' },
  unknown: { name: 'clock', className: 'text-(--meta)' },
  unreachable: { name: 'alert', className: 'text-(--error)' },
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="px-card flex min-w-0 flex-col gap-1 px-4 py-3">
      <dd className="text-title text-(--ink-hi)">{value}</dd>
      <dt className="text-label order-first text-(--meta)">{label}</dt>
    </div>
  )
}

function Overview({
  report,
  summary,
}: {
  report: StatusReport
  summary: StatusSummary
}) {
  const { title, lead } = headline(summary)
  const glyph = STATE_GLYPH[summary.state]
  return (
    <header className="flex flex-col gap-4">
      <p className="text-label flex items-center gap-2 text-(--meta)">
        <span>~/kacper</span>
        <span aria-hidden className="text-(--heading)">
          ❯
        </span>
        <span>status --live</span>
      </p>
      <div className="flex items-start gap-4">
        <span aria-hidden className="px-scale-2 mt-[calc(2*var(--px))] flex">
          <PixelIcon name={glyph.name} className={glyph.className} />
        </span>
        <h1 id="status-title" className="text-display lamp-heading">
          {title}
        </h1>
      </div>
      <p className={PROSE_CLASS}>{lead}</p>
      {report.reachable && (
        <dl className="grid grid-cols-3 gap-3">
          <Stat
            label="Checks up"
            value={
              <>
                {summary.up}
                <span className="text-(--meta)">/{summary.total}</span>
              </>
            }
          />
          <Stat label="30 day uptime" value={formatUptime(summary.uptime30d)} />
          <Stat
            label="Last check"
            value={
              report.checkedAt ? (
                <CheckedAgo
                  iso={report.checkedAt}
                  absolute={formatCheckTime(report.checkedAt)}
                />
              ) : (
                'n/a'
              )
            }
          />
        </dl>
      )}
    </header>
  )
}

/** How to read a row, once above the groups. */
function Legend() {
  return (
    <p className="text-label -mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-(--meta)">
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-6 w-3 bg-(--frame)" />
        passed
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-8 w-3 bg-(--error)" />
        failed
      </span>
      <span>
        One check a minute, newest on the right. Percent is 30 day uptime, ms
        the mean response.
      </span>
    </p>
  )
}

function GroupSection({ group }: { group: GroupStatus }) {
  const up = group.services.filter((service) => service.state === 'up').length
  const down = group.services.some((service) => service.state === 'down')
  const headingId = `status-group-${group.id}`
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-heading lamp-heading">
          {group.title}
        </h2>
        <StateChip
          state={
            down
              ? 'down'
              : up > 0 && up === group.services.length
                ? 'up'
                : 'unknown'
          }
        >
          {up}/{group.services.length} up
        </StateChip>
      </div>
      <p className="text-label -mt-1 text-(--meta)">{group.blurb}</p>
      <div className="@container">
        <ul className="px-panel grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 py-1 @min-[34rem]:grid-cols-[calc(140*var(--px))_minmax(0,1fr)_calc(40*var(--px))] [&>li+li]:border-t [&>li+li]:border-dashed [&>li+li]:border-(--rule)">
          {group.services.map((service) => (
            <ServiceRow
              key={service.key}
              service={service}
              historyLength={HISTORY_LENGTH}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * The status page (`/status`): one ShiroOS window over the wallpaper's
 * static frame, like the 404. Server-rendered from the cached report; the
 * Lamp toggle, the "checked ago" time and a once a minute refresh are the
 * only client parts.
 */
export function StatusScreen({ report }: { report: StatusReport }) {
  const summary = summarize(report)
  return (
    <main className="relative isolate min-h-dvh bg-(--ground)">
      <div aria-hidden className="fixed inset-0 -z-1 max-md:hidden">
        <WallpaperStatic />
      </div>
      <StatusAutoRefresh everyMs={STATUS_REFRESH_SECONDS * 1000} />
      <div className="flex min-h-dvh items-start justify-center px-4 py-6 md:py-14">
        <article
          aria-labelledby="status-title"
          className="px-window-focused motion-safe:animate-win-open flex w-full max-w-[calc(420*var(--px))] flex-col"
        >
          <div className="os-night px-titlebar-focused flex h-16 items-center gap-3 pl-6 pointer-coarse:h-24">
            <AppIcon id="skills" />
            <span className="text-title flex-1 truncate text-(--ink-hi)">
              status.sys
            </span>
            <StatusLampToggle />
            <Link
              href="/"
              aria-label="Close and return to desktop"
              className="focus-ring flex h-12 w-14 items-center justify-center text-(--ink) hover:bg-(--danger) pointer-coarse:size-(--target)"
            >
              <PixelIcon name="close" />
            </Link>
          </div>

          <div className="flex flex-col gap-10 p-6 md:p-8">
            <Overview report={report} summary={summary} />

            {report.reachable && report.groups.length > 0 && <Legend />}
            {report.reachable &&
              report.groups.map((group) => (
                <GroupSection key={group.id} group={group} />
              ))}

            <footer className="flex flex-col gap-5">
              <div aria-hidden className="rule-dotted" />
              <p className="text-label text-(--meta)">
                Checked every minute by my own Gatus instance. The raw checks
                live at{' '}
                <ExternalLink href={STATUS_URL} inline>
                  {STATUS_HOST}
                </ExternalLink>
                .
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className={buttonVariants({ variant: 'primary' })}
                >
                  <PixelIcon name="home" />
                  Back to desktop
                </Link>
                <ExternalLink
                  href={STATUS_URL}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <PixelIcon name="external" />
                  Open Gatus
                </ExternalLink>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </main>
  )
}
