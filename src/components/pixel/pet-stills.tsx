import { cn } from '@/lib/utils'

import petSheet from '@/assets/pixel/pets/mascot-pet.png'
import rideSheet from '@/assets/pixel/pets/minime-ride.png'
import '@/styles/sprites/mascot-pet.css'
import '@/styles/sprites/minime-ride.css'

/**
 * Still frames of the pet sheets for the places that show her without the
 * desktop pet: the About portrait, the motorbike hobby, the empty states.
 * The first frame of a tag (`stillsOnly` in the art manifest: no loops, so
 * nothing here moves). Decorative.
 */

type PetPose = 'idle' | 'sit' | 'wave'

const POSE_CLASS: Record<PetPose, string> = {
  idle: 'px-mascot-pet-idle',
  sit: 'px-mascot-pet-sit',
  wave: 'px-mascot-pet-wave',
}

/** The mascot, 48x48 art px, in `pose`. */
export function PetStill({
  pose,
  className,
}: {
  pose: PetPose
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'px-mascot-pet block flex-none',
        POSE_CLASS[pose],
        className
      )}
      style={{ backgroundImage: `url(${petSheet.src})` }}
    />
  )
}

/** The mini-me on her parked bike, 48x32 art px, facing right. */
export function RideStill({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'px-minime-ride px-minime-ride-parked block flex-none',
        className
      )}
      style={{ backgroundImage: `url(${rideSheet.src})` }}
    />
  )
}

/**
 * The mascot seated (`sit`, frame 1) on a short ledge, for the empty
 * states: the seated pose is drawn hanging over an edge, so it needs one
 * under it to read. The ledge is behind her, at her seat line (PET.md).
 */
export function PetOnLedge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('relative block size-48 flex-none', className)}>
      <span className="absolute top-38 -left-8 h-2 w-64 bg-(--frame)" />
      <PetStill pose="sit" className="relative" />
    </span>
  )
}
