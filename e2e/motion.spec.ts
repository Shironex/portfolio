import { type Locator, type Page, expect, test } from '@playwright/test'

import { RIDES_STORAGE_KEY } from '../src/components/os/wallpaper/ride-by'
import { MOTION_STORAGE_KEY } from '../src/lib/os/appearance'
import { BOOT_STORAGE_KEY } from '../src/lib/os/boot-flag'
import {
  AMBIENT_LOOP_CLASS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  ambientPlayStates,
  bootSplash,
  cmdPalette,
  launch,
  mockFeeds,
  openDesktop,
  openMobile,
  recordAnimations,
  rectOf,
  skipBootSplash,
  startMenu,
  taskbar,
  titleBar,
} from './helpers'

/**
 * Motion on the shell: the wallpaper's clock and the decorative loops stand
 * still while the desktop is covered, under the Pause setting, in a hidden
 * tab and under reduced motion; hover loops hold only for the user's own
 * pause; nothing blurs live behind them or behind the bars; interaction
 * feedback stays short; the terminal transcript is text before it is
 * animation; and the theme switch is one short cross-fade.
 */
const TERMINAL_LINES = [
  'cat about.md',
  'Full-stack developer: TypeScript and Rust.',
  'cat availability.txt',
  'Open to full-time remote roles and contracts or MVPs.',
]

/** Longest an interaction may animate for, in ms (SPEC 2.8). */
const FEEDBACK_BUDGET_MS = 160

/**
 * The desktop's own loops, the terminal cursor and the featured banner. An
 * open app adds its own (the banners of About, Skills and Writing).
 */
const LOOP_COUNT = 2
/** Every loop of the bare desktop, running or paused. */
const ALL_RUNNING = Array.from({ length: LOOP_COUNT }, () => 'running')
const ALL_PAUSED = Array.from({ length: LOOP_COUNT }, () => 'paused')

/** Whether the wallpaper's clock runs (`data-state` on its canvas). */
function wallpaperState(page: Page) {
  return page.locator('canvas[data-wallpaper]').getAttribute('data-state')
}

/**
 * The decorative loops and the wallpaper, in one reading: the play states
 * the loops are in, once each, when the desktop's own are among them.
 */
async function motionState(page: Page) {
  const loops = await ambientPlayStates(page)
  return {
    loops: loops.length >= LOOP_COUNT ? [...new Set(loops)] : loops,
    wallpaper: await wallpaperState(page),
  }
}

const RUNNING = { loops: ['running'], wallpaper: 'running' }
const PAUSED = { loops: ['paused'], wallpaper: 'paused' }

/** Hold every loop for good, as the View menu's Pause motion does. */
async function usePausedMotion(page: Page) {
  await page.addInitScript(
    ([key]) => window.localStorage.setItem(key, 'paused'),
    [MOTION_STORAGE_KEY]
  )
}

/** Make the tab hidden or visible again, as switching tabs does. */
async function setTabHidden(page: Page, hidden: boolean) {
  await page.evaluate((value) => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => value,
    })
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => (value ? 'hidden' : 'visible'),
    })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hidden)
}

