'use client'

import { Download, Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { ScrollAnimation } from '@/components/scroll-animation'

import { Link } from '@/i18n/routing'
import { APP_ROUTES } from '@/lib/constants'

export const AboutContent = () => {
  const t = useTranslations('about')

  return (
    <ScrollAnimation delay={0.2}>
      <div className="flex flex-col justify-center">
        <h2 className="mb-6 text-3xl font-bold">{t('myJourney')}</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>{t('journey.paragraph1')}</p>
          <p>{t('journey.paragraph2')}</p>
          <p>{t('journey.paragraph3')}</p>
          <p>{t('journey.paragraph4')}</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href={APP_ROUTES.toContact}>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.05 },
                tap: { scale: 0.98 },
              }}
            >
              <Button
                className="gap-2"
                data-umami-event="Click Button Contact Me"
              >
                {t('contactMe')}
                <Mail className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={{
              hover: { scale: 1.05 },
              tap: { scale: 0.98 },
            }}
          >
            <Button
              variant="outline"
              className="gap-2"
              disabled
              data-umami-event="Click Button Download Resume"
            >
              {t('downloadResume')}
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
