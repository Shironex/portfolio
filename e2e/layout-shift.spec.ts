import { type Page, expect, test } from '@playwright/test'

import {
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  mockFeeds,
  openDesktop,
  openMobile,
  skipBootSplash,
} from './helpers'

/**
 * Layout shift on the home route (SPEC 4: under 0.02). The server hero is
 * the first paint and the shell lays its own hero over it in the same place,
 * the wallpaper is a fixed layer under both, and the feeds fill boxes the
 * size of their skeletons: none of it may move what is already on screen.
 */
const CLS_BUDGET = 0.02

/** Long enough for the feeds, the wallpaper and the terminal reveal. */
const SETTLE_MS = 2500

/** Record every layout shift not caused by input, from the first paint. */
async function recordShifts(page: Page) {
  await page.addInitScript(() => {
    const state = window as unknown as { __shift: number }
    state.__shift = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[] &
        { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) state.__shift += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
}

function totalShift(page: Page) {
  return page.evaluate(() => (window as unknown as { __shift: number }).__shift)
}

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
  await recordShifts(page)
})

test('the desktop loads without layout shift', async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT)
  await openDesktop(page)
  await page.waitForTimeout(SETTLE_MS)
  expect(await totalShift(page)).toBeLessThan(CLS_BUDGET)
})

test('the phone feed loads without layout shift', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT)
  await openMobile(page)
  await page.waitForTimeout(SETTLE_MS)
  expect(await totalShift(page)).toBeLessThan(CLS_BUDGET)
})
