'use client'

import type { ReactNode } from 'react'

import { AppIcon, AppLogo } from '@/components/pixel/app-icon'
import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

import { GITHUB_URL } from '@/lib/constants'
import type { SkyId } from '@/lib/os/appearance'
import { PREF_COPY, PREF_IDS, type PrefId } from '@/lib/os/prefs'
import { cn } from '@/lib/utils'

import { usePrefs } from '@/hooks/use-prefs'
import type { Theme } from '@/hooks/use-theme'

import { APPS } from './constants'
import { ExternalLink } from './external-link'
import { MobileSheet } from './mobile-sheet'
import { SkyPicker } from './sky-picker'
import type { AppId } from './types'

/** A row or tile of the launcher: the selection fill under the pointer. */
const ITEM_CLASS = 'focus-ring hover:bg-(--select)'

/** A full-width row: one 22 art px target (44 css). */
const ROW_CLASS = cn(
  ITEM_CLASS,
  'flex h-(--target) w-full items-center gap-3 px-2 text-left'
)

/** The settings' glyphs, as the View menu lists them. */
const PREF_GLYPHS: Record<PrefId, PixelIconName> = {
  pets: 'paw',
  motion: 'pause',
  text: 'book',
}

interface MobileLauncherProps {
  onOpenApp: (id: AppId) => void
  onClose: () => void
  theme: Theme
  onToggleTheme: () => void
  sky: SkyId
  onSelectSky: (id: SkyId) => void
}

/**
 * The phone's Start menu, as a sheet (SPEC 1.7): the six apps as 32x32
 * tiles, the four settings as switches (the Lamp, Pets, Pause animations and
 * Readable text, through the same hooks, storage and announcements as the
 * View menu), the Sky picker and the GitHub link.
 */
export function MobileLauncher({
  onOpenApp,
  onClose,
  theme,
  onToggleTheme,
  sky,
  onSelectSky,
}: MobileLauncherProps) {
  const { prefs, toggle } = usePrefs()

  return (
    <MobileSheet
      title="launcher"
      label="App launcher"
      closeLabel="Close launcher"
      layer="launcher"
      icon={<AppLogo />}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6">
        <ul className="grid grid-cols-3 gap-2">
          {APPS.map((app) => (
            <li key={app.id} className="flex">
              <button
                type="button"
                onClick={() => onOpenApp(app.id)}
                aria-label={`Open ${app.name}`}
                className={cn(
                  ITEM_CLASS,
                  'group flex flex-1 flex-col items-center gap-2 p-2 text-center'
                )}
              >
                <AppIcon id={app.id} size={32} />
                <span className="text-body text-(--ink)">{app.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <Section title="Settings">
          <ul>
            <li>
              <SettingSwitch
                label="Lamp"
                glyph={theme === 'dark' ? 'lamp-off' : 'lamp-on'}
                on={theme === 'light'}
                onToggle={onToggleTheme}
              />
            </li>
            {PREF_IDS.map((id) => (
              <li key={id}>
                <SettingSwitch
                  label={PREF_COPY[id].menu}
                  glyph={PREF_GLYPHS[id]}
                  on={prefs[id]}
                  onToggle={() => toggle(id)}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Sky">
          <div className="px-1">
            <SkyPicker value={sky} onSelect={onSelectSky} />
          </div>
        </Section>

        <Section title="Elsewhere">
          <ExternalLink
            href={GITHUB_URL}
            onClick={onClose}
            className={cn(ROW_CLASS, 'text-body text-(--ink)')}
          >
            <PixelIcon name="github" className="text-(--meta)" />
            <span className="flex-1">GitHub profile</span>
            <PixelIcon name="external" className="text-(--meta)" />
          </ExternalLink>
        </Section>
      </div>
    </MobileSheet>
  )
}

/** A dotted rule, then a small uppercase heading over its content. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden className="rule-dotted" />
      <h3 className="text-label px-2 text-(--meta) uppercase">{title}</h3>
      {children}
    </div>
  )
}

interface SettingSwitchProps {
  label: string
  glyph: PixelIconName
  on: boolean
  onToggle: () => void
}

/**
 * One setting as a switch row: its glyph and name, the state as a word, and
 * a pixel switch, a night well with the knob at the left in grey (off) or
 * at the right in lamp (on). The word and the knob's side carry the state
 * without the colour; `aria-checked` says it to assistive tech.
 */
function SettingSwitch({ label, glyph, on, onToggle }: SettingSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(ROW_CLASS, 'group')}
    >
      <PixelIcon name={glyph} className="text-(--meta)" />
      <span className="text-body flex-1 text-(--ink)">{label}</span>
      {/* Ink on the hover fill: the grey is 3.52:1 on the night teal. */}
      <span
        aria-hidden
        className="text-label text-(--meta) group-hover:text-(--ink)"
      >
        {on ? 'on' : 'off'}
      </span>
      <span
        aria-hidden
        className="os-night relative block h-10 w-18 flex-none bg-(--ground) shadow-[inset_0_0_0_var(--px)_var(--frame)]"
      >
        <span
          className={cn(
            'absolute top-2 block size-6',
            on ? 'right-2 bg-(--lamp)' : 'left-2 bg-(--meta)'
          )}
        />
      </span>
    </button>
  )
}
