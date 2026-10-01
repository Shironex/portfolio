import { type Locator, type Page, expect, test } from '@playwright/test'

import { SESSION_STORAGE_KEY } from '../src/lib/os/session'
import {
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  launch,
  mobileReady,
  mockFeeds,
  openDesktop,
  osWindow,
  osWindows,
  skipBootSplash,
  taskbar,
  titleBar,
} from './helpers'

/**
 * Window management on the desktop shell: edge snapping by drag and by
 * keyboard, double-click maximize, the taskbar buttons, and the session
 * restore that brings the desktop back after a reload in the same tab.
 */
const VIEWPORT = DESKTOP_VIEWPORT

/** Usable desktop area for a viewport: the insets in `geometry.ts`. */
function areaFor(viewport: { width: number; height: number }) {
  return {
    x: 8,
    y: 44,
    width: viewport.width - 16,
    height: viewport.height - 108,
  }
}

const AREA = areaFor(VIEWPORT)
const HALF = AREA.width / 2
const LEFT_HALF = { ...AREA, width: HALF }
const RIGHT_HALF = { ...AREA, x: AREA.x + HALF, width: HALF }

/** Default rect of the About window, from `APP_WINDOW_DEFAULTS`. */
const ABOUT_RECT = { x: 180, y: 120, width: 820, height: 580 }

function snapPreview(page: Page) {
  return page.locator('[data-snap-preview]')
}

/** The live region keyboard snaps are announced through. */
function announcer(page: Page) {
  return page
    .getByRole('status')
    .filter({ hasText: /snapped|maximized|restored/ })
}

async function rectOf(win: Locator) {
  const box = await win.boundingBox()
  if (!box) throw new Error('window is not visible')
  return box
}

async function zIndexOf(win: Locator) {
  return win.evaluate((el) => Number(getComputedStyle(el).zIndex))
}

/** Press the title bar clear of the controls and move the pointer to a point. */
async function dragTitleBarTo(page: Page, win: Locator, x: number, y: number) {
  const box = await rectOf(win)
  await page.mouse.move(box.x + 120, box.y + 18)
  await page.mouse.down()
  await page.mouse.move(x, y, { steps: 12 })
}

/** Wait for the debounced session write to land with this many windows. */
async function waitForStoredWindows(page: Page, count: number) {
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const raw = window.sessionStorage.getItem(key)
        const parsed: unknown = raw ? JSON.parse(raw) : null
        return Array.isArray(parsed) ? parsed.length : 0
      }, SESSION_STORAGE_KEY)
    )
    .toBe(count)
}

test.use({ viewport: VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('edge snapping', () => {
  test('dragging to the left edge previews and snaps to the left half', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await dragTitleBarTo(page, about, 0, 400)
    await expect(snapPreview(page)).toHaveAttribute('data-snap-preview', 'left')
    expect(await rectOf(snapPreview(page))).toEqual(LEFT_HALF)

    await page.mouse.up()
    await expect(snapPreview(page)).toHaveCount(0)
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)
  })

  test('dragging to the right edge snaps to the right half', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await dragTitleBarTo(page, about, VIEWPORT.width - 1, 400)
    await expect(snapPreview(page)).toHaveAttribute(
      'data-snap-preview',
      'right'
    )
    await page.mouse.up()

    await expect.poll(() => rectOf(about)).toEqual(RIGHT_HALF)
  })

  test('dragging to the top edge maximizes', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await dragTitleBarTo(page, about, 700, 4)
    await expect(snapPreview(page)).toHaveAttribute('data-snap-preview', 'top')
    await page.mouse.up()

    await expect.poll(() => rectOf(about)).toEqual(AREA)
  })

  test('leaving the snap zone before release cancels the snap', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await dragTitleBarTo(page, about, 0, 400)
    await expect(snapPreview(page)).toBeVisible()
    await page.mouse.move(500, 400, { steps: 6 })
    await expect(snapPreview(page)).toHaveCount(0)
    await page.mouse.up()

    const rect = await rectOf(about)
    expect(rect.width).toBe(ABOUT_RECT.width)
    expect(rect.height).toBe(ABOUT_RECT.height)
  })

  test('dragging a snapped window away restores its size under the pointer', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await dragTitleBarTo(page, about, 0, 400)
    await page.mouse.up()
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)

    await dragTitleBarTo(page, about, 700, 300)
    await page.mouse.up()

    const rect = await rectOf(about)
    expect(rect.width).toBe(ABOUT_RECT.width)
    expect(rect.height).toBe(ABOUT_RECT.height)
    // The pointer is still on the title bar of the restored window.
    expect(rect.x).toBeLessThan(700)
    expect(rect.x + rect.width).toBeGreaterThan(700)
    expect(rect.y).toBeLessThan(300)
    expect(rect.y + 36).toBeGreaterThan(300)
  })

  test('dragging a maximized window away restores its size', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await about.getByRole('button', { name: 'Toggle maximize window' }).click()
    await expect.poll(() => rectOf(about)).toEqual(AREA)

    await dragTitleBarTo(page, about, 600, 300)
    await page.mouse.up()

    const rect = await rectOf(about)
    expect(rect.width).toBe(ABOUT_RECT.width)
    expect(rect.height).toBe(ABOUT_RECT.height)
  })
})

