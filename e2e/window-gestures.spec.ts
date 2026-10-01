import { type Page, expect, test } from '@playwright/test'

import {
  SESSION_STORAGE_KEY,
  SESSION_WRITE_DEBOUNCE_MS,
} from '../src/lib/os/session'
import {
  ABOUT_RECT,
  DESKTOP_VIEWPORT,
  ambientPlayStates,
  areaFor,
  launch,
  mockFeeds,
  openDesktop,
  recordAnimations,
  rectOf,
  settled,
  skipBootSplash,
  taskbar,
  titleBar,
  titleBarGrip,
  windowById,
} from './helpers'

/**
 * Pointer gestures on the desktop shell: windows drag and resize under a
 * finger as well as a mouse, a gesture stays out of React until it is
 * released (one state commit, one session write, no other window touched),
 * it ends cleanly when the window changes or leaves under it, and a minimize
 * animates out wherever it came from.
 */
const VIEWPORT = DESKTOP_VIEWPORT
const AREA = areaFor(VIEWPORT)

/** A tablet in landscape: the desktop shell under a coarse pointer. */
const TABLET_VIEWPORT = { width: 1024, height: 768 }

interface TouchPoint {
  x: number
  y: number
}

type TouchStep = [type: string, points: TouchPoint[]]

/**
 * A real touch sequence, through the browser's input pipeline: the page gets
 * trusted pointer events with `pointerType: 'touch'`, and `touch-action`
 * decides whether the browser keeps the gesture for itself.
 */
async function touch(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  const send = ([type, points]: TouchStep) =>
    cdp.send('Input.dispatchTouchEvent', {
      type: type as 'touchStart',
      touchPoints: points,
    })
  /** Queue the steps in one go: the gaps between them are the browser's. */
  const burst = (steps: TouchStep[]) => Promise.all(steps.map(send))
  const tap = (point: TouchPoint): TouchStep[] => [
    ['touchStart', [point]],
    ['touchEnd', []],
  ]
  return {
    start: (point: TouchPoint) => send(['touchStart', [point]]),
    /** Move in steps, as a finger does, so every frame sees a new point. */
    async move(from: TouchPoint, to: TouchPoint, steps = 8) {
      for (let i = 1; i <= steps; i++) {
        await send([
          'touchMove',
          [
            {
              x: from.x + ((to.x - from.x) * i) / steps,
              y: from.y + ((to.y - from.y) * i) / steps,
            },
          ],
        ])
      }
    },
    end: () => send(['touchEnd', []]),
    cancel: () => send(['touchCancel', []]),
    /**
     * Two taps with no round trip to the test runner between them, so a busy
     * machine cannot stretch the pair past the double-tap window.
     */
    doubleTap: (point: TouchPoint) => burst([...tap(point), ...tap(point)]),
    /** A double tap whose first tap slips by `slip` px before it lifts. */
    shakyDoubleTap: (point: TouchPoint, slip: number) =>
      burst([
        ['touchStart', [point]],
        ['touchMove', [{ x: point.x + slip, y: point.y }]],
        ['touchEnd', []],
        ...tap(point),
      ]),
  }
}

function snapPreview(page: Page) {
  return page.locator('[data-snap-preview]')
}

/** The rect and the transform the window element carries inline. */
function inlineGeometry(page: Page, id: string) {
  return windowById(page, id).evaluate((el) => ({
    x: Number.parseFloat(el.style.left),
    y: Number.parseFloat(el.style.top),
    width: Number.parseFloat(el.style.width),
    height: Number.parseFloat(el.style.height),
    transform: el.style.transform,
  }))
}

/** The stored session entry of a window, as a rect; `null` until written. */
function storedRect(page: Page, id: string) {
  return page.evaluate(
    ([key, windowId]) => {
      const stored: Array<{
        id: string
        x: number
        y: number
        w: number
        h: number
      }> = JSON.parse(window.sessionStorage.getItem(key) ?? '[]')
      const entry = stored.find((item) => item.id === windowId)
      return entry
        ? { x: entry.x, y: entry.y, width: entry.w, height: entry.h }
        : null
    },
    [SESSION_STORAGE_KEY, id]
  )
}

