import { type Locator, type Page, expect, test } from '@playwright/test'

import { SETTING_FLAGS } from '../src/lib/os/appearance'
import {
  AFTER_RELOAD,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  cmdPalette,
  desktopReady,
  mobileLauncher,
  mobileReady,
  mockFeeds,
  openDesktop,
  openMobile,
  skipBootSplash,
} from './helpers'

/**
 * The three View settings (SPEC 2.3, 3.6): Pets, Pause animations and
 * Readable text. Each is a checkbox item in the View menu and an action in
 * the palette; each flips its flag on <html>, says so through the shell's
 * live region, and survives a reload (the boot script sets the flag before
 * first paint).
 */
const SETTINGS = [
  {
    id: 'pets',
    menu: 'Pets',
    attribute: 'data-pets',
    flag: 'hidden',
    // On by default: the flag is set while it is off.
    onByDefault: true,
    actions: ['Hide pets', 'Show pets'],
    said: ['Pets hidden', 'Pets shown'],
  },
  {
    id: 'motion',
    menu: 'Pause animations',
    attribute: 'data-motion',
    flag: 'paused',
    onByDefault: false,
    actions: ['Pause animations', 'Resume animations'],
    said: ['Animations paused', 'Animations resumed'],
  },
  {
    id: 'text',
    menu: 'Readable text',
    attribute: 'data-text',
    flag: 'readable',
    onByDefault: false,
    actions: ['Turn readable text on', 'Turn readable text off'],
    said: ['Readable text on', 'Readable text off'],
  },
] as const

const viewMenu = (page: Page) => page.getByRole('menu', { name: 'View' })
const viewTrigger = (page: Page) =>
  page.getByRole('menubar').getByRole('menuitem', { name: 'View', exact: true })
const announcer = (page: Page) =>
  page.locator('[data-os-shell] > [role="status"]')
const html = (page: Page) => page.locator('html')

/** The first family of a font list, unquoted. */
const firstFamily = (list: string) =>
  list.split(',')[0].trim().replace(/["']/g, '')

/** The pixel face and the readable face, as next/font named them on <html>. */
async function faces(page: Page) {
  const face = async (variable: string) =>
    firstFamily(
      await page.evaluate(
        (name) =>
          getComputedStyle(document.documentElement).getPropertyValue(name),
        variable
      )
    )
  const pixel = await face('--font-pixel-sans')
  const readable = await face('--font-atkinson')
  expect(pixel).not.toBe('')
  expect(readable).not.toBe(pixel)
  return { pixel, readable }
}

/** The face a piece of text is set in. */
const familyOf = async (target: Locator) =>
  firstFamily(await target.evaluate((el) => getComputedStyle(el).fontFamily))

/** Store Readable text on, as the switch would. Call before the first `goto`. */
async function storeReadable(page: Page) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [SETTING_FLAGS.text.key, SETTING_FLAGS.text.value]
  )
}

test.use({ viewport: DESKTOP_VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

for (const setting of SETTINGS) {
  test(`View menu: ${setting.menu} flips, says so and persists`, async ({
    page,
  }) => {
    test.slow()
    await openDesktop(page)
    await viewTrigger(page).click()
    const item = viewMenu(page).getByRole('menuitemcheckbox', {
      name: setting.menu,
    })
    await expect(item).toHaveAttribute(
      'aria-checked',
      String(setting.onByDefault)
    )
    // The state shows as a glyph too, never by colour alone.
    await expect(item.locator('[data-menu-check] svg')).toHaveCount(
      setting.onByDefault ? 1 : 0
    )
    await item.click()

    await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)
    await expect(announcer(page)).toHaveText(setting.said[0])

    await page.reload()
    await desktopReady(page, AFTER_RELOAD)
    await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)
    await viewTrigger(page).click()
    await expect(
      viewMenu(page).getByRole('menuitemcheckbox', { name: setting.menu })
    ).toHaveAttribute('aria-checked', String(!setting.onByDefault))

    // And back.
    await viewMenu(page)
      .getByRole('menuitemcheckbox', { name: setting.menu })
      .click()
    await expect(html(page)).not.toHaveAttribute(setting.attribute, /.*/)
    await expect(announcer(page)).toHaveText(setting.said[1])
    // Back to the default, which stores nothing.
    expect(
      await page.evaluate(
        (key) => window.localStorage.getItem(key),
        SETTING_FLAGS[setting.id].key
      )
    ).toBeNull()
  })

  test(`palette: ${setting.actions[0]} and ${setting.actions[1]}`, async ({
    page,
  }) => {
    test.slow()
    await openDesktop(page)
    const run = async (label: string) => {
      await page.keyboard.press('Control+k')
      const dialog = cmdPalette(page)
      await dialog.getByRole('combobox').fill(label)
      await dialog.getByRole('option', { name: label }).click()
      await expect(dialog).toBeHidden()
    }

    await run(setting.actions[0])
    await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)
    await expect(announcer(page)).toHaveText(setting.said[0])

    await page.reload()
    await desktopReady(page, AFTER_RELOAD)
    await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)

    await run(setting.actions[1])
    await expect(html(page)).not.toHaveAttribute(setting.attribute, /.*/)
    await expect(announcer(page)).toHaveText(setting.said[1])
  })
}

