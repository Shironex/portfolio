import { type Locator, type Page, expect, test } from '@playwright/test'

import { LAYOUT } from '../src/components/os/wallpaper/scene-data.generated'
import { MAXIMIZED_INSET } from '../src/lib/os/geometry'
import {
  DESKTOP_VIEWPORT,
  launch,
  mockFeeds,
  openDesktop,
  rectOf,
  skipBootSplash,
  taskbar,
  titleBar,
  titleBarGrip,
} from './helpers'

/**
 * The desktop pet (SPEC 3): decoration nobody has to deal with. She is not
 * in the accessibility tree or the tab order, the Pets setting puts her away
 * for good, reduced motion sits her still, a focused control she covers
 * sends her away, a maximized window hides her, and she drags, falls, rides
 * a dragged window and lands where the physics says: on a window, on the
 * taskbar, or on the road's kerb, her floor. All in art px at DPR 1 (2 css
 * px each).
 */
const ART_PX = 2
const FRAME = 48
/**
 * The floor she stands on: the lit kerb of the wallpaper's road, 4 rows
 * into the road piece, across the whole width (SPEC 11, decision 3).
 */
const KERB =
  Math.ceil(DESKTOP_VIEWPORT.height / ART_PX) - LAYOUT.road.height + 4
/** Her frame's top while she stands on the floor. */
const ON_FLOOR = KERB - FRAME
/** The taskbar's top edge, a perch of its own: the top of the taskbar row. */
const TASKBAR_TOP = DESKTOP_VIEWPORT.height / ART_PX - MAXIMIZED_INSET.bottom
/** Her frame's top while she stands on the taskbar. */
const ON_TASKBAR = TASKBAR_TOP - FRAME
/** Her seat line is 10 art px above her feet (PET.md). */
const SEAT = 38

/** States in which she is out and on a perch. */
const OUT = /^(idle|walk|sit|sleep|wave|land)$/

interface PetView {
  state: string
  tag: string
  x: number
  y: number
  frame: string
  z: string
}

const petLayer = (page: Page) => page.locator('[data-pet]')
const hitbox = (page: Page) => page.locator('[data-pet-hitbox]')

/** What she shows now, or null before her layer mounts. */
function petView(page: Page): Promise<PetView | null> {
  return page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('[data-pet]')
    const sprite = el?.firstElementChild as HTMLElement | null
    if (!el || !sprite) return null
    return {
      state: el.dataset.petState ?? '',
      tag: el.dataset.petTag ?? '',
      x: Number(el.style.getPropertyValue('--pet-x')),
      y: Number(el.style.getPropertyValue('--pet-y')),
      frame: sprite.style.backgroundPosition,
      z: el.style.zIndex,
    }
  })
}

const petState = async (page: Page) => (await petView(page))?.state ?? ''

/** Wait for her to come out (3 to 8 s after the shell is idle). */
async function waitForPet(page: Page, state: RegExp = OUT) {
  await expect.poll(() => petState(page), { timeout: 20_000 }).toMatch(state)
}

/** Press on her and move to (x, y) in css px; `release` lets go there. */
async function dragPet(page: Page, x: number, y: number, release = true) {
  const box = await rectOf(hitbox(page))
  await page.mouse.move(box.x + box.width / 2, box.y + 12)
  await page.mouse.down()
  await page.mouse.move(x, y, { steps: 10 })
  if (release) await page.mouse.up()
}

/**
 * Drop her over a window's title bar (at `x` css px, or a little right of
 * its middle) and wait until she stands or sits on it.
 */
async function perchOn(page: Page, win: Locator, x?: number) {
  const bar = await rectOf(titleBar(win))
  await dragPet(page, x ?? bar.x + bar.width * 0.55, bar.y - 120)
  // Her perch is the window's top edge, over the title bar's frame.
  const top = Math.round((await rectOf(win)).y / ART_PX)
  await expect
    .poll(async () => {
      const view = await petView(page)
      if (!view || !OUT.test(view.state)) return null
      return view.y === top - FRAME || view.y === top - SEAT
    })
    .toBe(true)
}

function overlap(a: DOMRectLike, b: DOMRectLike) {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  )
}

interface DOMRectLike {
  x: number
  y: number
  width: number
  height: number
}

test.use({ viewport: DESKTOP_VIEWPORT })

let errors: string[] = []

