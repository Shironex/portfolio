import { expect, test } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Regression cover for mobile theme switching.
 *
 * The mobile shell originally shipped no theme toggle (only the desktop
 * menubar had one), so mobile users were stuck on the default light theme.
 * This drives the mobile top-bar toggle and asserts it flips `.dark` on
 * <html>, screenshotting both themes for review.
 */
const SHOT_DIR =
  process.env.SHOT_DIR ?? join(process.cwd(), 'test-results', 'review')

test.beforeAll(() => {
  if (!existsSync(SHOT_DIR)) mkdirSync(SHOT_DIR, { recursive: true })
})

test('mobile top bar toggles between light and dark themes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })

  const boot = page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
  if (await boot.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
    await boot.waitFor({ state: 'hidden' }).catch(() => {})
  }
  await page.waitForTimeout(400)

  const html = page.locator('html')
  const toDark = page.getByRole('button', { name: 'Switch to dark theme' })
  const toLight = page.getByRole('button', { name: 'Switch to light theme' })

  // Default is light: no `.dark`, and the toggle offers dark.
  await expect(html).not.toHaveClass(/\bdark\b/)
  await expect(toDark).toBeVisible()
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-theme-light.png') })

  // Flip to dark.
  await toDark.click()
  await expect(html).toHaveClass(/\bdark\b/)
  await expect(toLight).toBeVisible()
  await page.waitForTimeout(200)
  await page.screenshot({ path: join(SHOT_DIR, 'mobile-theme-dark.png') })

  // Flip back to light.
  await toLight.click()
  await expect(html).not.toHaveClass(/\bdark\b/)
})
