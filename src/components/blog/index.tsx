'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import Heading from '@/components/heading'
import Paragraph from '@/components/paragraph'

import { Blog } from '@/lib/type'

export const Blogs = ({ blogs }: { blogs: Blog[] }) => {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="mx-auto my-10 max-w-5xl">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.slug}
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          <Link
            key={`blog-${blog.title}`}
            href={{
              pathname: `/blog/${blog.slug}`,
            }}
            className="relative my-10 block"
            onMouseEnter={() => setHovered(blog.slug)}
            onMouseLeave={() => setHovered(null)}
          >
            <AnimatePresence mode="wait">
              {hovered === blog.slug && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0.95,
                    scaleY: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scaleX: 1.05,
                    scaleY: 1.2,
                  }}
                  exit={{
                    opacity: 0,

                    scaleX: 0.95,
                    scaleY: 0.95,
                  }}
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-md bg-gray-50"
                />
              )}
            </AnimatePresence>
            <div className="relative z-20 grid grid-cols-1 gap-4 md:grid-cols-4">
              <Image
                src={blog.image}
                alt="thumbnail"
                height="200"
                width="200"
                objectFit="cover"
                className="h-40 w-60 rounded-md object-cover"
              />
              <div className="col-span-3 flex flex-col">
                <Heading className="text-lg md:text-lg lg:text-lg">
                  {blog.title}
                </Heading>
                <Paragraph className="mt-2 text-sm md:text-sm lg:text-sm">
                  {blog.description}
                </Paragraph>
                <div className="mt-4 flex flex-wrap space-x-2">
                  {blog.tags?.map((tag) => (
                    <span
                      key={`tag-${blog.slug}`}
                      className="rounded-md border border-neutral-200 bg-white px-1 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
