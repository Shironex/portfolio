import type { CSSProperties } from 'react'

import { artLength as art } from '@/lib/os/pixel'

import starsPng from '@/assets/pixel/scene/stars.png'
import atlasPng from '@/assets/pixel/scene/wallpaper.png'

import { FIXED_MOON } from './scene'
import {
  BRIGHT_FRAMES,
  LAYOUT,
  PIECES,
  STATIC_TILES,
} from './scene-data.generated'
import { WallpaperSkies } from './wallpaper-skies'
// Its own rules: the 404 screen and the static project page show this frame
// with no live wallpaper to bring them.
import './wallpaper.css'

type Rect = readonly [number, number, number, number]

/** A piece of the atlas at canvas point (x, y), from the left or the right. */
function piece(
  rect: Rect,
  x: number,
  y: number,
  fromRight = false
): CSSProperties {
  return {
    [fromRight ? 'right' : 'left']: art(x),
    top: art(y),
    width: art(rect[2]),
    height: art(rect[3]),
    backgroundPosition: `${art(-rect[0])} ${art(-rect[1])}`,
  }
}

const VARIABLES = {
  '--wp-atlas': `url(${atlasPng.src})`,
  '--wp-atlas-size': `${art(atlasPng.width)} ${art(atlasPng.height)}`,
  '--wp-stars-image': `url(${starsPng.src})`,
  '--wp-stars-size': `${art(STATIC_TILES.stars.w)} ${art(STATIC_TILES.stars.h)}`,
  '--wp-stars-clear': art(LAYOUT.road.height + LAYOUT.stars.clearAboveHorizon),
} as CSSProperties

const [moonX, moonY] = LAYOUT.moon.desktop

/**
 * The wallpaper's frame 0 as markup, for the server render, no JavaScript
 * and the moment before the canvas draws (SPEC 2.5): the sky bands with
 * their dither, the skyline and lamps of the sky on <html>, the stars, the
 * moon and the night glow, each where the canvas puts them. Which sky shows
 * is CSS, from `data-sky` and the skies' stylesheet (`WallpaperSkies`), so
 * the boot script's sky is right before first paint. The clouds only come
 * with the canvas.
 */
export function WallpaperStatic() {
  return (
    <div aria-hidden className="wallpaper-static" style={VARIABLES}>
      <WallpaperSkies />
      <div className="wallpaper-stars">
        {LAYOUT.brightStars.desktop.map(([x, y]) => (
          <i
            key={`${x},${y}`}
            className="wallpaper-piece"
            style={piece(BRIGHT_FRAMES[0], x, y)}
          />
        ))}
      </div>
      <i
        className="wallpaper-piece wallpaper-moon"
        style={piece(PIECES[FIXED_MOON.night], moonX, moonY)}
      />
      <i
        className="wallpaper-piece wallpaper-moon-faint"
        style={piece(PIECES.moon_faint, moonX, moonY)}
      />
      <i
        className="wallpaper-piece wallpaper-glow"
        style={piece(
          PIECES.glow,
          -LAYOUT.glow.desktop.dx,
          LAYOUT.glow.desktop.dy,
          true
        )}
      />
    </div>
  )
}

/**
 * The foot of that frame alone: the skyline, its lamps and the sky bands of
 * the sky on <html>, bottom aligned, with no stars, moon or glow. The phone
 * feed ends on it (SPEC 3.8), and the mini-me rides along its road.
 */
export function WallpaperStrip() {
  return (
    <div aria-hidden className="wallpaper-static">
      <WallpaperSkies />
    </div>
  )
}
