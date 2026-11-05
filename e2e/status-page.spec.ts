import { expect, test } from '@playwright/test'

import { PUBLIC_CHECKS } from '../src/lib/status/services'
import {
  DESKTOP_VIEWPORT,
  contrastFailures,
  contrastReadings,
  settled,
  useMode,
} from './helpers'

/**
 * The status page (`/status`). It reads my Gatus monitor on the server, so
 * these hold whatever the monitor answers, including when it does not: the
 * page renders, says what it knows, leaks nothing internal and meets AA.
 */

const ALLOWED_NAMES = new Set(PUBLIC_CHECKS.map((check) => check.name))

/**
 * Generic words from the monitor's own plumbing. Internal hosts and panel
 * names are kept out of this public file on purpose: the row check below
 * already fails on any name that is not allowlisted.
 */
const FORBIDDEN = ['alertmanager', 'watchdog', 'subslayer-api-dev', 'domain']

test('the status page renders with its own title and one h1', async ({
  page,
}) => {
  const response = await page.goto('/status')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(/^Status \| /)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(
    page.getByRole('link', { name: 'Back to desktop' })
  ).toBeVisible()
})

test('the status page shows only allowlisted checks', async ({ page }) => {
  const response = await page.goto('/status')
  const html = (await response?.text())?.toLowerCase() ?? ''
  for (const name of FORBIDDEN) {
    expect(html, `"${name}" in the served HTML`).not.toContain(name)
  }
  const rowNames = await page
    .locator('main li > div:first-child > :last-child')
    .allInnerTexts()
  const unreachable = await page
    .getByRole('heading', { level: 1, name: /can't reach my monitor/i })
    .count()
  // With the monitor answering, an empty page would pass the loop below.
  expect(
    unreachable > 0 || rowNames.length > 0,
    'no service rows rendered'
  ).toBe(true)
  for (const name of rowNames) {
    expect(ALLOWED_NAMES, `"${name}" is not allowlisted`).toContain(
      name.split('\n')[0].trim()
    )
  }
})

test('the status page fits a 375 px phone without sideways scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/status')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

for (const mode of ['dark', 'light'] as const) {
  test(`the status page meets AA with the lamp ${mode === 'dark' ? 'off' : 'on'}`, async ({
    page,
  }) => {
    await useMode(page, mode)
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/status')
    const window = page.locator('article[aria-labelledby="status-title"]')
    await expect(window).toBeVisible()
    await settled(window)
    const failures = contrastFailures(await contrastReadings(window))
    expect(failures).toEqual([])
  })
}
