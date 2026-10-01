import { unstable_cache } from 'next/cache'

import { z } from 'zod'

import { FEED_REVALIDATE_SECONDS } from '@/lib/feed-cache'

import type { ContributionDay, GithubActivity } from './activity-schema'
import { githubGraphql } from './graphql'

export type { ContributionDay, GithubActivity } from './activity-schema'

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const

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
  const json = GraphQLResponseSchema.parse(
    await githubGraphql(QUERY, { username })
  )
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
  revalidate: FEED_REVALIDATE_SECONDS,
  tags: ['github-activity'],
})
