const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

interface CacheWindows {
  /** How long a browser may reuse a response without asking again. */
  browser: number
  /** How long a CDN may keep it. */
  cdn: number
  /** How long a CDN may serve a stale copy while it revalidates. */
  stale: number
}

/** A public `Cache-Control` value from three lifetimes in seconds. */
function cacheControl({ browser, cdn, stale }: CacheWindows): string {
  return `public, max-age=${browser}, s-maxage=${cdn}, stale-while-revalidate=${stale}`
}

/** Revalidate window (seconds) for cached upstream data: 6 hours. */
export const FEED_REVALIDATE_SECONDS = 6 * HOUR

/** `Cache-Control` shared by the feed API routes. */
export const FEED_CACHE_CONTROL = cacheControl({
  browser: 5 * MINUTE,
  cdn: FEED_REVALIDATE_SECONDS,
  stale: DAY,
})

/**
 * `Cache-Control` for feeds generated from the project data at build time.
 * The content only changes on deploy, so a CDN may keep it for a day.
 */
export const STATIC_FEED_CACHE_CONTROL = cacheControl({
  browser: HOUR,
  cdn: DAY,
  stale: 7 * DAY,
})

/** `User-Agent` sent with every upstream request the site makes. */
export const UPSTREAM_USER_AGENT = 'shironex-portfolio'
