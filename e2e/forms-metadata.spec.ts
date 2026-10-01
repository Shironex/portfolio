import { type Locator, type Page, expect, test } from '@playwright/test'

import { CONTACT_DRAFT_STORAGE_KEY } from '../src/hooks/use-contact-draft'
import {
  DESKTOP_VIEWPORT,
  blockTurnstile,
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
 * both modes, and says so when the captcha is missing; what was typed
 * survives closing the window. The contribution heatmap is one image, not a
 * run of tab stops. The document head carries a canonical, `viewport-fit=cover`
 * and a theme colour that follows the site's own mode, and the 404 has a
 * title of its own.
 *
 * Turnstile never runs here: its script is blocked, so the widget stays empty
 * and no token arrives. That is the "captcha not completed" state, without a
 * call to Cloudflare.
 */
const AA_TEXT = 4.5

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

/**
 * WCAG contrast of an element's text against what is painted behind it.
 * Every background colour from the root down to the element is painted onto
 * a canvas, which blends the translucent ones and reads any colour syntax.
 */
function contrastRatio(target: Locator) {
  return target.evaluate((el) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('no 2d context')

    const paint = (color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
    }
    const luminance = () => {
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
        .slice(0, 3)
        .map((v) => {
          const s = v / 255
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const layers: string[] = []
    for (let node: Element | null = el; node; node = node.parentElement) {
      layers.unshift(getComputedStyle(node).backgroundColor)
    }
    paint('#fff')
    layers.forEach(paint)
    const background = luminance()

    paint(getComputedStyle(el).color)
    const text = luminance()

    const [hi, lo] = [background, text].sort((a, b) => b - a)
    return (hi + 0.05) / (lo + 0.05)
  })
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

    await win.getByRole('button', { name: 'Close window' }).click()
    await expect(win).toBeHidden()
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
    const cells = el.querySelectorAll('[class*="size-[11px]"]').length
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

  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1)
  await expectThemeColorIsGround(page)
})

test('the theme colour follows the stored mode and the toggle', async ({
  page,
}) => {
  // The other direction: the OS asks for light, the site is set to dark.
  await page.emulateMedia({ colorScheme: 'light' })
  await useMode(page, 'dark')
  await openDesktop(page)

  await expect(page.locator('html')).toHaveClass(/\bdark\b/)
  await expectThemeColorIsGround(page)
  const dark = (await themeColors(page)).ground

  await page
    .getByRole('banner')
    .getByRole('button', { name: 'Switch to light theme' })
    .click()
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
  await expect.poll(async () => (await themeColors(page)).ground).not.toBe(dark)
  await expectThemeColorIsGround(page)
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
