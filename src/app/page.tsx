'use client'

import { PageTransition } from '@/components/layout/page-transition'
import CTASection from '@/components/sections/cta-section'
import FeaturedProjectsSection from '@/components/sections/featured-projects-section'
import HeroSection from '@/components/sections/hero-section'
import SkillsSection from '@/components/sections/skills-section'

const HomePage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection />
        <FeaturedProjectsSection />
        <SkillsSection />
        <CTASection />
      </div>
    </PageTransition>
  )
}

export default HomePage
