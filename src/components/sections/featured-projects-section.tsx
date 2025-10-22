'use client'

import Link from 'next/link'
import React from 'react'

import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

import { projectsData } from '@/data/projects-data'

import ProjectCard from '../card/project-card'
import { ScrollAnimation } from '../scroll-animation'
import { Button } from '../ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../ui/empty'

const FeaturedProjectsSection = () => {
  const featuredProjects = projectsData
    .filter((project) => project.featured)
    .slice(0, 3)

  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <ScrollAnimation>
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            What I&apos;ve been working on
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            A selection of my recent projects and collaborations.
          </p>
        </div>
      </ScrollAnimation>

      {featuredProjects.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No featured projects</EmptyTitle>
            <EmptyDescription>
              When projects are featured, they will be highlighted here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            Add featured projects to draw attention to your best work.
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={0.1 * index}
            />
          ))}
        </div>
      )}

      <ScrollAnimation delay={0.4}>
        <div className="mt-12 flex justify-center">
          <Link href="/projects">
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
                data-umami-event="Click Button View All Projects"
              >
                View All Projects
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    times: [0, 0.6, 1],
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </div>
      </ScrollAnimation>
    </section>
  )
}

export default FeaturedProjectsSection
