/**
 * project.detail window — rich detail view for a single project.
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

import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { cn, onBackdropDismiss } from '@/lib/utils'

import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import type { GalleryItem, Project } from '@/types'

import {
  GALLERY_CELL_CLASS,
  GalleryThumb,
  ProjectGallery,
  ProjectSections,
} from './project-detail/project-sections'

interface ProjectDetailAppProps {
  project: Project
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

const NAV_BUTTON_CLASS =
  'focus-ring bg-surf-solid/85 text-ink hover:bg-surf-solid shadow-elev-2 absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-colors'

/**
 * Full-screen viewer for the gallery screenshots. Portals to <body> so it
 * escapes the window's stacking context and covers the whole desktop.
 * Escape is intercepted in the capture phase — otherwise the shell's global
 * Escape handler would close the project window underneath at the same time.
 * Arrow keys, the side buttons and horizontal swipes step through the
 * gallery, wrapping at both ends.
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        onClose()
        return
      }
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
  }, [hasMany, onClose, showPrev, showNext])

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
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-10"
      onMouseDown={onBackdropDismiss(onClose)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        className="animate-cp-in relative flex max-h-full max-w-5xl flex-col items-center motion-reduce:animate-none"
      >
        {/* First in DOM order so the focus trap lands on it when opening. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image view"
          className="focus-ring bg-surf-solid text-ink hover:bg-surf-soft shadow-elev-2 absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <X aria-hidden size={16} />
        </button>
        {/* Fixed 16:9 frame: screenshots vary in aspect ratio, so sizing the
            box off the image would collapse it while the next one loads and
            make the nav buttons jump. The <img> is reused across steps (no
            key), so the browser keeps the old picture up until the new one
            has decoded. */}
        <div className="relative aspect-video w-[min(90vw,64rem,142vh)]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={LIGHTBOX_SIZES}
            className="object-contain drop-shadow-2xl select-none"
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
                className={cn(NAV_BUTTON_CLASS, 'left-2 md:left-3')}
              >
                <ChevronLeft aria-hidden size={20} />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className={cn(NAV_BUTTON_CLASS, 'right-2 md:right-3')}
              >
                <ChevronRight aria-hidden size={20} />
              </button>
            </>
          )}
        </div>
        {(item.caption || hasMany) && (
          <p className="font-body text-cloud mt-3 min-h-10 max-w-2xl text-center text-sm">
            {hasMany && (
              <span className="text-cloud/70 mr-2 font-mono text-xs">
                {index + 1} / {items.length}
              </span>
            )}
            {item.caption}
          </p>
        )}
      </div>
    </div>,
    document.body
  )
}

export default function ProjectDetailApp({ project }: ProjectDetailAppProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <ProjectSections project={project}>
      {project.gallery.length > 0 && (
        <ProjectGallery>
          {project.gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View full size: ${item.alt}`}
              className={cn(GALLERY_CELL_CLASS, 'focus-ring cursor-zoom-in')}
            >
              <GalleryThumb item={item} />
              <span
                aria-hidden
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Maximize2 size={14} />
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
