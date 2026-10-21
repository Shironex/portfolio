'use client'

import { Toaster as Sonner } from 'sonner'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'
import { PixelSpinner } from '@/components/pixel/pixel-spinner'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toasts (SPEC 2.4): the `px-toast` 9-slice with its lamp bar, night chrome
 * in both Lamp modes (`os-night`), Pixeloid text and an 8x8 glyph per type.
 * Unstyled, so sonner keeps the stacking, swipe and announcements and draws
 * nothing of its own; its movement is stepped and shortened in globals.css.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      // The toast layer, above every overlay of the shell. Important because
      // sonner's own unlayered stylesheet sets a z-index on the same element.
      className="toaster group !z-toast"
      // Clear the taskbar (desktop) and bottom dock (mobile) so toasts never
      // overlap the OS chrome, home indicator inset included.
      offset={{ bottom: 'calc(36 * var(--px) + env(safe-area-inset-bottom))' }}
      mobileOffset={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
      icons={{
        success: <PixelIcon name="check" className="text-(--link)" />,
        error: <PixelIcon name="alert" className="text-(--error)" />,
        info: <PixelIcon name="dot" className="text-(--link)" />,
        warning: <PixelIcon name="alert" className="text-(--lamp)" />,
        loading: <PixelSpinner className="text-(--link)" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'os-night px-toast text-body flex w-(--width) items-center gap-3 py-2 pr-4 pl-3 text-(--ink)',
          icon: 'flex flex-none items-center',
          content: 'flex min-w-0 flex-col gap-1',
          title: 'text-body',
          description: 'text-label text-(--meta)',
          actionButton:
            'os-night px-button-primary text-label ml-auto h-12 flex-none px-3 text-(--fill-primary-ink)',
          cancelButton:
            'os-night px-button-secondary text-label h-12 flex-none px-3 text-(--ink)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
