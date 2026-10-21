'use client'

import { PROSE_CLASS, SKELETON_BAR } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

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
    <ExternalLink href={GITHUB_URL} inline>
      my GitHub profile
    </ExternalLink>
  )
}

/** The pull request list: a card 9-slice with dotted rules between rows. */
const LIST_CLASS = 'px-card flex flex-col p-1'

function Skeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <p role="status" className="sr-only">
        Loading pull requests
      </p>
      <div aria-hidden className={cn('h-4 w-3/4', SKELETON_BAR)} />
      <div aria-hidden className={LIST_CLASS}>
        {Array.from({ length: PULLS_SHOWN }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-6 px-2 py-2"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className={cn('h-4 w-2/3', SKELETON_BAR)} />
              <div className={cn('h-3 w-1/3', SKELETON_BAR)} />
            </div>
            <div className={cn('h-3 w-16', SKELETON_BAR)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Contributions({ data }: { data: GithubContributions }) {
  const hiddenRepos = data.repoCount - data.repos.length

  return (
    <div className="flex flex-col gap-3">
      <p className={PROSE_CLASS}>
        {data.capped && 'More than '}
        {plural(
          data.total,
          'merged pull request',
          'merged pull requests'
        )} to {data.capped && 'at least '}
        {plural(data.repoCount, 'repository', 'repositories')} I do not own.
        These are the latest.
      </p>

      <ul className="flex flex-wrap items-center gap-2">
        {data.repos.map((repo) => (
          <li key={repo.name} className="flex">
            <ExternalLink
              href={repo.url}
              aria-label={`${repo.name}, ${plural(repo.count, 'merged pull request', 'merged pull requests')}`}
              className="os-night focus-ring px-chip text-label inline-flex items-center gap-2 px-2 text-(--ink) hover:text-(--ink-hi)"
            >
              {repo.name}
              <span className="text-(--lamp) tabular-nums">{repo.count}</span>
            </ExternalLink>
          </li>
        ))}
        {hiddenRepos > 0 && (
          <li className="text-label text-(--meta)">
            +{hiddenRepos}
            {data.capped && ' or'} more
          </li>
        )}
      </ul>

      <ul className={LIST_CLASS}>
        {data.pulls.map((pull, i) => (
          <li key={pull.url} className="flex flex-col">
            {i > 0 && <span aria-hidden className="rule-dotted mx-2" />}
            <ExternalLink
              href={pull.url}
              className="focus-ring group flex items-center justify-between gap-6 px-2 py-2 hover:bg-(--select)"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-body flex items-center gap-2 text-(--ink)">
                  <span className="truncate">{pull.title}</span>
                  <PixelIcon
                    name="external"
                    className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </span>
                <span className="text-label block truncate text-(--meta) group-hover:text-(--ink)">
                  {pull.repo}
                </span>
              </span>
              <time
                dateTime={pull.mergedAt}
                className="text-label flex-none text-(--meta) group-hover:text-(--ink)"
              >
                {formatMerged(pull.mergedAt)}
              </time>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
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
      <p className={PROSE_CLASS}>
        I couldn&apos;t load my pull requests right now. They are all on{' '}
        <ProfileLink />.
      </p>
    )
  }

  if (state.data.pulls.length === 0) {
    return (
      <p className={PROSE_CLASS}>
        No merged pull requests to other people&apos;s repositories yet.
      </p>
    )
  }

  return <Contributions data={state.data} />
}
