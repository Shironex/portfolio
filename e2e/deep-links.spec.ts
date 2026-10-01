import { type Page, expect, test } from '@playwright/test'
import { join } from 'node:path'

/**
 * Deep links: `/?open=<app>` and `/?project=<slug>`.
 *
 * Covers both directions of the binding. A link opens its window on load
 * (skipping the boot splash), and the address bar follows the topmost window
 * as windows open, take focus and close, without adding history entries or
 * dropping unrelated params. Also covers the copy-link control and the mobile
 * sheet.
 */
const PROJECT_SLUG = 'shiranami'

/** API routes answered from the showcase fixtures, so no test waits on GitHub or the blog. */
const FIXTURE_ROUTES = ['github-activity', 'github-contributions', 'blog-posts']

const FIXTURE_DIR = join(process.cwd(), 'showcase', 'fixtures')

function bootSplash(page: Page) {
  return page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
}

function osWindow(page: Page, title: string) {
  return page.getByRole('dialog', { name: title, exact: true })
}

function taskbar(page: Page) {
  return page.getByLabel('Taskbar')
}

/** Path and query of the current URL, the part a deep link lives in. */
function location(page: Page) {
  const url = new URL(page.url())
  return url.pathname + url.search
}

async function dismissBoot(page: Page) {
  const boot = bootSplash(page)
  if (!(await boot.isVisible().catch(() => false))) return
  await page.keyboard.press('Escape')
  await boot.waitFor({ state: 'hidden' }).catch(() => {})
}

test.beforeEach(async ({ page }) => {
  for (const name of FIXTURE_ROUTES) {
    await page.route(`**/api/${name}`, (route) =>
      route.fulfill({
        contentType: 'application/json',
        path: join(FIXTURE_DIR, `${name}.json`),
      })
    )
  }
})

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('an app link opens that app with no boot splash', async ({ page }) => {
    await page.goto('/?open=about')

    const about = osWindow(page, 'about.me')
    await expect(about).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect(
      about.getByRole('heading', { name: 'Open source' })
    ).toBeVisible()
    expect(location(page)).toBe('/?open=about')
  })

  test('a writing link opens the posts from the feed', async ({ page }) => {
    await page.goto('/?open=writing')

    const writing = osWindow(page, 'writing.rss')
    await expect(writing).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect(
      writing.getByRole('link', { name: /Shiranami 2/ })
    ).toHaveAttribute('target', '_blank')
  })

  test('a project link opens that project with no boot splash', async ({
    page,
  }) => {
    await page.goto(`/?project=${PROJECT_SLUG}`)

    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    expect(location(page)).toBe(`/?project=${PROJECT_SLUG}`)
  })

  test('the URL follows open, focus and close without growing history', async ({
    page,
  }) => {
    await page.goto('/?utm_source=test', { waitUntil: 'networkidle' })
    await dismissBoot(page)
    const historyLength = await page.evaluate(() => window.history.length)

    await taskbar(page).getByRole('button', { name: 'Open Projects' }).click()
    const projects = osWindow(page, 'projects.app')
    await expect(projects).toBeVisible()
    await expect
      .poll(() => location(page))
      .toBe('/?utm_source=test&open=projects')

    await taskbar(page).getByRole('button', { name: 'Open About' }).click()
    const about = osWindow(page, 'about.me')
    await expect(about).toBeVisible()
    await expect.poll(() => location(page)).toBe('/?utm_source=test&open=about')

    // About opens overlapping Projects but leaves the top of its title bar
    // showing; pressing there brings Projects back to the front.
    await projects.click({ position: { x: 60, y: 10 } })
    await expect
      .poll(() => location(page))
      .toBe('/?utm_source=test&open=projects')

    // Closing the top window hands the URL to the one left open.
    await projects.getByRole('button', { name: 'Close window' }).click()
    await expect(projects).toBeHidden()
    await expect.poll(() => location(page)).toBe('/?utm_source=test&open=about')

    // Closing the last one clears the deep link and keeps the other param.
    await about.getByRole('button', { name: 'Close window' }).click()
    await expect(about).toBeHidden()
    await expect.poll(() => location(page)).toBe('/?utm_source=test')

    expect(await page.evaluate(() => window.history.length)).toBe(historyLength)
  })

  test('unknown app ids and project slugs are ignored', async ({ page }) => {
    await page.goto('/?open=nope&project=missing', {
      waitUntil: 'networkidle',
    })
    await dismissBoot(page)

    await expect(taskbar(page)).toBeVisible()
    // Windows are the only non-modal dialogs in the shell.
    await expect(
      page.locator('[role="dialog"][aria-modal="false"]')
    ).toHaveCount(0)
  })

  test('the title-bar button copies a link to its window', async ({
    page,
    context,
    baseURL,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/?open=about&utm_source=test')

    const about = osWindow(page, 'about.me')
    await about
      .getByRole('button', { name: 'Copy link to this window' })
      .click()

    await expect(page.getByText('Link copied')).toBeVisible()
    // The copied link names the window only, not the visitor's other params.
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      new URL('/?open=about', baseURL).href
    )
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('a project link opens its sheet and closing clears the param', async ({
    page,
  }) => {
    await page.goto(`/?project=${PROJECT_SLUG}`)

    const sheet = osWindow(page, `${PROJECT_SLUG}.app`)
    await expect(sheet).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect(sheet).toHaveAttribute('aria-modal', 'true')

    await sheet.getByRole('button', { name: 'Close', exact: true }).tap()
    await expect(sheet).toBeHidden()
    await expect.poll(() => location(page)).toBe('/')
  })
})
