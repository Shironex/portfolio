'use client'

import { useEffect, useRef } from 'react'

import {
  AMBIENT_ATTRIBUTE,
  AMBIENT_PAUSED,
  GESTURE_ATTRIBUTE,
} from '@/lib/os/dom'
import { artPixel, artPx, onArtPixelChange } from '@/lib/os/pixel'
import { type TickerHandle, schedule } from '@/lib/os/ticker'

import ridePng from '@/assets/pixel/pets/minime-ride.png'
import atlasPng from '@/assets/pixel/scene/wallpaper.png'

import { SHELL_ROOT_ATTRIBUTE } from '../noscript-fallback'
import { moonPhase } from './moon'
import { FIXED_MOON, type SkyName, WallpaperScene } from './scene'
import { SKIES } from './scene-data.generated'
import { WallpaperStatic } from './wallpaper-static'
import './wallpaper.css'

/** Marks the desktop surfaces the pointer counts as bare wallpaper over. */
export const DESKTOP_BARE_ATTRIBUTE = 'data-desktop-bare'

/** `data-state` on the canvas: whether its clock runs. */
export type WallpaperState = 'running' | 'paused'

interface WallpaperProps {
  /** Live sky: the moon shows its real phase instead of the fixed gibbous. */
  live: boolean
}

function isSky(value: string | undefined): value is SkyName {
  return value !== undefined && value in SKIES
}

/**
 * The desktop wallpaper (SPEC 2.5): the static frame, and over it a canvas
 * that draws the same frame and then animates on the shared ticker.
 *
 * The clock stops (`data-state="paused"`) while the desktop is covered or a
 * layer is open (`data-ambient` on the shell root), during a window drag
 * (`data-gesture`), under the Pause setting (`data-motion`), in a hidden tab,
 * and under reduced motion, where the canvas shows frame 0 and never moves.
 * Parallax follows the pointer only over bare desktop. While the mini-me
 * rides by on the road the canvas carries `data-ride`.
 */
export function Wallpaper({ live }: WallpaperProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const liveRef = useRef(live)
  const refreshRef = useRef<() => void>(() => {})

  useEffect(() => {
    liveRef.current = live
    refreshRef.current()
  }, [live])

  useEffect(() => {
    const root = rootRef.current
    const el = canvasRef.current
    if (!root || !el) return
    const html = document.documentElement
    const shell = root.closest(`[${SHELL_ROOT_ATTRIBUTE}]`)
    const desktop = root.parentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let scene: WallpaperScene | null = null
    let ctx: CanvasRenderingContext2D | null = null
    let handle: TickerHandle | null = null
    let disposed = false

    const paused = () =>
      reduced.matches ||
      html.dataset.motion === 'paused' ||
      html.hasAttribute(GESTURE_ATTRIBUTE) ||
      shell?.getAttribute(AMBIENT_ATTRIBUTE) === AMBIENT_PAUSED ||
      document.hidden

    const draw = () => {
      if (!scene || !ctx) return
      scene.draw(ctx)
      el.dataset.drawn = ''
      if (scene.riding) el.dataset.ride = ''
      else delete el.dataset.ride
    }

    const resize = () => {
      if (!scene) return
      const px = artPixel()
      const cols = Math.ceil(root.clientWidth / px)
      const rows = Math.ceil(root.clientHeight / px)
      if (!scene.resize(cols, rows)) return
      el.width = cols
      el.height = rows
      el.style.width = `${artPx(cols, px)}px`
      el.style.height = `${artPx(rows, px)}px`
      ctx = el.getContext('2d')
      draw()
    }

    const refresh = () => {
      if (!scene) return
      const attribute = html.dataset.sky
      const sky = isSky(attribute) ? attribute : 'night'
      scene.setSky(sky, liveRef.current ? moonPhase() : FIXED_MOON[sky])
      const stop = paused() || !scene.animated
      if (reduced.matches) scene.reset()
      if (stop && handle) {
        handle.cancel()
        handle = null
      } else if (!stop && !handle) {
        const running = scene
        running.start(performance.now())
        handle = schedule({
          run: (now) => {
            const { changed, next } = running.step(now)
            if (changed) draw()
            return Number.isFinite(next) ? next : null
          },
        })
      }
      el.dataset.state = (
        handle ? 'running' : 'paused'
      ) satisfies WallpaperState
      draw()
    }
    refreshRef.current = refresh

    const onPointer = (event: PointerEvent) => {
      if (!scene || !handle || event.pointerType === 'touch') return
      const target = event.target
      const bare =
        target === desktop ||
        (target instanceof Element &&
          target.hasAttribute(DESKTOP_BARE_ATTRIBUTE))
      if (!bare) return
      scene.aim((event.clientX / window.innerWidth) * 2 - 1)
      handle.wake()
    }

    const observer = new MutationObserver(refresh)
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-sky', 'data-motion', GESTURE_ATTRIBUTE],
    })
    if (shell) {
      observer.observe(shell, {
        attributes: true,
        attributeFilter: [AMBIENT_ATTRIBUTE],
      })
    }
    const sized = new ResizeObserver(resize)
    const stopPx = onArtPixelChange(resize)
    document.addEventListener('visibilitychange', refresh)
    reduced.addEventListener('change', refresh)
    desktop?.addEventListener('pointermove', onPointer)

    const image = new Image()
    image.src = atlasPng.src
    image
      .decode()
      .then(() => {
        if (disposed) return
        scene = new WallpaperScene(image)
        resize()
        sized.observe(root)
        refresh()
        // The mini-me ride-by (SPEC 3.7): her sheet, then the first ride
        // a minute of visible time later.
        const rider = new Image()
        rider.src = ridePng.src
        return rider.decode().then(() => {
          if (!disposed) scene?.setRider(rider)
        })
      })
      .catch(() => {
        // The static frame stays: the scene is decoration.
      })

    return () => {
      disposed = true
      handle?.cancel()
      observer.disconnect()
      sized.disconnect()
      stopPx()
      document.removeEventListener('visibilitychange', refresh)
      reduced.removeEventListener('change', refresh)
      desktop?.removeEventListener('pointermove', onPointer)
      refreshRef.current = () => {}
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-1 h-dvh overflow-hidden"
    >
      <WallpaperStatic />
      <canvas
        ref={canvasRef}
        className="wallpaper-canvas"
        data-wallpaper=""
        data-state={'paused' satisfies WallpaperState}
      />
    </div>
  )
}
