/* eslint-disable n/no-process-env */

// PostHog is deferred until the browser is idle or the user interacts with
// the page, whichever comes first. This keeps the posthog-js bundle out of
// the initial paint waterfall without dropping any high-intent events
// (contact clicks, project opens, form submits all happen post-interaction).

let booted = false

async function bootPosthog() {
  if (booted) return
  booted = true
  const { default: posthog } = await import('posthog-js')
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: 'https://us.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })
}

if (typeof window !== 'undefined') {
  const schedule =
    typeof window.requestIdleCallback === 'function'
      ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2000 })
      : (cb: () => void) => window.setTimeout(cb, 1500)

  schedule(() => {
    void bootPosthog()
  })

  const eager = () => {
    void bootPosthog()
  }
  ;(['pointerdown', 'keydown', 'scroll'] as const).forEach((evt) =>
    window.addEventListener(evt, eager, { once: true, passive: true })
  )
}
