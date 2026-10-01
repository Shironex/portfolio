'use client'

import { ArrowUpRight } from 'lucide-react'

import { INLINE_LINK_CLASS, SKELETON_BAR } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'

import { GITHUB_URL } from '@/lib/constants'
import {
  type GithubContributions,
  GithubContributionsSchema,
  PULLS_SHOWN,
} from '@/lib/github/contributions-schema'
import { cn } from '@/lib/utils'
import { SHORT_DATE, formatDate } from '@/lib/utils/format-date'
import { plural } from '@/lib/utils/plural'

import { useApiFeed } from '@/hooks/use-api-feed'

function formatMerged(mergedAt: string) {
  return formatDate(mergedAt, SHORT_DATE) ?? mergedAt
}

function ProfileLink() {
  return (
    <ExternalLink href={GITHUB_URL} className={INLINE_LINK_CLASS}>
      my GitHub profile
    </ExternalLink>
  )
}

function Skeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading pull requests
      </p>
      <div
        aria-hidden
        className={cn('h-4 w-3/4 rounded-[2px]', SKELETON_BAR)}
      />
      <div className="border-rule bg-surf-0 divide-rule mt-3 divide-y overflow-hidden rounded-2xl border">
        {Array.from({ length: PULLS_SHOWN }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="flex items-center justify-between gap-4 px-4 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <div className={cn('h-3.5 w-2/3 rounded-[2px]', SKELETON_BAR)} />
              <div
                className={cn('mt-2 h-2.5 w-1/3 rounded-[2px]', SKELETON_BAR)}
              />
            </div>
            <div className={cn('h-2.5 w-16 rounded-[2px]', SKELETON_BAR)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Contributions({ data }: { data: GithubContributions }) {
  const hiddenRepos = data.repoCount - data.repos.length

  return (
    <>
      <p className="text-ink-2 text-sm leading-relaxed">
        {data.capped && 'More than '}
        {plural(
          data.total,
          'merged pull request',
          'merged pull requests'
        )} to {data.capped && 'at least '}
        {plural(data.repoCount, 'repository', 'repositories')} I do not own.
        These are the latest.
      </p>

      <ul className="mt-3 flex flex-wrap items-center gap-1.5">
        {data.repos.map((repo) => (
          <li key={repo.name}>
            <ExternalLink
              href={repo.url}
              aria-label={`${repo.name}, ${plural(repo.count, 'merged pull request', 'merged pull requests')}`}
              className="focus-ring border-rule bg-surf-0 text-ink-2 hover:bg-surf-soft inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition"
            >
              {repo.name}
              <span className="text-miku-ink font-bold tabular-nums">
                {repo.count}
              </span>
            </ExternalLink>
          </li>
        ))}
        {hiddenRepos > 0 && (
          <li className="text-ink-3 font-mono text-[11px]">
            +{hiddenRepos}
            {data.capped && ' or'} more
          </li>
        )}
      </ul>

      <ul className="border-rule bg-surf-0 divide-rule mt-3 divide-y overflow-hidden rounded-2xl border">
        {data.pulls.map((pull) => (
          <li key={pull.url}>
            <ExternalLink
              href={pull.url}
              className="focus-ring group hover:bg-surf-soft flex items-center justify-between gap-4 px-4 py-2.5 transition"
            >
              <span className="min-w-0">
                <span className="text-ink flex items-center gap-1 text-sm font-semibold">
                  <span className="truncate">{pull.title}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="text-ink-3 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </span>
                <span className="text-ink-3 mt-0.5 block truncate font-mono text-[11px]">
                  {pull.repo}
                </span>
              </span>
              <time
                dateTime={pull.mergedAt}
                className="text-ink-3 shrink-0 font-mono text-[11px]"
              >
                {formatMerged(pull.mergedAt)}
              </time>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Merged pull requests to repositories outside my own accounts, fetched from
 * `/api/github-contributions` (GitHub GraphQL search behind a 6h
 * `unstable_cache`). Without `GITHUB_TOKEN` the route answers 501; that and
 * any other failure fall back to a line pointing at my GitHub profile.
 */
export function OpenSourcePanel() {
  const state = useApiFeed(
    '/api/github-contributions',
    GithubContributionsSchema
  )

  if (state.kind === 'loading') return <Skeleton />

  if (state.kind !== 'ready') {
    return (
      <p className="text-ink-2 text-sm leading-relaxed">
        I couldn&apos;t load my pull requests right now. They are all on{' '}
        <ProfileLink />.
      </p>
    )
  }

  if (state.data.pulls.length === 0) {
    return (
      <p className="text-ink-3 text-sm leading-relaxed">
        No merged pull requests to other people&apos;s repositories yet.
      </p>
    )
  }

  return <Contributions data={state.data} />
}
