/* eslint-disable no-undef */
/* eslint-disable n/no-process-env */
import { withSentryConfig } from '@sentry/nextjs'
import { createJiti } from 'jiti'
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
  cacheComponents: true,
  cacheLife: {
    hours: { stale: 3600, revalidate: 900, expire: 86400 },
    days: { stale: 86400, revalidate: 3600, expire: 604800 },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure bullmq/ioredis are bundled to avoid serverExternalPackages warnings
      config.externals = (config.externals || []).filter(
        (ext) =>
          !(typeof ext === 'string' && (ext === 'bullmq' || ext === 'ioredis'))
      )
    }

    return config
  },
  output: 'standalone',
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG || 'tabitabi',
  project: process.env.SENTRY_PROJECT || 'portfolio',
  sentryUrl: process.env.SENTRY_URL || 'https://sentry.tabitabi.dev',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
})
