'use client'

import { Toaster as Sonner } from 'sonner'

import { useTheme } from '@/hooks/use-theme'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      // The toast layer, above every overlay of the shell. Important because
      // sonner's own unlayered stylesheet sets a z-index on the same element.
      className="toaster group !z-toast"
      // Clear the floating taskbar (desktop) and bottom dock (mobile) so
      // toasts never overlap the OS chrome, home indicator inset included.
      offset={{ bottom: 'calc(72px + env(safe-area-inset-bottom))' }}
      mobileOffset={{ bottom: 'calc(88px + env(safe-area-inset-bottom))' }}
      // Typed toasts keep the panel surface and take their colour in the text
      // and border: a filled danger panel cannot hold readable text in both
      // modes.
      richColors
      style={
        {
          '--normal-bg': 'var(--color-surf-solid)',
          '--normal-border': 'var(--color-rule-2)',
          '--normal-text': 'var(--color-ink)',
          '--success-bg': 'var(--color-surf-solid)',
          '--success-border': 'var(--color-miku)',
          '--success-text': 'var(--color-ink)',
          '--error-bg': 'var(--color-surf-solid)',
          '--error-border': 'var(--color-danger-ink)',
          '--error-text': 'var(--color-danger-ink)',
          '--info-bg': 'var(--color-surf-solid)',
          '--info-border': 'var(--color-miku)',
          '--info-text': 'var(--color-ink)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'group toast font-body !rounded-xl !backdrop-blur-xl !shadow-elev-2',
          description: '!text-ink-3',
          actionButton: '!bg-miku !text-cloud !rounded-md',
          cancelButton: '!bg-surf-0 !text-ink-2 !rounded-md',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
