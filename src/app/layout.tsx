import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import {
  defaultMetadata,
  personJsonLd,
  serializeJsonLd,
  siteConfig,
} from '@/lib/metadata-config'
import { APPEARANCE_BOOT_SCRIPT, DEFAULT_PALETTE } from '@/lib/os/appearance'

import '@/styles/globals.css'

/*
 * Typography:
 *   - Display: Fraunces — variable serif with optical sizing. Used for
 *     headlines and the brand mark. Carries more character than the
 *     previous rounded-friendly pairing.
 *   - Body: Geist — distinctive neutral sans from Vercel. Replaces the
 *     generic Nunito for copy.
 *   - Mono: JetBrains Mono — unchanged, used in terminal and kbd.
 * Weights trimmed to what's actually rendered.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  // The mobile shell pads with env(safe-area-inset-*), which needs `cover`.
  viewportFit: 'cover',
  // The default appearance. The mode is the site's own setting, not the OS
  // colour scheme, so the boot script below and `applyAppearance` keep this
  // tag on the ground that is actually shown.
  themeColor: siteConfig.ground,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-palette={DEFAULT_PALETTE} suppressHydrationWarning>
      <head>
        <script
          // Applies the stored mode and palette (and the matching theme
          // colour) before first paint. Inline and blocking on purpose; a
          // deferred script paints the default first.
          dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
