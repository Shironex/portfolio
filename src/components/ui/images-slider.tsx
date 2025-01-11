'use client'

import { StaticImageData } from 'next/image'
import React, { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

interface ImagesSliderProps {
  images: string[] | StaticImageData[]
  children?: React.ReactNode
  overlay?: boolean
  overlayClassName?: string
  className?: string
  autoplay?: boolean
  direction?: 'up' | 'down'
}

export const ImagesSlider: React.FC<ImagesSliderProps> = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = 'up',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    )
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    const loadImages = () => {
      const loadPromises = images.map((image) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.src = typeof image === 'string' ? image : image.src
          img.onload = () =>
            resolve(typeof image === 'string' ? image : image.src)
          img.onerror = reject
        })
      })

      Promise.all(loadPromises)
        .then((loadedImages) => {
          setLoadedImages(loadedImages)
        })
        .catch((error) => console.error('Failed to load images', error))
    }

    loadImages()
  }, [images])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    let interval: NodeJS.Timeout
    if (autoplay) {
      interval = setInterval(handleNext, 5000)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(interval)
    }
  }, [autoplay])

  const slideVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotateX: 45,
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
    upExit: {
      opacity: 0,
      y: '-50%',
      transition: {
        duration: 0.3,
      },
    },
    downExit: {
      opacity: 0,
      y: '50%',
      transition: {
        duration: 0.3,
      },
    },
  }

  const areImagesLoaded = loadedImages.length > 0

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl',
        className
      )}
      style={{
        perspective: '1000px',
      }}
    >
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div
          className={cn('absolute inset-0 z-10 bg-black/30', overlayClassName)}
        />
      )}

      {areImagesLoaded && (
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === 'up' ? 'upExit' : 'downExit'}
            variants={slideVariants}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      )}

      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center space-x-2">
        {loadedImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              index === currentIndex ? 'w-4 bg-white' : 'bg-white/50'
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/30"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/30"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}
