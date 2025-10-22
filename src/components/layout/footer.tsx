'use client'

import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/routing'
import { GITHUB_URL, NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Shirone
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <nav className="flex flex-wrap gap-6 sm:flex-nowrap">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  data-umami-event={`Click Button Navigate to ${t(item.name)}`}
                >
                  {t(item.name)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  )
}
