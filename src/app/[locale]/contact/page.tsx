'use client'

import type React from 'react'

import { Mail, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import ContactVisualization from '@/components/contact-visualization'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'
import HeroSection from '@/components/sections/hero-section'

import { EMAIL_CONTACT } from '@/lib/constants'

import { useMediaQuery } from '@/hooks/use-media-query'

import ContactForm from './_components/contact-form'

export default function ContactPage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const t = useTranslations('contact')

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero Section */}
        <HeroSection
          title={t('pageTitle')}
          description={t('pageDescription')}
        />

        {/* Contact Form Section */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <ScrollAnimation>
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 text-3xl font-bold">{t('getInTouch')}</h2>
                <p className="mb-8 text-muted-foreground">
                  {t('availability')}
                </p>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'rgba(120,119,198,0.3)',
                      }}
                    >
                      <Mail className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium">{t('email')}</h3>
                      <p className="text-muted-foreground">{EMAIL_CONTACT}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'rgba(120,119,198,0.3)',
                      }}
                    >
                      <MapPin className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium">{t('location')}</h3>
                      <p className="text-muted-foreground">{t('locationValue')}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollAnimation>

            <ContactForm />
          </div>
        </section>

        {/* Interactive Visualization Section */}
        {!isMobile && (
          <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                {t('visualizationTitle')}
              </h2>
              <p className="text-muted-foreground">
                {t('visualizationDescription')}
              </p>
            </div>
            <ScrollAnimation>
              <ContactVisualization />
            </ScrollAnimation>
          </section>
        )}
      </div>
    </PageTransition>
  )
}
