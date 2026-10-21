import { type Locator, type Page, expect, test } from '@playwright/test'

import {
  MOBILE_VIEWPORT,
  blockTurnstile,
  desktopReady,
  mobileLauncher,
  mockFeeds,
  openDesktop,
  openMobile,
  osWindow,
  settled,
  skipBootSplash,
  taskbar,
  titleBar,
  useMode,
} from './helpers'

/**
 * The phone shell in pixels (SPEC 1.7) and its edges: the header, dock,
 * launcher and sheets at 390x844 under a touch pointer, reflow at 320 css,
 * the 767/768 breakpoint, and the 44 css targets of a coarse pointer, on the
 * phone and on a tablet at desktop width (SPEC 4.4).
 *
 * At DPR 1 an art px is 2 css px: the header and every target are 22 art
 * px (44 css), a sheet's title bar 24 (48), the dock its targets plus a
 * 2 art px frame and 1 of padding above and below (56).
 */

/** Dock name, sheet title. */
const APPS = [
  ['Projects', 'projects.app'],
  ['About', 'about.me'],
  ['Monitor', 'monitor.sys'],
  ['Contact', 'contact.app'],
  ['Writing', 'writing.rss'],
  ['Readme', 'readme.md'],
] as const

const TARGET = 44
const NIGHT_GROUND = 'rgb(11, 20, 32)'
const TITLE_BAR_FILL = 'rgb(23, 58, 69)'
const NIGHT_BODY = 'rgb(19, 37, 58)'
const PAPER_BODY = 'rgb(232, 228, 220)'

/** A touch screen, so the pointer is coarse. */
const TOUCH = { hasTouch: true, isMobile: true }

/** A phone in the hand. */
const PHONE = { viewport: MOBILE_VIEWPORT, ...TOUCH }

const dock = (page: Page) => page.getByRole('navigation', { name: 'Dock' })
const sheet = (page: Page, title: string) =>
  page.getByRole('dialog', { name: title, exact: true })
const launcherSheet = (page: Page) =>
  page.getByRole('dialog', { name: 'App launcher' })

async function boxOf(target: Locator) {
  const box = await target.boundingBox()
  expect(box, 'the element has a box').not.toBeNull()
  return box!
}

const backgroundOf = (target: Locator) =>
  target.evaluate((el) => getComputedStyle(el).backgroundColor)

/** The title bar of a sheet: its first child. */
const sheetBar = (dialog: Locator) => dialog.locator('> div').first()

/** The scrolling body of a sheet: its last child. */
const sheetBody = (dialog: Locator) => dialog.locator('> div').last()

/**
 * Every control in `root` someone can reach that is under 44 css either way:
 * buttons, links, fields, switches, radios and tab stops, skipping what is
 * hidden or inert and links inside running text.
 */
function smallTargets(root: Locator) {
  return root.evaluate((el, min) => {
    const small: string[] = []
    const controls = el.querySelectorAll(
      'button, a[href], input, textarea, select, [role="switch"], [role="radio"], [tabindex="0"]'
    )
    for (const control of controls) {
      if (!control.checkVisibility() || control.closest('[inert]')) continue
      // A link inside a sentence is exempt (WCAG 2.5.8).
      if (getComputedStyle(control).display === 'inline') continue
      const { width, height } = control.getBoundingClientRect()
      if (width >= min - 0.01 && height >= min - 0.01) continue
      const name =
        control.getAttribute('aria-label') ??
        (control.textContent ?? '').trim().slice(0, 30)
      small.push(`${width.toFixed(1)}x${height.toFixed(1)} ${name}`)
    }
    return small
  }, TARGET)
}

/**
 * Nothing scrolls sideways and nothing visible runs past the screen's
 * sides: the page, and each scroller inside `root`. Decoration (hidden from
 * assistive tech) is left out: the footer skyline is a whole number of art
 * px wide and clips inside its strip.
 */
