import { type Page, expect, test } from '@playwright/test'

import { SETTING_FLAGS } from '../src/lib/os/appearance'
import {
  MOBILE_VIEWPORT,
  mockFeeds,
  openMobile,
  skipBootSplash,
} from './helpers'

/**
 * The phone cameos (SPEC 3.8): the mascot seated on the contact card, who
 * loops `sit` and waves on a tap, and the mini-me who rides once across the
 * feed footer when it scrolls into view. Pause holds them, reduced motion
 * shows still frames, Pets hides them, and the ride plays at most once per
 * page view.
 */

const ART_PX = 2
/** Her seat line is 38 art px down her frame, her feet 48 (PET.md). */
const SEAT = 38
const FEET = 48

const mascot = (page: Page) => page.locator('[data-cameo="mascot"]')
const strip = (page: Page) => page.locator('[data-ride]')
const rider = (page: Page) => page.locator('[data-ride] > span').last()

/** The tag and frame she shows, and whether her loop runs. */
function pose(page: Page) {
  return mascot(page).evaluate((el: HTMLElement) => ({
    tag: el.dataset.cameoTag,
    frame: el.dataset.cameoFrame,
    state: el.dataset.cameoState,
  }))
}

/** Where the rider is drawn and on which frame. */
function ride(page: Page) {
  return rider(page).evaluate((el: HTMLElement) => ({
    translate: el.style.translate,
    frame: el.style.backgroundPosition,
  }))
}

async function setFlag(page: Page, id: 'motion' | 'pets', on: boolean) {
  await page.evaluate(
    ([name, value, set]) => {
      const html = document.documentElement
      if (set) html.setAttribute(`data-${name}`, value)
      else html.removeAttribute(`data-${name}`)
    },
    [id, SETTING_FLAGS[id].value, on] as const
  )
}

async function storeFlag(page: Page, id: 'motion' | 'pets') {
  const { key, value } = SETTING_FLAGS[id]
  await page.addInitScript(
    ([k, v]) => window.localStorage.setItem(k, v),
    [key, value]
  )
}

/** Scroll the feed so the contact card is in view. */
async function toCard(page: Page) {
  await mascot(page).scrollIntoViewIfNeeded()
}

/** Scroll the feed to its foot, where the skyline strip is. */
async function toFooter(page: Page) {
  await page.locator('main').evaluate((el) => el.scrollTo(0, el.scrollHeight))
}

test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('seated mascot', () => {
  test('sits on the card edge and loops `sit` while in view', async ({
    page,
  }) => {
    await openMobile(page)
    await toCard(page)
    await expect.poll(async () => (await pose(page)).state).toBe('moving')

    const card = await mascot(page).locator('..').boundingBox()
    const her = await mascot(page).boundingBox()
    expect(card!.y - her!.y).toBe(SEAT * ART_PX)

    const first = (await pose(page)).frame
    await expect
      .poll(async () => (await pose(page)).frame, { timeout: 3000 })
      .not.toBe(first)
    expect((await pose(page)).tag).toBe('sit')
  })

  test('stands and waves on a tap, then sits again', async ({ page }) => {
    await openMobile(page)
    await toCard(page)
    await expect.poll(async () => (await pose(page)).state).toBe('moving')

    await mascot(page).locator('> span').last().tap()
    expect((await pose(page)).tag).toBe('wave')
    // Standing, her feet are on the edge.
    const card = await mascot(page).locator('..').boundingBox()
    const her = await mascot(page).boundingBox()
    expect(card!.y - her!.y).toBe(FEET * ART_PX)
    await expect
      .poll(async () => (await pose(page)).tag, { timeout: 5000 })
      .toBe('sit')
  })

  test('holds her frame under Pause', async ({ page }) => {
    await openMobile(page)
    await toCard(page)
    await expect.poll(async () => (await pose(page)).state).toBe('moving')

    await setFlag(page, 'motion', true)
    await expect.poll(async () => (await pose(page)).state).toBe('held')
    const held = await pose(page)
    await page.waitForTimeout(800)
    expect(await pose(page)).toEqual(held)

    await setFlag(page, 'motion', false)
    await expect.poll(async () => (await pose(page)).state).toBe('moving')
  })

  test('holds while a sheet covers the feed', async ({ page }) => {
    await openMobile(page)
    await toCard(page)
    await expect.poll(async () => (await pose(page)).state).toBe('moving')
    await page
      .getByRole('navigation', { name: 'Dock' })
      .getByRole('button', { name: 'Open About' })
      .click()
    await expect.poll(async () => (await pose(page)).state).toBe('held')
  })

  test.describe('under reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('shows `sit` frame 1, still, and one wave frame on a tap', async ({
      page,
    }) => {
      await openMobile(page)
      await toCard(page)
      await expect(mascot(page)).toBeVisible()
      expect(await pose(page)).toEqual({
        tag: 'sit',
        frame: '0',
        state: 'held',
      })
      await page.waitForTimeout(800)
      expect((await pose(page)).frame).toBe('0')

      await mascot(page).locator('> span').last().tap()
      expect(await pose(page)).toMatchObject({ tag: 'wave', frame: '0' })
      await page.waitForTimeout(500)
      expect(await pose(page)).toMatchObject({ tag: 'wave', frame: '0' })
      await expect
        .poll(async () => (await pose(page)).tag, { timeout: 3000 })
        .toBe('sit')
      expect((await pose(page)).frame).toBe('0')
    })
  })
})