test.use({ viewport: DESKTOP_VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('decorative loops and the wallpaper', () => {
  test('run on the desktop and under a floating window, with nothing filtered live', async ({
    page,
  }) => {
    await openDesktop(page)
    await expect.poll(() => motionState(page)).toEqual(RUNNING)

    const filters = await page.evaluate(
      (loopClass) => ({
        loops: Array.from(document.getElementsByClassName(loopClass)).map(
          (el) => getComputedStyle(el).filter
        ),
        chrome: ['header', 'nav[aria-label="Taskbar"]'].map((selector) => {
          const el = document.querySelector(selector)
          return el ? getComputedStyle(el).backdropFilter : null
        }),
      }),
      AMBIENT_LOOP_CLASS
    )
    expect(new Set(filters.loops)).toEqual(new Set(['none']))
    expect(filters.chrome).toEqual(['none', 'none'])

    await launch(page, 'About', 'about.me')
    await expect.poll(() => motionState(page)).toEqual(RUNNING)
  })

  test('pause under a maximized window, the palette and the start menu', async ({
    page,
  }) => {
    await openDesktop(page)

    await page.keyboard.press('Control+k')
    await expect(cmdPalette(page)).toBeVisible()
    await expect.poll(() => motionState(page)).toEqual(PAUSED)
    await page.keyboard.press('Escape')
    await expect.poll(() => motionState(page)).toEqual(RUNNING)

    await taskbar(page).getByRole('button', { name: 'Open Start menu' }).click()
    await expect(startMenu(page)).toBeVisible()
    await expect.poll(() => motionState(page)).toEqual(PAUSED)
    await page.keyboard.press('Escape')
    await expect.poll(() => motionState(page)).toEqual(RUNNING)

    const about = await launch(page, 'About', 'about.me')
    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => motionState(page)).toEqual(PAUSED)

    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => motionState(page)).toEqual(RUNNING)

    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => motionState(page)).toEqual(PAUSED)
    await titleBar(about).press('Control+M')
    await expect.poll(() => motionState(page)).toEqual(RUNNING)
  })

  test('hold for good under the Pause setting', async ({ page }) => {
    await usePausedMotion(page)
    await openDesktop(page)
    await expect.poll(() => motionState(page)).toEqual(PAUSED)
    await launch(page, 'About', 'about.me')
    await expect.poll(() => motionState(page)).toEqual(PAUSED)
  })

  test('stop the wallpaper in a hidden tab', async ({ page }) => {
    await openDesktop(page)
    await expect.poll(() => wallpaperState(page)).toBe('running')
    await setTabHidden(page, true)
    await expect.poll(() => wallpaperState(page)).toBe('paused')
    await setTabHidden(page, false)
    await expect.poll(() => wallpaperState(page)).toBe('running')
  })

  test('leave a still wallpaper, drawn, under reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)
    const canvas = page.locator('canvas[data-wallpaper]')
    await expect(canvas).toHaveAttribute('data-drawn', '')
    await expect(canvas).toHaveAttribute('data-state', 'paused')
    const frame = () =>
      canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())
    const first = await frame()
    // Longer than a twinkle, a window switch and a cloud step.
    await page.waitForTimeout(1600)
    expect(await frame()).toBe(first)
  })
})

test.describe('app icons', () => {
  /** The animation and background position of an app icon. */
  async function iconState(icon: Locator) {
    return icon.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        name: style.animationName,
        position: style.backgroundPosition,
      }
    })
  }

  function contactIcon(page: Page) {
    return iconState(page.locator('[data-app-icon="contact"]').first())
  }

  test('loop on hover and keyboard focus only, from their still', async ({
    page,
  }) => {
    await openDesktop(page)
    const button = page.getByRole('button', { name: 'Open Contact' }).first()
    const still = await contactIcon(page)
    expect(still.name).toBe('none')

    await button.hover()
    await expect
      .poll(async () => (await contactIcon(page)).name)
      .toBe('px-app-icons-32-contact')
    await page.mouse.move(720, 450)
    await expect.poll(() => contactIcon(page)).toEqual(still)

    await button.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await expect
      .poll(async () => (await contactIcon(page)).name)
      .toBe('px-app-icons-32-contact')
  })

  test('stay on their still with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)
    const still = await contactIcon(page)
    await page.getByRole('button', { name: 'Open Contact' }).first().hover()
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(120)
      expect((await contactIcon(page)).position).toBe(still.position)
    }
  })

  test('stay on their still under the Pause setting', async ({ page }) => {
    await usePausedMotion(page)
    await openDesktop(page)
    await page.getByRole('button', { name: 'Open Contact' }).first().hover()
    await page.waitForTimeout(200)
    expect((await contactIcon(page)).name).toBe('none')
  })

  test('keep looping in the start menu, under its ambient pause', async ({
    page,
  }) => {
    await openDesktop(page)
    await taskbar(page).getByRole('button', { name: 'Open Start menu' }).click()
    const menu = startMenu(page)
    await expect(menu).toBeVisible()
    await expect.poll(() => motionState(page)).toEqual(PAUSED)

    const icon = menu.locator('[data-app-icon="contact"]').first()
    expect((await iconState(icon)).name).toBe('none')
    await icon.hover()
    await expect
      .poll(async () => (await iconState(icon)).name)
      .toBe('px-app-icons-32-contact')
    await expect
      .poll(() =>
        icon.evaluate((el) => getComputedStyle(el).animationPlayState)
      )
      .toBe('running')
  })
})

