import { type Locator, type Page, expect, test } from '@playwright/test'

import { SETTING_FLAGS } from '../src/lib/os/appearance'
import {
  AFTER_RELOAD,
  DESKTOP_VIEWPORT,
  cmdPalette,
  desktopReady,
  mockFeeds,
  openDesktop,
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
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [SETTING_FLAGS.text.key, SETTING_FLAGS.text.value]
  )
  await openDesktop(page)
  await expect(html(page)).toHaveAttribute('data-text', 'readable')

  /** The first family of a font list, unquoted. */
  const first = (list: string) => list.split(',')[0].trim().replace(/["']/g, '')
  /** The first family of a font variable on <html>: the face next/font named. */
  const face = async (variable: string) =>
    first(
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
  const familyOf = async (target: Locator) =>
    first(await target.evaluate((el) => getComputedStyle(el).fontFamily))

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
