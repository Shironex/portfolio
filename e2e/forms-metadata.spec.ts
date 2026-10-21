import { type Locator, type Page, expect, test } from '@playwright/test'

import { CONTACT_DRAFT_STORAGE_KEY } from '../src/hooks/use-contact-draft'
import {
  AA_TEXT,
  DESKTOP_VIEWPORT,
  blockTurnstile,
  closeWindow,
  contrastRatio,
  desktopReady,
  launch,
  mockFeeds,
  openDesktop,
  osWindow,
  skipBootSplash,
  useMode,
} from './helpers'

/**
 * Forms and document metadata.
 *
 * The contact form reports problems inline, in a colour that is readable in
 * both modes, and says so when the captcha is missing; an autofilled field
 * keeps its ink, and what was typed survives closing the window. The contribution heatmap is one image, not a
 * run of tab stops. The document head carries a canonical, `viewport-fit=cover`
 * and a theme colour that is the ground navy whatever the Lamp says, and the
 * 404 has a title of its own.
 *
 * Turnstile never runs here: its script is blocked, so the widget stays empty
 * and no token arrives. That is the "captcha not completed" state, without a
 * call to Cloudflare.
 */
const DRAFT = {
  name: 'Test Person',
  email: 'test@example.com',
  message: 'Hello there.',
}

async function fillContact(win: Locator, values: typeof DRAFT) {
  await win.getByRole('textbox', { name: 'Name' }).fill(values.name)
  await win.getByRole('textbox', { name: 'Email' }).fill(values.email)
  await win.getByRole('textbox', { name: 'Message' }).fill(values.message)
}

async function expectContact(win: Locator, values: typeof DRAFT) {
  await expect(win.getByRole('textbox', { name: 'Name' })).toHaveValue(
    values.name
  )
  await expect(win.getByRole('textbox', { name: 'Email' })).toHaveValue(
    values.email
  )
  await expect(win.getByRole('textbox', { name: 'Message' })).toHaveValue(
    values.message
  )
}

/**
 * Every `theme-color` tag and the page ground, as computed colours. The tags
 * carry no media query: the mode is the site's setting, not the OS scheme.
 */
function themeColors(page: Page) {
  return page.evaluate(() => {
    const computed = (color: string) => {
      const probe = document.createElement('span')
      probe.style.color = color
      document.body.append(probe)
      const value = getComputedStyle(probe).color
      probe.remove()
      return value
    }
    const tags = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    )
    return {
      metas: tags.map((tag) => computed(tag.content)),
      media: tags.map((tag) => tag.getAttribute('media')),
      ground: getComputedStyle(document.body).backgroundColor,
    }
  })
}

/** The theme colour is the page ground itself, in every tag there is. */
async function expectThemeColorIsGround(page: Page) {
  await expect
    .poll(async () => {
      const { metas, media, ground } = await themeColors(page)
      return (
        metas.length > 0 &&
        metas.every((color) => color === ground) &&
        media.every((query) => query === null)
      )
    })
    .toBe(true)
}

async function openContact(page: Page) {
  await page.goto('/?open=contact')
  await desktopReady(page)
  const win = osWindow(page, 'contact.app')
  await expect(win.getByRole('button', { name: 'Send message' })).toBeVisible()
  return win
}

