import { type BlogPost, BlogPostSchema } from './posts-schema'

const MAX_EXCERPT_LENGTH = 300

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

/**
 * Decode XML entities in a single pass, so an escaped ampersand
 * (`&amp;lt;`) is not decoded twice.
 */
function decodeEntities(text: string): string {
  return text.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, body: string) => {
      if (body[0] !== '#') return NAMED_ENTITIES[body.toLowerCase()] ?? match
      const isHex = body[1] === 'x' || body[1] === 'X'
      const code = Number.parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) return match
      return String.fromCodePoint(code)
    }
  )
}

/** Text content of the first `<tag>` in `xml`, CDATA unwrapped and decoded. */
function readTag(xml: string, tag: string): string | undefined {
  const match = new RegExp(
    `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`,
    'i'
  ).exec(xml)
  if (!match) return undefined
  const raw = match[1].trim()
  const cdata = /^<!\[CDATA\[([\s\S]*?)\]\]>$/.exec(raw)
  return (cdata ? cdata[1] : decodeEntities(raw)).trim()
}

/** Flatten a description that may carry markup into one line of plain text. */
function toPlainText(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Cut `text` to at most `max` characters on a word boundary, with an ellipsis. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/**
 * Parse an RSS 2.0 feed into the `limit` newest posts, newest first.
 * Hand-rolled on purpose: the blog's feed is flat (title, link, description,
 * pubDate per item), so a handful of regexes cover it without an XML
 * dependency. Items missing a title, a valid http(s) link or a parseable date
 * are skipped, not fatal.
 */
export function parseFeed(xml: string, limit: number): BlogPost[] {
  const dated: Array<{ item: string; published: Date }> = []

  for (const [, item] of xml.matchAll(
    /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi
  )) {
    const published = new Date(readTag(item, 'pubDate') ?? '')
    if (!Number.isNaN(published.getTime())) dated.push({ item, published })
  }

  // The feed lists items by slug, so the newest have to be found before the
  // list is cut; only those are then read in full and validated.
  dated.sort((a, b) => b.published.getTime() - a.published.getTime())

  const posts: BlogPost[] = []
  for (const { item, published } of dated) {
    if (posts.length >= limit) break
    const excerpt = truncate(
      toPlainText(readTag(item, 'description') ?? ''),
      MAX_EXCERPT_LENGTH
    )
    const parsed = BlogPostSchema.safeParse({
      title: (readTag(item, 'title') ?? '').replace(/\s+/g, ' '),
      url: readTag(item, 'link') ?? '',
      date: published.toISOString(),
      ...(excerpt ? { excerpt } : {}),
    })
    if (parsed.success) posts.push(parsed.data)
  }

  return posts
}
