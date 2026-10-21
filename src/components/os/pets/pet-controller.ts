import { SHELL_ROOT_ATTRIBUTE } from '@/components/os/noscript-fallback'
import type { WindowState } from '@/components/os/types'

import {
  AMBIENT_ATTRIBUTE,
  AMBIENT_PAUSED,
  WINDOW_CONTROLS_ATTRIBUTE,
  WINDOW_ID_ATTRIBUTE,
  WINDOW_TITLE_BAR_ATTRIBUTE,
  measureDesktopArea,
} from '@/lib/os/dom'
import { DRAG_SLOP } from '@/lib/os/geometry'
import {
  PET_PERCH_ATTRIBUTE,
  PET_WAVE_EVENT,
  subscribeWindowDrag,
} from '@/lib/os/pets'
import { artPixel, onArtPixelChange } from '@/lib/os/pixel'
import { type TickerHandle, schedule } from '@/lib/os/ticker'

import {
  type Perch,
  type TitleBarMetrics,
  type WindowBox,
  floorPerch,
  panelHasRoom,
  panelPerch,
  windowHasRoom,
  windowPerch,
} from './perches'
import { PetBrain, type PetView } from './pet-brain'
import {
  type Box,
  type Point,
  decodePetSheet,
  framePosition,
} from './pet-sheet'

/** The exit animation of a minimized window (`animate-win-close`), in ms. */
const WINDOW_EXIT_MS = 120

const GRAB_CLASS = 'px-cursor-grab'
const GRABBING_CLASS = 'px-cursor-grabbing'

interface PetElements {
  layer: HTMLElement
  sprite: HTMLElement
  hitbox: HTMLElement
}

/**
 * Runs the mascot (SPEC 3): measures the perches on stack and size changes,
 * steps `PetBrain` on the shared ticker, and writes what it shows to her
 * three elements, only when something changed. All DOM reads happen here,
 * on events; the ticker task only does arithmetic and a few style writes.
 *
 * She holds her frame (no task at all) under the Pause setting, under an
 * open layer (`data-ambient`) and in a hidden tab (the ticker sleeps);
 * she is off the screen under Pets off and a maximized window, and comes
 * back with a fall when both clear. Under reduced motion she sits still on
 * the floor and nothing ticks.
 */
