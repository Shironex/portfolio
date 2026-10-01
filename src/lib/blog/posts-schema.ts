import { z } from 'zod'

/**
 * Wire shape of `/api/blog-posts`. Kept free of server imports so the
 * writing app can parse the response with the same schema the route emits.
 */
export const BlogPostSchema = z.object({
  title: z.string().min(1),
  /** Absolute http(s) link to the post; anything else is rejected. */
  url: z.url({ protocol: /^https?$/ }),
  /** Publish date as an ISO 8601 timestamp. */
  date: z.iso.datetime(),
  excerpt: z.string().optional(),
})

export type BlogPost = z.infer<typeof BlogPostSchema>

export const BlogPostsSchema = z.object({
  posts: z.array(BlogPostSchema),
})

export type BlogPosts = z.infer<typeof BlogPostsSchema>
