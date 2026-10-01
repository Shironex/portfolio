import { type Locator, type Page, expect } from '@playwright/test'
import { join } from 'node:path'

import { BOOT_STORAGE_KEY } from '../src/components/os/boot'
import {
  SHELL_READY_ATTRIBUTE,
  SHELL_ROOT_ATTRIBUTE,
} from '../src/components/os/noscript-fallback'
import {
  MODE_STORAGE_KEY,
  PALETTE_STORAGE_KEY,
  type PaletteId,
} from '../src/lib/os/appearance'
import { WINDOW_ID_ATTRIBUTE } from '../src/lib/os/dom'

/** API routes answered from the showcase fixtures, so no test waits on GitHub or the blog. */
const FIXTURE_ROUTES = ['github-activity', 'github-contributions', 'blog-posts']

const FIXTURE_DIR = join(process.cwd(), 'showcase', 'fixtures')

export const DESKTOP_VIEWPORT = { width: 1440, height: 900 }
export const MOBILE_VIEWPORT = { width: 390, height: 844 }

/** Default rect of the About window, from `APP_WINDOW_DEFAULTS`. */
export const ABOUT_RECT = { x: 180, y: 120, width: 820, height: 580 }

/** Class of every decorative loop the shell can hold still. */
export const AMBIENT_LOOP_CLASS = 'ambient-loop'

/** Usable desktop area for a viewport: the insets in `geometry.ts`. */
export function areaFor(viewport: { width: number; height: number }) {
  return {
    x: 8,
    y: 44,
    width: viewport.width - 16,
    height: viewport.height - 108,
  }
}

/**
 * Room for the shell to hydrate after a reload that only waits for commit.
 * A second document load is slow on a busy dev server, so tests that reload
 * are also marked slow.
 */
export const AFTER_RELOAD = { timeout: 30_000 }

/** Answer the feed API routes from fixtures. Call before the first `goto`. */
export async function mockFeeds(page: Page) {
  for (const name of FIXTURE_ROUTES) {
    await page.route(`**/api/${name}`, (route) =>
      route.fulfill({
        contentType: 'application/json',
        path: join(FIXTURE_DIR, `${name}.json`),
      })
    )
  }
}

/**
 * Mark the tab as already booted, so no load in this test shows the splash.
 * For every test that is not about the splash. Call before the first `goto`.
 */
export async function skipBootSplash(page: Page) {
  await page.addInitScript((key) => {
    window.sessionStorage.setItem(key, '1')
  }, BOOT_STORAGE_KEY)
}

/**
 * Keep Turnstile off the network: its script never loads, so the widget
 * stays empty and no token arrives. For every test that opens the contact
 * form. Call before the first `goto`.
 */
export async function blockTurnstile(page: Page) {
  await page.route('**/challenges.cloudflare.com/**', (route) => route.abort())
}

/** Store the site's mode, as the theme toggle would. Call before the first `goto`. */
export async function useMode(page: Page, mode: 'light' | 'dark') {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [MODE_STORAGE_KEY, mode]
  )
}

/** Store the site's palette, as the picker would. Call before the first `goto`. */
export async function usePalette(page: Page, palette: PaletteId) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [PALETTE_STORAGE_KEY, palette]
  )
}

export function bootSplash(page: Page) {
  return page.getByRole('dialog', { name: 'ShiroOS boot sequence' })
}

export function osWindow(page: Page, title: string) {
  return page.getByRole('dialog', { name: title, exact: true })
}

/** Every open desktop window: the only non-modal dialogs in the shell. */
export function osWindows(page: Page) {
  return page.locator('[role="dialog"][aria-modal="false"]')
}

/** A desktop window by its id; matches nothing once it has left the DOM. */
export function windowById(page: Page, id: string) {
  return page.locator(`[${WINDOW_ID_ATTRIBUTE}="${id}"]`)
}

export function titleBar(win: Locator) {
  return win.getByRole('toolbar')
}

export async function rectOf(target: Locator) {
  const box = await target.boundingBox()
  if (!box) throw new Error('element is not visible')
  return box
}

/**
 * Wait out the animations running on an element. A window or a lightbox that
 * just opened is still scaling in, and a box measured then is not where it
 * ends up.
 */
