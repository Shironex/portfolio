import { type Locator, type Page, expect, test } from '@playwright/test'

import type { Mode, SkyId } from '../src/lib/os/appearance'
import {
  AA_LARGE,
  type ContrastWalk,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  blockTurnstile,
  bootSplash,
  closeWindow,
  cmdPalette,
  contrastFailures,
  contrastRatio,
  contrastReadings,
  launch,
  lightbox,
  mobileLauncher,
  mockFeeds,
  openDesktop,
  openMobile,
  osWindow,
  settled,
  skipBootSplash,
  startMenu,
  taskbar,
  useMode,
  useSky,
} from './helpers'

/**
 * Colour contrast of what is actually on screen.
 *
 * Every main screen is walked with the Lamp off and on (night and paper
 * bodies), under the darkest sky and the lightest (the desktop and the boot
 * screen under all four): each visible run of text
 * has to reach WCAG AA (4.5:1, or 3:1 for large text) against its composited
 * background, and each icon 3:1. The generator's own gate
 * (`scripts/gen-tokens.mjs`) checks the token pairings; this checks that the
 * components use them, and that nothing reads straight off a sky.
 */
const SKIES: SkyId[] = ['night', 'day']
const MODES: Mode[] = ['dark', 'light']

/** Every sky the wallpaper paints, for the desktop and the boot screen. */
const PAINTED_SKIES: SkyId[] = ['night', 'dusk', 'dawn', 'day']

/** A test title for a Lamp mode. */
const LAMP: Record<Mode, string> = { dark: 'lamp off', light: 'lamp on' }

/** Dock name, window title, and a line that is there once the app has loaded. */
const APPS = [
  ['Projects', 'projects.app', 'Pick one and it opens in its own window.'],
  ['About', 'about.me', 'Outside the editor'],
  ['Monitor', 'monitor.sys', 'Skills & tools'],
  ['Contact', 'contact.app', 'Send message'],
  ['Writing', 'writing.rss', 'Latest posts'],
  ['Readme', 'readme.md', 'Welcome to ShiroOS'],
] as const

/** No feed on the page is still showing its skeleton. */
async function feedsLoaded(target: Page | Locator) {
  await expect(target.locator('[aria-busy="true"]')).toHaveCount(0)
}

/** An app has its content, and no feed in it is still loading. */
async function loaded(app: Locator, line: string) {
  await expect(app.getByText(line).first()).toBeVisible()
  await feedsLoaded(app)
  await settled(app)
}

/**
 * In progress and featured, with a gallery: every badge of the detail hero.
 * `caption` is how the caption of its first screenshot starts.
 */
const PROJECT = {
  title: 'Moekoder',
  window: 'moekoder.app',
  slug: 'moekoder',
  caption: 'Home screen',
}

/**
 * What the walk leaves out, and what it does not reach at all.
 *
 * `exempt`: the ambient loops (the terminal cursor, the featured banner) are
 * pure decoration, which AA does not cover. `overImage`: a gallery caption sits on a screenshot, under a scrim that
 * fades to nothing above the text; the probe measures every stop of a
 * gradient, the clear one included, so the caption cannot pass on its own.
 * It is held to one line, where the scrim is 60% black or more (see
 * `GalleryThumb`). Any other text over a picture fails unless its worst case
 * passes, as the lightbox caption does over the dimmed shell.
 *
 * Not walked: hover, focus and pressed states (the hovered close button is
 * the one exception below), placeholders, disabled controls, the text
 * selection colour, the mobile sheets of Monitor, Contact, Writing and
 * Readme, and the page without JavaScript in anything but the default
 * appearance, which is the only one it can have. Dusk and Dawn sit between
 * the two skies the apps are walked in.
 */
const WALK: ContrastWalk = {
  exempt: ['.ambient-loop'],
  overImage: [
    'button[aria-label^="View full size"] > span[title]',
    'figure > span[title]',
  ],
}

/**
 * Walk a screen and return its AA failures. `known` is a line of the screen
 * that has to be among the readings: a walk that did not reach the content
 * it was pointed at fails here instead of passing on nothing.
 */
async function failuresOn(screen: string, target: Locator, known: string) {
  const readings = await contrastReadings(target, WALK)
  expect(
    readings.some((reading) => reading.what.includes(known.slice(0, 40))),
    `${screen}: "${known}" was not measured`
  ).toBe(true)
  return {
    readings,
    failures: contrastFailures(readings).map((line) => `${screen}: ${line}`),
  }
}

/** Turnstile that hands over a token at once, with no call to Cloudflare. */
async function fakeTurnstile(page: Page) {
  await page.route('**/challenges.cloudflare.com/**', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `
        window.turnstile = {
          render(el, options) {
            setTimeout(() => options.callback('test-token'), 0)
            return 'fake'
          },
          reset() {}, remove() {}, execute() {}, isExpired: () => false,
          getResponse: () => 'test-token',
        }
        const onload = new URL(document.currentScript.src).searchParams.get('onload')
        if (onload) window[onload]()
      `,
    })
  )
}

