import { type Page, expect, test } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  AFTER_RELOAD,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  launch,
  mockFeeds,
  openDesktop,
  openMobile,
  skipBootSplash,
} from './helpers'

/**
 * The Lamp: night window bodies (the default, `<html class="dark">`) or warm
 * paper ones. The toggle is in the mobile top bar and in the menu bar; the
 * choice is stored and applied again before the first paint of the next load.
 * The ground stays night either way. Both states are screenshotted for review.
 */
const SHOT_DIR =
  process.env.SHOT_DIR ?? join(process.cwd(), 'test-results', 'review')

/** `#13253a`, the night body, and `#e8e4dc`, the paper one. */
const NIGHT_BODY = 'rgb(19, 37, 58)'
const PAPER_BODY = 'rgb(232, 228, 220)'
const GROUND = 'rgb(11, 20, 32)'

test.beforeAll(() => {
  if (!existsSync(SHOT_DIR)) mkdirSync(SHOT_DIR, { recursive: true })
})

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

function grounds(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor)
}

test('the mobile top bar turns the lamp on and off', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT)
  await openMobile(page)

  const html = page.locator('html')
  const on = page.getByRole('button', { name: 'Turn the lamp on' })
  const off = page.getByRole('button', { name: 'Turn the lamp off' })

  // Night is the default: `.dark`, and the toggle offers the lamp.
  await expect(html).toHaveClass(/\bdark\b/)
  await expect(on).toBeVisible()
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-lamp-off.png') })

  await on.click()
  await expect(html).not.toHaveClass(/\bdark\b/)
  await expect(off).toBeVisible()
  expect(await grounds(page)).toBe(GROUND)
  await page.waitForTimeout(200)
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-lamp-on.png') })

  await off.click()
  await expect(html).toHaveClass(/\bdark\b/)
})

test('the menu bar lamp paints paper bodies and survives a reload', async ({
  page,
}) => {
  test.slow()
  await page.setViewportSize(DESKTOP_VIEWPORT)
  await openDesktop(page)
  const about = await launch(page, 'About', 'about.me')
  // The app body under the title bar, in the colour of the frame's body.
  const body = () =>
    about.evaluate(
      (el) =>
        getComputedStyle(
          el.querySelector('[role="toolbar"]')?.nextElementSibling ?? el
        ).backgroundColor
    )
  expect(await body()).toBe(NIGHT_BODY)

  await page
    .getByRole('banner')
    .getByRole('button', { name: 'Turn the lamp on' })
    .click()
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  await expect.poll(body).toBe(PAPER_BODY)
  expect(await grounds(page)).toBe(GROUND)

  // The boot script applies the stored lamp before React runs: the document
  // is paper at `domcontentloaded`, before any hydration.
  await page.reload({ waitUntil: 'domcontentloaded' })
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )
  ).toBe(false)
  await expect(
    page.getByRole('banner').getByRole('button', { name: 'Turn the lamp off' })
  ).toBeVisible(AFTER_RELOAD)
})
