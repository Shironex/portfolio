import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { ScrollRestoration } from '@/components/scroll-restoration'

import { routing } from '@/i18n/routing'
import { defaultMetadata } from '@/lib/metadata-config'

import Providers from '@/context/providers'
import { env } from '@/env/server'

export const metadata: Metadata = defaultMetadata

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  await connection()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ScrollRestoration />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
                <script
                  defer
                  src={env.ANALYTIC_URL + '/script.js'}
                  data-website-id={env.ANALYTIC_ID}
                />
              </main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
