'use client'

import Image from 'next/image'
import type React from 'react'
import { useState } from 'react'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'

interface ProjectGalleryProps {
  images: {
    src: string
    alt: string
    caption?: string
  }[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)

  const openViewer = (index: number) => {
    setCurrentIndex(index)
    setViewerOpen(true)
  }

  const closeViewer = () => {
    setViewerOpen(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeViewer()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">Project Gallery</h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-lg border border-border bg-card"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div
              className="cursor-pointer overflow-hidden"
              onClick={() => openViewer(index)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image.src || '/placeholder.svg'}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover"
                />
              </motion.div>
            </div>
            {image.caption && (
              <div className="p-3">
                <p className="text-sm text-muted-foreground">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            onClick={closeViewer}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={images[currentIndex].src || '/placeholder.svg'}
                  alt={images[currentIndex].alt}
                  width={1200}
                  height={800}
                  className="max-h-[80vh] rounded-lg object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={closeViewer}
                >
                  <X className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {images[currentIndex].caption && (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground">
                    {images[currentIndex].caption}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <div className="flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-muted'}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(index)
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
