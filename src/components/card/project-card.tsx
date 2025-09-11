'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { cardHover } from '@/lib/utils/animations'

import { Project } from '@/types'

import { ScrollAnimation } from '../scroll-animation'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface ProjectCardProps {
  project: Project
  delay: number
}

const ProjectCard = ({ project, delay }: ProjectCardProps) => {
  return (
    <ScrollAnimation key={project.id} delay={delay}>
      <motion.div
        className="project-card group"
        whileHover="hover"
        initial="rest"
        variants={cardHover}
      >
        <Link
          href={`/projects/${project.slug}`}
          className="mb-6 block overflow-hidden rounded-lg"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={project.image || '/placeholder.svg'}
              alt={`${project.title} Project`}
              width={600}
              height={400}
              priority
              className="h-48 w-full object-cover"
            />
          </motion.div>
        </Link>
        <Link href={`/projects/${project.slug}`}>
          <h3 className="mb-2 text-xl font-bold transition-colors hover:text-primary">
            {project.title}
          </h3>
        </Link>
        <p className="mb-4 text-muted-foreground">{project.summary}</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 5 && (
            <Badge variant="secondary">
              +{project.technologies.length - 5} more
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.slug}`}>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.05 },
                tap: { scale: 0.98 },
              }}
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                data-umami-event={`Click Button View Details of Project ${project.title}`}
              >
                View Details
              </Button>
            </motion.div>
          </Link>
          {project.demoUrl &&
            project.demoUrl !== '#desktop-app' &&
            project.demoUrl !== '#in-development' && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                    size="sm"
                    className="gap-2"
                    data-umami-event={`Click Button View Live Demo of Project ${project.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                </motion.div>
              </Link>
            )}
          {project.demoUrl === '#desktop-app' && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-not-allowed gap-2 opacity-50"
              disabled
            >
              <ExternalLink className="h-4 w-4" />
              Desktop App
            </Button>
          )}
          {project.demoUrl === '#in-development' && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-not-allowed gap-2 opacity-50"
              disabled
            >
              <ExternalLink className="h-4 w-4" />
              In Development
            </Button>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={{
                  hover: { scale: 1.05 },
                  tap: { scale: 0.98 },
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  data-umami-event={`Click Button View Code of Project ${project.title}`}
                >
                  <Github className="h-4 w-4" />
                  Code
                </Button>
              </motion.div>
            </Link>
          )}
        </div>
      </motion.div>
    </ScrollAnimation>
  )
}

export default ProjectCard
