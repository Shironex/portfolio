import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

import Footer from '@/components/layout/footer'
import Sidebar from '@/components/layout/sidebar/index'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Portfolio | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

type Props = {
  children: React.ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          inter.className,
          'flex h-screen overflow-hidden bg-gray-100 antialiased'
        )}
      >
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-gray-100 lg:pl-2 lg:pt-2">
          <div className="min-h-screen flex-1 overflow-y-auto border border-transparent bg-white lg:rounded-tl-xl lg:border-neutral-200">
            {children}
            <Toaster />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
