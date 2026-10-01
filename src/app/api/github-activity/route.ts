import { NextResponse } from 'next/server'

import { FEED_CACHE_CONTROL } from '@/lib/feed-cache'
import { getGithubActivity } from '@/lib/github/fetch-activity'
import { GITHUB_USERNAME } from '@/lib/github/graphql'

import { env } from '@/env/server'

export async function GET() {
  if (!env.GITHUB_TOKEN) {
    return NextResponse.json({ error: 'not-configured' }, { status: 501 })
  }

  try {
    const data = await getGithubActivity(GITHUB_USERNAME)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': FEED_CACHE_CONTROL },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