export async function settled(target: Locator) {
  await target.evaluate((el) =>
    Promise.all(el.getAnimations().map((animation) => animation.finished))
  )
}

/** The spot a gesture grabs a settled title bar by, clear of the controls. */
export async function titleBarGrip(win: Locator) {
  await settled(win)
  const box = await rectOf(win)
  return { x: box.x + 120, y: box.y + 18 }
}

/** Play state of every decorative loop on the page. */
export function ambientPlayStates(page: Page) {
  return page.evaluate(
    (loopClass) =>
      Array.from(document.getElementsByClassName(loopClass)).map(
        (el) => getComputedStyle(el).animationPlayState
      ),
    AMBIENT_LOOP_CLASS
  )
}

export interface StartedAnimation {
  name: string
  /** Its duration in ms, as computed when it started. */
  ms: number
}

/**
 * Record every CSS animation that starts from here on, on the elements
 * matching `selector` or anywhere. Returns a read of what has started so far.
 * One recorder per page load.
 */
export async function recordAnimations(page: Page, selector?: string) {
  await page.evaluate((only) => {
    const state = window as unknown as { __animations: StartedAnimation[] }
    state.__animations = []
    document.addEventListener('animationstart', (event) => {
      const target = event.target as Element
      if (only && !target.matches(only)) return
      const seconds = Number.parseFloat(
        getComputedStyle(target).animationDuration
      )
      state.__animations.push({
        name: event.animationName,
        ms: Math.round(seconds * 1000),
      })
    })
  }, selector ?? null)
  return () =>
    page.evaluate(
      () =>
        (window as unknown as { __animations: StartedAnimation[] }).__animations
    )
}

/** Close a desktop window from its title bar and wait for it to go. */
export async function closeWindow(win: Locator) {
  await win.getByRole('button', { name: 'Close window' }).click()
  await expect(win).toBeHidden()
}

export function cmdPalette(page: Page) {
  return page.getByRole('dialog', { name: 'Command palette' })
}

export function startMenu(page: Page) {
  return page.getByRole('dialog', { name: 'Start menu' })
}

/** The gallery lightbox: the modal dialog that holds the image-view close. */
export function lightbox(page: Page) {
  return page.locator('[role="dialog"][aria-modal="true"]').filter({
    has: page.getByRole('button', { name: 'Close image view' }),
  })
}

export function taskbar(page: Page) {
  return page.getByLabel('Taskbar')
}

/** The launcher button of the mobile top bar; only the mobile shell has one. */
export function mobileLauncher(page: Page) {
  return page.getByRole('button', { name: 'Open app launcher' })
}

/** Path and query of the current URL, the part a deep link lives in. */
export function location(page: Page) {
  const url = new URL(page.url())
  return url.pathname + url.search
}

/**
 * Wait for the desktop shell to be interactive. The taskbar is in the server
 * HTML, so its being visible proves nothing; its clock only gets a time once
 * the shell has hydrated and run its effects.
 */
export async function desktopReady(page: Page, options?: { timeout: number }) {
  await expect(taskbar(page)).toBeVisible(options)
  await expect(taskbar(page).locator('time[datetime]')).toBeVisible(options)
}

/** The shell root once it has hydrated. */
export function readyShell(page: Page) {
  return page.locator(`[${SHELL_ROOT_ATTRIBUTE}][${SHELL_READY_ATTRIBUTE}]`)
}

/**
 * The mobile shell is in the server HTML and shown by CSS, so its launcher
 * being visible proves nothing; the shell marks itself once it has hydrated.
 */
export async function mobileReady(page: Page, options?: { timeout: number }) {
  await expect(readyShell(page)).toBeVisible(options)
  await expect(mobileLauncher(page)).toBeVisible(options)
}

/** Land on the plain desktop (or `path`) with the shell hydrated. */
export async function openDesktop(page: Page, path = '/') {
  await page.goto(path)
  await desktopReady(page)
}

/** Same as {@link openDesktop}, at a mobile viewport. */
export async function openMobile(page: Page, path = '/') {
  await page.goto(path)
  await mobileReady(page)
}

/** Open an app from the taskbar and return its window. */
export async function launch(page: Page, appName: string, title: string) {
  await taskbar(page)
    .getByRole('button', { name: `Open ${appName}` })
    .click()
  const win = osWindow(page, title)
  await expect(win).toBeVisible()
  return win
}

