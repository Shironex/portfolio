import React from 'react'

import { Code } from 'lucide-react'

import { FeatureCard } from '../card/feature-card'
import { Badge } from '../ui/badge'

interface Skill {
  name: string
}

type Skills = {
  frontend: Skill[]
  backend: Skill[]
  devops: Skill[]
}

const skills: Skills = {
  frontend: [
    {
      name: 'React',
    },
    {
      name: 'Next.js',
    },
    {
      name: 'TypeScript',
    },
    {
      name: 'Tailwind CSS',
    },
    {
      name: 'Framer Motion',
    },
    {
      name: 'Shadcn UI',
    },
    {
      name: 'React Native',
    },
    {
      name: 'Electron',
    },
  ],
  backend: [
    {
      name: 'Node.js',
    },
    {
      name: 'Nest JS',
    },
    {
      name: 'PostgreSQL',
    },
    {
      name: 'Redis',
    },
    {
      name: 'RabbitMQ',
    },
    {
      name: 'WebSockets',
    },
    {
      name: 'More...',
    },
  ],
  devops: [
    {
      name: 'Docker',
    },
    {
      name: 'Terraform',
    },
    {
      name: 'GitHub Actions',
    },
    {
      name: 'AWS Services',
    },
    {
      name: 'Cypress',
    },
    {
      name: 'Jest',
    },
    {
      name: 'Vitest',
    },
    {
      name: 'Grafana',
    },
    {
      name: 'More...',
    },
  ],
}

const SkillsSection = () => {
  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            My Skills & Expertise
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            I specialize in building modern web applications with these
            technologies.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Frontend Development"
            description="Creating responsive and interactive user interfaces with modern frameworks."
            icon={<Code className="h-6 w-6" />}
          >
            <div className="flex flex-wrap gap-2">
              {skills.frontend.map((skill) => (
                <Badge key={skill.name} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            delay={0.2}
            title="Backend Development"
            description="Building robust server-side applications and APIs to power web applications."
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
                <path d="M2 13a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z"></path>
                <path d="M16 13a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z"></path>
                <path d="M8 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path>
                <path d="M8 21V8"></path>
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              {skills.backend.map((skill) => (
                <Badge key={skill.name} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            delay={0.3}
            title="DevOps & Deployment & Testing Tools"
            description="Setting up CI/CD pipelines and deploying applications to production environments."
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
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <line x1="3" x2="21" y1="9" y2="9"></line>
                <line x1="9" x2="9" y1="21" y2="9"></line>
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              {skills.devops.map((skill) => (
                <Badge key={skill.name} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
