/**
 * contact.app window — ShiroOS chrome around the real contact form.
 * Ported from new-design/components/apps.jsx `function ContactApp()`,
 * but wired into the production next-safe-action + Turnstile flow via
 * `@/lib/contact/contact-form`.
 */

'use client'

import { Clock, Github, Mail, MapPin } from 'lucide-react'

import { ContactForm } from '@/lib/contact/contact-form'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

type ReachRow = {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  accent: 'miku' | 'pink' | 'lav' | 'peach'
}

const accentChip: Record<ReachRow['accent'], string> = {
  miku: 'bg-miku/15 text-miku',
  pink: 'bg-pink/15 text-pink-2',
  lav: 'bg-lav/20 text-lav',
  peach: 'bg-peach/20 text-peach',
}

const rows: ReachRow[] = [
  {
    icon: <Mail className="h-4 w-4" />,
    label: 'email',
    value: EMAIL_CONTACT,
    href: `mailto:${EMAIL_CONTACT}`,
    accent: 'miku',
  },
  {
    icon: <Github className="h-4 w-4" />,
    label: 'github',
    value: GITHUB_URL.replace(/^https?:\/\//, ''),
    href: GITHUB_URL,
    accent: 'pink',
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: 'location',
    value: 'Gdańsk, PL',
    accent: 'lav',
  },
  {
    icon: <Clock className="h-4 w-4" />,
    label: 'timezone',
    value: 'UTC+1 · CET',
    accent: 'peach',
  },
]

export default function ContactApp() {
  return (
    <div className="max-w-4xl font-body">
      <div className="font-mono text-xs text-miku tracking-widest uppercase mb-3">
        # contact.app
      </div>
      <h2 className="font-display text-3xl text-ink font-bold mb-2">
        send a{' '}
        <em className="gradient-text-miku not-italic font-bold">signal</em>
      </h2>
      <p className="font-body text-ink-2 mb-6">
        Freelance, full-time, or just to talk. I reply within a day ♪
      </p>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <ContactForm theme="light" surface="card" />

        <aside className="rounded-2xl border border-rule-2 bg-surf-1 backdrop-blur-xl p-5 flex flex-col gap-3 h-fit">
          <div className="font-mono text-xs text-ink-3 tracking-widest uppercase mb-1">
            ✦ reach me
          </div>
          {rows.map((row) => {
            const inner = (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accentChip[row.accent]}`}
                >
                  {row.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-4">
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
                  className="flex items-center gap-3 rounded-xl border border-rule bg-surf-0 p-3 transition-colors hover:border-miku/40 hover:bg-surf-soft"
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
