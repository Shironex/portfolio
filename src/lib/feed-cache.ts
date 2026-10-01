/** Revalidate window (seconds) for cached upstream data: 6 hours. */
export const FEED_REVALIDATE_SECONDS = 6 * 60 * 60

/** How long a browser may reuse a feed response without asking again. */
const FEED_BROWSER_MAX_AGE_SECONDS = 5 * 60

/** How long a CDN may serve a stale response while it revalidates: 1 day. */
const FEED_STALE_SECONDS = 24 * 60 * 60

/** `Cache-Control` shared by the feed API routes. */
export const FEED_CACHE_CONTROL = `public, max-age=${FEED_BROWSER_MAX_AGE_SECONDS}, s-maxage=${FEED_REVALIDATE_SECONDS}, stale-while-revalidate=${FEED_STALE_SECONDS}`

/** `User-Agent` sent with every upstream request the site makes. */
export const UPSTREAM_USER_AGENT = 'shironex-portfolio'
