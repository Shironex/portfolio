import { type Locator, type Page, expect, test } from '@playwright/test'

import {
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  blockTurnstile,
  launch,
  mobileLauncher,
  mockFeeds,
  openDesktop,
  openMobile,
  osWindow,
  osWindows,
  readyShell,
  skipBootSplash,
  taskbar,
  titleBar,
} from './helpers'

/**
 * Layers, keyboard and structure of the shell.
 *
 * Escape closes one layer per press and never a window while a field has
 * focus. Windows stack inside their own layer, under the chrome, however often
 * they are raised, and the palette opens over a mobile sheet. Modal layers
 * (launcher, palette) hold focus and make the page behind inert, and hand it
 * back when they close. The menubar is a real ARIA menubar. Focus follows the
 * windows the user opens and closes, and is left alone on load. The server
 * HTML already shows the right shell for the viewport, and every state has
 * one `main` and one exposed `h1`.
 */
const PROJECT_SLUG = 'shiranami'
const PROJECT_TITLE = 'Shiranami'

const palette = (page: Page) =>
  page.getByRole('dialog', { name: 'Command palette' })
const startMenu = (page: Page) =>
  page.getByRole('dialog', { name: 'Start menu' })
const menubar = (page: Page) => page.getByRole('menubar')
const menuTrigger = (page: Page, name: string) =>
  menubar(page).getByRole('menuitem', { name, exact: true })
const menu = (page: Page, name: string) =>
  page.getByRole('menu', { name, exact: true })

/** Whether the element painted at the centre of `target` belongs to `owner`. */
async function paintsOnTop(target: Locator, owner: Locator = target) {
  const box = await target.boundingBox()
  if (!box) throw new Error('target is not rendered')
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  return owner.evaluate(
    (el, { x, y }) => el.contains(document.elementFromPoint(x, y)),
    point
  )
}

