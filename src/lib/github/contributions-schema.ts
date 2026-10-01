import { z } from 'zod'

/** How many of the latest merged pull requests the payload carries. */
export const PULLS_SHOWN = 6
/** How many of the top repositories the payload carries. */
export const REPOS_SHOWN = 6

const HttpUrlSchema = z.url({ protocol: /^https?$/ })

/**
 * Wire shape of `/api/github-contributions`. Kept free of server imports so
 * the client panel can parse the response with the same schema the route
 * emits.
 */
export const MergedPullSchema = z.object({
  title: z.string(),
  /** Absolute http(s) link to the pull request; anything else is rejected. */
  url: HttpUrlSchema,
  /** `owner/name` of the repository the pull request was merged into. */
  repo: z.string(),
  /** Merge time as an ISO 8601 timestamp. */
  mergedAt: z.iso.datetime(),
})

export type MergedPull = z.infer<typeof MergedPullSchema>

export const ContributionRepoSchema = z.object({
  name: z.string(),
  url: HttpUrlSchema,
  /** Merged pull requests in this repository. */
  count: z.number(),
})

export type ContributionRepo = z.infer<typeof ContributionRepoSchema>

export const GithubContributionsSchema = z.object({
  /** Merged pull requests counted, to repositories outside my own accounts. */
  total: z.number(),
  /** Distinct repositories those pull requests went to. */
  repoCount: z.number(),
  /**
   * True when GitHub reports more pull requests than were counted, so `total`
   * and `repoCount` are lower bounds.
   */
  capped: z.boolean(),
  /** Top repositories by merged pull request count, highest first. */
  repos: z.array(ContributionRepoSchema),
  /** The most recently merged pull requests, newest first. */
  pulls: z.array(MergedPullSchema),
})

export type GithubContributions = z.infer<typeof GithubContributionsSchema>