/** How often the window session has been written in this page. */
function sessionWrites(page: Page) {
  return page.evaluate(
    () => (window as unknown as { __sessionWrites: number }).__sessionWrites
  )
}

test.use({ viewport: VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('touch', () => {
  test.use({ hasTouch: true })

  test('a finger drags a window by its title bar', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    // The title bar and the handles keep a touch for themselves: without
    // `touch-action: none` the browser would take the drag as a scroll.
    const touchActions = await about.evaluate((el) =>
      [
        el.querySelector('[role="toolbar"]'),
        ...el.querySelectorAll('[data-resize-handle]'),
      ].map((node) => (node ? getComputedStyle(node).touchAction : null))
    )
    expect(touchActions).toHaveLength(9)
    expect(new Set(touchActions)).toEqual(new Set(['none']))

    const grip = await titleBarGrip(about)
    const finger = await touch(page)
    await finger.start(grip)
    await finger.move(grip, { x: grip.x + 200, y: grip.y + 100 })
    await finger.end()

    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, x: ABOUT_RECT.x + 200, y: ABOUT_RECT.y + 100 })
  })

  test('a finger snaps a window to an edge', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    const finger = await touch(page)

    await finger.start(grip)
    await finger.move(grip, { x: 0, y: 400 })
    await expect(snapPreview(page)).toHaveAttribute('data-snap-preview', 'left')
    await finger.end()

    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...AREA, width: AREA.width / 2 })
  })

  test('a finger resizes a window by its edge and corner handles', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await settled(about)
    const finger = await touch(page)

    const centreOf = async (dir: string) => {
      const box = await rectOf(about.locator(`[data-resize-handle="${dir}"]`))
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    }

    const east = await centreOf('e')
    await finger.start(east)
    await finger.move(east, { x: east.x + 80, y: east.y })
    await finger.end()
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, width: ABOUT_RECT.width + 80 })

    const corner = await centreOf('nw')
    await finger.start(corner)
    await finger.move(corner, { x: corner.x - 40, y: corner.y - 30 })
    await finger.end()
    await expect
      .poll(() => rectOf(about))
      .toEqual({
        x: ABOUT_RECT.x - 40,
        y: ABOUT_RECT.y - 30,
        width: ABOUT_RECT.width + 120,
        height: ABOUT_RECT.height + 30,
      })
  })

  test('a double tap on the title bar toggles maximize, not on a control', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    const finger = await touch(page)

    await finger.doubleTap(grip)
    await expect.poll(() => rectOf(about)).toEqual(AREA)

    await finger.doubleTap({ x: AREA.x + 120, y: AREA.y + 18 })
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)

    const copyLink = await rectOf(
      about.getByRole('button', { name: 'Copy link to this window' })
    )
    await finger.doubleTap({
      x: copyLink.x + copyLink.width / 2,
      y: copyLink.y + copyLink.height / 2,
    })
    // The button was pressed and nothing maximized.
    await expect(page.getByText('Link copied').first()).toBeVisible()
    expect(await rectOf(about)).toEqual(ABOUT_RECT)
  })

  test('a shaky double tap on a maximized window restores it', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await about.getByRole('button', { name: 'Toggle maximize window' }).click()
    await expect.poll(() => rectOf(about)).toEqual(AREA)
    const finger = await touch(page)

    // The first tap slips 5px: under the drag slop, so it is still a tap and
    // does not pull the window loose for the second one to maximize again.
    await finger.shakyDoubleTap({ x: AREA.x + 120, y: AREA.y + 18 }, 5)

    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
  })

  test('a cancelled touch leaves the window where it was', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    const finger = await touch(page)

    await finger.start(grip)
    await finger.move(grip, { x: grip.x + 200, y: grip.y + 100 })
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, x: ABOUT_RECT.x + 200, y: ABOUT_RECT.y + 100 })
    await finger.cancel()

    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
    expect(await about.evaluate((el) => el.style.transform)).toBe('')
  })
})

