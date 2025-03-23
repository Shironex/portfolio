import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { ScrollRestoration } from '@/components/scroll-restoration'

import Providers from '@/context/providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shirone | Developer Portfolio',
  description: 'Personal portfolio of Shirone, a full-stack developer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ScrollRestoration />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