/** The animation, its count and the background position of a sprite. */
async function spriteState(sprite: Locator) {
  return sprite.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      name: style.animationName,
      count: style.animationIterationCount,
      position: style.backgroundPosition,
    }
  })
}

/** Positions of a sprite read a few times over `ms`. */
async function positionsOver(sprite: Locator, page: Page, ms = 600) {
  const seen = new Set<string>()
  for (let i = 0; i < 5; i++) {
    seen.add((await spriteState(sprite)).position)
    await page.waitForTimeout(ms / 5)
  }
  return [...seen]
}

test.describe('project icons', () => {
  const PROJECT = 'Moekoder'

  async function openProjects(page: Page) {
    await openDesktop(page)
    const projects = await launch(page, 'Projects', 'projects.app')
    const card = projects.getByRole('button', {
      name: `Open ${PROJECT}`,
      exact: true,
    })
    return { card, icon: card.locator('[data-project-icon="moekoder"]') }
  }

  test('play their tag once on hover, then rest on the still', async ({
    page,
  }) => {
    const { card, icon } = await openProjects(page)
    const still = await spriteState(icon)
    expect(still.name).toBe('none')
    await icon.evaluate((el) =>
      el.addEventListener(
        'animationend',
        () => el.setAttribute('data-ended', ''),
        { once: true }
      )
    )

    await card.hover()
    await expect
      .poll(async () => (await spriteState(icon)).name)
      .toBe('px-project-icons-32-moekoder')
    expect((await spriteState(icon)).count).toBe('1')
    // The tag runs 975 ms and ends with the pointer still on the card.
    await expect(icon).toHaveAttribute('data-ended', '', { timeout: 3000 })
    expect(await positionsOver(icon, page)).toEqual([still.position])
  })

  test('stay on their still with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const { card, icon } = await openProjects(page)
    const still = await spriteState(icon)
    await card.hover()
    expect(await positionsOver(icon, page)).toEqual([still.position])
  })

  test('stay on their still under the Pause setting', async ({ page }) => {
    await usePausedMotion(page)
    const { card, icon } = await openProjects(page)
    await card.hover()
    await page.waitForTimeout(200)
    expect((await spriteState(icon)).name).toBe('none')
  })
})

test.describe('404 sign', () => {
  function sign(page: Page) {
    return page.locator('.px-os-neon-404')
  }

  test('flickers on its drawn timing', async ({ page }) => {
    await page.goto('/no-such-page')
    await expect
      .poll(async () => (await spriteState(sign(page))).name)
      .toBe('px-os-neon-404-flicker')
    expect(
      await sign(page).evaluate((el) => getComputedStyle(el).animationDuration)
    ).toBe('3.44s')
  })

  test('holds frame 1 with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/no-such-page')
    await expect(sign(page)).toBeVisible()
    expect(await positionsOver(sign(page), page)).toEqual(['0px 0px'])
  })

  test('holds frame 1 under the Pause setting', async ({ page }) => {
    await usePausedMotion(page)
    await page.goto('/no-such-page')
    await expect(sign(page)).toBeVisible()
    expect((await spriteState(sign(page))).name).toBe('none')
    expect(await positionsOver(sign(page), page)).toEqual(['0px 0px'])
  })
})

