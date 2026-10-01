import { unstable_cache } from 'next/cache'

import { BLOG_URL } from '@/lib/constants'
import { FEED_REVALIDATE_SECONDS, UPSTREAM_USER_AGENT } from '@/lib/feed-cache'

import { parseFeed } from './parse-feed'
import type { BlogPosts } from './posts-schema'

export type { BlogPost, BlogPosts } from './posts-schema'

const BLOG_FEED_URL = `${BLOG_URL}/rss.xml`
const BLOG_TIMEOUT_MS = 10_000
const MAX_POSTS = 8
/** Largest feed body accepted; the real feed is a few kilobytes. */
const MAX_FEED_BYTES = 1_000_000

async function fetchRaw(): Promise<BlogPosts> {
  // eslint-disable-next-line noctcore-security/no-user-controlled-fetch-url -- fixed origin from the BLOG_URL constant, not request input
  const res = await fetch(BLOG_FEED_URL, {
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml',
      'User-Agent': UPSTREAM_USER_AGENT,
    },
    signal: AbortSignal.timeout(BLOG_TIMEOUT_MS),
  })

  if (!res.ok) {
    throw new Error(`Blog feed returned ${res.status}`)
  }
  // The header is checked first so an oversized body is never read; the
  // length check after covers a missing or wrong header.
  if (Number(res.headers.get('content-length')) > MAX_FEED_BYTES) {
    throw new Error('Blog feed is too large')
  }

  const xml = await res.text()
  if (xml.length > MAX_FEED_BYTES) {
    throw new Error('Blog feed is too large')
  }
  if (!/<rss[\s>]/i.test(xml)) {
    throw new Error('Blog feed is not an RSS document')
  }

  return { posts: parseFeed(xml, MAX_POSTS) }
}

export const getBlogPosts = unstable_cache(fetchRaw, ['blog-posts'], {
  revalidate: FEED_REVALIDATE_SECONDS,
  tags: ['blog-posts'],
})
