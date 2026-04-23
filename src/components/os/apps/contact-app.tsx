/**
 * contact.app window — ShiroOS chrome around the real contact form.
 * Ported from new-design/components/apps.jsx `function ContactApp()`,
 * but wired into the production next-safe-action + Turnstile flow via
 * `@/lib/contact/contact-form`.
 */

'use client'

import { Clock, Github, Mail, MapPin } from 'lucide-react'

import { useTheme } from '@/hooks/use-theme'

import { ContactForm } from '@/lib/contact/contact-form'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

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
    <div className="max-w-4xl font-body">
      <h2 className="font-display text-3xl text-ink font-bold mb-2">
        Get in touch
      </h2>
      <p className="font-body text-ink-2 mb-6">
        Freelance, full-time, or just to talk. I reply within 24 hours.
      </p>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <ContactForm theme={theme} surface="card" />

        <aside className="rounded-2xl border border-rule-2 bg-surf-solid p-5 flex flex-col gap-3 h-fit">
          <div className="font-display text-sm font-bold text-ink mb-1">
            Reach me
          </div>
          {rows.map((row) => {
            const inner = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-miku/15 text-miku-2">
                  {row.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-body text-xs text-ink-4">
                    {row.label}
                  </span>
                  <span className="font-body text-sm text-ink truncate">
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
                  rel={
                    row.href.startsWith('http') ? 'noreferrer' : undefined
                  }
                  aria-label={`${row.label}: ${row.value}`}
                  className="focus-ring flex items-center gap-3 rounded-xl border border-rule bg-surf-0 p-3 transition-colors hover:border-miku/40 hover:bg-surf-soft"
                >
                  {inner}
                </a>
              )
            }

            return (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-xl border border-rule bg-surf-0 p-3"
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