test.describe('boot splash', () => {
  /** Show the splash on this load, as a first visit in the tab does. */
  async function firstVisit(page: Page) {
    await page.addInitScript(
      ([key]) => window.sessionStorage.removeItem(key),
      [BOOT_STORAGE_KEY]
    )
  }

  test('is skipped under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await firstVisit(page)
    await openDesktop(page)
    await expect(bootSplash(page)).toBeHidden()
  })

  /** The pet beside the wordmark: `wave:<frame>`, `idle:0`, or `still`. */
  const bootWave = (page: Page) => page.locator('[data-boot-wave]')

  test('the pet waves once beside the wordmark, then rests', async ({
    page,
  }) => {
    await firstVisit(page)
    await page.goto('/')
    const wave = bootWave(page)
    await expect(bootSplash(page)).toBeVisible()
    const seen = new Set<string>()
    await expect
      .poll(
        async () => {
          seen.add((await wave.getAttribute('data-boot-wave')) ?? '')
          return seen.has('idle:0')
        },
        { intervals: [40], timeout: 3000 }
      )
      .toBe(true)
    // She played through her wave on the way (frames 1 to 8, sampled).
    expect(
      [...seen].filter((s) => s.startsWith('wave:')).length
    ).toBeGreaterThan(2)
    const pet = await rectOf(wave)
    const wordmark = await rectOf(page.locator('.px-os-boot-wordmark'))
    expect(pet.x).toBeGreaterThan(wordmark.x + wordmark.width)
  })

  test('holds still under the Pause setting, and Escape skips it', async ({
    page,
  }) => {
    await usePausedMotion(page)
    await firstVisit(page)
    await page.goto('/')
    const splash = bootSplash(page)
    await expect(splash).toBeVisible()
    const moving = await splash.evaluate(
      (root) =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.playState === 'running' &&
              root.contains(
                (animation.effect as KeyframeEffect | null)?.target ?? null
              )
          ).length
    )
    expect(moving).toBe(0)
    // The pet beside the wordmark shows one wave frame, still.
    const wave = bootWave(page)
    await expect(wave).toBeVisible()
    const frame = await wave.evaluate(
      (el) => getComputedStyle(el).backgroundPosition
    )
    await page.waitForTimeout(1200)
    expect(await wave.getAttribute('data-boot-wave')).toBe('still')
    expect(
      await wave.evaluate((el) => getComputedStyle(el).backgroundPosition)
    ).toBe(frame)
    await page.keyboard.press('Escape')
    await expect(splash).toBeHidden()
  })
})

test.describe('mobile bars', () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test('are not filtered live over the feed', async ({ page }) => {
    await openMobile(page)

    const bars = await page.evaluate(() =>
      ['header', 'nav[aria-label="Dock"]'].map((selector) => {
        const el = document.querySelector(selector)
        if (!el) return null
        const style = getComputedStyle(el)
        return { backdrop: style.backdropFilter, filter: style.filter }
      })
    )
    expect(bars).toEqual([
      { backdrop: 'none', filter: 'none' },
      { backdrop: 'none', filter: 'none' },
    ])
  })
})

test.describe('terminal transcript', () => {
  test('is in the server HTML and in the DOM before it is revealed', async ({
    page,
  }) => {
    const html = await (await page.request.get('/')).text()
    for (const line of TERMINAL_LINES) expect(html).toContain(line)

    await openDesktop(page)
    // Attached is the claim: the reveal animation may still hold a line at
    // opacity 0, and assistive tech reads it all the same.
    for (const line of TERMINAL_LINES) {
      await expect(page.getByText(line, { exact: true })).toBeAttached()
    }
    await expect(
      page.getByText(TERMINAL_LINES[TERMINAL_LINES.length - 1], {
        exact: true,
      })
    ).toBeVisible()
    // Once revealed a line holds nothing: no finished animation is left
    // filling forwards on it.
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (animation) =>
                  (animation as CSSAnimation).animationName === 'termIn'
              ).length
        )
      )
      .toBe(0)
  })

  test('shows at once with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)

    const lines = await page.evaluate(
      (texts) =>
        texts.map((text) => {
          const el = Array.from(document.querySelectorAll('main div')).find(
            (node) => node.textContent === text
          )
          if (!el) return null
          const style = getComputedStyle(el)
          return { animation: style.animationName, opacity: style.opacity }
        }),
      // Output lines: each is the whole text of its row.
      [TERMINAL_LINES[1], TERMINAL_LINES[3]]
    )
    expect(lines).toEqual([
      { animation: 'none', opacity: '1' },
      { animation: 'none', opacity: '1' },
    ])
  })
})

