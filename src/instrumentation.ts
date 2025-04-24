import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')

    const discordWorker = await import('./lib/workers/discord-worker')

    discordWorker
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }

  console.log('instrumentation registered')
}

export const onRequestError = Sentry.captureRequestError