test.describe('coarse pointer', () => {
  test.use({ viewport: TABLET_VIEWPORT, hasTouch: true, isMobile: true })

  test('a tap on the top edge of a control button presses the button', async ({
    page,
  }) => {
    await openDesktop(page)
    expect(
      await page.evaluate(() => window.matchMedia('(pointer: coarse)').matches)
    ).toBe(true)
    const about = await launch(page, 'About', 'about.me')
    await settled(about)

    // The wide handles a finger gets sit outside the window box, clear of
    // the controls and of the app body.
    const box = await rectOf(about)
    const north = await rectOf(about.locator('[data-resize-handle="n"]'))
    const east = await rectOf(about.locator('[data-resize-handle="e"]'))
    expect(north.height).toBe(16)
    expect(north.y + north.height).toBeLessThanOrEqual(box.y)
    expect(east.width).toBe(16)
    expect(east.x).toBeGreaterThanOrEqual(box.x + box.width)

    const maximize = await rectOf(
      about.getByRole('button', { name: 'Toggle maximize window' })
    )
    await page.touchscreen.tap(maximize.x + maximize.width / 2, maximize.y + 1)

    await expect.poll(() => rectOf(about)).toEqual(areaFor(TABLET_VIEWPORT))
  })
})

test.describe('mouse', () => {
  test('only a plain press of the primary button drags or resizes', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)

    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down({ button: 'right' })
    await page.mouse.move(grip.x + 200, grip.y + 100, { steps: 6 })
    await page.mouse.up({ button: 'right' })

    const east = await rectOf(about.locator('[data-resize-handle="e"]'))
    await page.mouse.move(east.x + 2, east.y + 100)
    await page.mouse.down({ button: 'middle' })
    await page.mouse.move(east.x + 82, east.y + 100, { steps: 6 })
    await page.mouse.up({ button: 'middle' })

    // Ctrl+click is the context menu on macOS: its release never arrives.
    await page.keyboard.down('Control')
    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(grip.x + 200, grip.y + 100, { steps: 6 })
    await page.mouse.up()
    await page.keyboard.up('Control')

    expect(await rectOf(about)).toEqual(ABOUT_RECT)
  })

  test('a resize follows the pointer and commits on release', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await settled(about)

    const south = await rectOf(about.locator('[data-resize-handle="s"]'))
    await page.mouse.move(south.x + 100, south.y + 2)
    await page.mouse.down()
    await page.mouse.move(south.x + 100, south.y + 62, { steps: 6 })
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, height: ABOUT_RECT.height + 60 })
    await page.mouse.up()

    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, height: ABOUT_RECT.height + 60 })
  })

  test('a plain click on a title bar inside an edge strip does not snap', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)

    // Park the window so the bare part of its title bar crosses the strip
    // at the right edge of the viewport that snaps a dragged window.
    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(grip.x + 700, grip.y, { steps: 6 })
    await page.mouse.up()
    const parked = { ...ABOUT_RECT, x: ABOUT_RECT.x + 700 }
    await expect.poll(() => rectOf(about)).toEqual(parked)

    await page.mouse.click(VIEWPORT.width - 4, grip.y)

    await expect(snapPreview(page)).toHaveCount(0)
    expect(await rectOf(about)).toEqual(parked)
  })

  test('minimizing mid-drag leaves no stuck snap preview', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)

    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(0, 400, { steps: 12 })
    await expect(snapPreview(page)).toHaveAttribute('data-snap-preview', 'left')

    // The press put focus on the title bar, so its shortcuts work mid-drag.
    await page.keyboard.press('Control+m')
    await expect(windowById(page, 'about')).toHaveCount(0)
    await page.mouse.up()

    await taskbar(page)
      .getByRole('button', { name: 'About (minimized) - restore' })
      .click()
    await expect(about).toBeVisible()
    await expect(snapPreview(page)).toHaveCount(0)
    // The drag was cancelled, not committed.
    await expect.poll(() => rectOf(about)).toEqual(ABOUT_RECT)
    expect((await inlineGeometry(page, 'about')).transform).toBe('')
  })

  test('closing mid-drag plays the exit from the window, not from the drag', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    // What the window carries inline as its exit animation starts.
    await page.evaluate(() => {
      document.addEventListener('animationstart', (event) => {
        if (event.animationName !== 'winClose') return
        const { transform, willChange } = (event.target as HTMLElement).style
        ;(window as unknown as { __atClose: unknown }).__atClose = {
          transform,
          willChange,
        }
      })
    })

    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(grip.x + 150, grip.y + 90, { steps: 12 })
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, x: ABOUT_RECT.x + 150, y: ABOUT_RECT.y + 90 })

    await page.keyboard.press('Control+w')
    await expect(windowById(page, 'about')).toHaveCount(0)
    await page.mouse.up()

    expect(
      await page.evaluate(
        () => (window as unknown as { __atClose: unknown }).__atClose
      )
    ).toEqual({ transform: '', willChange: '' })
    expect(await ambientPlayStates(page)).not.toContain('paused')
    // Nothing of the gesture outlives the window: it opens fresh.
    const reopened = await launch(page, 'About', 'about.me')
    await settled(reopened)
    expect(await rectOf(reopened)).toEqual(ABOUT_RECT)
  })

  test('an arrow key during a drag of a maximized window leaves DOM and state in agreement', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await about.getByRole('button', { name: 'Toggle maximize window' }).click()
    await expect.poll(() => rectOf(about)).toEqual(AREA)

    // Pull it loose and keep holding.
    await page.mouse.move(AREA.x + 120, AREA.y + 18)
    await page.mouse.down()
    await page.mouse.move(600, 300, { steps: 12 })
    await expect
      .poll(async () => Math.round((await rectOf(about)).width))
      .toBe(ABOUT_RECT.width)

    // The key undocks the window in state and nudges it: its old size, from
    // the corner of the desktop area, one step to the right.
    await page.keyboard.press('ArrowRight')
    const nudged = {
      x: AREA.x + 20,
      y: AREA.y,
      width: ABOUT_RECT.width,
      height: ABOUT_RECT.height,
    }
    await expect.poll(() => rectOf(about)).toEqual(nudged)
    await expect.poll(() => storedRect(page, 'about')).toEqual(nudged)
    expect(await inlineGeometry(page, 'about')).toEqual({
      ...nudged,
      transform: '',
    })

    // The drag ended with the key, so the release has nothing left to do.
    await page.mouse.up()
    await page.waitForTimeout(SESSION_WRITE_DEBOUNCE_MS + 100)
    expect(await rectOf(about)).toEqual(nudged)
    expect(await inlineGeometry(page, 'about')).toEqual({
      ...nudged,
      transform: '',
    })
    expect(await storedRect(page, 'about')).toEqual(nudged)
  })
})

