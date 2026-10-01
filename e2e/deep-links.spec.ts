import { expect, test } from '@playwright/test'

import {
  AFTER_RELOAD,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  bootSplash,
  desktopReady,
  location,
  mockFeeds,
  openDesktop,
  osWindow,
  osWindows,
  skipBootSplash,
  taskbar,
} from './helpers'

/**
 * Deep links: `/?open=<app>` for apps and `/projects/<slug>` for projects
 * (plus the legacy `/?project=<slug>`, which is rewritten to the route).
 *
 * Covers both directions of the binding. A link opens its window on load
 * (skipping the boot splash), and the address bar follows the topmost window
 * as windows open, take focus and close, without adding history entries or
 * dropping unrelated params. Also covers the copy-link control, the mobile
 * sheet and the project page without JavaScript.
 */
const PROJECT_SLUG = 'shiranami'
const PROJECT_TITLE = 'Shiranami'
const PROJECT_PATH = `/projects/${PROJECT_SLUG}`

const SITE_TITLE = /^Kacper Lachowicz: .* \| ShiroOS$/

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
})

test.describe('desktop', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

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

  test('a project route opens that project with no boot splash', async ({
    page,
  }) => {
    const response = await page.goto(PROJECT_PATH)
    expect(response?.status()).toBe(200)

    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect(page).toHaveTitle(`${PROJECT_TITLE} | ShiroOS`)
    expect(location(page)).toBe(PROJECT_PATH)
  })

  test('a project route serves the project as static HTML', async ({
    page,
    request,
  }) => {
    const html = await (await request.get(PROJECT_PATH)).text()
    expect(html).toContain(`>${PROJECT_TITLE}</h1>`)
    expect(html).toContain('Desktop music player for the library on your disk')
    expect(html).toContain(`rel="canonical" href="http://`)
    expect(html).toContain('"@type":"SoftwareSourceCode"')

    // Once the shell is up the static copy is inert, so assistive tech meets
    // the project once: in its window.
    await page.goto(PROJECT_PATH)
    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible()
    await expect(page.locator('[data-ssr-project]')).toHaveAttribute('inert')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText([
      PROJECT_TITLE,
    ])
  })

  test('an unknown project slug is a 404', async ({ page }) => {
    const response = await page.goto('/projects/no-such-project')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(
      page.locator('meta[name="robots"]:not([content*="noindex"])')
    ).toHaveCount(0)
    await expect(taskbar(page)).toHaveCount(0)
  })

  test('a legacy project param opens the project and moves to its route', async ({
    page,
  }) => {
    await page.goto(`/?project=${PROJECT_SLUG}&utm_source=test`)

    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect
      .poll(() => location(page))
      .toBe(`${PROJECT_PATH}?utm_source=test`)
  })

  test('the URL crosses between a project route and the desktop in place', async ({
    page,
  }) => {
    test.slow()
    await page.goto(PROJECT_PATH)
    const project = osWindow(page, `${PROJECT_SLUG}.app`)
    await expect(project).toBeVisible()
    await expect(page).toHaveTitle(`${PROJECT_TITLE} | ShiroOS`)
    const historyLength = await page.evaluate(() => window.history.length)
    // Lost on any real navigation or reload, so it proves the writes below
    // stay inside this document.
    await page.evaluate(() => {
      document.documentElement.dataset.sameDocument = 'yes'
    })

    await taskbar(page).getByRole('button', { name: 'Open About' }).click()
    const about = osWindow(page, 'about.me')
    await expect(about).toBeVisible()
    await expect.poll(() => location(page)).toBe('/?open=about')
    // The tab title follows the path, as a fresh load of that URL would.
    await expect(page).toHaveTitle(SITE_TITLE)
    await expect(project).toBeVisible()

    await about.getByRole('button', { name: 'Close window' }).click()
    await expect(about).toBeHidden()
    await expect.poll(() => location(page)).toBe(PROJECT_PATH)
    await expect(page).toHaveTitle(`${PROJECT_TITLE} | ShiroOS`)

    await project.getByRole('button', { name: 'Close window' }).click()
    await expect(project).toBeHidden()
    await expect.poll(() => location(page)).toBe('/')
    await expect(page).toHaveTitle(SITE_TITLE)

    await expect(page.locator('html')).toHaveAttribute(
      'data-same-document',
      'yes'
    )
    expect(await page.evaluate(() => window.history.length)).toBe(historyLength)

    // Each URL the shell wrote is a real page: reloading lands on it. The
    // assertions below wait for the shell, so the reload need not wait for
    // the load event (slow on a busy dev server).
    await page.reload({ waitUntil: 'commit' })
    await desktopReady(page, AFTER_RELOAD)
    await expect(osWindows(page)).toHaveCount(0)
  })

  test('opening a project from the desktop writes its route', async ({
    page,
  }) => {
    test.slow()
    await skipBootSplash(page)
    await openDesktop(page, '/?utm_source=test')

    await page
      .getByRole('button', { name: `Open ${PROJECT_TITLE}`, exact: true })
      .first()
      .click()
    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible()
    await expect
      .poll(() => location(page))
      .toBe(`${PROJECT_PATH}?utm_source=test`)

    await page.reload({ waitUntil: 'commit' })
    await expect(osWindow(page, `${PROJECT_SLUG}.app`)).toBeVisible(
      AFTER_RELOAD
    )
    await expect(bootSplash(page)).toBeHidden()
  })

  test('the URL follows open, focus and close without growing history', async ({
    page,
  }) => {
    await skipBootSplash(page)
    await openDesktop(page, '/?utm_source=test')
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
    await skipBootSplash(page)
    await openDesktop(page, '/?open=nope&project=missing')

    await expect(osWindows(page)).toHaveCount(0)
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

  test('a project window copies its route URL', async ({
    page,
    context,
    baseURL,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${PROJECT_PATH}?utm_source=test`)

    await osWindow(page, `${PROJECT_SLUG}.app`)
      .getByRole('button', { name: 'Copy link to this window' })
      .click()

    await expect(page.getByText('Link copied')).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      new URL(PROJECT_PATH, baseURL).href
    )
  })
})

test.describe('mobile', () => {
  test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true })

  test('a project route opens its sheet and closing returns to the desktop', async ({
    page,
  }) => {
    await page.goto(PROJECT_PATH)

    const sheet = osWindow(page, `${PROJECT_SLUG}.app`)
    await expect(sheet).toBeVisible()
    await expect(bootSplash(page)).toBeHidden()
    await expect(sheet).toHaveAttribute('aria-modal', 'true')

    await sheet.getByRole('button', { name: 'Close', exact: true }).tap()
    await expect(sheet).toBeHidden()
    await expect.poll(() => location(page)).toBe('/')
  })
})

test.describe('without JavaScript', () => {
  test.use({ viewport: DESKTOP_VIEWPORT, javaScriptEnabled: false })

  const HIDE_SHELL_RULE =
    '<noscript><style>[data-os-shell]{display:none}</style></noscript>'
  const FALLBACK_HEADING = 'ShiroOS needs JavaScript'

  test('a project route shows the static project, not the shell', async ({
    page,
    request,
  }) => {
    // The dev server streams the shell in a segment only JavaScript reveals,
    // while a build has it in the static HTML, on top of the article. The
    // markup is checked as well, so the rule that hides it there is covered.
    const html = await (await request.get(PROJECT_PATH)).text()
    expect(html).toContain(HIDE_SHELL_RULE)
    expect(html).not.toContain(FALLBACK_HEADING)

    await page.goto(PROJECT_PATH)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText([
      PROJECT_TITLE,
    ])
    await expect(
      page
        .getByRole('article')
        .getByText('Desktop music player for the library on your disk')
    ).toBeVisible()
    await expect(taskbar(page)).toBeHidden()
  })

  test('the desktop keeps its fallback card', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain(FALLBACK_HEADING)
    expect(html).not.toContain(HIDE_SHELL_RULE)
  })
})