test.beforeEach(async ({ page }) => {
  errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.afterEach(() => {
  expect(errors).toEqual([])
})

test.describe('the desktop pet', () => {
  test.slow()

  test('is not in the accessibility tree or the tab order', async ({
    page,
  }) => {
    await openDesktop(page)
    await waitForPet(page)
    await expect(petLayer(page)).toHaveAttribute('aria-hidden', 'true')
    await expect(
      petLayer(page).locator(
        'a, button, input, select, textarea, [tabindex], [role]'
      )
    ).toHaveCount(0)
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      expect(
        await page.evaluate(
          () => document.activeElement?.closest('[data-pet]') !== null
        )
      ).toBe(false)
    }
  })

  test('the Pets setting puts her away at once, and a reload keeps it', async ({
    page,
  }) => {
    await openDesktop(page)
    await waitForPet(page)
    await page
      .getByRole('menubar')
      .getByRole('menuitem', { name: 'View', exact: true })
      .click()
    await page.getByRole('menuitemcheckbox', { name: 'Pets' }).click()
    await expect(petLayer(page)).toBeHidden()

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-pets', 'hidden')
    // Past her longest spawn delay: still away.
    await page.waitForTimeout(10_000)
    await expect(petLayer(page)).toBeHidden()
    expect(await petState(page)).toMatch(/^(out|)$/)
  })

  test('drags, falls and lands on the kerb', async ({ page }) => {
    await openDesktop(page)
    await waitForPet(page)
    // Left of the taskbar, over the bare road.
    await dragPet(page, 240, 300, false)
    await expect.poll(() => petState(page)).toBe('drag')
    await page.mouse.up()
    await expect.poll(() => petState(page)).toMatch(/fall|land/)
    await expect
      .poll(async () => (await petView(page))?.y, { timeout: 5000 })
      .toBe(ON_FLOOR)
    await expect.poll(() => petState(page)).toMatch(OUT)
  })

  test('lands on the taskbar when dropped over it', async ({ page }) => {
    await openDesktop(page)
    await waitForPet(page)
    const bar = await rectOf(taskbar(page))
    await dragPet(page, bar.x + bar.width / 2, 300)
    await expect
      .poll(async () => (await petView(page))?.y, { timeout: 5000 })
      .toBe(ON_TASKBAR)
    await expect.poll(() => petState(page)).toMatch(OUT)
    // Her feet are on the bar's top edge, in its span.
    const view = await petView(page)
    const centre = ((view?.x ?? 0) + FRAME / 2) * ART_PX
    expect(centre).toBeGreaterThan(bar.x)
    expect(centre).toBeLessThan(bar.x + bar.width)
    expect(TASKBAR_TOP * ART_PX).toBe(Math.round(bar.y))
  })

  test('rides a window dragged slowly and falls off a fling', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await waitForPet(page)
    await perchOn(page, about)
    const before = await petView(page)

    // 60 css px in steps of 6, a frame or more apart: 0.06 art px/ms.
    const grip = await titleBarGrip(about)
    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(grip.x + i * 6, grip.y)
      await page.waitForTimeout(50)
    }
    const riding = await petView(page)
    expect(riding?.state).toMatch(OUT)
    expect(riding?.x).toBe((before?.x ?? 0) + 30)

    // A fling: 200 art px in one frame.
    await page.mouse.move(grip.x + 460, grip.y + 200)
    await expect.poll(() => petState(page), { timeout: 2000 }).toBe('fall')
    await page.mouse.up()
    await expect.poll(() => petState(page), { timeout: 5000 }).toMatch(OUT)
  })

  test('falls when her window is minimized', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await waitForPet(page)
    await perchOn(page, about)
    await about.getByRole('button', { name: 'Minimize window' }).click()
    await expect.poll(() => petState(page), { timeout: 2000 }).toBe('fall')
    // Onto the taskbar under her, or the kerb beside it.
    const bar = await rectOf(taskbar(page))
    const centre = (((await petView(page))?.x ?? 0) + FRAME / 2) * ART_PX
    const overBar = centre >= bar.x && centre <= bar.x + bar.width
    await expect
      .poll(async () => (await petView(page))?.y, { timeout: 5000 })
      .toBe(overBar ? ON_TASKBAR : ON_FLOOR)
  })

  test('hides under a maximized window and comes back on restore', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')
    await waitForPet(page)
    const maximize = about.getByRole('button', {
      name: 'Toggle maximize window',
    })
    await maximize.click()
    await expect(petLayer(page)).toBeHidden()
    expect(await petState(page)).toBe('out')
    await maximize.click()
    await expect(petLayer(page)).toBeVisible()
    await waitForPet(page, /fall|land|idle/)
  })

  test('leaves a focused control she covers within 300 ms', async ({
    page,
  }) => {
    await openDesktop(page)
    const button = page.getByRole('button', { name: /^Get in touch/ })
    const target = await rectOf(button)
    // About's top edge right under the button, so she stands over it.
    const about = await launch(page, 'About', 'about.me')
    const grip = await titleBarGrip(about)
    const box = await rectOf(about)
    await page.mouse.move(grip.x, grip.y)
    await page.mouse.down()
    await page.mouse.move(
      grip.x + (target.x - 40 - box.x),
      grip.y + (target.y + target.height + 6 - box.y),
      { steps: 8 }
    )
    await page.mouse.up()
    await waitForPet(page)
    await perchOn(page, about, target.x + target.width / 2)
    expect(overlap(await rectOf(hitbox(page)), target)).toBe(true)

    const ms = await button.evaluate(
      (el) =>
        new Promise<number>((resolve) => {
          const hit = document.querySelector('[data-pet-hitbox]')
          if (!hit) return resolve(-1)
          const covers = () => {
            const a = el.getBoundingClientRect()
            const b = hit.getBoundingClientRect()
            return (
              a.left < b.right &&
              b.left < a.right &&
              a.top < b.bottom &&
              b.top < a.bottom
            )
          }
          const start = performance.now()
          ;(el as HTMLElement).focus()
          const check = () => {
            const elapsed = performance.now() - start
            if (!covers() || elapsed > 1000) resolve(elapsed)
            else requestAnimationFrame(check)
          }
          check()
        })
    )
    expect(ms).toBeGreaterThanOrEqual(0)
    expect(ms).toBeLessThan(300)
  })

  test('holds her frame under the Pause setting', async ({ page }) => {
    await openDesktop(page)
    await waitForPet(page)
    await page
      .getByRole('menubar')
      .getByRole('menuitem', { name: 'View', exact: true })
      .click()
    await page
      .getByRole('menuitemcheckbox', { name: 'Pause animations' })
      .click()
    await page.keyboard.press('Escape')
    const held = await petView(page)
    await page.waitForTimeout(2500)
    expect(await petView(page)).toEqual(held)
  })
})

