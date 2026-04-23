import { NextResponse } from 'next/server'

import * as Sentry from '@sentry/nextjs'

import { getGithubActivity } from '@/lib/github/fetch-activity'

import { env } from '@/env/server'

const USERNAME = 'shironex'

export async function GET() {
  if (!env.GITHUB_TOKEN) {
    return NextResponse.json({ error: 'not-configured' }, { status: 501 })
  }

  try {
    const data = await getGithubActivity(USERNAME)
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
