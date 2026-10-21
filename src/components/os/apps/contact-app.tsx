/**
 * contact.app window: the real contact form (next-safe-action and
 * Turnstile, `@/lib/contact/contact-form`) and the ways to reach me, in
 * pixels (SPEC 1.5): field wells, the mini-me waving hello as it opens and
 * again when a message has gone out (the form confirms inline, no toast).
 */

'use client'

import dynamic from 'next/dynamic'
import { useCallback, useId, useState } from 'react'

import { Button } from '@/components/ui/button'

import { MiniMe } from '@/components/pixel/mini-me'
import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import { requestPetWave } from '@/lib/os/pets'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'

import { useTheme } from '@/hooks/use-theme'

const ContactForm = dynamic(
  () => import('@/lib/contact/contact-form').then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden className="px-tile-skeleton ambient-loop h-150" />
    ),
  }
)

type ReachRow = {
  icon: PixelIconName
  label: string
  value: string
  href?: string
  /** When set, the row grows a copy-to-clipboard button for this value. */
  copyValue?: string
}

const rows: ReachRow[] = [
  {
    icon: 'mail',
    label: 'Email',
    value: EMAIL_CONTACT,
    href: `mailto:${EMAIL_CONTACT}`,
    copyValue: EMAIL_CONTACT,
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: GITHUB_URL.replace(/^https?:\/\//, ''),
    href: GITHUB_URL,
  },
  {
    icon: 'pin',
    label: 'Location',
    value: 'Poland · remote',
  },
  {
    icon: 'clock',
    label: 'Timezone',
    value: 'UTC+1 · CET',
  },
]

/** The glyph on its plate, and the label over the value. */
function RowContent({ row }: { row: ReachRow }) {
  return (
    <>
      <span
        aria-hidden
        className="os-night px-label-plate flex size-14 flex-none items-center justify-center text-(--link)"
      >
        <PixelIcon name={row.icon} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-label text-(--meta) group-hover:text-(--ink)">
          {row.label}
        </span>
        <span className="text-body truncate text-(--ink)">{row.value}</span>
      </span>
    </>
  )
}

export default function ContactApp() {
  const { theme } = useTheme()
  const reachId = useId()
  // Bumped when a message goes out: the mini-me remounts and waves again,
  // and so does the desktop pet (SPEC 3.2).
  const [waves, setWaves] = useState(0)
  const waveAgain = useCallback(() => {
    setWaves((n) => n + 1)
    requestPetWave()
  }, [])

  return (
    <div className="@container flex flex-col gap-8">
      <div className="flex items-end gap-4">
        <MiniMe key={waves} tag="wave" play="once" />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-display lamp-heading">Get in touch</h2>
          <p className="text-prose max-w-[66ch] text-(--ink)">
            Full-time roles, contracts, MVPs, or just to talk. I reply within 24
            hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 @min-[44rem]:grid-cols-[minmax(0,1fr)_calc(150*var(--px))]">
        <ContactForm theme={theme} onSent={waveAgain} />

        <aside
          aria-labelledby={reachId}
          className="px-card flex h-fit flex-col gap-2 p-3"
        >
          <h3 id={reachId} className="text-heading lamp-heading px-1">
            Reach me
          </h3>
          {rows.map((row) => {
            if (!row.href) {
              return (
                <div key={row.label} className="flex items-center gap-3 p-1">
                  <RowContent row={row} />
                </div>
              )
            }
            const external = row.href.startsWith('http')
            return (
              <div key={row.label} className="flex items-center gap-1">
                <a
                  href={row.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  aria-label={`${row.label}: ${row.value}`}
                  className="focus-ring group flex min-w-0 flex-1 items-center gap-3 p-1 hover:bg-(--select)"
                >
                  <RowContent row={row} />
                </a>
                {row.copyValue && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={`Copy ${row.label.toLowerCase()}`}
                    onClick={() =>
                      copyToClipboard(
                        row.copyValue ?? '',
                        `${row.label} copied`
                      )
                    }
                  >
                    <PixelIcon name="copy" />
                  </Button>
                )}
              </div>
            )
          })}
        </aside>
      </div>
    </div>
  )
}
