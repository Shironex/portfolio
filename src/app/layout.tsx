import type { Metadata } from 'next'
import { Caveat, Fredoka, JetBrains_Mono, Nunito } from 'next/font/google'
import type React from 'react'
import { Suspense } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { defaultMetadata, siteConfig } from '@/lib/metadata-config'

import Providers from '@/context/providers'
import '@/styles/globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'] as const,
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
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
        className={`${fredoka.variable} ${nunito.variable} ${caveat.variable} ${jetbrainsMono.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
