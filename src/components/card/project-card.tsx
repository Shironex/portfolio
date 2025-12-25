'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

import { ExternalLink, Github, Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { buttonScale, cardHover } from '@/lib/utils/animations'

import { Project } from '@/types'

import ProjectPlaceholder from '../project-placeholder'
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
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} Project`}
                width={600}
                height={400}
                priority
                className="h-48 w-full object-cover"
              />
            ) : (
              <ProjectPlaceholder project={project} className="h-48 w-full" />
            )}
          </motion.div>
        </Link>
        {project.inProgress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <Badge
              variant="secondary"
              className="gap-1.5 border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                }}
              >
                <Zap className="h-3 w-3 fill-current" />
              </motion.div>
              In Development
            </Badge>
          </motion.div>
        )}
        <Link href={`/projects/${project.slug}`}>
          <h3 className="hover:text-primary mb-2 text-xl font-bold transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4">{project.summary}</p>
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
              variants={buttonScale}
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
                  variants={buttonScale}
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
                variants={buttonScale}
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

export default memo(ProjectCard)
