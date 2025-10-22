'use client'

import { useTranslations } from 'next-intl'

import { PageTransition } from '@/components/layout/page-transition'
import CTASection from '@/components/sections/cta-section'
import FeaturedProjectsSection from '@/components/sections/featured-projects-section'
import HeroSection from '@/components/sections/hero-section'
import SkillsSection from '@/components/sections/skills-section'

const HomeClientPage = () => {
  const t = useTranslations()

  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection
          title={t('hero.greeting')}
          description={t('hero.description')}
          showAvailableForNewProjects={true}
          showBottomButtons={true}
        />
        <FeaturedProjectsSection />
        <SkillsSection />
        <CTASection
          title={t('cta.workTogether')}
          description={t('cta.workTogetherDescription')}
        />
      </div>
    </PageTransition>
  )
}

export default HomeClientPage
