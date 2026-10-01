import { NextResponse } from 'next/server'

import { getBlogPosts } from '@/lib/blog/fetch-posts'
import { FEED_CACHE_CONTROL } from '@/lib/feed-cache'

export async function GET() {
  try {
    const data = await getBlogPosts()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': FEED_CACHE_CONTROL },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
