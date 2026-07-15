import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for ShiroOS portfolio.
 *
 * Boots the Next dev server (reusing an already-running one when present) and
 * drives it with Chromium. The suite is primarily a responsive-review harness:
 * it captures full-page screenshots across mobile and desktop viewports so the
 * desktop/mobile shell split can be eyeballed for bleed-through and layout
 * regressions.
 */
const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