async function expectOneMainAndH1(page: Page) {
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
}

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('escape', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('closes a menu before the window under it', async ({ page }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await menuTrigger(page, 'File').click()
    await expect(menu(page, 'File')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(menu(page, 'File')).toBeHidden()
    await expect(about).toBeVisible()
    await expect(menuTrigger(page, 'File')).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(about).toBeHidden()
  })

  test('closes the palette and the start menu before a window', async ({
    page,
  }) => {
    await openDesktop(page)
    const about = await launch(page, 'About', 'about.me')

    await page.keyboard.press('Control+k')
    await expect(palette(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(palette(page)).toBeHidden()
    await expect(about).toBeVisible()

    await taskbar(page).getByRole('button', { name: 'Open Start menu' }).click()
    await expect(startMenu(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(startMenu(page)).toBeHidden()
    await expect(about).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(about).toBeHidden()
  })

  test('closes only the top window of two', async ({ page }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')

    await page.keyboard.press('Escape')
    await expect(about).toBeHidden()
    await expect(projects).toBeVisible()
  })

  test('never closes a window while a field has focus', async ({ page }) => {
    await blockTurnstile(page)
    await openDesktop(page)
    const contact = await launch(page, 'Contact', 'contact.app')
    const field = contact.getByRole('textbox').first()

    await field.fill('half a thought')
    await page.keyboard.press('Escape')
    await expect(contact).toBeVisible()
    await expect(field).toHaveValue('half a thought')

    // The palette over the form still closes, and hands focus back to it.
    await page.keyboard.press('Control+k')
    await expect(palette(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(palette(page)).toBeHidden()
    await expect(field).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(contact).toBeVisible()

    // Off the field, Escape closes the window again.
    await titleBar(contact).focus()
    await page.keyboard.press('Escape')
    await expect(contact).toBeHidden()
  })
})

test.describe('layers', () => {
  test('a window never paints over the taskbar after 150 focus changes', async ({
    page,
  }) => {
    test.slow()
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')

    // Park About as low as it goes, so it lies across the taskbar. Each
    // press moves from where the last one rendered, hence the pause.
    await titleBar(about).evaluate(async (bar) => {
      for (let i = 0; i < 40; i++) {
        bar.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
        )
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    })

    // An even number of raises: About ends on top again.
    await taskbar(page).evaluate(async (bar) => {
      for (let i = 0; i < 150; i++) {
        const button = Array.from(bar.querySelectorAll('button')).find((b) =>
          b.getAttribute('aria-label')?.endsWith('bring to front')
        )
        if (!button) throw new Error(`no background window at raise ${i}`)
        button.click()
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    })

    const zOf = (win: Locator) =>
      win.evaluate((el) => Number(getComputedStyle(el).zIndex))
    expect(await zOf(about)).toBe(2)
    expect(await zOf(projects)).toBe(1)

    const bar = await taskbar(page).boundingBox()
    const win = await about.boundingBox()
    if (!bar || !win) throw new Error('taskbar or window is not rendered')
    const barMiddle = { x: bar.x + bar.width / 2, y: bar.y + bar.height / 2 }
    expect(win.x).toBeLessThan(barMiddle.x)
    expect(win.x + win.width).toBeGreaterThan(barMiddle.x)
    expect(win.y).toBeLessThan(barMiddle.y)
    expect(await paintsOnTop(taskbar(page))).toBe(true)
  })

  test('the palette opens above a mobile sheet', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await openMobile(page)
    await page.getByRole('button', { name: 'Open About' }).click()
    const sheet = osWindow(page, 'about.me')
    await expect(sheet).toBeVisible()

    await page.keyboard.press('Control+k')
    await expect(palette(page)).toBeVisible()
    const input = palette(page).getByRole('combobox')
    await expect(input).toBeFocused()
    expect(await paintsOnTop(input, palette(page))).toBe(true)

    // One layer per press: the palette, then the sheet.
    await page.keyboard.press('Escape')
    await expect(palette(page)).toBeHidden()
    await expect(sheet).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
  })
})

test.describe('mobile sheets', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('Escape leaves a sheet open while a field has focus', async ({
    page,
  }) => {
    await blockTurnstile(page)
    await openMobile(page)
    await page.getByRole('button', { name: 'Open Contact' }).click()
    const sheet = osWindow(page, 'contact.app')
    const field = sheet.getByRole('textbox').first()

    await field.fill('half a thought')
    await page.keyboard.press('Escape')
    await expect(sheet).toBeVisible()
    await expect(field).toHaveValue('half a thought')

    await sheet.getByRole('button', { name: 'Close', exact: true }).focus()
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
  })

  test('focus returns to the dock when sheets opened through the palette close', async ({
    page,
  }) => {
    await openMobile(page)
    const dockButton = page.getByRole('button', { name: 'Open About' })
    await dockButton.click()
    const about = osWindow(page, 'about.me')
    await expect(about).toBeVisible()

    // The palette opens from inside the sheet and replaces it with another:
    // what the palette would return to is gone along with that sheet.
    await page.keyboard.press('Control+k')
    await palette(page).getByRole('combobox').fill('readme')
    await page.keyboard.press('Enter')
    const readme = osWindow(page, 'readme.md')
    await expect(readme).toBeVisible()
    await expect(palette(page)).toBeHidden()
    expect(
      await readme.evaluate((el) => el.contains(document.activeElement))
    ).toBe(true)

    // Closing it shows the sheet underneath again, and closing that one
    // lands on the button the first sheet was opened from, not on the page.
    await page.keyboard.press('Escape')
    await expect(readme).toBeHidden()
    await expect(about).toBeVisible()
    expect(
      await about.evaluate((el) => el.contains(document.activeElement))
    ).toBe(true)
    await page.keyboard.press('Escape')
    await expect(about).toBeHidden()
    await expect(dockButton).toBeFocused()
  })
})

test.describe('mobile launcher', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('traps focus, makes the page inert and closes on Escape', async ({
    page,
  }) => {
    await openMobile(page)
    await mobileLauncher(page).click()
    const launcher = page.getByRole('dialog', { name: 'App launcher' })
    await expect(launcher).toBeVisible()
    await expect(launcher).toHaveAttribute('aria-modal', 'true')

    // Everything behind it is out of reach.
    await expect(page.locator('main')).toHaveAttribute('inert')

    const focusInside = () =>
      launcher.evaluate((el) => el.contains(document.activeElement))
    expect(await focusInside()).toBe(true)
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
      expect(await focusInside()).toBe(true)
    }
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Shift+Tab')
      expect(await focusInside()).toBe(true)
    }

    // Focus knocked off the dialog comes back on the next Tab.
    await page.evaluate(() => (document.activeElement as HTMLElement).blur())
    await page.keyboard.press('Tab')
    expect(await focusInside()).toBe(true)

    await page.keyboard.press('Escape')
    await expect(launcher).toBeHidden()
    await expect(mobileLauncher(page)).toBeFocused()
    await expect(page.locator('main')).not.toHaveAttribute('inert')
  })
})

test.describe('menubar', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('is one tab stop with arrow-key navigation', async ({ page }) => {
    await openDesktop(page)
    const file = menuTrigger(page, 'File')
    const edit = menuTrigger(page, 'Edit')
    const view = menuTrigger(page, 'View')

    await expect(menubar(page).locator('[tabindex="0"]')).toHaveCount(1)

    await file.focus()
    await page.keyboard.press('ArrowRight')
    await expect(edit).toBeFocused()
    await expect(menubar(page).locator('[tabindex="0"]')).toHaveCount(1)
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(menuTrigger(page, 'Help')).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(edit).toBeFocused()

    // Opening moves focus to the first item; arrows, Home and End move in it.
    await page.keyboard.press('ArrowDown')
    const editMenu = menu(page, 'Edit')
    await expect(editMenu).toBeVisible()
    await expect(edit).toHaveAttribute('aria-expanded', 'true')
    await expect(edit).toHaveAttribute(
      'aria-controls',
      (await editMenu.getAttribute('id')) ?? ''
    )
    const copyEmail = editMenu.getByRole('menuitem', { name: 'Copy email' })
    const copyGithub = editMenu.getByRole('menuitem', {
      name: 'Copy GitHub URL',
    })
    await expect(copyEmail).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(copyGithub).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(copyEmail).toBeFocused()
    await page.keyboard.press('End')
    await expect(copyGithub).toBeFocused()
    await page.keyboard.press('Home')
    await expect(copyEmail).toBeFocused()

    // Right opens the neighbouring menu on its first item.
    await page.keyboard.press('ArrowRight')
    const viewMenu = menu(page, 'View')
    await expect(viewMenu).toBeVisible()
    await expect(editMenu).toBeHidden()
    await expect(viewMenu.getByRole('menuitem').first()).toBeFocused()

    // The palette row is one stop; Left/Right stay inside it.
    await page.keyboard.press('ArrowDown')
    const swatches = viewMenu.getByRole('menuitemradio')
    await expect(viewMenu.locator('[aria-checked="true"]')).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(viewMenu).toBeVisible()
    expect(
      await swatches.evaluateAll(
        (all) =>
          all.includes(document.activeElement as HTMLElement) &&
          document.activeElement?.getAttribute('aria-checked') === 'false'
      )
    ).toBe(true)
    await page.keyboard.press('ArrowDown')
    await expect(
      viewMenu.getByRole('menuitem', { name: 'Open about.me' })
    ).toBeFocused()

    // Escape closes and returns focus to the trigger.
    await page.keyboard.press('Escape')
    await expect(viewMenu).toBeHidden()
    await expect(view).toBeFocused()
    await expect(view).toHaveAttribute('aria-expanded', 'false')

    // Space opens too, and Tab closes on the way out.
    await page.keyboard.press('Space')
    await expect(viewMenu).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(viewMenu).toBeHidden()
    await expect(menubar(page).locator(':focus')).toHaveCount(0)
  })

  test('Enter activates an item and focus lands in what it opened', async ({
    page,
  }) => {
    await openDesktop(page)
    await menuTrigger(page, 'File').focus()
    await page.keyboard.press('Enter')
    await expect(
      menu(page, 'File').getByRole('menuitem', { name: 'Open readme' })
    ).toBeFocused()
    await page.keyboard.press('Enter')

    const readme = osWindow(page, 'readme.md')
    await expect(readme).toBeVisible()
    await expect(menu(page, 'File')).toBeHidden()
    await expect(titleBar(readme)).toBeFocused()
  })
})

test.describe('window focus', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('moves into a new window and returns to its launcher on close', async ({
    page,
  }) => {
    await openDesktop(page)
    const icon = page
      .getByRole('main')
      .getByRole('button', { name: 'Open About', exact: true })
    await icon.focus()
    await page.keyboard.press('Enter')
    const about = osWindow(page, 'about.me')
    await expect(titleBar(about)).toBeFocused()

    await page.keyboard.press('Control+w')
    await expect(about).toBeHidden()
    await expect(icon).toBeFocused()
  })

  test('goes to the next window when the top one closes', async ({ page }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    await expect(titleBar(projects)).toBeFocused()
    const about = await launch(page, 'About', 'about.me')
    await expect(titleBar(about)).toBeFocused()

    await about.getByRole('button', { name: 'Close window' }).click()
    await expect(about).toBeHidden()
    await expect(titleBar(projects)).toBeFocused()

    // Minimize and restore: focus comes back with the window.
    await page.keyboard.press('Control+m')
    await expect(projects).toBeHidden()
    await taskbar(page)
      .getByRole('button', { name: 'Projects (minimized) - restore' })
      .click()
    await expect(titleBar(projects)).toBeFocused()
  })

  test('a window opened from the palette returns focus to the palette trigger', async ({
    page,
  }) => {
    await openDesktop(page)
    const search = taskbar(page).getByRole('button', { name: /search apps/ })
    await search.click()
    await palette(page).getByRole('combobox').fill('readme')
    await page.keyboard.press('Enter')

    const readme = osWindow(page, 'readme.md')
    await expect(titleBar(readme)).toBeFocused()
    await page.keyboard.press('Control+w')
    await expect(readme).toBeHidden()
    await expect(search).toBeFocused()
  })

  test('returns to the control inside the window that opened it', async ({
    page,
  }) => {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const row = projects.getByRole('button', {
      name: `Open ${PROJECT_TITLE}`,
      exact: true,
    })
    await row.focus()
    await page.keyboard.press('Enter')
    const project = osWindow(page, `${PROJECT_SLUG}.app`)
    await expect(titleBar(project)).toBeFocused()

    await page.keyboard.press('Control+w')
    await expect(project).toBeHidden()
    await expect(row).toBeFocused()
  })

  test('a taskbar minimize keeps focus on the button, so Enter restores', async ({
    page,
  }) => {
    await openDesktop(page)
    await launch(page, 'Projects', 'projects.app')
    const about = await launch(page, 'About', 'about.me')
    const button = taskbar(page).getByRole('button', { name: /^About/ })

    await button.focus()
    await page.keyboard.press('Enter')
    await expect(about).toBeHidden()
    await expect(button).toHaveAccessibleName('About (minimized) - restore')
    await expect(button).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(titleBar(about)).toBeFocused()
  })

  test('launching the app already on top does not move a later press', async ({
    page,
  }) => {
    await blockTurnstile(page)
    await openDesktop(page)
    // Side by side, so a field of the background window can be pressed.
    const contact = await launch(page, 'Contact', 'contact.app')
    await page.keyboard.press('Control+Alt+ArrowLeft')
    const about = await launch(page, 'About', 'about.me')
    await page.keyboard.press('Control+Alt+ArrowRight')
    const field = contact.getByRole('textbox', { name: 'Name' })
    await expect(field).toBeVisible()

    // About is on top already, so this changes nothing in the stack.
    await menuTrigger(page, 'View').click()
    await menu(page, 'View')
      .getByRole('menuitem', { name: 'Open about.me' })
      .click()
    await expect(about).toBeVisible()

    await field.click()
    await expect(field).toBeFocused()
    await field.fill('still here')
    await expect(field).toBeFocused()
  })

  test('a deep link leaves focus alone on load', async ({ page }) => {
    await openDesktop(page, '/?open=about')
    const about = osWindow(page, 'about.me')
    await expect(about).toBeVisible()
    await expect(titleBar(about)).not.toBeFocused()
    expect(
      await page.evaluate(() => document.activeElement === document.body)
    ).toBe(true)
  })
})