/**
 * Readable text swaps long text only (SPEC 2.3): paragraphs, descriptions
 * and lists in app bodies turn to Atkinson Hyperlegible Next, while the
 * chrome (menus, palette rows, buttons) stays in the pixel face.
 */
test('Readable text swaps long text and leaves the chrome pixel', async ({
  page,
}) => {
  await storeReadable(page)
  await openDesktop(page)
  await expect(html(page)).toHaveAttribute('data-text', 'readable')
  const { pixel, readable } = await faces(page)

  // A button of the hero.
  await expect(
    familyOf(page.getByRole('button', { name: 'Get in touch' }))
  ).resolves.toBe(pixel)

  // A menu item.
  await viewTrigger(page).click()
  const item = viewMenu(page).getByRole('menuitemcheckbox', {
    name: 'Readable text',
  })
  await expect(item).toBeVisible()
  expect(await familyOf(item)).toBe(pixel)
  await page.keyboard.press('Escape')
  await expect(viewMenu(page)).toBeHidden()

  // A palette row.
  await page.keyboard.press('Control+k')
  const option = cmdPalette(page).getByRole('option').first()
  await expect(option).toBeVisible()
  expect(await familyOf(option)).toBe(pixel)
  await page.keyboard.press('Escape')
  await expect(cmdPalette(page)).toBeHidden()

  // An About paragraph.
  await page
    .getByRole('navigation', { name: 'Taskbar' })
    .getByRole('button', { name: 'Open About' })
    .click()
  const paragraph = page
    .getByRole('dialog', { name: 'about.me' })
    .getByText(/^I work in TypeScript and Rust/)
  await expect(paragraph).toBeVisible()
  expect(await familyOf(paragraph)).toBe(readable)
})

/**
 * The phone launcher's switches (SPEC 1.7): the same flags, storage and
 * announcements as the View menu, and the Lamp, which swaps the bodies.
 */
test.describe('phone launcher', () => {
  test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true })

  const launcher = (page: Page) =>
    page.getByRole('dialog', { name: 'App launcher' })
  const switchFor = (page: Page, name: string) =>
    launcher(page).getByRole('switch', { name, exact: true })
  const openLauncher = async (page: Page) => {
    await mobileLauncher(page).click()
    await expect(launcher(page)).toBeVisible()
  }

  for (const setting of SETTINGS) {
    test(`${setting.menu} flips, says so and persists`, async ({ page }) => {
      test.slow()
      await openMobile(page)
      await openLauncher(page)
      const toggle = switchFor(page, setting.menu)
      await expect(toggle).toHaveAttribute(
        'aria-checked',
        String(setting.onByDefault)
      )
      await toggle.click()
      await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)
      await expect(toggle).toHaveAttribute(
        'aria-checked',
        String(!setting.onByDefault)
      )
      await expect(announcer(page)).toHaveText(setting.said[0])

      await page.reload()
      await mobileReady(page, AFTER_RELOAD)
      await expect(html(page)).toHaveAttribute(setting.attribute, setting.flag)
      await openLauncher(page)
      await expect(toggle).toHaveAttribute(
        'aria-checked',
        String(!setting.onByDefault)
      )

      // And back, to the default, which stores nothing.
      await toggle.click()
      await expect(html(page)).not.toHaveAttribute(setting.attribute, /.*/)
      await expect(announcer(page)).toHaveText(setting.said[1])
      expect(
        await page.evaluate(
          (key) => window.localStorage.getItem(key),
          SETTING_FLAGS[setting.id].key
        )
      ).toBeNull()
    })
  }

  test('the Lamp turns paper bodies on and persists', async ({ page }) => {
    await openMobile(page)
    await openLauncher(page)
    const lamp = switchFor(page, 'Lamp')
    await expect(lamp).toHaveAttribute('aria-checked', 'false')
    await lamp.click()
    await expect(html(page)).not.toHaveClass(/dark/)
    await expect(lamp).toHaveAttribute('aria-checked', 'true')

    await page.reload()
    await mobileReady(page, AFTER_RELOAD)
    await expect(html(page)).not.toHaveClass(/dark/)
    await openLauncher(page)
    await expect(lamp).toHaveAttribute('aria-checked', 'true')
    await lamp.click()
    await expect(html(page)).toHaveClass(/dark/)
  })

  test('Readable text swaps sheet prose and keeps the phone chrome pixel', async ({
    page,
  }) => {
    await storeReadable(page)
    await openMobile(page)
    const { pixel, readable } = await faces(page)

    await openLauncher(page)
    expect(await familyOf(switchFor(page, 'Readable text'))).toBe(pixel)
    await launcher(page).getByRole('button', { name: 'Open About' }).click()
    const sheet = page.getByRole('dialog', { name: 'about.me' })
    await expect(sheet).toBeVisible()
    expect(
      await familyOf(sheet.getByRole('heading', { name: 'about.me' }))
    ).toBe(pixel)
    expect(
      await familyOf(sheet.getByText(/^I work in TypeScript and Rust/))
    ).toBe(readable)
  })
})