test.describe('footer ride', () => {
  test('rides across once when the footer comes into view', async ({
    page,
  }) => {
    test.slow()
    await openMobile(page)
    await expect(strip(page)).toHaveAttribute('data-ride', 'waiting')
    await toFooter(page)
    await expect(strip(page)).toHaveAttribute('data-ride', 'riding')
    await expect(rider(page)).toBeVisible()
    await expect(strip(page)).toHaveAttribute('data-ride', 'done', {
      timeout: 10_000,
    })
    await expect(rider(page)).toBeHidden()

    // Away and back: once per page view.
    await page.locator('main').evaluate((el) => el.scrollTo(0, 0))
    await page.waitForTimeout(300)
    await toFooter(page)
    await page.waitForTimeout(600)
    await expect(strip(page)).toHaveAttribute('data-ride', 'done')
    await expect(rider(page)).toBeHidden()
  })

  test('holds where she is under Pause, then rides on', async ({ page }) => {
    await openMobile(page)
    await toFooter(page)
    await expect(strip(page)).toHaveAttribute('data-ride', 'riding')
    await page.waitForTimeout(300)

    await setFlag(page, 'motion', true)
    await expect(strip(page)).toHaveAttribute('data-ride', 'held')
    const held = await ride(page)
    await page.waitForTimeout(600)
    expect(await ride(page)).toEqual(held)

    await setFlag(page, 'motion', false)
    await expect(strip(page)).toHaveAttribute('data-ride', 'riding')
    await expect.poll(() => ride(page)).not.toEqual(held)
  })

  test('waits parked when Pause is on as the footer comes into view', async ({
    page,
  }) => {
    await storeFlag(page, 'motion')
    await openMobile(page)
    await toFooter(page)
    await expect(strip(page)).toHaveAttribute('data-ride', 'parked')
    await expect(rider(page)).toBeVisible()
    const parked = await ride(page)
    await page.waitForTimeout(600)
    expect(await ride(page)).toEqual(parked)
  })

  test.describe('under reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('shows her parked and never rides', async ({ page }) => {
      await openMobile(page)
      await toFooter(page)
      await expect(strip(page)).toHaveAttribute('data-ride', 'parked')
      await expect(rider(page)).toBeVisible()
      await page.waitForTimeout(800)
      await expect(strip(page)).toHaveAttribute('data-ride', 'parked')
    })
  })
})

test.describe('with Pets off', () => {
  test('neither the mascot nor the rider shows, and no ride starts', async ({
    page,
  }) => {
    await storeFlag(page, 'pets')
    await openMobile(page)
    await expect(mascot(page)).toBeHidden()
    await toFooter(page)
    await page.waitForTimeout(800)
    await expect(strip(page)).toHaveAttribute('data-ride', 'waiting')
    await expect(rider(page)).toBeHidden()
  })
})
