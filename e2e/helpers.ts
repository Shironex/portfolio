import { type Locator, type Page, expect } from '@playwright/test'
import { join } from 'node:path'

import { BOOT_STORAGE_KEY } from '../src/components/os/boot'
import {
  SHELL_READY_ATTRIBUTE,
  SHELL_ROOT_ATTRIBUTE,
} from '../src/components/os/noscript-fallback'
import { MODE_STORAGE_KEY } from '../src/lib/os/appearance'
import { WINDOW_ID_ATTRIBUTE } from '../src/lib/os/dom'

/** API routes answered from the showcase fixtures, so no test waits on GitHub or the blog. */
const FIXTURE_ROUTES = ['github-activity', 'github-contributions', 'blog-posts']

const FIXTURE_DIR = join(process.cwd(), 'showcase', 'fixtures')

export const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
export const MOBILE_VIEWPORT = { width: 390, height: 844 }

/** Default rect of the About window, from `APP_WINDOW_DEFAULTS`. */
export const ABOUT_RECT = { x: 180, y: 120, width: 820, height: 580 }

/** Class of every decorative loop the shell can hold still. */
export const AMBIENT_LOOP_CLASS = 'ambient-loop'

/** Usable desktop area for a viewport: the insets in `geometry.ts`. */
export function areaFor(viewport: { width: number; height: number }) {
  return {
    x: 8,
    y: 44,
    width: viewport.width - 16,
    height: viewport.height - 108,
  }
}

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

/**
 * Keep Turnstile off the network: its script never loads, so the widget
 * stays empty and no token arrives. For every test that opens the contact
 * form. Call before the first `goto`.
 */
export async function blockTurnstile(page: Page) {
  await page.route('**/challenges.cloudflare.com/**', (route) => route.abort())
}

/** Store the site's mode, as the theme toggle would. Call before the first `goto`. */
export async function useMode(page: Page, mode: 'light' | 'dark') {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [MODE_STORAGE_KEY, mode]
  )
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

/** A desktop window by its id; matches nothing once it has left the DOM. */
export function windowById(page: Page, id: string) {
  return page.locator(`[${WINDOW_ID_ATTRIBUTE}="${id}"]`)
}

export function titleBar(win: Locator) {
  return win.getByRole('toolbar')
}

export async function rectOf(target: Locator) {
  const box = await target.boundingBox()
  if (!box) throw new Error('element is not visible')
  return box
}

/**
 * Wait out the animations running on an element. A window or a lightbox that
 * just opened is still scaling in, and a box measured then is not where it
 * ends up.
 */
export async function settled(target: Locator) {
  await target.evaluate((el) =>
    Promise.all(el.getAnimations().map((animation) => animation.finished))
  )
}

/** The spot a gesture grabs a settled title bar by, clear of the controls. */
export async function titleBarGrip(win: Locator) {
  await settled(win)
  const box = await rectOf(win)
  return { x: box.x + 120, y: box.y + 18 }
}

/** Play state of every decorative loop on the page. */
export function ambientPlayStates(page: Page) {
  return page.evaluate(
    (loopClass) =>
      Array.from(document.getElementsByClassName(loopClass)).map(
        (el) => getComputedStyle(el).animationPlayState
      ),
    AMBIENT_LOOP_CLASS
  )
}

export interface StartedAnimation {
  name: string
  /** Its duration in ms, as computed when it started. */
  ms: number
}

/**
 * Record every CSS animation that starts from here on, on the elements
 * matching `selector` or anywhere. Returns a read of what has started so far.
 * One recorder per page load.
 */
export async function recordAnimations(page: Page, selector?: string) {
  await page.evaluate((only) => {
    const state = window as unknown as { __animations: StartedAnimation[] }
    state.__animations = []
    document.addEventListener('animationstart', (event) => {
      const target = event.target as Element
      if (only && !target.matches(only)) return
      const seconds = Number.parseFloat(
        getComputedStyle(target).animationDuration
      )
      state.__animations.push({
        name: event.animationName,
        ms: Math.round(seconds * 1000),
      })
    })
  }, selector ?? null)
  return () =>
    page.evaluate(
      () =>
        (window as unknown as { __animations: StartedAnimation[] }).__animations
    )
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

/** The shell root once it has hydrated. */
export function readyShell(page: Page) {
  return page.locator(`[${SHELL_ROOT_ATTRIBUTE}][${SHELL_READY_ATTRIBUTE}]`)
}

/**
 * The mobile shell is in the server HTML and shown by CSS, so its launcher
 * being visible proves nothing; the shell marks itself once it has hydrated.
 */
export async function mobileReady(page: Page, options?: { timeout: number }) {
  await expect(readyShell(page)).toBeVisible(options)
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
