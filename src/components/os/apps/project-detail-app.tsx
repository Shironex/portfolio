/**
 * project.detail window: rich detail view for a single project.
 * Sections: hero + overview + features + tech stack + gallery. The static
 * sections live in `project-detail/project-sections.tsx`, shared with the
 * `/projects/<slug>` page; this file adds the interactive gallery.
 */

'use client'

import Image from 'next/image'
import {
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { createPortal } from 'react-dom'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { cn, onBackdropDismiss } from '@/lib/utils'

import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import type { GalleryItem, Project } from '@/types'

import type { HeadingLevel } from '../types'
import {
  GALLERY_CELL_CLASS,
  GalleryThumb,
  ProjectGallery,
  ProjectSections,
} from './project-detail/project-sections'

interface ProjectDetailAppProps {
  project: Project
  /** See `ProjectSections`; `2` in a desktop window, `1` in a mobile sheet. */
  titleLevel?: HeadingLevel
}

interface GalleryLightboxProps {
  items: GalleryItem[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/** Minimum horizontal travel (px) for a touch drag to count as a swipe. */
const SWIPE_THRESHOLD = 50

/** Shared by the shown image and the preloaded neighbours so they resolve to the same URL. */
const LIGHTBOX_SIZES = '(min-width: 1136px) 1024px, 90vw'

/** The step buttons: secondary pixel buttons over the picture's edges. */
const NAV_BUTTON_CLASS =
  'os-night focus-ring px-button-secondary absolute top-1/2 flex size-18 -translate-y-1/2 items-center justify-center text-(--ink) pointer-coarse:size-(--target)'

/**
 * Full-screen viewer for the gallery screenshots, drawn as a night window
 * (SPEC 1.5) on the 50% navy dither scrim of the Start menu: a title bar
 * with the count and the close control, the picture, then its caption.
 * Portals to <body> so it
 * escapes the windows layer (an isolated stacking context) and covers the
 * whole shell, and so the shell as a whole goes inert behind it. Escape goes
 * through the shell's Escape layers, where the lightbox outranks the window
 * underneath. Arrow keys, the side buttons and horizontal swipes step through
 * the gallery, wrapping at both ends.
 */
function GalleryLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const item = items[index]
  const hasMany = items.length > 1
  // Preload both neighbours so stepping either way is instant.
  const neighbours = Array.from(
    new Set([
      items[(index - 1 + items.length) % items.length],
      items[(index + 1) % items.length],
    ])
  ).filter((neighbour) => neighbour !== item)

  useScrollLock(true)
  useFocusTrap(panelRef, true)

  const showPrev = useCallback(
    () => onIndexChange((index - 1 + items.length) % items.length),
    [index, items.length, onIndexChange]
  )
  const showNext = useCallback(
    () => onIndexChange((index + 1) % items.length),
    [index, items.length, onIndexChange]
  )

  useEscapeLayer('lightbox', onClose)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!hasMany) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopImmediatePropagation()
        showPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopImmediatePropagation()
        showNext()
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [hasMany, showPrev, showNext])

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || !hasMany) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
    if (dx > 0) showPrev()
    else showNext()
  }

  return createPortal(
    <div
      className="z-lightbox px-tile-shadow fixed inset-0 flex items-center justify-center p-4 md:p-12"
      onMouseDown={onBackdropDismiss(onClose)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        className="animate-cp-in os-night px-window-focused relative flex max-h-full flex-col motion-reduce:animate-none"
      >
        <div className="px-titlebar-focused flex h-16 items-center gap-3 pr-1 pl-6 pointer-coarse:h-22">
          <span className="text-title flex-1 truncate text-(--ink-hi)">
            gallery
          </span>
          {hasMany && (
            <span className="text-label text-(--meta) tabular-nums">
              {index + 1} / {items.length}
            </span>
          )}
          {/* First focusable in DOM order, so the focus trap lands on it
              when opening. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image view"
            className="focus-ring flex h-12 w-14 items-center justify-center text-(--ink) hover:bg-(--danger) pointer-coarse:size-(--target)"
          >
            <PixelIcon name="close" />
          </button>
        </div>
        {/* Fixed 16:9 frame: screenshots vary in aspect ratio, so sizing the
            box off the image would collapse it while the next one loads and
            make the nav buttons jump. The <img> is reused across steps (no
            key), so the browser keeps the old picture up until the new one
            has decoded. */}
        <div className="relative mx-1 aspect-video w-[min(90vw,64rem,124vh)]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={LIGHTBOX_SIZES}
            className="bg-(--ground) object-contain select-none"
            draggable={false}
          />
          {hasMany &&
            neighbours.map((neighbour) => (
              <Image
                key={neighbour.src}
                src={neighbour.src}
                alt=""
                aria-hidden
                fill
                sizes={LIGHTBOX_SIZES}
                loading="eager"
                className="invisible"
              />
            ))}
          {hasMany && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className={cn(NAV_BUTTON_CLASS, 'left-3')}
              >
                <PixelIcon name="chevron-left" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className={cn(NAV_BUTTON_CLASS, 'right-3')}
              >
                <PixelIcon name="chevron-right" />
              </button>
            </>
          )}
        </div>
        {/* Two lines are kept free so a caption that wraps does not move
            the frame and its buttons. */}
        <p className="text-body min-h-[2lh] max-w-[66ch] px-3 pt-2 pb-1 text-(--ink)">
          {item.caption}
        </p>
      </div>
    </div>,
    document.body
  )
}

export default function ProjectDetailApp({
  project,
  titleLevel = 2,
}: ProjectDetailAppProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <ProjectSections project={project} titleLevel={titleLevel}>
      {project.gallery.length > 0 && (
        <ProjectGallery titleLevel={titleLevel}>
          {project.gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View full size: ${item.alt}`}
              className={cn(GALLERY_CELL_CLASS, 'focus-ring cursor-zoom-in')}
            >
              <GalleryThumb item={item} />
              {/* The zoom badge: a plate that shows on hover and focus. */}
              <span
                aria-hidden
                className="px-label-plate absolute top-2 right-2 flex size-12 items-center justify-center text-(--ink) opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <PixelIcon name="maximize" />
              </span>
            </button>
          ))}
        </ProjectGallery>
      )}

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={project.gallery}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </ProjectSections>
  )
}
