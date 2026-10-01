import { unstable_cache } from 'next/cache'

import { z } from 'zod'

import { FEED_REVALIDATE_SECONDS } from '@/lib/feed-cache'

import {
  type ContributionRepo,
  ContributionRepoSchema,
  type GithubContributions,
  type MergedPull,
  MergedPullSchema,
  PULLS_SHOWN,
  REPOS_SHOWN,
} from './contributions-schema'
import { githubGraphql } from './graphql'

export type { GithubContributions } from './contributions-schema'

/**
 * Organisations that are mine. Pull requests to them are my own work, so the
 * search leaves them out along with my user account.
 */
const OWN_ORGS = ['noctcore', 'shinijs']

const PAGE_SIZE = 100
/** Upper bound on search pages per refresh, so the counts stay cheap. */
const MAX_PAGES = 5
/** Time allowed for the whole chain of pages, on top of the per-request timeout. */
const TOTAL_BUDGET_MS = 12_000

const GraphQLResponseSchema = z.object({
  data: z
    .object({
      search: z.object({
        issueCount: z.number(),
        pageInfo: z.object({
          hasNextPage: z.boolean(),
          endCursor: z.string().nullable(),
        }),
        // Search nodes are a union; anything that is not a pull request
        // arrives as an empty object and is skipped below.
        nodes: z.array(
          z
            .object({
              title: z.string().optional(),
              url: z.string().optional(),
              mergedAt: z.string().nullish(),
              repository: z
                .object({ nameWithOwner: z.string(), url: z.string() })
                .optional(),
            })
            .nullable()
        ),
      }),
    })
    .nullish(),
})

type SearchResult = NonNullable<
  z.infer<typeof GraphQLResponseSchema>['data']
>['search']

// The search has no sort by merge time, so every page asks for the fields a
// listed pull request needs and the newest are picked once all pages are in.
const QUERY = `
  query($search: String!, $first: Int!, $after: String) {
    search(query: $search, type: ISSUE, first: $first, after: $after) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on PullRequest {
          title
          url
          mergedAt
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  }
`

function buildSearch(username: string): string {
  const excluded = [username, ...OWN_ORGS].map((owner) => `-user:${owner}`)
  return [
    `author:${username}`,
    'is:pr',
    'is:merged',
    'is:public',
    ...excluded,
    'sort:updated-desc',
  ].join(' ')
}

async function fetchPage(
  search: string,
  after: string | null,
  signal: AbortSignal
): Promise<SearchResult> {
  const json = GraphQLResponseSchema.parse(
    await githubGraphql(QUERY, { search, first: PAGE_SIZE, after }, signal)
  )
  const result = json.data?.search
  if (!result) {
    throw new Error('Missing pull request search result')
  }
  return result
}

/** Fold one page of search nodes into the running pulls and per-repo counts. */
function collectPage(
  nodes: SearchResult['nodes'],
  pulls: MergedPull[],
  repos: Map<string, ContributionRepo>
) {
  for (const node of nodes) {
    if (!node?.repository) continue
    const { nameWithOwner: name, url } = node.repository
    const pull = MergedPullSchema.safeParse({
      title: node.title,
      url: node.url,
      repo: name,
      mergedAt: node.mergedAt,
    })
    const repo = ContributionRepoSchema.safeParse(
      repos.get(name) ?? { name, url, count: 0 }
    )
    if (!pull.success || !repo.success) continue
    pulls.push(pull.data)
    repo.data.count += 1
    repos.set(name, repo.data)
  }
}

async function fetchRaw(username: string): Promise<GithubContributions> {
  const search = buildSearch(username)
  const budget = AbortSignal.timeout(TOTAL_BUDGET_MS)
  const pulls: MergedPull[] = []
  const repos = new Map<string, ContributionRepo>()
  let reported = 0
  let after: string | null = null

  for (let page = 0; page < MAX_PAGES; page++) {
    let result: SearchResult
    try {
      result = await fetchPage(search, after, budget)
    } catch (error) {
      // Without the first page there is nothing to show. A later page failing
      // (or the budget running out) still leaves a usable partial count.
      if (page === 0) throw error
      console.error(error)
      break
    }

    reported = result.issueCount
    collectPage(result.nodes, pulls, repos)

    after = result.pageInfo.endCursor
    if (!result.pageInfo.hasNextPage || after === null) break
  }

  // ISO timestamps sort correctly as plain strings.
  pulls.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))

  return {
    total: pulls.length,
    repoCount: repos.size,
    capped: reported > pulls.length,
    repos: [...repos.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, REPOS_SHOWN),
    pulls: pulls.slice(0, PULLS_SHOWN),
  }
}

export const getGithubContributions = unstable_cache(
  fetchRaw,
  ['github-contributions', 'v2'],
  {
    revalidate: FEED_REVALIDATE_SECONDS,
    tags: ['github-contributions'],
  }
)