/** WCAG AA: normal text, then large text and meaningful non-text UI. */
export const AA_TEXT = 4.5
export const AA_LARGE = 3

/** One measured pairing: a run of text or an icon against what is behind it. */
export interface ContrastReading {
  kind: 'text' | 'icon'
  /** The text itself (clipped), or the icon's class. */
  what: string
  /** Tag and classes of the element that carries the colour. */
  where: string
  ratio: number
  /** What AA asks of it: 4.5, or 3 for large text and icons. */
  required: number
  foreground: string
  background: string
  /**
   * Set when something the probe cannot read a colour from is painted behind
   * the point (a picture, a video, a canvas, a `url()` background): the tag
   * and classes of the topmost such layer. The ratio is then the worst the
   * layer could make it, black or white behind whatever covers it.
   */
  over?: string
  /** `over` is set and the caller listed the element as known to sit there. */
  expected?: boolean
}

interface ProbeOptions {
  /** Measure every visible text run and icon under the element, not just it. */
  deep: boolean
  /** Subtrees left out: pure decoration, listed by the caller. */
  exempt: string[]
  /** Layers that are not counted as a background at all. */
  ignored: string[]
  /** Text that is known to sit on a picture; see `ContrastReading.expected`. */
  overImage: string[]
  /** The AA thresholds: normal text, then large text and icons. */
  aaText: number
  aaLarge: number
}

/**
 * Runs in the page. Paints what sits behind a point onto a canvas, bottom to
 * top, then the text colour over it, and reads both back: the canvas blends
 * the translucent layers and understands every colour syntax.
 *
 * The layers are the element's ancestors, plus whatever else is under it at
 * that point (the wallpaper under a translucent window, a glow under a
 * badge). Opacity counts for every layer and for the text. A gradient has no
 * single colour, so it is measured once per colour stop and the worst ratio
 * is the reading: text over a glow is measured as if it sat on its centre.
 *
 * A picture has no colour to read at all. It is painted once black and once
 * white, the two ends of what it can be under the layers that cover it, and
 * the reading is the worse of the two, or 1:1 when the text colour lies
 * between them. Such a reading names the picture in `over`.
 */
