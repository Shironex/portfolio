import createMDX from '@next/mdx'
import { createJiti } from 'jiti'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { fileURLToPath } from 'url'

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env/server.ts', { default: true })
await jiti.import('./src/env/client.ts', { default: true })

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkParse, remarkRehype],
    rehypePlugins: [
      rehypePrism,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
      rehypeStringify,
    ],
  },
})

export default withMDX(nextConfig)
