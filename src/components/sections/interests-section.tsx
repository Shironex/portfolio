'use client'

import { Code, Headphones } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { FeatureCard } from '@/components/card/feature-card'
import { ScrollAnimation } from '@/components/scroll-animation'

export const InterestsSection = () => {
  const t = useTranslations('interests')

  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <ScrollAnimation>
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t('title')}
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            title={t('programming.title')}
            description={t('programming.description')}
            icon={<Code className="h-6 w-6" />}
          />

          <FeatureCard
            delay={0.2}
            title={t('music.title')}
            description={t('music.description')}
            icon={<Headphones className="h-6 w-6" />}
          />

          <FeatureCard
            delay={0.3}
            title={t('motorcycles.title')}
            description={t('motorcycles.description')}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M14.5 22V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16"></path>
                <path d="M2 22h20"></path>
                <path d="M22 6h-7.5"></path>
                <path d="M14 10h2"></path>
                <path d="M14 14h4"></path>
                <path d="M14 18h6"></path>
              </svg>
            }
          />
        </div>
      </div>
    </section>
  )
}
