import { expect, test } from '@playwright/test'

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

/** Names that must never reach the public page, in any state. */
const FORBIDDEN = [
  'shinictl',
  'grafana',
  '100.127.',
  'app.lunofi.app',
  'alertmanager',
  'watchdog',
  'subslayer-api-dev',
  'domain',
]

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