test.describe('keyboard and double-click', () => {
  test('Ctrl+Alt+arrows snap, maximize and restore', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await titleBar(about).focus()

    await page.keyboard.press('Control+Alt+ArrowLeft')
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)
    await expect(announcer(page)).toHaveText('About snapped left')

    await page.keyboard.press('Control+Alt+ArrowRight')
    await expect.poll(() => rectOf(about)).toEqual(RIGHT_HALF)
    await expect(announcer(page)).toHaveText('About snapped right')

    await page.keyboard.press('Control+Alt+ArrowUp')
    await expect.poll(() => rectOf(about)).toEqual(AREA)
    await expect(announcer(page)).toHaveText('About maximized')

    // Restore goes back to the rect from before the first snap.
    await page.keyboard.press('Control+Alt+ArrowDown')
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
    await expect(announcer(page)).toHaveText('About restored')
  })

  test('the title bar is named briefly and described by its shortcuts', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await expect(titleBar(about)).toHaveAccessibleName(
      'about.me window controls'
    )
    await expect(titleBar(about)).toHaveAccessibleDescription(
      /Ctrl\+Alt\+Left or Right snaps.*Ctrl\+Alt\+Up maximizes.*Ctrl\+Alt\+Down restores/
    )
  })

  test('a plain arrow key pulls a snapped window loose before moving it', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await titleBar(about).focus()
    await page.keyboard.press('Control+Alt+ArrowLeft')
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)

    await page.keyboard.press('ArrowRight')
    await expect
      .poll(() => rectOf(about))
      .toEqual({
        x: LEFT_HALF.x + 20,
        y: LEFT_HALF.y,
        width: ABOUT_RECT.width,
        height: ABOUT_RECT.height,
      })

    // It floats now, so a restore has nothing to do.
    await page.keyboard.press('Control+Alt+ArrowDown')
    await page.keyboard.press('ArrowRight')
    await expect
      .poll(async () => (await rectOf(about)).x)
      .toBe(LEFT_HALF.x + 40)
  })

  test('a docked window follows the desktop area when the viewport resizes', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await titleBar(about).focus()
    await page.keyboard.press('Control+Alt+ArrowRight')
    await expect.poll(() => rectOf(about)).toEqual(RIGHT_HALF)

    const smaller = { width: 1200, height: 800 }
    await page.setViewportSize(smaller)
    const area = areaFor(smaller)
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...area, x: area.x + area.width / 2, width: area.width / 2 })
  })

  test('double-clicking the title bar toggles maximize', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await titleBar(about).dblclick({ position: { x: 120, y: 18 } })
    await expect.poll(() => rectOf(about)).toEqual(AREA)

    await titleBar(about).dblclick({ position: { x: 120, y: 18 } })
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
  })

  test('double-clicking a control button does not toggle maximize', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await about
      .getByRole('button', { name: 'Copy link to this window' })
      .dblclick()

    await expect(page.getByText('Link copied').first()).toBeVisible()
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
  })
})

test.describe('taskbar', () => {
  test('a button raises a background window, then minimizes and restores it', async ({
    page,
  }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')
    expect(await zIndexOf(about)).toBeGreaterThan(await zIndexOf(projects))

    await taskbar(page)
      .getByRole('button', { name: 'Projects - bring to front' })
      .click()
    await expect(projects).toBeVisible()
    await expect
      .poll(async () => (await zIndexOf(projects)) > (await zIndexOf(about)))
      .toBe(true)

    await taskbar(page)
      .getByRole('button', { name: 'Projects - minimize' })
      .click()
    await expect(projects).toBeHidden()

    await taskbar(page)
      .getByRole('button', { name: 'Projects (minimized) - restore' })
      .click()
    await expect(projects).toBeVisible()
  })
})

