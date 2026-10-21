import type { StaticImageData } from 'next/image'
import type { CSSProperties } from 'react'

import dawnLamps from '@/assets/pixel/scene/lamps-dawn.png'
import dayLamps from '@/assets/pixel/scene/lamps-day.png'
import duskLamps from '@/assets/pixel/scene/lamps-dusk.png'
import nightLamps from '@/assets/pixel/scene/lamps-night.png'
import dawnSkyline from '@/assets/pixel/scene/skyline-dawn.png'
import daySkyline from '@/assets/pixel/scene/skyline-day.png'
import duskSkyline from '@/assets/pixel/scene/skyline-dusk.png'
import nightSkyline from '@/assets/pixel/scene/skyline-night.png'
import starsPng from '@/assets/pixel/scene/stars.png'
import atlasPng from '@/assets/pixel/scene/wallpaper.png'

import { FIXED_MOON, type SkyName } from './scene'
import {
  BAND_DITHER,
  BRIGHT_FRAMES,
  LAYOUT,
  PIECES,
  SKIES,
  STATIC_TILES,
} from './scene-data.generated'
import { staticSkyRows } from './sky'
// Its own rules: the 404 screen and the static project page show this frame
// with no live wallpaper to bring them.
import './wallpaper.css'

/** `n` art px as a CSS length. */
const art = (n: number) => `calc(${n} * var(--px))`

type Rect = readonly [number, number, number, number]

const TILES: Record<SkyName, readonly [StaticImageData, StaticImageData]> = {
  night: [nightSkyline, nightLamps],
  dusk: [duskSkyline, duskLamps],
  dawn: [dawnSkyline, dawnLamps],
  day: [daySkyline, dayLamps],
}

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

/** One background layer: image, position, size and repeat. */
function layer(image: string, position: string, size: string, repeat: string) {
  return `${image} ${position} / ${size} ${repeat}`
}

/**
 * The whole static background of one sky, front to back: its lamps, its
 * skyline, a 2 px pattern for each dithered or mixed sky row, and the plain
 * bands (`--sky-bands` from tokens.css) on the ground colour.
 */
function skyBackground(sky: SkyName): string {
  const [skyline, lamps] = TILES[sky]
  const { lamps: l, skyline: s } = STATIC_TILES
  const rows = staticSkyRows(SKIES[sky].bands, LAYOUT.road.height, BAND_DITHER)
  return [
    layer(
      `url(${lamps.src})`,
      `${art(l.x)} calc(100% - ${art(l.bottom)})`,
      `${art(l.w)} ${art(l.h)}`,
      'repeat-x'
    ),
    layer(
      `url(${skyline.src})`,
      '0 100%',
      `${art(s.w)} ${art(s.h)}`,
      'repeat-x'
    ),
    ...rows.map((row) =>
      layer(
        `linear-gradient(90deg, ${row.even} 50%, ${row.odd} 50%)`,
        `0 calc(100% - ${art(row.above)})`,
        `${art(2)} ${art(1)}`,
        'repeat-x'
      )
    ),
    `${layer('var(--sky-bands)', '0 0', '100% 100%', 'no-repeat')} var(--ground)`,
  ].join(', ')
}

/** Each sky's background; `wallpaper.css` picks one from `data-sky`. */
const BACKGROUNDS = Object.fromEntries(
  (Object.keys(TILES) as SkyName[]).map((sky) => [
    `--wp-background-${sky}`,
    skyBackground(sky),
  ])
) as CSSProperties

const VARIABLES = {
  '--wp-atlas': `url(${atlasPng.src})`,
  '--wp-atlas-size': `${art(atlasPng.width)} ${art(atlasPng.height)}`,
  '--wp-stars-image': `url(${starsPng.src})`,
  '--wp-stars-size': `${art(STATIC_TILES.stars.w)} ${art(STATIC_TILES.stars.h)}`,
  '--wp-stars-clear': art(LAYOUT.road.height + LAYOUT.stars.clearAboveHorizon),
  ...BACKGROUNDS,
} as CSSProperties

const [moonX, moonY] = LAYOUT.moon.desktop

/**
 * The wallpaper's frame 0 as markup, for the server render, no JavaScript
 * and the moment before the canvas draws (SPEC 2.5): the sky bands with
 * their dither, the skyline and lamps of the sky on <html>, the stars, the
 * moon and the night glow, each where the canvas puts them. Which sky shows is CSS, from
 * `data-sky`, so the boot script's sky is right before first paint. The
 * clouds only come with the canvas.
 */
export function WallpaperStatic() {
  return (
    <div aria-hidden className="wallpaper-static" style={VARIABLES}>
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
  return <div aria-hidden className="wallpaper-static" style={BACKGROUNDS} />
}
