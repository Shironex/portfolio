/* eslint-disable no-undef */
/* eslint-disable n/no-process-env */
import bundleAnalyzer from '@next/bundle-analyzer'
import { createJiti } from 'jiti'
import { fileURLToPath } from 'url'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env/server.ts', { default: true })
await jiti.import('./src/env/client.ts', { default: true })

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  cacheComponents: true,
  cacheLife: {
    hours: { stale: 3600, revalidate: 900, expire: 86400 },
    days: { stale: 86400, revalidate: 3600, expire: 604800 },
  },
  output: 'standalone',
}

export default withBundleAnalyzer(nextConfig)
