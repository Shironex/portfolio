import rehypePrism from '@mapbox/rehype-prism'
import createMDX from '@next/mdx'
import { createJiti } from 'jiti'
import { fileURLToPath } from 'node:url'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env/server.ts', { default: true })
await jiti.import('./src/env/client.ts', { default: true })

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, remarkParse, remarkRehype],
    rehypePlugins: [rehypePrism, rehypeStringify],
  },
})

export default withMDX(nextConfig)
