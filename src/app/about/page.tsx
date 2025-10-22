'use cache'

import { cacheLife } from 'next/cache'

import { PageTransition } from '@/components/layout/page-transition'
import { AboutContent } from '@/components/sections/about-content'
import CTASection from '@/components/sections/cta-section'
import HeroSection from '@/components/sections/hero-section'
import { InterestsSection } from '@/components/sections/interests-section'

import { ImagesGallery } from './_components/images-gallery'

export default async function AboutPage() {
  cacheLife('days')
  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection
          title="About Me"
          description="Hey there, I'm Kacper — a passionate developer, tech enthusiast, and a lover of creativity in all forms."
        />

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <ImagesGallery />
            <AboutContent />
          </div>
        </section>

        <InterestsSection />

        <CTASection
          title="Let's Connect"
          description={`I'm always open to new opportunities, collaborations, or
                  just a friendly chat about tech, music, or motorcycles.`}
          showGitHubButton={true}
        />
      </div>
    </PageTransition>
  )
}
