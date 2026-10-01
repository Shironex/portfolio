/**
 * writing.rss window: my latest blog posts, read from `/api/blog-posts`
 * (which fetches the blog's RSS feed server-side with a 6h `unstable_cache`).
 * Every post links out to the blog in a new tab.
 */

'use client'

import { ArrowUpRight } from 'lucide-react'

import { INLINE_LINK_CLASS, SKELETON_BAR } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'

import {
  type BlogPost,
  type BlogPosts,
  BlogPostsSchema,
} from '@/lib/blog/posts-schema'
import { BLOG_URL } from '@/lib/constants'
import { SHORT_DATE, formatDate } from '@/lib/utils/format-date'

import { type ApiFeedState, useApiFeed } from '@/hooks/use-api-feed'

const SKELETON_ROWS = 4
const BLOG_HOST = new URL(BLOG_URL).host

/** Feed dates are UTC; formatting in UTC keeps the day the post was dated. */
function describeDate(date: string) {
  return formatDate(date, {
    ...SHORT_DATE,
    format: { ...SHORT_DATE.format, timeZone: 'UTC' },
  })
}

function BlogLink({ children }: { children: React.ReactNode }) {
  return (
    <ExternalLink href={BLOG_URL} className={INLINE_LINK_CLASS}>
      {children}
    </ExternalLink>
  )
}

function PostSkeleton() {
  return (
    <li aria-hidden className="border-rule bg-surf-0 rounded-2xl border p-4">
      <div className={`${SKELETON_BAR} h-2.5 w-20 rounded`} />
      <div className={`${SKELETON_BAR} mt-3 h-4 w-3/4 rounded`} />
      <div className={`${SKELETON_BAR} mt-3 h-3 w-full rounded`} />
      <div className={`${SKELETON_BAR} mt-2 h-3 w-2/3 rounded`} />
    </li>
  )
}

function PostRow({ post }: { post: BlogPost }) {
  const date = describeDate(post.date)
  return (
    <li>
      <ExternalLink
        href={post.url}
        className="focus-ring group border-rule bg-surf-0 hover:bg-surf-1 hover:border-miku/40 block rounded-2xl border p-4 transition-colors"
      >
        {date && (
          <time
            dateTime={post.date}
            className="text-ink-3 block font-mono text-[11px]"
          >
            {date}
          </time>
        )}
        <span className="mt-1 flex items-start justify-between gap-3">
          <span className="font-display text-ink text-base font-semibold">
            {post.title}
          </span>
          <ArrowUpRight
            aria-hidden
            size={16}
            className="text-ink-3 group-hover:text-miku-2 mt-1 shrink-0 transition-colors"
          />
        </span>
        {post.excerpt && (
          <span className="text-ink-2 mt-1.5 line-clamp-3 block text-sm">
            {post.excerpt}
          </span>
        )}
      </ExternalLink>
    </li>
  )
}

function PostList({ state }: { state: ApiFeedState<BlogPosts> }) {
  if (state.kind === 'loading') {
    return (
      <>
        <p role="status" className="sr-only">
          Loading posts
        </p>
        <ul className="space-y-3">
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <PostSkeleton key={i} />
          ))}
        </ul>
      </>
    )
  }

  if (state.kind !== 'ready') {
    return (
      <p role="status" className="text-ink-3 font-mono text-[12px]">
        couldn&apos;t load my posts right now · you can read them on{' '}
        <BlogLink>{BLOG_HOST}</BlogLink>
      </p>
    )
  }

  if (state.data.posts.length === 0) {
    return (
      <p className="text-ink-3 font-mono text-[12px]">nothing published yet</p>
    )
  }

  return (
    <ul className="space-y-3">
      {state.data.posts.map((post) => (
        <PostRow key={post.url} post={post} />
      ))}
    </ul>
  )
}

export default function WritingApp() {
  const state = useApiFeed('/api/blog-posts', BlogPostsSchema)

  return (
    <div className="font-body text-ink-2 max-w-[720px] text-[14px] leading-relaxed">
      <div className="text-miku font-mono text-[10px] tracking-[0.22em] uppercase">
        Writing
      </div>
      <h2 className="font-display text-ink text-3xl font-semibold tracking-tight">
        Latest posts
      </h2>
      <p className="mt-1">
        Field notes on things I build, from my blog at{' '}
        <BlogLink>{BLOG_HOST}</BlogLink>.
      </p>

      <div className="mt-5" aria-busy={state.kind === 'loading'}>
        <PostList state={state} />
      </div>
    </div>
  )
}
