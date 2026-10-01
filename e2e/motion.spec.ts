import { expect, test } from '@playwright/test'

import {
  AMBIENT_LOOP_CLASS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  ambientPlayStates,
  launch,
  mockFeeds,
  openDesktop,
  openMobile,
  recordAnimations,
  skipBootSplash,
  taskbar,
  titleBar,
} from './helpers'

/**
 * Motion on the shell: the wallpaper loops stand still while the desktop is
 * covered, nothing blurs live behind them or behind the bars, interaction
 * feedback stays short, the terminal transcript is text before it is
 * animation, and the theme switch is one short cross-fade.
 */
const TERMINAL_LINES = [
  'cat about.md',
  'Full-stack developer: TypeScript and Rust.',
  'cat availability.txt',
  'Open to full-time remote roles and contracts or MVPs.',
]

/** Longest an interaction may animate for, in ms. */
const FEEDBACK_BUDGET_MS = 200

/**
 * Four drifting notes, two wallpaper orbs, the orb on the hero plate and the
 * terminal cursor.
 */
const LOOP_COUNT = 8
const ALL_RUNNING = Array.from({ length: LOOP_COUNT }, () => 'running')
const ALL_PAUSED = Array.from({ length: LOOP_COUNT }, () => 'paused')

test.use({ viewport: DESKTOP_VIEWPORT })

test.beforeEach(async ({ page }) => {
  await mockFeeds(page)
  await skipBootSplash(page)
})

test.describe('decorative loops', () => {
  test('run on the desktop and under a floating window, with nothing filtered live', async ({
    page,
  }) => {
    await openDesktop(page)
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)

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
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)
  })

  test('pause under a maximized window, the palette and the start menu', async ({
    page,
  }) => {
    await openDesktop(page)

    await page.keyboard.press('Control+k')
    await expect(
      page.getByRole('dialog', { name: 'Command palette' })
    ).toBeVisible()
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_PAUSED)
    await page.keyboard.press('Escape')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)

    await taskbar(page).getByRole('button', { name: 'Open Start menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Start menu' })).toBeVisible()
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_PAUSED)
    await page.keyboard.press('Escape')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)

    const about = await launch(page, 'About', 'about.me')
    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_PAUSED)

    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)

    await titleBar(about).press('Control+Shift+M')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_PAUSED)
    await titleBar(about).press('Control+M')
    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)
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
    await expect(
      page.getByRole('dialog', { name: 'Command palette' })
    ).toBeVisible()
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
    // transition that is over in 200ms.
    const transition = await page.evaluate(async (loopClass) => {
      const button = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Switch to dark theme"]'
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
    expect(transition.dark).toBe(true)
    expect(transition.themeColor).toBe('#041816')
    expect(transition.loops).toEqual(ALL_PAUSED)

    await expect.poll(() => ambientPlayStates(page)).toEqual(ALL_RUNNING)
  })

  test('swaps at once with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDesktop(page)

    const transitions = await page.evaluate(() => {
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Switch to dark theme"]'
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
    expect(transitions).toEqual({ dark: true, pseudo: 0 })
  })
})