test.describe('a drag stays out of React until release', () => {
  test('it writes the session once', async ({ page }) => {
    await page.addInitScript((key) => {
      const counter = window as unknown as { __sessionWrites: number }
      counter.__sessionWrites = 0
      const setItem = Storage.prototype.setItem
      Storage.prototype.setItem = function (name: string, value: string) {
        if (this === window.sessionStorage && name === key) {
          counter.__sessionWrites += 1
        }
        setItem.call(this, name, value)
      }
    }, SESSION_STORAGE_KEY)
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    // The write for the window that just opened.
    await expect.poll(() => sessionWrites(page)).toBe(1)

    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(grip.x + 240, grip.y + 120, { steps: 30 })
    await page.mouse.up()

    await expect.poll(() => sessionWrites(page)).toBe(2)
    // Longer than the write debounce: nothing else is on its way.
    await page.waitForTimeout(SESSION_WRITE_DEBOUNCE_MS + 100)
    expect(await sessionWrites(page)).toBe(2)
    expect(await storedRect(page, 'about')).toMatchObject({
      x: ABOUT_RECT.x + 240,
      y: ABOUT_RECT.y + 120,
    })
  })

  test('it moves by transform and mutates nothing in the two other windows', async ({
    page,
  }) => {
    await openDesktop(page)
    await launch(page, 'Projects', 'projects.app')
    await launch(page, 'Monitor', 'monitor.sys')
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)

    // Every DOM change inside the windows that are not being dragged: a
    // re-render that changed nothing would not show here, one that touched
    // the DOM would.
    const observed = await page.evaluate(() => {
      const state = window as unknown as { __mutations: string[] }
      state.__mutations = []
      const others = document.querySelectorAll(
        '[data-window-id]:not([data-window-id="about"])'
      )
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          state.__mutations.push(`${record.type}:${record.attributeName}`)
        }
      })
      for (const other of others) {
        observer.observe(other, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        })
      }
      return others.length
    })
    expect(observed).toBe(2)
    const mutations = () =>
      page.evaluate(
        () => (window as unknown as { __mutations: string[] }).__mutations
      )

    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(grip.x + 150, grip.y + 90, { steps: 20 })

    // Mid-drag the window is where the pointer is, by transform alone, and
    // the decorative loops stand still.
    await expect
      .poll(() => rectOf(about))
      .toEqual({ ...ABOUT_RECT, x: ABOUT_RECT.x + 150, y: ABOUT_RECT.y + 90 })
    expect(await inlineGeometry(page, 'about')).toEqual({
      ...ABOUT_RECT,
      transform: 'translate3d(150px, 90px, 0px)',
    })
    expect(new Set(await ambientPlayStates(page))).toEqual(new Set(['paused']))

    await page.mouse.up()
    await expect
      .poll(() => inlineGeometry(page, 'about'))
      .toEqual({
        ...ABOUT_RECT,
        x: ABOUT_RECT.x + 150,
        y: ABOUT_RECT.y + 90,
        transform: '',
      })
    expect(new Set(await ambientPlayStates(page))).toEqual(new Set(['running']))
    expect(await mutations()).toEqual([])
  })
})

