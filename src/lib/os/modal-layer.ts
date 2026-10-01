import { isLiveRegion } from './dom'

/** Elements that render nothing, plus the dev overlay of the framework. */
const SKIPPED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'LINK',
  'NOSCRIPT',
  'TEMPLATE',
  'NEXTJS-PORTAL',
])

/** How many open layers hold each element inert. */
const holds = new WeakMap<HTMLElement, number>()

/**
 * Make everything outside `layer` inert: its siblings, and the siblings of
 * each ancestor up to `<body>`. Returns the release.
 *
 * Holds are counted per element, so layers can stack (the palette over a
 * mobile sheet) and be released in any order; an element comes back only when
 * the last layer holding it lets go. Something that is already inert for its
 * own reasons (the static layer under the shell) is left alone both ways.
 */
export function inertOthers(layer: HTMLElement): () => void {
  const held: HTMLElement[] = []
  let node: HTMLElement | null = layer
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement
    if (!parent) break
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue
      if (SKIPPED_TAGS.has(sibling.tagName) || isLiveRegion(sibling)) continue
      const count = holds.get(sibling) ?? 0
      if (count === 0 && sibling.inert) continue
      holds.set(sibling, count + 1)
      sibling.inert = true
      held.push(sibling)
    }
    node = parent
  }

  return () => {
    for (const element of held) {
      const count = (holds.get(element) ?? 1) - 1
      if (count > 0) {
        holds.set(element, count)
        continue
      }
      holds.delete(element)
      element.inert = false
    }
  }
}