/**
 * Answer the contact form's server action here, so nothing is sent: an empty
 * result, which is what the action returns when the mail has gone out.
 */
async function mockSend(page: Page) {
  await page.route(
    (url) => url.pathname === '/',
    (route) => {
      const request = route.request()
      if (request.method() !== 'POST' || !request.headers()['next-action']) {
        return route.fallback()
      }
      return route.fulfill({
        contentType: 'text/x-component',
        body: '0:{"a":"$@1","f":"","b":"development"}\n1:{}\n',
      })
    }
  )
}

// Contrast is a property of the settled page: with reduced motion nothing is
// measured halfway through a fade.
test.use({ reducedMotion: 'reduce' })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
})

for (const sky of SKIES) {
  for (const mode of MODES) {
    test.describe(`${sky} sky, ${LAMP[mode]}`, () => {
      test.beforeEach(async ({ page }) => {
        await skipBootSplash(page)
        await useMode(page, mode)
        await useSky(page, sky)
      })

      test('desktop text and icons meet AA', async ({ page }) => {
        test.slow()
        await blockTurnstile(page)
        await page.setViewportSize(DESKTOP_VIEWPORT)
        await openDesktop(page)
        await expect(page.locator('html')).toHaveAttribute('data-sky', sky)
        await feedsLoaded(page)

        const failures: string[] = []
        const walk = async (screen: string, target: Locator, known: string) => {
          const result = await failuresOn(screen, target, known)
          failures.push(...result.failures)
          return result.readings
        }

        await walk('desktop', page.locator('body'), "hi, I'm Kacper.")

        for (const [name, title, line] of APPS) {
          const win = await launch(page, name, title)
          await loaded(win, line)
          await walk(title, win, line)
          await closeWindow(win)
        }

        const projects = await launch(page, 'Projects', 'projects.app')
        await projects
          .getByRole('button', { name: `Open ${PROJECT.title}`, exact: true })
          .click()
        const detail = osWindow(page, PROJECT.window)
        await expect(detail).toBeVisible()
        await settled(detail)
        const inDetail = await walk(PROJECT.window, detail, PROJECT.title)
        // The captions are read, and are the only text let off as over a
        // picture: the allowance in `WALK` is not a dead entry.
        if (!inDetail.some((reading) => reading.expected)) {
          failures.push(`${PROJECT.window}: no gallery caption was measured`)
        }

        await detail
          .getByRole('button', { name: /^View full size:/ })
          .first()
          .click()
        const box = lightbox(page)
        await expect(box).toBeVisible()
        await settled(box)
        await walk('lightbox', box, PROJECT.caption)
        await page.keyboard.press('Escape')
        await expect(box).toBeHidden()

        // The close button turns into a filled danger button under the
        // pointer. Its glyph is an icon, not text, so it needs 3:1 (SPEC
        // 2.4: cream on the danger red, 4.18:1).
        const close = detail.getByRole('button', { name: 'Close window' })
        await close.hover()
        await settled(close)
        const hovered = await contrastRatio(close)
        if (hovered < AA_LARGE) {
          failures.push(`close button, hovered: ${hovered.toFixed(2)}:1`)
        }
        await close.click()
        await expect(detail).toBeHidden()
        await closeWindow(projects)

        await page.keyboard.press('Control+k')
        const cmd = cmdPalette(page)
        await expect(cmd).toBeVisible()
        await settled(cmd)
        await walk('command palette', cmd, 'quick actions')
        await page.keyboard.press('Escape')
        await expect(cmd).toBeHidden()

        await taskbar(page)
          .getByRole('button', { name: 'Open Start menu' })
          .click()
        const start = startMenu(page)
        await expect(start).toBeVisible()
        await settled(start)
        await walk('start menu', start, 'Pinned')

        expect(failures).toEqual([])
      })

      test('mobile text and icons meet AA', async ({ page }) => {
        test.slow()
        await blockTurnstile(page)
        await page.setViewportSize(MOBILE_VIEWPORT)
        await openMobile(page)
        await feedsLoaded(page)

        const failures: string[] = []
        const walk = async (screen: string, target: Locator, known: string) => {
          const result = await failuresOn(screen, target, known)
          failures.push(...result.failures)
        }

        await walk('feed', page.locator('body'), "hi, I'm Kacper.")

        await mobileLauncher(page).click()
        const launcher = page.getByRole('dialog', { name: 'App launcher' })
        await expect(launcher).toBeVisible()
        await settled(launcher)
        await walk('launcher', launcher, 'Elsewhere')

        for (const [name, title, line] of APPS.slice(0, 2)) {
          await launcher
            .getByRole('button', { name: `Open ${name}`, exact: true })
            .click()
          const sheet = page.getByRole('dialog', { name: title, exact: true })
          await loaded(sheet, line)
          await walk(`${title} sheet`, sheet, line)
          await sheet
            .getByRole('button', { name: 'Close', exact: true })
            .click()
          await expect(sheet).toBeHidden()
          await mobileLauncher(page).click()
          await expect(launcher).toBeVisible()
        }

        // A project sheet: on a phone the glow of its hero reaches the badges.
        await launcher
          .getByRole('button', { name: 'Open Projects', exact: true })
          .click()
        await page
          .getByRole('dialog', { name: 'projects.app', exact: true })
          .getByRole('button', { name: `Open ${PROJECT.title}`, exact: true })
          .click()
        const detail = page.getByRole('dialog', {
          name: PROJECT.window,
          exact: true,
        })
        await expect(detail).toBeVisible()
        await settled(detail)
        await walk(`${PROJECT.window} sheet`, detail, PROJECT.title)

        expect(failures).toEqual([])
      })

      test('the 404, the contact form states and a toast meet AA', async ({
        page,
        context,
      }) => {
        test.slow()
        await fakeTurnstile(page)
        await mockSend(page)
        await context.grantPermissions(['clipboard-read', 'clipboard-write'])
        await page.setViewportSize(DESKTOP_VIEWPORT)

        const failures: string[] = []
        const walk = async (screen: string, target: Locator, known: string) => {
          const result = await failuresOn(screen, target, known)
          failures.push(...result.failures)
        }

        await page.goto('/no-such-page')
        const missing = page.getByRole('dialog', { name: '404' })
        await expect(missing).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('data-sky', sky)
        await settled(missing)
        await walk('404', page.locator('body'), 'No such path')

        await openDesktop(page)
        const contact = await launch(page, 'Contact', 'contact.app')
        const send = contact.getByRole('button', { name: 'Send message' })
        await send.click()
        await expect(contact.getByText('Name is required')).toBeVisible()
        await walk('contact form, invalid', contact, 'Name is required')

        await contact.getByRole('textbox', { name: 'Name' }).fill('Test Person')
        await contact
          .getByRole('textbox', { name: 'Email' })
          .fill('test@example.com')
        await contact.getByRole('textbox', { name: 'Message' }).fill('Hello.')
        await send.click()
        await expect(contact.getByText('Message sent')).toBeVisible()
        await walk('contact form, sent', contact, 'Message sent')
        await closeWindow(contact)

        await page.keyboard.press('Control+k')
        await cmdPalette(page)
          .getByRole('option', { name: 'Copy email address' })
          .click()
        const toast = page.locator('[data-sonner-toast]')
        await expect(toast).toBeVisible()
        await settled(toast)
        await walk('toast', toast, 'Email copied')

        expect(failures).toEqual([])
      })
    })
  }
}

