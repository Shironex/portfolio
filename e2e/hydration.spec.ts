import { type Page, expect, test } from '@playwright/test'

import {
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  desktopReady,
  mobileReady,
  mockFeeds,
  skipBootSplash,
} from './helpers'

/**
 * No page hydrates with a mismatch. React reports one as a console error (a
 * "Hydration failed" text in development, a minified error with code 418, 423
 * or 425 in a production build), and recovers by throwing the server HTML
 * away, so nothing looks broken and only the console shows it. Each page here
 * loads once per viewport and fails on any such message.
 *
 * A mismatch comes from a value the server cannot know: the path of a static
 * 404, the clock, the viewport, a stored choice. Anything of that kind
 * renders a fixed value on the server and the real one after hydration.
 *
 * The dev server renders each request fresh, so a mismatch in a prerendered
 * page (the 404 shares one copy for every path) only shows in a production
 * build: `pnpm build && pnpm start`, then `pnpm test:e2e e2e/hydration.spec.ts`
 * reuses that server.
 */

const HYDRATION_ERROR =
  /hydration|hydrated|did(n't| not) match|Minified React error #(418|419|422|423|425)\b/i

const PAGES = [
  { name: 'the desktop', path: '/', hydrated: 'shell' },
  { name: 'a deep-linked window', path: '/?open=about', hydrated: 'shell' },
  { name: 'a project page', path: '/projects/shiranami', hydrated: 'shell' },
  { name: 'the status page', path: '/status', hydrated: 'idle' },
  { name: 'the 404 page', path: '/no-such-page', hydrated: 'idle' },
] as const

const VIEWPORTS = [
  { name: 'desktop', size: DESKTOP_VIEWPORT, ready: desktopReady },
  { name: 'mobile', size: MOBILE_VIEWPORT, ready: mobileReady },
] as const

/** Collect hydration errors, from the console and from uncaught errors. */
function watchHydration(page: Page) {
  const found: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' && HYDRATION_ERROR.test(message.text())) {
      found.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    if (HYDRATION_ERROR.test(error.message)) found.push(error.message)
  })
  return found
}

for (const viewport of VIEWPORTS) {
  test.describe(`hydration on ${viewport.name}`, () => {
    test.use({ viewport: viewport.size })
    test.slow()

    for (const target of PAGES) {
      test(`${target.name} (${target.path}) hydrates cleanly`, async ({
        page,
      }) => {
        const found = watchHydration(page)
        await mockFeeds(page)
        await skipBootSplash(page)

        await page.goto(target.path)
        if (target.hydrated === 'shell') await viewport.ready(page)
        else await page.waitForLoadState('networkidle')

        expect(found).toEqual([])
      })
    }
  })
}
