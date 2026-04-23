import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import type React from 'react'
import { Suspense } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { defaultMetadata, siteConfig } from '@/lib/metadata-config'

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

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