test.describe('interaction timing', () => {
  test('a window, a menu and the palette open within the feedback budget', async ({
    page,
  }) => {
    await openDesktop(page)
    const started = await recordAnimations(page)
    const durations = async () =>
      Object.fromEntries((await started()).map(({ name, ms }) => [name, ms]))

    await launch(page, 'About', 'about.me')
    await page
      .getByRole('menubar')
      .getByRole('menuitem', { name: 'File', exact: true })
      .click()
    await expect(page.getByRole('menu', { name: 'File' })).toBeVisible()
    // The animation starts a frame after the menu mounts; closing the menu
    // before that would leave nothing to measure.
    await expect.poll(durations).toHaveProperty('menuIn')
    await page.keyboard.press('Escape')
    await page.keyboard.press('Control+k')
    await expect(cmdPalette(page)).toBeVisible()
    await expect.poll(durations).toHaveProperty('cpIn')

    const { winOpen, menuIn, cpIn } = await durations()
    for (const ms of [winOpen, menuIn, cpIn]) {
      expect(ms).toBeGreaterThan(0)
      expect(ms).toBeLessThanOrEqual(FEEDBACK_BUDGET_MS)
    }
  })
})

test.describe('theme switch', () => {
  test('is one short cross-fade, with the theme colour set as it starts', async ({
    page,
  }) => {
    await openDesktop(page)

    // Click and watch from inside the page, so no round trip can miss a
    // transition that is over in 160ms.
    const transition = await page.evaluate(async (loopClass) => {
      const button = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Turn the lamp on"]'
      )
      button?.click()
      const pseudoAnimations = () =>
        document.getAnimations().flatMap((animation) => {
          const effect = animation.effect as KeyframeEffect | null
          const pseudo = effect?.pseudoElement ?? ''
          if (!effect || !pseudo.startsWith('::view-transition')) return []
          const frames = effect.getKeyframes()
          return [
            {
              pseudo,
              duration: Number(effect.getComputedTiming().duration),
              properties: frames.flatMap((frame) =>
                Object.keys(frame).filter(
                  (key) =>
                    ![
                      'offset',
                      'easing',
                      'composite',
                      'computedOffset',
                    ].includes(key)
                )
              ),
              // The group pseudo-element animates geometry from the old
              // snapshot's box; for the root that is the viewport, in place.
              from: {
                transform: String(frames[0]?.transform ?? ''),
                width: String(frames[0]?.width ?? ''),
                height: String(frames[0]?.height ?? ''),
              },
            },
          ]
        })
      const deadline = performance.now() + 2000
      while (pseudoAnimations().length === 0 && performance.now() < deadline) {
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      return {
        animations: pseudoAnimations(),
        dark: document.documentElement.classList.contains('dark'),
        themeColor: document.querySelector<HTMLMetaElement>(
          'meta[name="theme-color"]'
        )?.content,
        loops: Array.from(document.getElementsByClassName(loopClass)).map(
          (el) => getComputedStyle(el).animationPlayState
        ),
      }
    }, AMBIENT_LOOP_CLASS)

    expect(transition.animations.length).toBeGreaterThan(0)
    for (const animation of transition.animations) {
      expect(animation.pseudo).toMatch(/\(root\)$/)
      expect(animation.duration).toBeGreaterThan(0)
      expect(animation.duration).toBeLessThanOrEqual(FEEDBACK_BUDGET_MS)
    }
    // The two snapshots only fade: nothing in them moves or resizes the page.
    const snapshots = transition.animations.filter((animation) =>
      /-(old|new)\(root\)$/.test(animation.pseudo)
    )
    expect(snapshots.length).toBeGreaterThan(0)
    // `mixBlendMode` is the browser's own half of a cross-fade: it keeps the
    // two fading snapshots from dipping in brightness midway.
    expect(
      new Set(snapshots.flatMap((animation) => animation.properties))
    ).toEqual(new Set(['opacity', 'mixBlendMode']))
    // And the box they sit in stays the viewport, where it already is.
    for (const group of transition.animations.filter((animation) =>
      animation.pseudo.includes('group')
    )) {
      expect(group.from).toEqual({
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
        width: `${DESKTOP_VIEWPORT.width}px`,
        height: `${DESKTOP_VIEWPORT.height}px`,
      })
    }
    // The Lamp went on (paper bodies); the theme colour is the ground navy,
    // which no mode changes.
    expect(transition.dark).toBe(false)
    expect(transition.themeColor).toBe('#0b1420')
    expect(transition.loops).toEqual(ALL_PAUSED)

    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)
  })

  test('swaps at once with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)

    const transitions = await page.evaluate(() => {
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Turn the lamp on"]'
        )
        ?.click()
      return {
        dark: document.documentElement.classList.contains('dark'),
        pseudo: document
          .getAnimations()
          .filter((animation) =>
            (
              (animation.effect as KeyframeEffect | null)?.pseudoElement ?? ''
            ).startsWith('::view-transition')
          ).length,
      }
    })
    expect(transitions).toEqual({ dark: false, pseudo: 0 })
  })
})