/**
 * A window that has just opened takes her at every DPR (SPEC 11, decision
 * 1): new windows leave her seated height of room under the menu bar.
 * Projects opens highest of the apps.
 */
for (const dpr of [1, 1.25, 2]) {
  test.describe(`a fresh window at DPR ${dpr}`, () => {
    test.use({ deviceScaleFactor: dpr })

    test('takes her when she is dropped on it', async ({ page }) => {
      await openDesktop(page)
      const projects = await launch(page, 'Projects', 'projects.app')
      await waitForPet(page)
      const px = await page.evaluate(() =>
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--px')
        )
      )
      const bar = await rectOf(titleBar(projects))
      // From 60 art px over the bar, as `perchOn` does: her feet fall onto it.
      await dragPet(page, bar.x + bar.width * 0.55, bar.y - 60 * px)
      const top = Math.round((await rectOf(projects)).y / px)
      await expect
        .poll(async () => {
          const view = await petView(page)
          if (!view || !OUT.test(view.state)) return null
          return view.y === top - FRAME || view.y === top - SEAT
        })
        .toBe(true)
    })
  })
}

test.describe('the desktop pet under reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test.slow()

  test('sits still on the kerb near the right end, with no ticks', async ({
    page,
  }) => {
    await openDesktop(page)
    await waitForPet(page, /^sit$/)
    const still = await petView(page)
    expect(still?.tag).toBe('sit')
    // Seated on the road's kerb (clear of the taskbar here), 40 art px in
    // from the right edge.
    expect(still?.y).toBe(KERB - SEAT)
    expect(still?.x).toBe(DESKTOP_VIEWPORT.width / ART_PX - 40 - FRAME / 2)
    const first = still?.frame
    await page.waitForTimeout(2500)
    expect(await petView(page)).toEqual(still)

    // A click shows one wave frame for a second, then the pose again.
    await hitbox(page).click()
    await expect.poll(async () => (await petView(page))?.tag).toBe('wave')
    await expect
      .poll(async () => (await petView(page))?.frame, { timeout: 3000 })
      .toBe(first)
  })
})