async function overflow(page: Page, root: Locator) {
  return root.evaluate((el) => {
    const width = window.innerWidth
    const found: string[] = []
    const page = document.scrollingElement
    if (page && page.scrollWidth > width) {
      found.push(`the page scrolls ${page.scrollWidth - width}px sideways`)
    }
    for (const node of [el, ...el.querySelectorAll('*')]) {
      if (node.closest('[aria-hidden="true"]')) continue
      if (!node.checkVisibility()) continue
      const style = getComputedStyle(node)
      // A graph may scroll inside itself (WCAG 1.4.10 lets two-dimensional
      // content do so): the activity grid is one picture.
      const scrolls =
        /(auto|scroll)/.test(style.overflowX) && node.role !== 'img'
      if (scrolls && node.scrollWidth > node.clientWidth + 1) {
        found.push(`${node.tagName} scrolls sideways`)
      }
      if (node.closest('[role="img"]')) continue
      const rect = node.getBoundingClientRect()
      // Nothing painted, or clipped to a pixel for screen readers only.
      if (rect.width <= 1 || rect.height <= 1) continue
      if (rect.left < -0.5 || rect.right > width + 0.5) {
        const label = node.getAttribute('aria-label') ?? node.className
        found.push(
          `${node.tagName}.${String(label).slice(0, 40)} spans ${rect.left.toFixed(1)} to ${rect.right.toFixed(1)}`
        )
      }
    }
    return found
  })
}

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
  await blockTurnstile(page)
})

