import sheetPng from '@/assets/pixel/pets/mascot-pet.png'

import { PET_SHEET } from './sheet-data.generated'

/**
 * The mascot pet sheet (`pet/mascot-pet.aseprite`, SPEC 3.1) as the pet
 * code reads it: 48x48 frames, eight tags, and per tag where the pose meets
 * its surface and which rectangle takes the pointer (`pet/PET.md`).
 */

export type PetTag = keyof typeof PET_SHEET.tags

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface Point {
  x: number
  y: number
}

export const PET_FRAME = PET_SHEET.frame

/** The sheet, served hashed from `/_next/static/media`. */
export const PET_SHEET_URL = sheetPng.src

/**
 * The point of a frame that sits on the surface, per tag (PET.md, "Per-tag
 * anchor"): the feet baseline (the `pivot` slice) for the standing poses,
 * the seat line for `sit` (10 art px lower, so the legs hang over the
 * edge), and the top of the head for `drag`, which stays under the pointer.
 * `fall` keeps the feet, so landing is a change of tag in place.
 */
export const PET_ANCHOR: Record<PetTag, Point> = {
  idle: PET_SHEET.pivot,
  walk: PET_SHEET.pivot,
  land: PET_SHEET.pivot,
  wave: PET_SHEET.pivot,
  sleep: PET_SHEET.pivot,
  fall: PET_SHEET.pivot,
  sit: { x: 24, y: 38 },
  drag: { x: 24, y: 4 },
}

/**
 * The pointer rectangle of each pose in frame coordinates (PET.md, the union
 * of body and head over the tag; tails, bows and the sleep z's left out).
 * The standing poses use the `hitbox` slice.
 */
export const PET_HITBOX: Record<PetTag, Box> = {
  idle: PET_SHEET.hitbox,
  walk: { x: 14, y: 5, w: 20, h: 43 },
  sit: { x: 10, y: 5, w: 28, h: 43 },
  drag: { x: 6, y: 4, w: 36, h: 44 },
  fall: { x: 4, y: 7, w: 35, h: 41 },
  land: { x: 9, y: 4, w: 30, h: 44 },
  wave: PET_SHEET.hitbox,
  sleep: { x: 12, y: 13, w: 24, h: 35 },
}

/**
 * How far either side of her centre the seated pose reaches below the seat
 * line, in art px: the dangling legs and the tail ends cover the whole
 * frame width there, so a sit slot must be clear for all of it.
 */
export const SIT_HALF_WIDTH = PET_FRAME.w / 2

export interface PetFrame {
  /** The frame's corner on the sheet, in art px. */
  x: number
  y: number
  ms: number
}

/** The frames of a tag in the order they play. */
export function petFrames(
  tag: PetTag
): readonly (readonly [number, number, number])[] {
  return PET_SHEET.tags[tag].frames
}

/** Whether a tag plays once (`land`) rather than looping. */
export function playsOnce(tag: PetTag): boolean {
  return PET_SHEET.tags[tag].once
}

/** Background positions per tag and frame, as CSS, made once. */
const POSITIONS = Object.fromEntries(
  (Object.keys(PET_SHEET.tags) as PetTag[]).map((tag) => [
    tag,
    petFrames(tag).map(
      ([x, y]) => `calc(${-x} * var(--px)) calc(${-y} * var(--px))`
    ),
  ])
) as Record<PetTag, string[]>

/** The CSS background position that shows frame `index` of `tag`. */
export function framePosition(tag: PetTag, index: number): string {
  const list = POSITIONS[tag]
  return list[Math.min(index, list.length - 1)]
}

/**
 * Loads and decodes the sheet, so her first frame never paints blank
 * (SPEC 3.9: decoded before she spawns). Resolves either way: a sheet that
 * fails to decode still loads when the sprite paints.
 */
export async function decodePetSheet(): Promise<void> {
  const image = new Image()
  image.src = PET_SHEET_URL
  try {
    await image.decode()
  } catch {
    // Decoration: she still comes out, the browser paints when it can.
  }
}
