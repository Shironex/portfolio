/**
 * contact.app window — ShiroOS chrome around the real contact form.
 * Ported from new-design/components/apps.jsx `function ContactApp()`,
 * but wired into the production next-safe-action + Turnstile flow via
 * `@/lib/contact/contact-form`.
 */

'use client'

import dynamic from 'next/dynamic'

import { Clock, Github, Mail, MapPin } from 'lucide-react'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

import { useTheme } from '@/hooks/use-theme'

const ContactForm = dynamic(
  () => import('@/lib/contact/contact-form').then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="border-rule-2 bg-surf-solid h-[420px] animate-pulse rounded-2xl border"
      />
    ),
  }
)

type ReachRow = {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

const rows: ReachRow[] = [
  {
    icon: <Mail className="h-4 w-4" />,
    label: 'Email',
    value: EMAIL_CONTACT,
    href: `mailto:${EMAIL_CONTACT}`,
  },
  {
    icon: <Github className="h-4 w-4" />,
    label: 'GitHub',
    value: GITHUB_URL.replace(/^https?:\/\//, ''),
    href: GITHUB_URL,
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: 'Location',
    value: 'Gdańsk, PL',
  },
  {
    icon: <Clock className="h-4 w-4" />,
    label: 'Timezone',
    value: 'UTC+1 · CET',
  },
]

export default function ContactApp() {
  const { theme } = useTheme()

  return (
    <div className="font-body max-w-4xl">
      <h2 className="font-display text-ink mb-2 text-3xl font-bold">
        Get in touch
      </h2>
      <p className="font-body text-ink-2 mb-6">
        Freelance, full-time, or just to talk. I reply within 24 hours.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <ContactForm theme={theme} surface="card" />

        <aside className="border-rule-2 bg-surf-solid flex h-fit flex-col gap-3 rounded-2xl border p-5">
          <div className="font-display text-ink mb-1 text-sm font-bold">
            Reach me
          </div>
          {rows.map((row) => {
            const inner = (
              <>
                <span className="bg-miku/15 text-miku-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  {row.icon}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="font-body text-ink-4 text-xs">
                    {row.label}
                  </span>
                  <span className="font-body text-ink truncate text-sm">
                    {row.value}
                  </span>
                </div>
              </>
            )

            if (row.href) {
              return (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.href.startsWith('http') ? '_blank' : undefined}
                  rel={row.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={`${row.label}: ${row.value}`}
                  className="focus-ring border-rule bg-surf-0 hover:border-miku/40 hover:bg-surf-soft flex items-center gap-3 rounded-xl border p-3 transition-colors"
                >
                  {inner}
                </a>
              )
            }

            return (
              <div
                key={row.label}
                className="border-rule bg-surf-0 flex items-center gap-3 rounded-xl border p-3"
              >
                {inner}
              </div>
            )
          })}
        </aside>
      </div>
    </div>
  )
}
