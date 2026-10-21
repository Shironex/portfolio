import type { WindowId } from '@/components/os/types'

/**
 * The small contract between the shell and the desktop pet (SPEC 3), which
 * loads late in its own chunk: what the shell publishes for her, so nothing
 * in the shell imports her code.
 *
 *   - the window drag bus: `useWindowDrag` says how far a dragged window
 *     moved each frame, so she rides the window she stands on;
 *   - waves: the shell asks her to wave (About opened, a message sent);
 *   - perches: the desktop panels she can stand on carry `data-pet-perch`.
 */

/** Marks a desktop panel whose top edge she can stand on (SPEC 3.3). */
export const PET_PERCH_ATTRIBUTE = 'data-pet-perch'

/** Spread on a panel's root to make its top edge a perch. */
export const PET_PERCH = { [PET_PERCH_ATTRIBUTE]: '' }

/** One frame of a window drag, in CSS px and ms. */
export interface WindowDragStep {
  id: WindowId
  dx: number
  dy: number
  /** Time since the previous step of this drag. */
  dt: number
}

type DragListener = (step: WindowDragStep) => void

const dragListeners = new Set<DragListener>()

/** Says a dragged window moved by (dx, dy) since its last step. */
export function publishWindowDrag(step: WindowDragStep) {
  for (const listener of dragListeners) listener(step)
}

/** Hears every window drag step; returns the unsubscribe. */
export function subscribeWindowDrag(listener: DragListener): () => void {
  dragListeners.add(listener)
  return () => {
    dragListeners.delete(listener)
  }
}

/** Fired on window when something asks the pet to wave. */
export const PET_WAVE_EVENT = 'shiroos:pet-wave'

/** Asks the pet to wave once (two cycles), if she is out and can. */
export function requestPetWave() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PET_WAVE_EVENT))
}