test.use({ viewport: DESKTOP_VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await blockTurnstile(page)
  })

  for (const mode of ['light', 'dark'] as const) {
    test(`an empty submit shows readable inline errors in ${mode} mode`, async ({
      page,
    }) => {
      await useMode(page, mode)
      const win = await openContact(page)
      const isDark = await page
        .locator('html')
        .evaluate((html) => html.classList.contains('dark'))
      expect(isDark).toBe(mode === 'dark')

      await win.getByRole('button', { name: 'Send message' }).click()

      const errors = [
        win.getByText('Name is required'),
        win.getByText('Email is required'),
        win.getByText('Message is required'),
        // The label of an invalid field takes the error colour too.
        win.getByText('Name', { exact: true }),
        win.getByRole('alert'),
      ]
      for (const error of errors) {
        await expect(error).toBeVisible()
        expect(await contrastRatio(error)).toBeGreaterThanOrEqual(AA_TEXT)
      }

      // The message is what describes the field, and nothing else is named.
      const name = win.getByRole('textbox', { name: 'Name' })
      await expect(name).toHaveAttribute('aria-invalid', 'true')
      const describedBy = await name.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      for (const id of describedBy?.split(' ') ?? []) {
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
      }
    })
  }

  // A browser or password manager that fills Name and Email forces its own
  // text colour with `!important`. CDP forces that state (this spec runs in
  // the Chromium project only).
  for (const mode of ['light', 'dark'] as const) {
    test(`autofilled fields keep the ink in ${mode} mode`, async ({ page }) => {
      await useMode(page, mode)
      const win = await openContact(page)
      await fillContact(win, DRAFT)

      const cdp = await page.context().newCDPSession(page)
      await cdp.send('DOM.enable')
      await cdp.send('CSS.enable')
      const { root } = await cdp.send('DOM.getDocument')
      const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
        nodeId: root.nodeId,
        selector: 'input[name="name"], input[name="email"]',
      })
      expect(nodeIds).toHaveLength(2)
      for (const nodeId of nodeIds) {
        await cdp.send('CSS.forcePseudoState', {
          nodeId,
          forcedPseudoClasses: ['autofill'],
        })
      }

      const paint = (label: string) =>
        win.getByRole('textbox', { name: label }).evaluate((el) => ({
          autofill: el.matches(':autofill'),
          fill: getComputedStyle(el).webkitTextFillColor,
        }))
      // The message is never autofilled: its ink is the one to match.
      const ink = (await paint('Message')).fill
      for (const label of ['Name', 'Email']) {
        expect(await paint(label)).toEqual({ autofill: true, fill: ink })
      }
    })
  }

  test('sending without the captcha shows an inline alert', async ({
    page,
  }) => {
    const win = await openContact(page)
    // A field with no message describes itself with nothing.
    for (const label of ['Name', 'Email', 'Message']) {
      const field = win.getByRole('textbox', { name: label })
      await expect(field).toHaveAttribute('required', '')
      await expect(field).not.toHaveAttribute('aria-describedby')
      await expect(field).not.toHaveAttribute('aria-label')
    }

    await fillContact(win, DRAFT)
    await expect(win.getByRole('alert')).toHaveCount(0)
    await win.getByRole('button', { name: 'Send message' }).click()

    // Said once, inline: no toast repeats it.
    await expect(page.getByText(/complete the captcha/i)).toHaveCount(1)
    await expect(win.getByRole('alert')).toHaveText(/complete the captcha/i)
    // Nothing was sent, so the form and what was typed are still there.
    await expectContact(win, DRAFT)
  })

  test('the draft survives closing the window and never holds a token', async ({
    page,
  }) => {
    await openDesktop(page)
    let win = await launch(page, 'Contact', 'contact.app')
    await fillContact(win, DRAFT)

    await closeWindow(win)
    win = await launch(page, 'Contact', 'contact.app')
    await expectContact(win, DRAFT)

    await page.getByRole('menuitem', { name: 'File', exact: true }).click()
    await page.getByRole('menuitem', { name: 'Close all windows' }).click()
    await expect(win).toBeHidden()
    win = await launch(page, 'Contact', 'contact.app')
    await expectContact(win, DRAFT)

    // The write is debounced; what lands is the three typed fields only.
    await expect
      .poll(() =>
        page.evaluate(
          (key) => window.sessionStorage.getItem(key),
          CONTACT_DRAFT_STORAGE_KEY
        )
      )
      .toBe(JSON.stringify(DRAFT))
  })
})

test('the desktop: the heatmap adds no tab stops, the head is complete', async ({
  page,
}) => {
  // The OS asks for dark; the site has no stored mode, so it shows light.
  await page.emulateMedia({ colorScheme: 'dark' })
  await openDesktop(page)
  const graph = page
    .getByRole('img', { name: /contributions in the last 6 months/ })
    .first()
  await expect(graph).toBeVisible()

  const stops = await graph.evaluate((el) => {
    const cells = el.querySelectorAll('[data-day]').length
    const focusable = [el, ...el.querySelectorAll('*')].filter(
      (node) => node instanceof HTMLElement && node.tabIndex >= 0
    ).length
    return { cells, focusable }
  })
  // The fixture is rendered (a full grid of days), and none of it takes focus.
  expect(stops.cells).toBeGreaterThan(100)
  expect(stops.focusable).toBe(0)

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute('href')
  expect(new URL(canonical ?? '').pathname).toBe('/')

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    'content',
    /viewport-fit=cover/
  )

  // Night bodies are the default.
  await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1)
  await expectThemeColorIsGround(page)
})

test('the theme colour stays the ground with the lamp on', async ({ page }) => {
  // The OS asks for dark; the site is set to paper bodies, whose ground is
  // still night.
  await page.emulateMedia({ colorScheme: 'dark' })
  await useMode(page, 'light')
  await openDesktop(page)

  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  await expectThemeColorIsGround(page)
  const paper = (await themeColors(page)).ground
  expect(paper).toBe('rgb(11, 20, 32)')

  await page
    .getByRole('banner')
    .getByRole('button', { name: 'Turn the lamp off' })
    .click()
  await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  await expectThemeColorIsGround(page)
  expect((await themeColors(page)).ground).toBe(paper)
})

