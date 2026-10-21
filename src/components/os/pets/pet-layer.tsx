'use client'

import { memo, useEffect, useRef } from 'react'

import type { WindowState } from '@/components/os/types'

import '@/styles/sprites/mascot-pet.css'

import { PetController } from './pet-controller'
import { PET_SHEET_URL } from './pet-sheet'
import './pets.css'

interface PetLayerProps {
  windows: readonly WindowState[]
  /** A maximized window covers the desktop. */
  covered: boolean
}

const SHEET = { backgroundImage: `url(${PET_SHEET_URL})` }

/**
 * The desktop pet (SPEC 3): the last child of the windows layer, so her
 * `z-index` puts her over her own window and under every higher one. Three
 * elements: the layer (moved by `transform`), the sprite (the sheet, one
 * frame shown) and the hitbox, the one part that takes the pointer.
 * Decoration only: hidden from assistive tech, never focusable.
 *
 * React renders the elements once; `PetController` writes everything that
 * changes to them directly, so her walking never re-renders anything.
 * Loaded late, in its own chunk (`OsShell`).
 */
function PetLayerImpl({ windows, covered }: PetLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const spriteRef = useRef<HTMLDivElement>(null)
  const hitboxRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<PetController | null>(null)

  useEffect(() => {
    const layer = layerRef.current
    const sprite = spriteRef.current
    const hitbox = hitboxRef.current
    if (!layer || !sprite || !hitbox) return
    const controller = new PetController({ layer, sprite, hitbox })
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    controllerRef.current?.setWindows(windows)
  }, [windows])

  useEffect(() => {
    controllerRef.current?.setCovered(covered)
  }, [covered])

  return (
    <div ref={layerRef} aria-hidden data-pet className="pet">
      <div ref={spriteRef} className="px-mascot-pet pet-sprite" style={SHEET} />
      <div
        ref={hitboxRef}
        data-pet-hitbox
        className="pet-hitbox px-cursor-grab"
      />
    </div>
  )
}

const PetLayer = memo(PetLayerImpl)
export default PetLayer
