'use client'

import Image from 'next/image'

import { motion } from 'motion/react'

import { ScrollAnimation } from '@/components/scroll-animation'

export function ImagesGallery() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1570630992840-0bdd5732442e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop',
      alt: 'City view',
    },
    {
      src: 'https://images.unsplash.com/photo-1597914377769-db5167cb0221?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop',
      alt: "Rubik's cube",
    },
    {
      src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop',
      alt: 'DJ equipment',
    },
    {
      src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop',
      alt: 'Code on laptop',
    },
  ]

  return (
    <ScrollAnimation>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <motion.div
            key={image.alt}
            className="overflow-hidden rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={400}
              className="h-[400px] w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </ScrollAnimation>
  )
}
