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

// Coolify hands the commit of the deploy to the build as SOURCE_COMMIT (the
// dockerfile declares it as a build arg). A page from one deploy then only
// requests assets of that deploy, and a client that meets another deploy's
// server reloads instead of loading chunks that no longer exist. Unset (local
// builds) or a placeholder, no id is set and Next behaves as before.
const commit = process.env.SOURCE_COMMIT?.trim()
const deploymentId =
  process.env.NEXT_DEPLOYMENT_ID ||
  (commit && commit !== 'HEAD' ? commit : undefined)

/** @type {import('next').NextConfig} */
const nextConfig = {
  deploymentId,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    hours: { stale: 3600, revalidate: 900, expire: 86400 },
    days: { stale: 86400, revalidate: 3600, expire: 604800 },
  },
  output: 'standalone',
  async headers() {
    // My Gatus status page (another subdomain) shows the logo and loads the
    // pixel fonts from here. The proxy skips these paths, so nothing sets
    // its same-origin resource policy on them.
    const shared = [
      {
        key: 'Access-Control-Allow-Origin',
        value: 'https://status.shirone.dev',
      },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
      {
        key: 'Cache-Control',
        value: 'public, max-age=86400, stale-while-revalidate=604800',
      },
    ]
    return [
      { source: '/shared/:path*', headers: shared },
      { source: '/icon-192.png', headers: shared },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
