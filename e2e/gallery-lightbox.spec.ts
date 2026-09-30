import { type Page, expect, test } from '@playwright/test'

/**
 * Gallery lightbox navigation on the project detail view.
 *
 * Opens a featured project with a multi-image gallery, then steps through
 * the screenshots with the prev/next buttons, the arrow keys (desktop) and
 * horizontal swipes (mobile), including wrap-around at both ends.
 */
const PROJECT = 'Shiranami'

async function openGallery(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })

  const boot = page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
  if (await boot.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
    await boot.waitFor({ state: 'hidden' }).catch(() => {})
  }

  await page
    .getByRole('button', { name: `Open ${PROJECT}`, exact: true })
    .first()
    .click()

  const thumbs = page.getByRole('button', { name: /^View full size:/ })
  await thumbs.first().click()

  return { thumbs, count: await thumbs.count() }
}

function lightbox(page: Page) {
  return page.locator('[role="dialog"][aria-modal="true"]').filter({
    has: page.getByRole('button', { name: 'Close image view' }),
  })
}

async function swipe(page: Page, fromX: number, toX: number) {
  await page.evaluate(
    ([startX, endX]) => {
      const target = document.elementFromPoint(startX, 400) ?? document.body
      const touch = (x: number) =>
        new Touch({ identifier: 1, target, clientX: x, clientY: 400 })
      target.dispatchEvent(
        new TouchEvent('touchstart', {
          bubbles: true,
          touches: [touch(startX)],
          changedTouches: [touch(startX)],
        })
      )
      target.dispatchEvent(
        new TouchEvent('touchend', {
          bubbles: true,
          touches: [],
          changedTouches: [touch(endX)],
        })
      )
    },
    [fromX, toX]
  )
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('buttons and arrow keys step through the gallery', async ({ page }) => {
    const { count } = await openGallery(page)
    expect(count).toBeGreaterThan(1)

    const box = lightbox(page)
    await expect(box).toBeVisible()
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()
    await expect(
      box.getByRole('button', { name: 'Close image view' })
    ).toBeFocused()

    await box.getByRole('button', { name: 'Next image' }).click()
    await expect(box.getByText(`2 / ${count}`)).toBeVisible()

    await box.getByRole('button', { name: 'Previous image' }).click()
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()

    // Wraps backwards from the first image to the last.
    await page.keyboard.press('ArrowLeft')
    await expect(box.getByText(`${count} / ${count}`)).toBeVisible()

    // And forwards from the last back to the first.
    await page.keyboard.press('ArrowRight')
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()

    // Escape closes only the lightbox, not the project window beneath it.
    await page.keyboard.press('Escape')
    await expect(box).toBeHidden()
    await expect(
      page.getByRole('button', { name: /^View full size:/ }).first()
    ).toBeVisible()
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('buttons and swipes step through the gallery', async ({ page }) => {
    const { count } = await openGallery(page)
    expect(count).toBeGreaterThan(1)

    const box = lightbox(page)
    await expect(box).toBeVisible()
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()

    await box.getByRole('button', { name: 'Next image' }).tap()
    await expect(box.getByText(`2 / ${count}`)).toBeVisible()

    await box.getByRole('button', { name: 'Previous image' }).tap()
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()

    // Swipe left advances, swipe right goes back (wrapping to the last).
    await swipe(page, 300, 100)
    await expect(box.getByText(`2 / ${count}`)).toBeVisible()
    await swipe(page, 100, 300)
    await expect(box.getByText(`1 / ${count}`)).toBeVisible()
    await swipe(page, 100, 300)
    await expect(box.getByText(`${count} / ${count}`)).toBeVisible()

    // A short drag is not a swipe.
    await swipe(page, 200, 180)
    await expect(box.getByText(`${count} / ${count}`)).toBeVisible()

    await box.getByRole('button', { name: 'Close image view' }).tap()
    await expect(box).toBeHidden()
  })
})
