import { type Locator, type Page, expect } from '@playwright/test'
import { join } from 'node:path'

import { BOOT_STORAGE_KEY } from '../src/components/os/boot'

/** API routes answered from the showcase fixtures, so no test waits on GitHub or the blog. */
const FIXTURE_ROUTES = ['github-activity', 'github-contributions', 'blog-posts']

const FIXTURE_DIR = join(process.cwd(), 'showcase', 'fixtures')

export const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
export const MOBILE_VIEWPORT = { width: 390, height: 844 }

/**
 * Room for the shell to hydrate after a reload that only waits for commit.
 * A second document load is slow on a busy dev server, so tests that reload
 * are also marked slow.
 */
export const AFTER_RELOAD = { timeout: 30_000 }

/** Answer the feed API routes from fixtures. Call before the first `goto`. */
export async function mockFeeds(page: Page) {
  for (const name of FIXTURE_ROUTES) {
    await page.route(`**/api/${name}`, (route) =>
      route.fulfill({
        contentType: 'application/json',
        path: join(FIXTURE_DIR, `${name}.json`),
      })
    )
  }
}

/**
 * Mark the tab as already booted, so no load in this test shows the splash.
 * For every test that is not about the splash. Call before the first `goto`.
 */
export async function skipBootSplash(page: Page) {
  await page.addInitScript((key) => {
    window.sessionStorage.setItem(key, '1')
  }, BOOT_STORAGE_KEY)
}

export function bootSplash(page: Page) {
  return page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
}

export function osWindow(page: Page, title: string) {
  return page.getByRole('dialog', { name: title, exact: true })
}

/** Every open desktop window: the only non-modal dialogs in the shell. */
export function osWindows(page: Page) {
  return page.locator('[role="dialog"][aria-modal="false"]')
}

export function titleBar(win: Locator) {
  return win.getByRole('toolbar')
}

export function taskbar(page: Page) {
  return page.getByLabel('Taskbar')
}

/** The launcher button of the mobile top bar; only the mobile shell has one. */
export function mobileLauncher(page: Page) {
  return page.getByRole('button', { name: 'Open app launcher' })
}

/** Path and query of the current URL, the part a deep link lives in. */
export function location(page: Page) {
  const url = new URL(page.url())
  return url.pathname + url.search
}

/**
 * Wait for the desktop shell to be interactive. The taskbar is in the server
 * HTML, so its being visible proves nothing; its clock only gets a time once
 * the shell has hydrated and run its effects.
 */
export async function desktopReady(page: Page, options?: { timeout: number }) {
  await expect(taskbar(page)).toBeVisible(options)
  await expect(taskbar(page).locator('time[datetime]')).toBeVisible(options)
}

/** The mobile shell only replaces the desktop one after hydration. */
export async function mobileReady(page: Page, options?: { timeout: number }) {
  await expect(mobileLauncher(page)).toBeVisible(options)
}

/** Land on the plain desktop (or `path`) with the shell hydrated. */
export async function openDesktop(page: Page, path = '/') {
  await page.goto(path)
  await desktopReady(page)
}

/** Same as {@link openDesktop}, at a mobile viewport. */
export async function openMobile(page: Page, path = '/') {
  await page.goto(path)
  await mobileReady(page)
}

/** Open an app from the taskbar and return its window. */
export async function launch(page: Page, appName: string, title: string) {
  await taskbar(page)
    .getByRole('button', { name: `Open ${appName}` })
    .click()
  const win = osWindow(page, title)
  await expect(win).toBeVisible()
  return win
}
