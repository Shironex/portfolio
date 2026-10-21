/**
 * writing.rss window: my latest blog posts, read from `/api/blog-posts`
 * (which fetches the blog's RSS feed server-side with a 6h `unstable_cache`).
 * Every post links out to the blog in a new tab.
 *
 * In pixels (SPEC 1.5): the README `writing` banner as the heading's
 * picture, posts as rows of one card with their dates in Departure Mono,
 * the mini-me typing over dither bars while the feed loads, and the alert
 * glyph with a Retry button when it fails.
 */

'use client'

import { Button } from '@/components/ui/button'

import { PROSE_CLASS, SKELETON_BAR } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'
import { MiniMe } from '@/components/pixel/mini-me'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import {
  type BlogPost,
  type BlogPosts,
  BlogPostsSchema,
} from '@/lib/blog/posts-schema'
import { BLOG_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SHORT_DATE, formatDate } from '@/lib/utils/format-date'

import banners from '@/assets/pixel/banners/readme-headers.png'
import { type ApiFeedState, useApiFeed } from '@/hooks/use-api-feed'
import '@/styles/sprites/readme-headers.css'

const SKELETON_ROWS = 3
const BLOG_HOST = new URL(BLOG_URL).host

/** The posts: one card 9-slice with dotted rules between the rows. */
const LIST_CLASS = 'px-card flex flex-col p-1'

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

function Rule() {
  return <span aria-hidden className="rule-dotted mx-2 block" />
}

function Loading() {
  return (
    <>
      <p role="status" className="sr-only">
        Loading posts
      </p>
      <div aria-hidden className="flex flex-col gap-3">
        <MiniMe tag="type" play="loop" />
        <div className={LIST_CLASS}>
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <div key={i} className="flex flex-col">
              {i > 0 && <Rule />}
              <div className="flex flex-col gap-2 p-2">
                <div className={cn(SKELETON_BAR, 'h-4 w-24')} />
                <div className={cn(SKELETON_BAR, 'h-6 w-3/4')} />
                <div className={cn(SKELETON_BAR, 'h-5 w-full')} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function PostRow({ post, first }: { post: BlogPost; first: boolean }) {
  const date = describeDate(post.date)
  return (
    <li className="flex flex-col">
      {!first && <Rule />}
      <ExternalLink
        href={post.url}
        className="focus-ring group flex flex-col gap-1 p-2 hover:bg-(--select)"
      >
        {date && (
          <time
            dateTime={post.date}
            className="text-label text-(--meta) group-hover:text-(--ink)"
          >
            {date}
          </time>
        )}
        <span className="flex items-start justify-between gap-4">
          <span className="text-title text-(--ink)">{post.title}</span>
          <PixelIcon
            name="external"
            className="mt-1 text-(--meta) group-hover:text-(--heading)"
          />
        </span>
        {post.excerpt && (
          <span className="text-prose line-clamp-2 text-(--meta) group-hover:text-(--ink)">
            {post.excerpt}
          </span>
        )}
      </ExternalLink>
    </li>
  )
}

function PostList({ state }: { state: ApiFeedState<BlogPosts> }) {
  if (state.kind === 'loading') return <Loading />

  if (state.kind === 'error') {
    return (
      <div role="status" className="flex flex-col items-start gap-3">
        <p className="text-prose flex items-start gap-2 text-(--ink)">
          <PixelIcon name="alert" className="mt-3 text-(--error)" />
          <span>
            I couldn&apos;t load my posts right now. You can read them on{' '}
            <BlogLink>{BLOG_HOST}</BlogLink>.
          </span>
        </p>
        <Button type="button" variant="secondary" onClick={state.retry}>
          Retry
        </Button>
      </div>
    )
  }

  if (state.kind !== 'ready') {
    return (
      <p role="status" className={PROSE_CLASS}>
        You can read my posts on <BlogLink>{BLOG_HOST}</BlogLink>.
      </p>
    )
  }

  if (state.data.posts.length === 0) {
    return <p className={PROSE_CLASS}>Nothing published yet.</p>
  }

  return (
    <ul className={LIST_CLASS}>
      {state.data.posts.map((post, i) => (
        <PostRow key={post.url} post={post} first={i === 0} />
      ))}
    </ul>
  )
}

export default function WritingApp() {
  const state = useApiFeed('/api/blog-posts', BlogPostsSchema)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-3">
        <span
          aria-hidden
          className="os-night px-readme-headers px-readme-headers-writing ambient-loop block flex-none animate-(--px-loop)"
          style={{ backgroundImage: `url(${banners.src})` }}
        />
        <h2 className="sr-only">Recent writing</h2>
        <p className={PROSE_CLASS}>
          Field notes on things I build, from my blog at{' '}
          <BlogLink>{BLOG_HOST}</BlogLink>.
        </p>
      </header>

      <div aria-busy={state.kind === 'loading'}>
        <PostList state={state} />
      </div>
    </div>
  )
}
