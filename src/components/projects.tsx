'use client'

import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'framer-motion'

import { projects } from '@/lib/constants'
import { Project } from '@/lib/type'

import Heading from './heading'
import { Paragraph } from './paragraph'

const Projects = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-10">
        {projects.map((project: Project, idx: number) => (
          <motion.div
            key={project.href}
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.2, delay: idx * 0.1 }}
          >
            <Link
              href={{
                pathname: project.slug
                  ? `/projects/${project.slug}`
                  : project.href,
              }}
              key={project.href}
              className="group flex flex-col space-y-4 rounded-2xl pt-4 transition duration-200 hover:bg-gray-50 md:flex-row md:space-x-4 md:space-y-0"
            >
              <Image
                src={project.thumbnail}
                alt="thumbnail"
                height="143"
                width="200"
                className="h-[143px] w-[200px] flex-shrink-0 rounded-md"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <Heading
                    as="h4"
                    className="text-lg font-black md:text-lg lg:text-lg"
                  >
                    {project.title}
                  </Heading>
                  <Paragraph className="mt-2 max-w-xl text-sm md:text-sm lg:text-sm">
                    {project.description}
                  </Paragraph>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-2 md:mb-1 md:mt-0">
                  {project.stack.length > 0 ? (
                    <>
                      {project.stack.map((stack: string, index: number) => {
                        if (index > 7) return null
                        return (
                          <span
                            key={stack}
                            className="rounded-sm bg-gray-50 px-2 py-1 text-xs text-muted-foreground"
                          >
                            {stack}
                          </span>
                        )
                      })}
                      {project.stack.length > 7 && (
                        <span className="rounded-sm bg-gray-50 px-2 py-1 text-xs text-muted-foreground">
                          +{project.stack.length - 8}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="rounded-sm bg-gray-50 px-2 py-1 text-xs text-muted-foreground">
                      No stack
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Projects