test.describe('mini-me ride-by', () => {
  test.slow()

  /** A minute and a bit of visible time: past the first ride's start. */
  const PAST_FIRST_RIDE = 66_000

  /**
   * Mark the page once the canvas carries `data-ride`, so a ride that came
   * and went between two readings still counts.
   */
  async function watchRides(page: Page) {
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-wallpaper]')
      const state = window as unknown as { __rode: boolean }
      state.__rode = false
      if (!canvas) return
      new MutationObserver(() => {
        if (canvas.hasAttribute('data-ride')) state.__rode = true
      }).observe(canvas, { attributes: true, attributeFilter: ['data-ride'] })
    })
    return () =>
      page.evaluate(() => (window as unknown as { __rode: boolean }).__rode)
  }

  /** The desktop under a fake clock, the wallpaper running or not. */
  async function openWithClock(page: Page) {
    await page.clock.install()
    await openDesktop(page)
    await expect(page.locator('canvas[data-wallpaper]')).toHaveAttribute(
      'data-drawn',
      ''
    )
  }

  test('rides by after a minute of visible time, and not before', async ({
    page,
  }) => {
    await openWithClock(page)
    const rode = await watchRides(page)
    await page.clock.runFor(50_000)
    expect(await rode()).toBe(false)
    await page.clock.runFor(PAST_FIRST_RIDE - 50_000)
    expect(await rode()).toBe(true)
  })

  test('stops after three rides in a tab', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.sessionStorage.setItem(key, '3'),
      [RIDES_STORAGE_KEY]
    )
    await openWithClock(page)
    const rode = await watchRides(page)
    await page.clock.runFor(PAST_FIRST_RIDE)
    expect(await rode()).toBe(false)
  })

  test('never starts under the Pause setting', async ({ page }) => {
    await usePausedMotion(page)
    await openWithClock(page)
    const rode = await watchRides(page)
    await page.clock.runFor(PAST_FIRST_RIDE)
    expect(await rode()).toBe(false)
  })

  test('never starts under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openWithClock(page)
    const rode = await watchRides(page)
    await page.clock.runFor(PAST_FIRST_RIDE)
    expect(await rode()).toBe(false)
  })

  test('never starts in a hidden tab', async ({ page }) => {
    await openWithClock(page)
    const rode = await watchRides(page)
    await setTabHidden(page, true)
    await page.clock.runFor(PAST_FIRST_RIDE)
    expect(await rode()).toBe(false)
  })

  test('never starts under a maximized window', async ({ page }) => {
    await openWithClock(page)
    const about = await launch(page, 'About', 'about.me')
    await about.getByRole('button', { name: 'Toggle maximize window' }).click()
    await expect.poll(() => wallpaperState(page)).toBe('paused')
    const rode = await watchRides(page)
    await page.clock.runFor(PAST_FIRST_RIDE)
    expect(await rode()).toBe(false)
  })
})
