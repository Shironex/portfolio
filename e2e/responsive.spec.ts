import { expect, test } from '@playwright/test'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Responsive review harness.
 *
 * Loads the home route at a spread of viewports, dismisses the boot splash, and
 * writes a full-viewport screenshot per size. Output dir is overridable with
 * SHOT_DIR so before/after passes can be compared side by side.
 *
 *   SHOT_DIR=/tmp/before pnpm exec playwright test
 *   SHOT_DIR=/tmp/after  pnpm exec playwright test
 */
const SHOT_DIR =
  process.env.SHOT_DIR ?? join(process.cwd(), 'test-results', 'review')

const VIEWPORTS = [
  { name: 'mobile-iphone-390', width: 390, height: 844 },
  { name: 'mobile-small-360', width: 360, height: 780 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const

test.beforeAll(() => {
  if (!existsSync(SHOT_DIR)) mkdirSync(SHOT_DIR, { recursive: true })
})

for (const vp of VIEWPORTS) {
  test(`responsive review — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/', { waitUntil: 'networkidle' })

    // Skip the boot splash (auto-dismisses at ~3.7s; Escape is instant).
    const boot = page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
    if (await boot.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape')
      await boot.waitFor({ state: 'hidden' }).catch(() => {})
    }

    // Let the shell settle (theme applied, media query resolved, panels in).
    await page.waitForTimeout(600)

    await page.screenshot({
      path: join(SHOT_DIR, `${vp.name}.png`),
      fullPage: false,
    })

    // Sanity: the shell rendered its chrome (the "ShiroOS" brand shows in the
    // mobile top bar and the desktop menubar), not a blank/error page. The
    // body itself is all position:fixed, so it collapses to zero height and
    // can't be asserted visible directly.
    await expect(page.getByText('ShiroOS').first()).toBeVisible()
  })
}
