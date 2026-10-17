import {
  type Locator,
  type Page,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  expect,
  test,
} from '@playwright/test'

import {
  DESKTOP_VIEWPORT,
  mockFeeds,
  openDesktop,
  osWindow,
  rectOf,
  settled,
  skipBootSplash,
  taskbar,
  titleBarGrip,
} from './helpers'

/**
 * The art pixel (SPEC 2.1) and the type sizes (SPEC 2.3) land on whole device
 * pixels at the device pixel ratios people actually have, so pixel art and
 * pixel type stay crisp: `--px` is a whole number of device pixels, and so is
 * one design pixel of each face at every type size. Runs in Chromium, WebKit
 * and Firefox (`playwright.config.ts`).
 */
const DPRS = [1, 1.25, 1.5, 1.75, 2, 2.625, 3]

/** Design pixels per em: Pixeloid Sans and Departure Mono. */
const PIXELOID_EM = 9
const DEPARTURE_EM = 11

/**
 * Labels follow the half pixel and are not snapped (SPEC 2.3): at DPR 1.25
 * the 0.6875rem floor wins and draws 1.25 device px per design pixel.
 */
const SOFT_LABEL_DPRS = new Set([1.25])

/** Within rounding of the computed style, a whole number. */
function expectWhole(value: number, what: string, tolerance = 0.01) {
  expect(
    Math.abs(value - Math.round(value)),
    `${what} = ${value} device px`
  ).toBeLessThan(tolerance)
}

/**
 * Layout keeps lengths in 1/64 CSS px units (Blink and WebKit), so a box
 * built from 2.4 px steps sits a few units off the exact value (a row of
 * 22 art px buttons adds up the error of each). Paint snaps every edge to the
 * nearest device pixel, so anything this close lands on it; a box really
 * off the grid is a third or a half of a pixel off.
 */
const LAYOUT_TOLERANCE = 0.1

/**
 * The art pixel tokens and every type size, in CSS px. A token that holds a
 * `calc()` computes to the unevaluated expression, so it is read as the
 * font size of a probe element: a computed font size is exact, where a width
 * is rounded to the layout grid (1/64 px). Lengths under the browser's
 * smallest font size are read at ten times their size.
 */
function measure(page: Page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const token = (name: string) =>
      Number.parseFloat(root.getPropertyValue(name))
    const probe = (value: string, scale = 1) => {
      const el = document.createElement('div')
      el.style.position = 'absolute'
      el.style.fontSize = `calc(${value} * ${scale})`
      document.body.append(el)
      const size = Number.parseFloat(getComputedStyle(el).fontSize)
      el.remove()
      return size / scale
    }
    return {
      px: token('--px'),
      hpx: token('--hpx'),
      spacing: probe('var(--spacing)', 10),
      dp: probe('var(--type-dp)', 10),
      dpDisplaySm: probe('var(--type-dp-display-sm)', 10),
      label: probe('var(--type-label)'),
      body: probe('var(--type-body)'),
      heading: probe('var(--type-heading)'),
      display: probe('var(--type-display)'),
      displaySm: probe('var(--type-display-sm)'),
    }
  })
}

/**
 * A desktop page at a device pixel ratio. Chromium and WebKit emulate the
 * ratio for a context; Playwright's Firefox ignores that, so it gets a browser
 * of its own with the ratio as a preference, as a real HiDPI screen would set
 * it. Firefox rounds a ratio to 60 app units per CSS px over a whole number of
 * device pixels (1.75 becomes 1.7647), so the page's own ratio is returned.
 */
type Engine = Pick<PlaywrightWorkerArgs, 'browser' | 'playwright'> &
  Pick<PlaywrightWorkerOptions, 'browserName'>

async function pageAt(
  dpr: number,
  { browser, browserName, playwright }: Engine
) {
  const own =
    browserName === 'firefox'
      ? await playwright.firefox.launch({
          firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(dpr) },
        })
      : null
  const context = await (own ?? browser).newContext(
    own
      ? { viewport: DESKTOP_VIEWPORT }
      : { viewport: DESKTOP_VIEWPORT, deviceScaleFactor: dpr }
  )
  const page = await context.newPage()
  await mockFeeds(page)
  await skipBootSplash(page)
  await openDesktop(page)
  const ratio = await page.evaluate(() => window.devicePixelRatio)
  const close = async () => {
    await context.close()
    await own?.close()
  }
  return { page, ratio, close }
}