export class PetController {
  private readonly brain = new PetBrain()
  private readonly html = document.documentElement
  private readonly shell: Element | null
  private readonly reduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  )
  private readonly cleanups: (() => void)[] = []
  private windows: readonly WindowState[] = []
  private covered = false
  private ready = false
  private spawned = false
  private task: TickerHandle | null = null
  private drawn: Partial<Record<string, string>> = {}
  private disposed = false

  constructor(private readonly el: PetElements) {
    this.shell = el.layer.closest(`[${SHELL_ROOT_ATTRIBUTE}]`)
    this.brain.input(performance.now(), null, false)
    this.listen()
    decodePetSheet().then(() => {
      if (this.disposed) return
      this.ready = true
      this.measure()
      this.update()
    })
  }

  // ------------------------------------------------------------ the shell

  /** The window store changed: perches, z order, closes and minimizes. */
  setWindows(windows: readonly WindowState[]) {
    const now = performance.now()
    for (const win of windows) {
      const before = this.windows.find((w) => w.id === win.id)
      if (win.minimized && before && !before.minimized) {
        // She falls once the window's exit animation is over.
        this.brain.dropSoon(win.id, now, WINDOW_EXIT_MS)
      }
    }
    this.windows = windows
    if (!this.ready) return
    this.measure()
    this.update()
  }

  /** A maximized window covers the desktop: she is off the screen. */
  setCovered(covered: boolean) {
    this.covered = covered
    if (this.ready) this.update()
  }

  destroy() {
    this.disposed = true
    this.task?.cancel()
    this.task = null
    for (const cleanup of this.cleanups) cleanup()
  }

  // --------------------------------------------------------------- state

  private get hidden(): boolean {
    return this.html.dataset.pets === 'hidden' || this.covered
  }

  private get paused(): boolean {
    return (
      this.html.dataset.motion === 'paused' ||
      this.shell?.getAttribute(AMBIENT_ATTRIBUTE) === AMBIENT_PAUSED
    )
  }

  /** Re-reads every switch and brings her out, holds her or puts her away. */
  private update() {
    if (!this.ready || this.disposed) return
    const now = performance.now()
    if (this.hidden) {
      this.brain.hide()
      this.stop()
      this.render()
      return
    }
    this.brain.setStill(this.reduced.matches, now)
    if (this.brain.state === 'out') {
      // The first time after the shell is ready, 3 to 8 s later; after a
      // hide, at once.
      if (this.reduced.matches || this.spawned) this.brain.spawn(now)
      else this.brain.spawnLater(now)
      this.spawned = true
    }
    this.render()
    this.kick()
  }

  /** Runs the task when anything is due, unless she is held. */
  private kick() {
    if (this.paused || this.hidden || !this.ready) {
      this.stop()
      return
    }
    if (this.task) {
      this.task.wake()
      return
    }
    this.brain.resume(performance.now())
    this.task = schedule({ run: this.run })
  }

  private stop() {
    this.task?.cancel()
    this.task = null
  }

  private readonly run = (now: number): number | null => {
    const due = this.brain.step(now)
    this.render()
    if (due === null) this.task = null
    return due
  }

  // ------------------------------------------------------------- drawing

  /** Writes one style or attribute, only when it differs from the last. */
  private write(key: string, value: string, apply: (value: string) => void) {
    if (this.drawn[key] === value) return
    this.drawn[key] = value
    apply(value)
  }

  private render() {
    const { layer, sprite, hitbox } = this.el
    const view: PetView = this.brain.view()
    this.write('state', view.state, (v) => (layer.dataset.petState = v))
    if (view.state === 'out') return
    this.write('x', String(view.left), (v) =>
      layer.style.setProperty('--pet-x', v)
    )
    this.write('y', String(view.top), (v) =>
      layer.style.setProperty('--pet-y', v)
    )
    this.write('z', String(view.z), (v) => (layer.style.zIndex = v))
    this.write('frame', framePosition(view.tag, view.frame), (v) => {
      sprite.style.backgroundPosition = v
    })
    this.write('flip', view.flip ? '-1 1' : '', (v) => (sprite.style.scale = v))
    const box = view.hitbox
    this.write('hit', `${box.x} ${box.y} ${box.w} ${box.h}`, () => {
      hitbox.style.setProperty('--hit-x', String(box.x))
      hitbox.style.setProperty('--hit-y', String(box.y))
      hitbox.style.setProperty('--hit-w', String(box.w))
      hitbox.style.setProperty('--hit-h', String(box.h))
    })
    this.write('tag', view.tag, (v) => (layer.dataset.petTag = v))
  }

  // ------------------------------------------------------------ measuring

  /** Art px from CSS px. */
  private art(value: number, px = artPixel()): number {
    return Math.round(value / px)
  }

  /** Where the title ends and the controls start, from the window's left. */
  private titleBar(win: WindowState, px: number): TitleBarMetrics {
    const el = document.querySelector(
      `[${WINDOW_ID_ATTRIBUTE}="${CSS.escape(win.id)}"]`
    )
    const bar = el?.querySelector(`[${WINDOW_TITLE_BAR_ATTRIBUTE}]`)
    const title = bar?.querySelector('h2')
    const controls = bar?.querySelector(`[${WINDOW_CONTROLS_ATTRIBUTE}]`)
    if (!el || !title || !controls) {
      // Not drawn yet: the icon, a guess at the title, the four controls.
      return {
        titleEnd: 28 + win.title.length * 5,
        controlsStart: this.art(win.w, px) - 60,
      }
    }
    const left = el.getBoundingClientRect().left
    const range = document.createRange()
    range.selectNodeContents(title)
    const text = range.getBoundingClientRect()
    const box = title.getBoundingClientRect()
    return {
      titleEnd: this.art(Math.min(text.right, box.right) - left, px),
      controlsStart: this.art(controls.getBoundingClientRect().left - left, px),
    }
  }

  /** The perches as they are now; never called from the frame loop. */
  private measure() {
    const px = artPixel()
    const area = measureDesktopArea()
    const width = this.art(window.innerWidth, px)
    const floorY = this.art(area.y + area.h, px)
    // The menu bar's bottom (and the gap under it): nothing above is room.
    const ceiling = this.art(area.y, px)
    const windows: WindowBox[] = []
    const perches: Perch[] = []
    for (const win of this.windows) {
      if (win.minimized) continue
      const box: WindowBox = {
        id: win.id,
        x: this.art(win.x, px),
        y: this.art(win.y, px),
        w: this.art(win.w, px),
        h: this.art(win.h, px),
        z: win.z,
      }
      windows.push(box)
      if (win.maximized || !windowHasRoom(box, ceiling)) continue
      perches.push(windowPerch(box, this.titleBar(win, px), ceiling))
    }
    const panels: Box[] = []
    document.querySelectorAll(`[${PET_PERCH_ATTRIBUTE}]`).forEach((panel) => {
      const rect = panel.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      panels.push({
        x: this.art(rect.left, px),
        y: this.art(rect.top, px),
        w: this.art(rect.width, px),
        h: this.art(rect.height, px),
      })
    })
    panels.forEach((rect, i) => {
      if (panelHasRoom(rect, ceiling, panels)) perches.push(panelPerch(rect, i))
    })
    perches.push(floorPerch(width, floorY))
    this.brain.setWorld(perches, windows, { width, floorY }, performance.now())
    this.render()
    this.kick()
  }

  // --------------------------------------------------------------- input

  private point(event: { clientX: number; clientY: number }): Point {
    const px = artPixel()
    return { x: event.clientX / px, y: event.clientY / px }
  }

  /** Runs `change`, then redraws and reschedules if she changed state. */
  private after(change: () => void) {
    const before = this.brain.state
    const tag = this.brain.view().tag
    change()
    if (this.brain.state === before && this.brain.view().tag === tag) return
    this.render()
    this.kick()
  }

  private listen() {
    const on = <K extends keyof WindowEventMap>(
      target: Window | Document | HTMLElement,
      type: K,
      handler: (event: WindowEventMap[K]) => void,
      options?: AddEventListenerOptions
    ) => {
      target.addEventListener(type, handler as EventListener, options)
      this.cleanups.push(() =>
        target.removeEventListener(type, handler as EventListener, options)
      )
    }
    const passive = { capture: true, passive: true }

    // Input anywhere keeps her awake; near or pressed, it wakes her.
    on(
      window,
      'pointermove',
      (e) =>
        this.after(() =>
          this.brain.input(performance.now(), this.point(e), false)
        ),
      passive
    )
    on(
      window,
      'pointerdown',
      (e) =>
        this.after(() =>
          this.brain.input(performance.now(), this.point(e), true)
        ),
      passive
    )
    on(
      window,
      'keydown',
      () => this.after(() => this.brain.input(performance.now(), null, true)),
      passive
    )
    on(window, 'resize', () => this.ready && this.measure())
    on(document, 'focusin', (e) => this.onFocus(e.target))
    on(window, PET_WAVE_EVENT as keyof WindowEventMap, () =>
      this.after(() => this.brain.wave(performance.now()))
    )

    this.cleanups.push(
      onArtPixelChange(() => this.ready && this.measure()),
      subscribeWindowDrag((step) => {
        const px = artPixel()
        this.brain.ride(
          step.id,
          step.dx / px,
          step.dy / px,
          step.dt,
          performance.now()
        )
        // In the same frame as the window, so she never lags it.
        this.render()
        this.kick()
      })
    )

    const observer = new MutationObserver(() => this.update())
    observer.observe(this.html, {
      attributes: true,
      attributeFilter: ['data-motion', 'data-pets'],
    })
    if (this.shell) {
      observer.observe(this.shell, {
        attributes: true,
        attributeFilter: [AMBIENT_ATTRIBUTE],
      })
    }
    this.cleanups.push(() => observer.disconnect())
    const onReduced = () => this.update()
    this.reduced.addEventListener('change', onReduced)
    this.cleanups.push(() =>
      this.reduced.removeEventListener('change', onReduced)
    )

    const panels = new ResizeObserver(() => this.ready && this.measure())
    document
      .querySelectorAll(`[${PET_PERCH_ATTRIBUTE}]`)
      .forEach((panel) => panels.observe(panel))
    this.cleanups.push(() => panels.disconnect())

    this.listenToHitbox(on)
  }

  /** Pointer on her: a press and a move past the slop drags, a tap waves. */
  private listenToHitbox(
    on: <K extends keyof WindowEventMap>(
      target: HTMLElement,
      type: K,
      handler: (event: WindowEventMap[K]) => void
    ) => void
  ) {
    const { hitbox } = this.el
    let press: { id: number; start: Point; dragging: boolean } | null = null
    const end = (cancelled: boolean) => {
      if (!press) return
      const { id, dragging } = press
      press = null
      if (hitbox.hasPointerCapture(id)) hitbox.releasePointerCapture(id)
      hitbox.classList.replace(GRABBING_CLASS, GRAB_CLASS)
      const now = performance.now()
      this.after(() => {
        if (dragging) this.brain.release(now)
        else if (!cancelled) this.brain.click(now)
      })
    }
    on(hitbox, 'pointerdown', (e) => {
      if (!e.isPrimary || e.button !== 0) return
      e.preventDefault()
      press = {
        id: e.pointerId,
        start: { x: e.clientX, y: e.clientY },
        dragging: false,
      }
      try {
        hitbox.setPointerCapture(e.pointerId)
      } catch {
        // A scripted event: the press still tracks over her.
      }
    })
    on(hitbox, 'pointermove', (e) => {
      if (!press || e.pointerId !== press.id) return
      const point = this.point(e)
      if (!press.dragging) {
        const moved = Math.hypot(
          e.clientX - press.start.x,
          e.clientY - press.start.y
        )
        if (moved < DRAG_SLOP) return
        press.dragging = true
        hitbox.classList.replace(GRAB_CLASS, GRABBING_CLASS)
        this.after(() => this.brain.grab(point, performance.now()))
        return
      }
      this.brain.drag(point)
      this.render()
    })
    on(hitbox, 'pointerup', (e) => {
      if (press && e.pointerId === press.id) end(false)
    })
    on(hitbox, 'pointercancel', (e) => {
      if (press && e.pointerId === press.id) end(true)
    })
    on(hitbox, 'lostpointercapture', (e) => {
      if (press && e.pointerId === press.id) end(true)
    })
  }

  /**
   * Focus Not Obscured (SPEC 3.6): a focused control she covers sends her
   * away at once. Controls in a window above her are not covered (the
   * window hides her there), nor are the bars and overlays, which draw
   * over the whole windows layer. Nor is the title bar she sits on: its
   * sit slots keep the title and the controls clear (SPEC 3.3), and her
   * legs over the rest of a bar hide nothing of it.
   */
  private onFocus(target: EventTarget | null) {
    if (!(target instanceof HTMLElement) || !this.ready) return
    const owner = target.closest(`[${WINDOW_ID_ATTRIBUTE}]`)
    let ownerZ: number | null = null
    if (owner) {
      const id = owner.getAttribute(WINDOW_ID_ATTRIBUTE)
      const onHerBar =
        target.hasAttribute(WINDOW_TITLE_BAR_ATTRIBUTE) &&
        id === this.brain.perchWindow
      if (onHerBar) return
      ownerZ = this.windows.find((w) => w.id === id)?.z ?? null
    } else if (!target.closest('main')) {
      return
    }
    const rect = target.getBoundingClientRect()
    const px = artPixel()
    const box: Box = {
      x: rect.left / px,
      y: rect.top / px,
      w: rect.width / px,
      h: rect.height / px,
    }
    this.after(() => this.brain.avoid(box, ownerZ, performance.now()))
  }
}