test.describe('session restore', () => {
  test('a reload restores rects, z-order, snapped and minimized state', async ({
    page,
  }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')
    const readme = await launch(page, 'Readme', 'readme.md')

    // Readme: minimized. Projects: moved by keyboard. About: snapped left.
    await readme.getByRole('button', { name: 'Minimize window' }).click()
    await expect(readme).toBeHidden()
    await titleBar(projects).focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    await titleBar(about).focus()
    await page.keyboard.press('Control+Alt+ArrowLeft')
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)
    // Leave Projects on top.
    await taskbar(page)
      .getByRole('button', { name: 'Projects - bring to front' })
      .click()
    await expect
      .poll(async () => (await zIndexOf(projects)) > (await zIndexOf(about)))
      .toBe(true)
    const projectsRect = await rectOf(projects)

    await page.reload()

    await expect(projects).toBeVisible()
    await expect.poll(() => rectOf(projects)).toEqual(projectsRect)
    await expect.poll(() => rectOf(about)).toEqual(LEFT_HALF)
    expect(await zIndexOf(projects)).toBeGreaterThan(await zIndexOf(about))
    // Restored z-indexes are renumbered from the bottom of the stack.
    expect(await zIndexOf(projects)).toBeLessThanOrEqual(103)
    await expect(readme).toBeHidden()
    await expect(
      taskbar(page).getByRole('button', {
        name: 'Readme (minimized) - restore',
      })
    ).toBeVisible()

    // The snapped window still remembers the rect it came from.
    await titleBar(about).focus()
    await page.keyboard.press('Control+Alt+ArrowDown')
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
  })

  test('a deep link wins over the restored session', async ({ page }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')
    await about.getByRole('button', { name: 'Minimize window' }).click()
    await expect(about).toBeHidden()
    await waitForStoredWindows(page, 2)

    // About was minimized and under Projects; the link brings it up on top.
    await page.goto('/?open=about')
    await expect(about).toBeVisible()
    await expect(projects).toBeVisible()
    expect(await zIndexOf(about)).toBeGreaterThan(await zIndexOf(projects))
    expect(new URL(page.url()).search).toBe('?open=about')

    // A link to a window that was not in the session opens it on top too.
    await page.goto('/?open=contact')
    const contact = osWindow(page, 'contact.app')
    await expect(contact).toBeVisible()
    await expect(projects).toBeVisible()
    await expect(about).toBeVisible()
    const contactZ = await zIndexOf(contact)
    expect(contactZ).toBeGreaterThan(await zIndexOf(projects))
    expect(contactZ).toBeGreaterThan(await zIndexOf(about))
  })

  test('stored rects are clamped and unknown ids are dropped', async ({
    page,
  }) => {
    // Seeded before the shell boots: a write from a loaded page would be
    // replaced by that page's own session on the way out.
    await page.addInitScript((key) => {
      const base = { z: 101, minimized: false, maximized: false }
      window.sessionStorage.setItem(
        key,
        JSON.stringify([
          { ...base, id: 'about', x: 5000, y: 5000, w: 9000, h: 9000 },
          { ...base, id: 'nope', x: 10, y: 50, w: 400, h: 300 },
          { ...base, id: 'project-missing', x: 10, y: 50, w: 400, h: 300 },
          { ...base, id: 'readme', x: 'left', y: 50, w: 400, h: 300 },
        ])
      )
    }, SESSION_STORAGE_KEY)

    await openDesktop(page)

    await expect(osWindows(page)).toHaveCount(1)
    const rect = await rectOf(osWindow(page, 'about.me'))
    expect(rect.x).toBeLessThan(VIEWPORT.width)
    expect(rect.y).toBeLessThan(VIEWPORT.height)
    expect(rect.width).toBeLessThanOrEqual(VIEWPORT.width)
    expect(rect.height).toBeLessThanOrEqual(VIEWPORT.height)
  })

  test('stored z-indexes are renumbered, whatever they were', async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      const base = { x: 100, y: 100, w: 500, h: 400, minimized: false }
      window.sessionStorage.setItem(
        key,
        JSON.stringify([
          { ...base, id: 'about', z: 9_000_000, maximized: false },
          { ...base, id: 'projects', z: -50, maximized: false },
          { ...base, id: 'readme', z: 420, maximized: false },
        ])
      )
    }, SESSION_STORAGE_KEY)

    await openDesktop(page)

    await expect(osWindows(page)).toHaveCount(3)
    expect(await zIndexOf(osWindow(page, 'projects.app'))).toBe(101)
    expect(await zIndexOf(osWindow(page, 'readme.md'))).toBe(102)
    expect(await zIndexOf(osWindow(page, 'about.me'))).toBe(103)

    // Pressing the window that is already on top does not spend a z-index.
    await titleBar(osWindow(page, 'about.me')).click({
      position: { x: 120, y: 18 },
    })
    expect(await zIndexOf(osWindow(page, 'about.me'))).toBe(103)
  })

  test('a mobile viewport does not restore a sheet', async ({ page }) => {
    await openDesktop(page)
    await launch(page, 'About', 'about.me')
    await waitForStoredWindows(page, 1)

    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/')
    await mobileReady(page)

    await expect(page.getByRole('dialog', { name: 'about.me' })).toHaveCount(0)
  })
})