test.describe('phone, 390x844', () => {
  test.use(PHONE)

  test('the header is a 22 art px night bar with the Lamp and the launcher', async ({
    page,
  }) => {
    await openMobile(page)
    const header = page.getByRole('banner')
    const bar = await boxOf(header)
    expect(bar.y).toBe(0)
    expect(bar.height).toBe(TARGET)
    await expect(header.getByText('ShiroOS')).toBeVisible()
    expect(await backgroundOf(header)).toBe(NIGHT_GROUND)

    for (const button of [
      header.getByRole('button', { name: 'Turn the lamp on' }),
      mobileLauncher(page),
    ]) {
      const box = await boxOf(button)
      expect(box.width).toBe(TARGET)
      expect(box.height).toBe(TARGET)
    }

    // Night chrome in both Lamp modes.
    await header.getByRole('button', { name: 'Turn the lamp on' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(await backgroundOf(header)).toBe(NIGHT_GROUND)
  })

  test('the dock holds search and the six apps, and marks an open app', async ({
    page,
  }) => {
    await openMobile(page)
    const bar = await boxOf(dock(page))
    expect(bar.y + bar.height).toBe(MOBILE_VIEWPORT.height)
    expect(bar.height).toBe(TARGET + 12)

    const search = dock(page).getByRole('button', {
      name: 'Search apps and projects',
    })
    expect((await boxOf(search)).height).toBe(TARGET)
    await expect(search).toContainText('search')
    for (const [name] of APPS) {
      const box = await boxOf(
        dock(page).getByRole('button', { name: `Open ${name}`, exact: true })
      )
      expect(box.width).toBe(TARGET)
      expect(box.height).toBe(TARGET)
    }

    const about = dock(page).getByRole('button', { name: 'Open About' })
    await expect(about.locator('[data-running-pip]')).toHaveCount(0)
    await about.click()
    await expect(sheet(page, 'about.me')).toBeVisible()
    // The running pip, under the sheet.
    await expect(about.locator('[data-running-pip]')).toHaveCount(1)
  })

  test('the launcher holds the apps, the four switches, the sky and GitHub', async ({
    page,
  }) => {
    await openMobile(page)
    await mobileLauncher(page).click()
    const launcher = launcherSheet(page)
    await expect(launcher).toBeVisible()
    await settled(launcher)

    for (const [name] of APPS) {
      await expect(
        launcher.getByRole('button', { name: `Open ${name}`, exact: true })
      ).toBeVisible()
    }
    const switches = {
      Lamp: 'false',
      Pets: 'true',
      'Pause animations': 'false',
      'Readable text': 'false',
    }
    for (const [name, checked] of Object.entries(switches)) {
      await expect(
        launcher.getByRole('switch', { name, exact: true })
      ).toHaveAttribute('aria-checked', checked)
    }
    await expect(
      launcher.getByRole('radiogroup', { name: 'Sky' }).getByRole('radio')
    ).toHaveCount(5)
    await expect(
      launcher.getByRole('link', { name: /GitHub profile/ })
    ).toBeVisible()

    expect((await boxOf(sheetBar(launcher))).height).toBe(48)
    await launcher.getByRole('button', { name: 'Close launcher' }).click()
    await expect(launcher).toBeHidden()
    await expect(mobileLauncher(page)).toBeFocused()
  })

  for (const mode of ['dark', 'light'] as const) {
    test(`every app opens as a sheet with a night title bar, Lamp ${mode === 'dark' ? 'off' : 'on'}`, async ({
      page,
    }) => {
      test.slow()
      await useMode(page, mode)
      await openMobile(page)
      for (const [name, title] of APPS) {
        await dock(page)
          .getByRole('button', { name: `Open ${name}`, exact: true })
          .click()
        const dialog = sheet(page, title)
        await expect(dialog).toBeVisible()
        await settled(dialog)

        const bar = sheetBar(dialog)
        expect((await boxOf(bar)).height).toBe(48)
        expect(await backgroundOf(bar)).toBe(TITLE_BAR_FILL)
        await expect(bar.getByRole('heading', { name: title })).toBeVisible()
        expect(await backgroundOf(sheetBody(dialog))).toBe(
          mode === 'dark' ? NIGHT_BODY : PAPER_BODY
        )

        const close = dialog.getByRole('button', { name: 'Close', exact: true })
        const box = await boxOf(close)
        expect(box.width).toBe(TARGET)
        expect(box.height).toBe(TARGET)
        await close.click()
        await expect(dialog).toBeHidden()
      }
    })
  }

  test('every control in the shell is a 44 css target', async ({ page }) => {
    test.slow()
    await openMobile(page)
    expect(await smallTargets(page.locator('body'))).toEqual([])

    await mobileLauncher(page).click()
    await settled(launcherSheet(page))
    expect(await smallTargets(launcherSheet(page))).toEqual([])
    await launcherSheet(page)
      .getByRole('button', { name: 'Close launcher' })
      .click()

    for (const [name, title] of APPS) {
      await dock(page)
        .getByRole('button', { name: `Open ${name}`, exact: true })
        .click()
      const dialog = sheet(page, title)
      await expect(dialog).toBeVisible()
      await settled(dialog)
      expect(await smallTargets(dialog), title).toEqual([])
      await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    }
  })
})

test.describe('the Readme wording', () => {
  /** Lines only one of the two wordings has (SPEC 11, decision 5). */
  const DESKTOP_LINE = 'Click the icons on the side'
  const PHONE_LINE = 'tap an app there'

  test.describe('on a phone', () => {
    test.use(PHONE)

    test('speaks of the dock, the launcher and taps, not clicks and keys', async ({
      page,
    }) => {
      await openMobile(page)
      await dock(page)
        .getByRole('button', { name: 'Open Readme', exact: true })
        .click()
      const readme = sheet(page, 'readme.md')
      await expect(readme).toBeVisible()
      await expect(readme.getByText(PHONE_LINE)).toBeVisible()
      await expect(readme.getByText('Launcher', { exact: true })).toBeVisible()
      await expect(readme.getByText(DESKTOP_LINE)).toBeHidden()
      // No keycap and no title bar keys on a phone.
      await expect(readme.locator('kbd').filter({ visible: true })).toHaveCount(
        0
      )
      for (const line of await readme.getByText(/arrow/i).all()) {
        await expect(line).toBeHidden()
      }
    })
  })

  test('on the desktop it keeps the clicks and the keys', async ({ page }) => {
    await page.goto('/?open=readme')
    await desktopReady(page)
    const readme = osWindow(page, 'readme.md')
    await expect(readme.getByText(DESKTOP_LINE)).toBeVisible()
    await expect(readme.getByText(PHONE_LINE)).toBeHidden()
  })
})

test.describe('reflow at 320 css', () => {
  test.use({ ...PHONE, viewport: { width: 320, height: 640 } })

  test('the feed, launcher and sheets fit with no sideways scroll', async ({
    page,
  }) => {
    test.slow()
    await openMobile(page)
    expect(await overflow(page, page.locator('body'))).toEqual([])
    // The dock's seven targets fill the width at 44 css each.
    expect(await smallTargets(dock(page))).toEqual([])

    await mobileLauncher(page).click()
    await settled(launcherSheet(page))
    expect(await overflow(page, launcherSheet(page))).toEqual([])
    await launcherSheet(page)
      .getByRole('button', { name: 'Close launcher' })
      .click()

    for (const [name, title] of APPS) {
      await dock(page)
        .getByRole('button', { name: `Open ${name}`, exact: true })
        .click()
      const dialog = sheet(page, title)
      await expect(dialog).toBeVisible()
      await settled(dialog)
      expect(await overflow(page, dialog), title).toEqual([])
      await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    }
  })
})

test.describe('breakpoint edges', () => {
  test('767 css is the phone shell', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 900 })
    await openMobile(page)
    await expect(dock(page)).toBeVisible()
    await expect(taskbar(page)).toHaveCount(0)
    expect(await overflow(page, page.locator('body'))).toEqual([])
  })

  test('768 css is the desktop', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await openDesktop(page)
    await expect(mobileLauncher(page)).toHaveCount(0)
    await expect(dock(page)).toHaveCount(0)
  })
})

