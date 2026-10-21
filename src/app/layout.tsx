import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next } from 'next/font/google'
import localFont from 'next/font/local'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import {
  defaultMetadata,
  personJsonLd,
  serializeJsonLd,
  siteConfig,
} from '@/lib/metadata-config'
import { APPEARANCE_BOOT_SCRIPT, DEFAULT_SKY } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

/*
 * Typography (SPEC 2.3): two pixel faces on whole-pixel grids, subset to
 * WOFF2 by scripts/pixel/subset-fonts.py, OFL text beside them.
 *   - Shiro Pixel Sans (Pixeloid Sans, renamed as its licence asks of a
 *     modified copy): chrome, headings and long text, 9 px per em.
 *   - Departure Mono: labels, keys, meta, clock, terminal, 11 px per em.
 *   - Atkinson Hyperlegible Next: the "Readable text" setting for long text
 *     (`data-text="readable"`). Not preloaded, so it only downloads when a
 *     visitor has turned the setting on.
 * Both pixel faces fall back to Arial adjusted to their metrics while they
 * load, so the swap barely moves anything.
 */

const pixelSans = localFont({
  src: [
    {
      path: './fonts/shiro-pixel-sans-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/shiro-pixel-sans-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pixel-sans',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

const departureMono = localFont({
  src: './fonts/departure-mono-regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-departure-mono',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-atkinson',
  display: 'swap',
  preload: false,
  // next/font has no metrics for this family, so there is no fallback to
  // adjust (Turbopack still logs that it found none).
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  // The mobile shell pads with env(safe-area-inset-*), which needs `cover`.
  viewportFit: 'cover',
  // The ground navy, which stays night whether the Lamp is on or off, so
  // the tag never changes after the server sends it.
  themeColor: siteConfig.ground,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-sky={DEFAULT_SKY}
      // The font variables sit on <html>, not <body>: the `--font-*` theme
      // tokens in globals.css are declared on `:root` and reference them with
      // `var()`, so they resolve there or not at all.
      // `dark` is night window bodies, the default and the page without
      // JavaScript; the boot script removes it when the Lamp is on.
      className={cn(
        'dark',
        pixelSans.variable,
        departureMono.variable,
        atkinson.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          // Sets the art pixel and applies the stored Lamp, sky, text and
          // motion choices before first paint. Inline and blocking on
          // purpose; a deferred script paints the default first.
          dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
