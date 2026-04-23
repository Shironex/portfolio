'use client'

import { Toaster as Sonner } from 'sonner'

import { useTheme } from '@/hooks/use-theme'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--color-surf-solid)',
          '--normal-border': 'var(--color-rule-2)',
          '--normal-text': 'var(--color-ink)',
          '--success-bg': 'var(--color-mint)',
          '--success-border': 'var(--color-rule-2)',
          '--success-text': 'var(--color-ink)',
          '--error-bg': 'var(--color-danger)',
          '--error-border': 'var(--color-rule-2)',
          '--error-text': 'var(--color-cloud)',
          '--info-bg': 'var(--color-miku)',
          '--info-border': 'var(--color-rule-2)',
          '--info-text': 'var(--color-cloud)',
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