for (const dpr of DPRS) {
  test(`at DPR ${dpr} the art pixel and the type sizes are whole device pixels`, async ({
    browser,
    browserName,
    playwright,
  }) => {
    const { page, ratio, close } = await pageAt(dpr, {
      browser,
      browserName,
      playwright,
    })
    try {
      expect(ratio).toBeCloseTo(dpr, 1)
      const m = await measure(page)

      expectWhole(m.px * ratio, '--px')
      expectWhole(m.hpx * ratio, '--hpx')
      expect(m.px).toBeGreaterThanOrEqual(1.9)
      // Spacing counts in art px.
      expect(m.spacing).toBeCloseTo(m.px, 2)

      // Line heights are whole multiples of these.
      expectWhole(m.dp * ratio, '--type-dp')
      expectWhole(m.dpDisplaySm * ratio, '--type-dp-display-sm')

      expectWhole((m.body * ratio) / PIXELOID_EM, 'text-body design pixel')
      expectWhole(
        (m.display * ratio) / PIXELOID_EM,
        'text-display design pixel'
      )
      expectWhole(
        (m.displaySm * ratio) / PIXELOID_EM,
        'mobile text-display design pixel'
      )
      expectWhole(
        (m.heading * ratio) / DEPARTURE_EM,
        'text-heading design pixel'
      )
      if (!SOFT_LABEL_DPRS.has(dpr)) {
        expectWhole((m.label * ratio) / DEPARTURE_EM, 'text-label design pixel')
      }

      // The floors of the spec table hold at every ratio (less a rounding
      // of the computed size).
      expect(m.label).toBeGreaterThan(10.99)
      expect(m.body).toBeGreaterThan(17.99)
      expect(m.heading).toBeGreaterThan(21.99)
      expect(m.display).toBeGreaterThan(35.99)
      expect(m.displaySm).toBeGreaterThan(26.99)
    } finally {
      await close()
    }
  })
}

/** Ratios the window chrome is checked at: whole, fractional, and HiDPI. */
const CHROME_DPRS = [1, 1.25, 1.5, 2]

/**
 * Every edge of `target` on a whole device pixel and a whole art pixel, so
 * its 9-slice chrome is drawn crisp. The rect includes a drag's transform.
 */
async function expectOnArtPixels(
  page: Page,
  target: Locator,
  ratio: number,
  what: string
) {
  const px = await page.evaluate(() =>
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--px')
    )
  )
  const box = await rectOf(target)
  for (const [edge, value] of Object.entries(box)) {
    expectWhole(value * ratio, `${what} ${edge}`, LAYOUT_TOLERANCE)
    expect(
      Math.abs(value / px - Math.round(value / px)),
      `${what} ${edge} = ${value / px} art px`
    ).toBeLessThan(LAYOUT_TOLERANCE)
  }
}

for (const dpr of CHROME_DPRS) {
  test(`at DPR ${dpr} a window stays on whole art pixels as it is dragged and resized`, async ({
    browser,
    browserName,
    playwright,
  }) => {
    const { page, ratio, close } = await pageAt(dpr, {
      browser,
      browserName,
      playwright,
    })
    try {
      await expectOnArtPixels(page, taskbar(page), ratio, 'taskbar')

      await taskbar(page).getByRole('button', { name: 'Open About' }).click()
      const about = osWindow(page, 'about.me')
      await expect(about).toBeVisible()
      await settled(about)
      await expectOnArtPixels(page, about, ratio, 'opened')

      // Odd distances, which no art pixel divides.
      const grip = await titleBarGrip(about)
      await page.mouse.move(grip.x, grip.y)
      await page.mouse.down()
      await page.mouse.move(grip.x + 137, grip.y + 71, { steps: 7 })
      await expectOnArtPixels(page, about, ratio, 'mid-drag')
      await page.mouse.up()
      await expectOnArtPixels(page, about, ratio, 'dropped')

      const east = await rectOf(about.locator('[data-resize-handle="e"]'))
      const start = { x: east.x + east.width / 2, y: east.y + 40 }
      await page.mouse.move(start.x, start.y)
      await page.mouse.down()
      await page.mouse.move(start.x + 53, start.y, { steps: 5 })
      await expectOnArtPixels(page, about, ratio, 'mid-resize')
      await page.mouse.up()
      await expectOnArtPixels(page, about, ratio, 'resized')

      const corner = await rectOf(about.locator('[data-resize-handle="nw"]'))
      const nw = { x: corner.x + 2, y: corner.y + 2 }
      await page.mouse.move(nw.x, nw.y)
      await page.mouse.down()
      await page.mouse.move(nw.x - 29, nw.y - 17, { steps: 5 })
      await page.mouse.up()
      await expectOnArtPixels(page, about, ratio, 'resized from the corner')
    } finally {
      await close()
    }
  })
}
