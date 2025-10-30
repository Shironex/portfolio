'use client'

import { PageTransition } from '@/components/layout/page-transition'
import CTASection from '@/components/sections/cta-section'
import FeaturedProjectsSection from '@/components/sections/featured-projects-section'
import HeroSection from '@/components/sections/hero-section'
import InProgressProjectsSection from '@/components/sections/in-progress-projects-section'
import SkillsSection from '@/components/sections/skills-section'

const HomeClientPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection
          title="Hello there! I'm Kacper"
          description="I'm a full-stack developer that loves building new things and web apps that can impact peoples around me."
          showAvailableForNewProjects={true}
          showBottomButtons={true}
        />
        <InProgressProjectsSection />
        <FeaturedProjectsSection />
        <SkillsSection />
        <CTASection
          title="Let's Work Together"
          description={`I'm currently available for freelance projects, full-time
            positions, or collaborations. If you have a project in mind or
            just want to chat, feel free to reach out!`}
        />
      </div>
    </PageTransition>
  )
}

export default HomeClientPage
