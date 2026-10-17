/**
 * writing.rss window: my latest blog posts, read from `/api/blog-posts`
 * (which fetches the blog's RSS feed server-side with a 6h `unstable_cache`).
 * Every post links out to the blog in a new tab.
 */

'use client'

import { ArrowUpRight } from 'lucide-react'

import { EYEBROW_CLASS, SKELETON_BAR } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'

import {
  type BlogPost,
  type BlogPosts,
  BlogPostsSchema,
} from '@/lib/blog/posts-schema'
import { BLOG_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
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
    <ExternalLink href={BLOG_URL} inline>
      {children}
    </ExternalLink>
  )
}

function PostSkeleton() {
  return (
    <li aria-hidden className="border-rule bg-surf-0 rounded-2xl border p-8">
      <div className={cn(SKELETON_BAR, 'h-5 w-40 rounded')} />
      <div className={cn(SKELETON_BAR, 'mt-6 h-8 w-3/4 rounded')} />
      <div className={cn(SKELETON_BAR, 'mt-6 h-6 w-full rounded')} />
      <div className={cn(SKELETON_BAR, 'mt-4 h-6 w-2/3 rounded')} />
    </li>
  )
}

function PostRow({ post }: { post: BlogPost }) {
  const date = describeDate(post.date)
  return (
    <li>
      <ExternalLink
        href={post.url}
        className="focus-ring group border-rule bg-surf-0 hover:bg-surf-1 hover:border-miku/40 block rounded-2xl border p-8 transition-colors"
      >
        {date && (
          <time
            dateTime={post.date}
            className="text-ink-3 block font-mono text-[11px]"
          >
            {date}
          </time>
        )}
        <span className="mt-2 flex items-start justify-between gap-6">
          <span className="font-display text-ink text-base font-semibold">
            {post.title}
          </span>
          <ArrowUpRight
            aria-hidden
            size={16}
            className="text-ink-3 group-hover:text-miku-2-icon mt-2 shrink-0 transition-colors"
          />
        </span>
        {post.excerpt && (
          <span className="text-ink-2 mt-3 line-clamp-3 block text-sm">
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
        <ul className="space-y-6">
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
    <ul className="space-y-6">
      {state.data.posts.map((post) => (
        <PostRow key={post.url} post={post} />
      ))}
    </ul>
  )
}

export default function WritingApp() {
  const state = useApiFeed('/api/blog-posts', BlogPostsSchema)

  return (
    <div className="font-body text-ink-2 max-w-360 text-[14px] leading-relaxed">
      <div className={cn(EYEBROW_CLASS, 'text-miku-ink')}>Writing</div>
      <h2 className="font-display text-ink text-3xl font-semibold">
        Latest posts
      </h2>
      <p className="mt-2">
        Field notes on things I build, from my blog at{' '}
        <BlogLink>{BLOG_HOST}</BlogLink>.
      </p>

      <div className="mt-10" aria-busy={state.kind === 'loading'}>
        <PostList state={state} />
      </div>
    </div>
  )
}
