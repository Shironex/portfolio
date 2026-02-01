'use client'

import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'

interface RelatedProjectsProps {
  projects: any[]
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          data-umami-event={`Click Button View Related Project ${project.title}`}
        >
          <motion.div
            className="border-border bg-card overflow-hidden rounded-xl border transition-all hover:shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={project.image || '/placeholder.svg'}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover"
                />
              </motion.div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.technologies.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
