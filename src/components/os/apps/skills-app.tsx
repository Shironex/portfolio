'use client'

import { useEffect, useState } from 'react'

import { skillsData } from '@/data/skills-data'

/**
 * monitor.sys window — animated "system monitor" stat cards + skill tag cloud.
 * Ported from new-design/components/apps.jsx `function SkillsApp()`.
 */

interface Stat {
  label: string
  value: string
  suffix?: string
  accent: 'miku' | 'pink' | 'lav' | 'peach'
  width: number
  delay: number
}

const stats: Stat[] = [
  {
    label: 'vibe check',
    value: '92',
    suffix: '%',
    accent: 'miku',
    width: 92,
    delay: 0,
  },
  {
    label: 'caffeine',
    value: '∞',
    suffix: 'cups',
    accent: 'pink',
    width: 100,
    delay: 150,
  },
  {
    label: 'load avg',
    value: '0.42',
    suffix: '1m',
    accent: 'lav',
    width: 42,
    delay: 300,
  },
  {
    label: 'uptime',
    value: '4y',
    suffix: '3m',
    accent: 'peach',
    width: 78,
    delay: 450,
  },
]

const barAccent: Record<Stat['accent'], string> = {
  miku: 'bg-miku',
  pink: 'bg-pink-2',
  lav: 'bg-lav',
  peach: 'bg-peach',
}

export default function SkillsApp() {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSeen(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="font-body space-y-6">
      <header>
        <div className="font-mono text-xs text-miku-2 tracking-[0.1em] uppercase font-bold mb-1">
          # monitor.sys
        </div>
        <h2 className="font-display text-3xl text-ink font-semibold tracking-tight">
          system{' '}
          <em className="gradient-text-miku not-italic font-bold">monitor</em>
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-rule bg-surf-0 p-4 shadow-[0_2px_6px_rgba(57,197,187,0.08)]"
          >
            <div className="font-mono text-xs uppercase tracking-wider text-ink-4 mb-1">
              {s.label}
            </div>
            <div className="font-display text-2xl text-ink font-bold">
              {s.value}
              {s.suffix && (
                <span className="ml-1 text-xs font-mono text-ink-3 font-medium">
                  {s.suffix}
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-surf-soft overflow-hidden">
              <div
                className={`h-full rounded-full ${barAccent[s.accent]}`}
                style={{
                  width: seen ? `${s.width}%` : '0%',
                  transition: `width 1s ${s.delay}ms cubic-bezier(.2,.9,.3,1)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {skillsData.map((col) => (
        <section key={col.group}>
          <h3 className="font-display text-xl text-ink font-semibold mb-3 flex items-center gap-2">
            <span className="text-miku">{col.icon}</span> {col.group}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {col.items.map((item) => (
              <span
                key={item.n}
                className="px-2.5 py-1 rounded-full border border-rule-2 bg-surf-0 text-xs font-mono text-ink-2"
              >
                {item.n}
              </span>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-6 p-3.5 rounded-xl border border-dashed border-miku/30 bg-surf-soft text-xs text-ink-3 font-medium">
        ♪{' '}
        <em className="not-italic font-bold text-miku-2">
          no progress bars here
        </em>{' '}
        — I don&apos;t think &quot;how good at X&quot; is a useful number. The
        top row of each group is what I reach for daily; the rest are
        comfortable tools.
      </p>
    </div>
  )
}