test.describe('minimize', () => {
  const ABOUT_WINDOW = '[data-window-id="about"]'

  test('from the taskbar plays the exit animation, like the title bar', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await settled(about)
    const started = await recordAnimations(page, ABOUT_WINDOW)
    const names = async () => (await started()).map(({ name }) => name)

    await taskbar(page)
      .getByRole('button', { name: 'About - minimize' })
      .click()
    await expect.poll(names).toEqual(['winClose'])
    await expect(windowById(page, 'about')).toHaveCount(0)

    await taskbar(page)
      .getByRole('button', { name: 'About (minimized) - restore' })
      .click()
    await expect(about).toBeVisible()
    await settled(about)
    await about.getByRole('button', { name: 'Minimize window' }).click()
    await expect.poll(names).toEqual(['winClose', 'winOpen', 'winClose'])
    await expect(windowById(page, 'about')).toHaveCount(0)
  })

  test('skips the animation with reduced motion, for good', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)
    await launch(page, 'About', 'about.me')
    const started = await recordAnimations(page, ABOUT_WINDOW)

    await taskbar(page)
      .getByRole('button', { name: 'About - minimize' })
      .click()
    await expect(windowById(page, 'about')).toHaveCount(0)
    expect(await started()).toEqual([])

    // The preference changing while the window is minimized does not bring
    // it back to play an exit it never needed.
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect
      .poll(() =>
        page.evaluate(
          () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
      )
      .toBe(false)
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(resolve))
    )
    await expect(windowById(page, 'about')).toHaveCount(0)
    expect(await started()).toEqual([])

    await taskbar(page)
      .getByRole('button', { name: 'About (minimized) - restore' })
      .click()
    await expect(titleBar(windowById(page, 'about'))).toBeFocused()
  })
})