test.describe('command palette', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('keeps focus on the input and offers to clear an empty search', async ({
    page,
  }) => {
    await openDesktop(page)
    await page.keyboard.press('Control+k')
    const dialog = palette(page)
    const input = dialog.getByRole('combobox')
    await expect(input).toBeFocused()

    // Options are reached with the arrows, never with Tab.
    const options = dialog.getByRole('option')
    await expect(options.first()).toHaveAttribute('tabindex', '-1')
    await expect(
      dialog.getByRole('listbox').locator('[aria-live]')
    ).toHaveCount(0)
    await page.keyboard.press('Tab')
    await expect(input).toBeFocused()

    // The desktop behind is inert while it is open.
    await expect(
      page.locator('main').locator('xpath=ancestor::*[@inert]')
    ).toHaveCount(1)

    await input.fill('zzzz no such thing')
    await expect(options).toHaveCount(0)
    await expect(dialog.getByRole('status')).toHaveText('0 results')
    await dialog.getByRole('button', { name: 'Clear search' }).click()
    await expect(input).toHaveValue('')
    await expect(input).toBeFocused()
    await expect(options.first()).toBeVisible()
  })
})

test.describe('first paint', () => {
  test('the server HTML at 390px shows the mobile shell, not the taskbar', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    // No script ever runs, so this is the HTML as the server sent it.
    await page.route(/\.js(\?.*)?$/, (route) => route.abort())
    await page.goto('/')

    await expect(mobileLauncher(page)).toBeVisible()
    await expect(readyShell(page)).toHaveCount(0)
    await expect(taskbar(page)).toBeHidden()
    await expect(page.getByRole('menubar')).toBeHidden()
  })

  test('the server HTML at desktop width shows the taskbar, not the mobile shell', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.route(/\.js(\?.*)?$/, (route) => route.abort())
    await page.goto('/')

    await expect(taskbar(page)).toBeVisible()
    await expect(readyShell(page)).toHaveCount(0)
    await expect(mobileLauncher(page)).toBeHidden()
  })

  test('hydration leaves one shell, with one main, h1, header and nav', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await openMobile(page)
    await expect(taskbar(page)).toHaveCount(0)
    await expectOneMainAndH1(page)
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Dock' })).toHaveCount(1)

    await page.setViewportSize(DESKTOP_VIEWPORT)
    await openDesktop(page)
    await expect(mobileLauncher(page)).toHaveCount(0)
    await expectOneMainAndH1(page)
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Taskbar' })).toHaveCount(
      1
    )

    // A window brings an `h2` of its own and leaves the page `h1` alone.
    const about = await launch(page, 'About', 'about.me')
    await expectOneMainAndH1(page)
    await expect(
      about.getByRole('heading', { level: 2, name: 'about.me' })
    ).toBeVisible()
  })
})

test.describe('landmarks and headings', () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test('a project route has one main and one h1 with its window open and closed', async ({
    page,
  }) => {
    await page.goto(`/projects/${PROJECT_SLUG}`)
    const win = osWindow(page, `${PROJECT_SLUG}.app`)
    await expect(win).toBeVisible()
    await expectOneMainAndH1(page)
    await expect(
      win.getByRole('heading', { level: 2, name: PROJECT_TITLE, exact: true })
    ).toBeVisible()

    await win.getByRole('button', { name: 'Close window' }).click()
    await expect(osWindows(page)).toHaveCount(0)
    await expectOneMainAndH1(page)
  })
})
