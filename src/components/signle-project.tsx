'use client'

import { IconArrowRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'

import { Project } from '@/lib/type'

import Heading from './heading'
import { Paragraph } from './paragraph'
import { Badge } from './ui/badge'
import { ImagesSlider } from './ui/images-slider'

type Props = {
  project: Project
}

const SingleProject = ({ project }: Props) => {
  return (
    <div className="py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        key={project.slug}
        className="relative"
      >
        <ImagesSlider
          className="h-[20rem]"
          images={project.images}
          overlay={false}
          direction="down"
        />
      </motion.div>

      <div className="mt-20 flex flex-col gap-2">
        <Heading className="pb-1 font-black">{project.title}</Heading>
        {project.status !== 'Completed' && (
          <div className="flex items-center gap-2">
            <Paragraph className="text-base md:text-xl lg:text-2xl">
              Project Status:
            </Paragraph>
            <Badge className="text-xs">{project.status}</Badge>
          </div>
        )}
        <div className="mt-2 flex flex-wrap justify-start gap-2 md:mb-1 md:mt-0">
          {project.stack?.map((stack: string) => (
            <Badge key={stack} variant="secondary" className="text-xs">
              {stack}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <Paragraph
          className="mt-4 max-w-xl text-xl font-black text-primary"
          words={project.description}
        />
      </div>
      <div className="prose prose-sm mb-4 max-w-none text-muted-foreground md:prose-base">
        {project.content.split(' ').map((el, i) => (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.25,
              delay: i / 10,
            }}
            key={i}
          >
            {el}{' '}
          </motion.span>
        ))}
      </div>

      <a
        href={project.href}
        target="__blank"
        className="group/button mt-auto inline-flex origin-left items-center gap-1 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/20 ring-gray-50/60 ring-offset-gray-900 transition hover:scale-105 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 group-hover/button:scale-105 group-hover/button:bg-gray-50/15 sm:backdrop-blur-sm"
      >
        Live Preview
        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  )
}

export default SingleProject
