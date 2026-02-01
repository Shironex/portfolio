import { Code, Headphones } from 'lucide-react'

import { FeatureCard } from '@/components/card/feature-card'
import { ScrollAnimation } from '@/components/scroll-animation'

export const InterestsSection = () => {
  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <ScrollAnimation>
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              My Interests
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              When its comes to my life, here&apos;s what keeps me busy.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            title="Programming"
            description="Exploring new technologies and frameworks, contributing to open-source projects, and building personal projects to solve real-world problems."
            icon={<Code className="h-6 w-6" />}
          />

          <FeatureCard
            delay={0.2}
            title="Music"
            description="Discovering new artists and genres, attending concerts, and creating playlists for different moods and activities."
            icon={<Headphones className="h-6 w-6" />}
          />

          <FeatureCard
            delay={0.3}
            title="Motorcycles"
            description="Dreaming about owning a CFMoto 450 SS, learning about motorcycle mechanics, and planning future road trips."
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