test.describe('coarse pointer at desktop width, 820x1180', () => {
  test.use({ viewport: { width: 820, height: 1180 }, ...TOUCH })

  test('title bars, window controls and the menu bar are 44 css targets', async ({
    page,
  }) => {
    await page.goto('/?open=projects')
    await desktopReady(page)
    const win = osWindow(page, 'projects.app')
    await expect(win).toBeVisible()
    await settled(win)

    // 24 art px (SPEC 11), 48 css at DPR 1.
    expect((await boxOf(titleBar(win))).height).toBe(48)
    for (const name of [
      'Copy link to this window',
      'Minimize window',
      'Toggle maximize window',
      'Close window',
    ]) {
      const box = await boxOf(titleBar(win).getByRole('button', { name }))
      expect(box.width, name).toBeGreaterThanOrEqual(TARGET)
      expect(box.height, name).toBeGreaterThanOrEqual(TARGET)
    }
    const menuBar = page
      .getByRole('banner')
      .filter({ has: page.getByRole('menubar') })
    expect(await smallTargets(menuBar)).toEqual([])
    expect(await smallTargets(taskbar(page))).toEqual([])
  })
})

test.describe('coarse pointer at DPR 2.625, 820x1180', () => {
  test.use({
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2.625,
    ...TOUCH,
  })

  test('the title bar is 24 art px and every window control 44 css', async ({
    page,
  }) => {
    await page.goto('/?open=projects')
    await desktopReady(page)
    const win = osWindow(page, 'projects.app')
    await expect(win).toBeVisible()
    await settled(win)

    // An art px is 1.905 css here: 22 art px would be 41.9.
    const px = await page.evaluate(() =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--px')
      )
    )
    expect(px).toBeCloseTo(1.905, 2)
    const bar = titleBar(win)
    expect((await boxOf(bar)).height).toBeCloseTo(24 * px, 1)
    // The coarse slice is the one drawn: 24 rows, not the 16 of a mouse.
    const source = await bar.evaluate(
      (el) => getComputedStyle(el).borderImageSource
    )
    expect(source).toContain("height='24'")
    expect(await smallTargets(bar)).toEqual([])
    for (const name of [
      'Copy link to this window',
      'Minimize window',
      'Toggle maximize window',
      'Close window',
    ]) {
      const box = await boxOf(bar.getByRole('button', { name }))
      expect(box.width, name).toBeGreaterThanOrEqual(TARGET)
      expect(box.height, name).toBeGreaterThanOrEqual(TARGET)
    }
  })
})
