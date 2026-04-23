import { unstable_cache } from 'next/cache'

import { env } from '@/env/server'

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const

type ContribLevel = keyof typeof LEVEL_MAP

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GithubActivity {
  total: number
  days: ContributionDay[]
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number
              contributionLevel: ContribLevel
              date: string
            }>
          }>
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}

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
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL returned ${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse
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
  revalidate: 21600,
  tags: ['github-activity'],
})
