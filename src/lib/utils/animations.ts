'use client'

import type { Variants } from 'motion/react'

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Fade up animation for individual elements
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
}

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

// Scale animation
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
}

// Staggered list item animation
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
}

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

// Card hover animation
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
}

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
}

// Button interaction with tap animation (most common pattern)
export const buttonScale: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
}

// Navbar slide in animation
export const navbarSlideIn: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
}

// Navbar item animation
export const navbarItem: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
    },
  },
}

// Gradient animation
export const gradientAnimation: Variants = {
  hidden: {
    backgroundPosition: '0% 50%',
  },
  show: {
    backgroundPosition: '100% 50%',
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'reverse',
      duration: 8,
      ease: 'linear',
    },
  },
}

// Infinite arrow pulse animation for CTAs
export const arrowPulse = {
  x: [0, 5, 0],
  transition: {
    duration: 1.5,
    repeat: Number.POSITIVE_INFINITY,
    ease: 'easeInOut' as const,
  },
}

// Infinite scale pulse animation for badges and icons
export const scalePulse = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: 'easeInOut' as const,
  },
}

// Image hover scale animation
export const imageHover = {
  scale: 1.05,
  transition: {
    duration: 0.3,
  },
}

// Badge entry animation (fade in from top)
export const badgeEntry: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Subtle card hover animation
export const cardSubtleHover = {
  scale: 1.02,
  transition: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },
}

// Gradient heading with blur effect
export const gradientHeadingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Scroll fade up with custom easing
export const scrollFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}