/*
 * The desktop and the boot screen in every painted sky: the wallpaper is
 * the one thing a sky changes, and these two are what sits on it or comes
 * before it. Live paints one of these four, by the hour in Warsaw.
 */
for (const sky of PAINTED_SKIES) {
  for (const mode of MODES) {
    test.describe(`${sky} sky, ${LAMP[mode]}, the desktop`, () => {
      test('the bare desktop meets AA', async ({ page }) => {
        await skipBootSplash(page)
        await useMode(page, mode)
        await useSky(page, sky)
        await mockFeeds(page)
        await page.setViewportSize(DESKTOP_VIEWPORT)
        await openDesktop(page)
        await expect(page.locator('html')).toHaveAttribute('data-sky', sky)
        await feedsLoaded(page)
        const { failures } = await failuresOn(
          'desktop',
          page.locator('body'),
          "hi, I'm Kacper."
        )
        expect(failures).toEqual([])
      })
    })

    test.describe(`${sky} sky, ${LAMP[mode]}, first visit`, () => {
      // Reduced motion skips the splash, so this one runs with motion on and
      // holds the page still itself: a frozen clock keeps the splash up, and
      // no animation is left to fade it out or to spin a mark away.
      test.use({ reducedMotion: 'no-preference' })

      test('the boot splash meets AA', async ({ page }) => {
        await useMode(page, mode)
        await useSky(page, sky)
        await page.addInitScript(() => {
          document.addEventListener('DOMContentLoaded', () => {
            const still = document.createElement('style')
            still.textContent = '*,*::before,*::after{animation:none!important}'
            document.head.append(still)
          })
        })
        await page.clock.install()
        await page.setViewportSize(DESKTOP_VIEWPORT)
        await page.goto('/')
        const splash = bootSplash(page)
        await expect(splash).toBeVisible()
        // Two steps done, one running, one waiting: every state of a step.
        await page.clock.runFor(1000)
        await expect(
          splash.getByRole('listitem').filter({ hasText: 'in progress' })
        ).toHaveText(/Priming panels/)

        const { failures } = await failuresOn(
          'boot splash',
          splash,
          'Mounting desk'
        )
        expect(failures).toEqual([])
      })
    })
  }
}

test('the project page without JavaScript meets AA', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: DESKTOP_VIEWPORT,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(`/projects/${PROJECT.slug}`)
  const article = page.locator('[data-ssr-project]')
  await expect(
    article.getByRole('heading', { name: PROJECT.title, level: 1 })
  ).toBeVisible()

  const { readings, failures } = await failuresOn(
    'static project page',
    article,
    PROJECT.title
  )
  expect(readings.some((reading) => reading.expected)).toBe(true)
  expect(failures).toEqual([])
  await context.close()
})
