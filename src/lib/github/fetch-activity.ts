import { unstable_cache } from 'next/cache'

import { z } from 'zod'

import { env } from '@/env/server'

import type { ContributionDay, GithubActivity } from './activity-schema'

export type { ContributionDay, GithubActivity } from './activity-schema'

/** Revalidate window (seconds) for cached GitHub activity — 6 hours. */
export const GITHUB_ACTIVITY_REVALIDATE_SECONDS = 21600

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const

const GITHUB_TIMEOUT_MS = 10_000

const ContribLevelSchema = z.enum([
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
])

const GraphQLResponseSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          contributionsCollection: z.object({
            contributionCalendar: z.object({
              totalContributions: z.number(),
              weeks: z.array(
                z.object({
                  contributionDays: z.array(
                    z.object({
                      contributionCount: z.number(),
                      contributionLevel: ContribLevelSchema,
                      date: z.string(),
                    })
                  ),
                })
              ),
            }),
          }),
        })
        .nullish(),
    })
    .nullish(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
    }
  }
`

async function fetchRaw(username: string): Promise<GithubActivity> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured')
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'shironex-portfolio',
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL returned ${res.status}`)
  }

  const json = GraphQLResponseSchema.parse(await res.json())
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  const cal = json.data?.user?.contributionsCollection.contributionCalendar
  if (!cal) {
    throw new Error('Missing contribution calendar for user')
  }

  const days: ContributionDay[] = []
  for (const week of cal.weeks) {
    for (const d of week.contributionDays) {
      days.push({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL_MAP[d.contributionLevel],
      })
    }
  }
  return { total: cal.totalContributions, days }
}

export const getGithubActivity = unstable_cache(fetchRaw, ['github-activity'], {
  revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
  tags: ['github-activity'],
})