test('the 404 has its own title and is not indexed', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)

  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await expect(page).toHaveTitle('Page not found | ShiroOS')
  // Next writes a robots tag of its own for a not-found response, next to
  // the page's. Neither may invite indexing.
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((tags) => tags.map((tag) => tag.getAttribute('content')))
  expect(robots.length).toBeGreaterThan(0)
  for (const content of robots) expect(content).toMatch(/^noindex/)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})

/** Width and height of a PNG, from its IHDR chunk. */
function pngSize(body: Buffer) {
  expect(body.subarray(1, 4).toString('latin1')).toBe('PNG')
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) }
}

/**
 * The pixel Open Graph and Twitter cards (SPEC 1.1): the home page and a
 * project page point at their own card, described by its own alt text, and
 * each is a 1200x630 PNG (the 400x210 art at 3x).
 */
for (const [path, card, alt] of [
  ['/', '/opengraph-image', /^Kacper Lachowicz, full-stack developer/],
  [
    '/projects/moekoder',
    '/projects/moekoder/opengraph-image',
    /^Moekoder\. Desktop hardsub tool for anime archivists: .+\.$/,
  ],
  // An archived project, whose card draws its letter on the bare tile.
  [
    '/projects/write-wiz',
    '/projects/write-wiz/opengraph-image',
    /^Write-Wiz\. Project management tool for small teams .+\.$/,
  ],
] as const) {
  test(`${path} points og:image and twitter:image at its 1200x630 card`, async ({
    page,
    request,
  }) => {
    await skipBootSplash(page)
    await page.goto(path)
    const og = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content')
    const twitter = await page
      .locator('meta[name="twitter:image"]')
      .first()
      .getAttribute('content')
    expect(new URL(og!).pathname).toMatch(new RegExp(`^${card}`))
    // The home card is shared by both; a project page has no Twitter card of
    // its own, so it falls back to its Open Graph card.
    const twitterCard = path === '/' ? '/twitter-image' : card
    expect(new URL(twitter!).pathname).toMatch(new RegExp(`^${twitterCard}`))
    await expect(
      page.locator('meta[property="og:image:width"]')
    ).toHaveAttribute('content', '1200')
    // Each project's card is described by its title and lead sentence.
    await expect(
      page.locator('meta[property="og:image:alt"]').first()
    ).toHaveAttribute('content', alt)

    for (const url of [og!, twitter!]) {
      const response = await request.get(new URL(url).pathname)
      expect(response.status(), url).toBe(200)
      expect(response.headers()['content-type']).toBe('image/png')
      expect(pngSize(await response.body())).toEqual({
        width: 1200,
        height: 630,
      })
    }
  })
}

/** The width of each image in an ICO directory (0 stands for 256). */
function icoWidths(body: Buffer) {
  expect(body.readUInt16LE(2)).toBe(1)
  const count = body.readUInt16LE(4)
  return Array.from({ length: count }, (_, i) => body[6 + i * 16] || 256)
}

/**
 * The favicon, touch icon and manifest icons are the README logo tile at the
 * sizes they claim (SPEC 1.1), and the manifest paints the ground navy. The
 * ICO also holds a 16 px logo, so a 16 px tab gets drawn pixels.
 */
test('every icon is the size it claims', async ({ page, request }) => {
  await skipBootSplash(page)
  await page.goto('/')
  const links = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((tags) =>
      tags.map((tag) => ({
        href: tag.getAttribute('href')!,
        sizes: tag.getAttribute('sizes')!,
      }))
    )
  expect(links.map((l) => l.sizes).sort()).toEqual([
    '180x180',
    '32x32',
    '32x32',
  ])
  const isIco = (l: { href: string }) => l.href.startsWith('/favicon.ico')
  const ico = links.find(isIco)
  const pngs = links.filter((l) => !isIco(l))
  expect(ico, 'the linked favicon.ico').toBeDefined()
  const icoBody = await (await request.get(ico!.href)).body()
  expect(icoWidths(icoBody).sort((a, b) => a - b)).toEqual([16, 32])

  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest.theme_color).toBe('#0b1420')
  expect(manifest.background_color).toBe('#0b1420')
  const icons = [
    ...pngs,
    ...manifest.icons.map((icon: { src: string; sizes: string }) => ({
      href: icon.src,
      sizes: icon.sizes,
    })),
  ]
  for (const { href, sizes } of icons) {
    const response = await request.get(href)
    expect(response.status(), href).toBe(200)
    const { width, height } = pngSize(await response.body())
    expect(`${width}x${height}`, href).toBe(sizes)
  }
})