function probeContrast(
  root: Element,
  { deep, exempt, ignored, overImage, aaText, aaLarge }: ProbeOptions
): ContrastReading[] {
  const LARGE_PX = 24
  const LARGE_BOLD_PX = 18.66
  const COLOR = /(rgba?|oklab|oklch|lab|lch|color|hsla?)\([^()]*\)/g
  const PICTURE = 'img, picture, video, canvas, iframe, object, embed'

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('no 2d context')

  const paint = (color: string, alpha = 1) => {
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
  }
  const read = () => Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3)
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const chainOf = (el: Element) => {
    const chain: Element[] = []
    for (let node: Element | null = el; node; node = node.parentElement) {
      chain.unshift(node)
    }
    return chain
  }
  /**
   * Opacity of an element as painted: its own times every ancestor's. Kept
   * per element for this one call, since a walk asks for the same ancestors
   * once per text run.
   */
  const opacities = new Map<Element, number>()
  const opacityOf = (el: Element): number => {
    const known = opacities.get(el)
    if (known !== undefined) return known
    const own = Number(getComputedStyle(el).opacity)
    const alpha = el.parentElement ? own * opacityOf(el.parentElement) : own
    opacities.set(el, alpha)
    return alpha
  }

  const describe = (el: Element) =>
    `${el.tagName.toLowerCase()}.${(el.getAttribute('class') ?? '').slice(0, 90)}`

  /** Everything painted behind `el` at a point, bottom to top. */
  const layersBehind = (el: Element, x: number, y: number) => {
    const chain = chainOf(el)
    const hits = document.elementsFromPoint(x, y)
    // Whatever is above the element (another window, the grain) is not behind
    // it. Off screen or clipped, nothing is hit and the ancestors are all.
    const at = hits.findIndex((hit) => hit === el || el.contains(hit))
    const under =
      at === -1
        ? []
        : hits
            .slice(at + 1)
            .filter((hit) => !hit.contains(el))
            .reverse()
    // An element under the point paints right after the ancestor it shares
    // with `el`, and before the next ancestor down.
    const ordered = chain.map((node, depth) => ({ node, depth, sub: 0 }))
    under.forEach((node, index) => {
      let depth = 0
      while (depth + 1 < chain.length && chain[depth + 1].contains(node)) {
        depth += 1
      }
      ordered.push({ node, depth, sub: index + 1 })
    })
    ordered.sort((a, b) => a.depth - b.depth || a.sub - b.sub)
    return ordered
      .filter(({ node }) => !ignored.some((selector) => node.matches(selector)))
      .map(({ node }) => {
        const style = getComputedStyle(node)
        const image = style.backgroundImage
        return {
          color: style.backgroundColor,
          stops: image.includes('gradient(') ? (image.match(COLOR) ?? []) : [],
          alpha: opacityOf(node),
          // The element itself is never its own background (an icon is not).
          picture:
            node !== el && (node.matches(PICTURE) || image.includes('url('))
              ? describe(node)
              : null,
        }
      })
  }

  const measure = (el: Element, color: string, x: number, y: number) => {
    const layers = layersBehind(el, x, y)
    const scenarios = Math.max(1, ...layers.map((layer) => layer.stops.length))
    const over = layers.findLast((layer) => layer.picture)?.picture ?? undefined
    const alpha = opacityOf(el)
    let worst = { ratio: Infinity, foreground: '', background: '' }
    const keep = (
      ratio: number,
      foreground: number[],
      background: number[]
    ) => {
      if (ratio >= worst.ratio) return
      worst = {
        ratio,
        foreground: `rgb(${foreground.join(', ')})`,
        background: `rgb(${background.join(', ')})`,
      }
    }
    for (let k = 0; k < scenarios; k += 1) {
      // Which side of the background the text is on, per shade of a picture.
      const sides: boolean[] = []
      for (const shade of over ? ['#000', '#fff'] : [null]) {
        paint('#fff')
        for (const layer of layers) {
          paint(layer.color, layer.alpha)
          if (layer.stops.length) {
            paint(layer.stops[Math.min(k, layer.stops.length - 1)], layer.alpha)
          }
          if (layer.picture && shade) paint(shade, layer.alpha)
        }
        const background = read()
        paint(color, alpha)
        const foreground = read()
        const [back, front] = [luminance(background), luminance(foreground)]
        sides.push(front > back)
        const [hi, lo] = [back, front].sort((a, b) => b - a)
        keep((hi + 0.05) / (lo + 0.05), foreground, background)
        // Lighter than the picture at one end and darker at the other: some
        // shade in between is the text colour itself.
        if (sides.length === 2 && sides[0] !== sides[1]) {
          keep(1, foreground, background)
        }
      }
    }
    return { ...worst, over }
  }

  const reading = (
    el: Element,
    base: Pick<ContrastReading, 'kind' | 'what' | 'where' | 'required'>,
    color: string,
    rect: DOMRect
  ): ContrastReading => {
    const measured = measure(
      el,
      color,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    )
    const expected =
      measured.over !== undefined &&
      overImage.some((selector) => el.closest(selector))
    return expected
      ? { ...base, ...measured, expected }
      : { ...base, ...measured }
  }

  const textReading = (el: Element, rect: DOMRect, text: string) => {
    const style = getComputedStyle(el)
    const size = Number.parseFloat(style.fontSize)
    const large =
      size >= LARGE_PX ||
      (size >= LARGE_BOLD_PX && Number(style.fontWeight) >= 700)
    return reading(
      el,
      {
        kind: 'text',
        what: text.slice(0, 48),
        where: describe(el),
        required: large ? aaLarge : aaText,
      },
      style.color,
      rect
    )
  }

  const skipped = (el: Element) =>
    !el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ||
    el.closest(':disabled, [aria-disabled="true"], noscript, script, style') ||
    exempt.some((selector) => el.closest(selector))

  /**
   * Bring an element under a point that can be hit. Nothing is hit outside
   * the viewport or under a scrolled-away edge, and a reading taken there
   * would see the element's ancestors and none of what else is behind it.
   */
  const reveal = (el: Element) => {
    const box = el.getBoundingClientRect()
    const inView =
      box.top >= 0 &&
      box.left >= 0 &&
      box.bottom <= window.innerHeight &&
      box.right <= window.innerWidth
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2
    )
    const reached = hit && (hit === el || el.contains(hit) || hit.contains(el))
    if (inView && reached) return
    el.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'instant',
    })
  }

  const walk = () => {
    if (!deep) {
      return [
        textReading(root, root.getBoundingClientRect(), root.textContent ?? ''),
      ]
    }

    const readings = new Map<string, ContrastReading>()
    const keep = (next: ContrastReading) => {
      const key = `${next.kind}|${next.where}|${next.foreground}|${next.background}`
      const seen = readings.get(key)
      if (!seen || next.ratio < seen.ratio) readings.set(key, next)
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = (node.textContent ?? '').trim()
      const el = node.parentElement
      if (!text || !el || el.closest('svg') || skipped(el)) continue
      reveal(el)
      range.selectNodeContents(node)
      const rect = range.getBoundingClientRect()
      // Nothing painted, or clipped to a pixel for screen readers only.
      if (rect.width <= 1 || rect.height <= 1) continue
      const box = el.getBoundingClientRect()
      if (box.width <= 1 || box.height <= 1) continue
      // A truncated line runs on past its element: measure the part in it.
      const left = Math.max(rect.left, box.left)
      const top = Math.max(rect.top, box.top)
      const shown = new DOMRect(
        left,
        top,
        Math.min(rect.right, box.right) - left,
        Math.min(rect.bottom, box.bottom) - top
      )
      if (shown.width <= 1 || shown.height <= 1) continue
      keep(textReading(el, shown, text))
    }

    for (const icon of Array.from(root.querySelectorAll('svg'))) {
      if (skipped(icon)) continue
      reveal(icon)
      const rect = icon.getBoundingClientRect()
      if (rect.width <= 1 || rect.height <= 1) continue
      const style = getComputedStyle(icon)
      const color = style.stroke !== 'none' ? style.stroke : style.fill
      if (color === 'none') continue
      keep(
        reading(
          icon,
          {
            kind: 'icon',
            what: icon.getAttribute('class') ?? 'svg',
            where: describe(icon.parentElement ?? icon),
            required: aaLarge,
          },
          color,
          rect
        )
      )
    }

    return Array.from(readings.values())
  }

  // Hit testing skips `pointer-events: none`, which is what every glow is.
  const hittable = document.createElement('style')
  hittable.textContent = '*{pointer-events:auto!important}'
  document.head.append(hittable)
  try {
    return walk()
  } finally {
    hittable.remove()
  }
}

/** What a walk leaves out or expects; see {@link contrastReadings}. */
export interface ContrastWalk {
  /** Subtrees of pure decoration, which AA does not cover. */
  exempt?: string[]
  /** Layers too faint to count as a background (the film grain). */
  ignored?: string[]
  /** Text known to sit on a picture, whose reading is not a failure. */
  overImage?: string[]
}

/**
 * WCAG contrast of an element's text against what is painted behind it.
 * See {@link probeContrast}.
 */
export async function contrastRatio(target: Locator) {
  const [reading] = await target.evaluate(probeContrast, {
    deep: false,
    exempt: [],
    ignored: [],
    overImage: [],
    aaText: AA_TEXT,
    aaLarge: AA_LARGE,
  })
  return reading.ratio
}

/**
 * Every visible run of text and every icon under `target`, each measured
 * against its composited background.
 */
export function contrastReadings(
  target: Locator,
  { exempt = [], ignored = [], overImage = [] }: ContrastWalk = {}
) {
  return target.evaluate(probeContrast, {
    deep: true,
    exempt,
    ignored,
    overImage,
    aaText: AA_TEXT,
    aaLarge: AA_LARGE,
  })
}

/** The readings that miss AA, worst first, as lines a failure can print. */
export function contrastFailures(readings: ContrastReading[]) {
  return readings
    .filter((reading) => reading.ratio < reading.required && !reading.expected)
    .sort((a, b) => a.ratio - b.ratio)
    .map((r) => {
      const over = r.over ? `, worst case over ${r.over}` : ''
      return (
        `${r.ratio.toFixed(2)}:1 (needs ${r.required}) ${r.kind} "${r.what}" ` +
        `${r.foreground} on ${r.background} in ${r.where}${over}`
      )
    })
}
