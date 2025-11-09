'use client'

import { useEffect, useState } from 'react'

import {
  AlertCircle,
  Code,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { EMAIL_CONTACT } from '@/lib/constants'

import { CodeMessageAnimation } from './code-message-animation'

const ContactVisualization = () => {
  const [animationComplete, setAnimationComplete] = useState(false)

  // Array of programming humor messages
  const programmingHumor = [
    { text: '404: Social life not found', icon: AlertCircle },
    { text: 'It works on my machine', icon: Terminal },
    { text: "!false // it's funny because it's true", icon: Code },
    { text: 'CSS is awesome', icon: Code },
    { text: '{ } // This is fine', icon: Terminal },
    { text: 'Undefined is not a function', icon: AlertCircle },
    { text: '0 errors, 147 warnings', icon: AlertCircle },
    { text: 'sudo make me a sandwich', icon: Terminal },
    { text: 'while(coding) { coffee++ }', icon: Code },
    { text: "git commit -m 'Fix bugs'", icon: Terminal },
    { text: '// TODO: Write better comments', icon: Code },
  ]

  // Trigger animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-linear-to-br from-background via-secondary/30 to-primary/10 p-8">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(var(--primary)/0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Content container */}
      <div className="relative h-full w-full">
        {/* Central globe */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 backdrop-blur-xs md:h-40 md:w-40 lg:h-48 lg:w-48">
            <Globe className="h-16 w-16 text-primary md:h-20 md:w-20 lg:h-24 lg:w-24" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'loop',
              }}
            />
          </div>
        </motion.div>

        {/* Contact info card */}
        <motion.div
          className="absolute left-[20%] top-[30%] rounded-xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur-xs"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <Mail className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs">{EMAIL_CONTACT}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                <MapPin className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs">Gdańsk, Poland</span>
            </div>
          </div>
        </motion.div>

        {/* Orbiting mail icon */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ rotate: 0, x: -120, y: -120 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-white shadow-lg"
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Mail className="h-6 w-6" />
          </motion.div>
        </motion.div>

        {/* Orbiting message icon */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ rotate: 60, x: 100, y: -80 }}
          animate={{ rotate: 420 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/80 text-white shadow-lg"
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <MessageSquare className="h-5 w-5" />
          </motion.div>
        </motion.div>

        {/* Orbiting send icon */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ rotate: 180, x: 0, y: 120 }}
          animate={{ rotate: 540 }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/80 text-white shadow-lg"
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Send className="h-7 w-7" />
          </motion.div>
        </motion.div>

        {/* Phone icon with card */}
        <motion.div
          className="absolute bottom-[40%] right-[19%] rounded-xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur-xs"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">Available for calls</span>
          </div>
        </motion.div>

        {/* Fixed position sparkles instead of random ones */}
        {[...Array(6)].map((_, i) => {
          // Calculate fixed positions for sparkles
          const positions = [
            { left: '15%', top: '20%' },
            { left: '75%', top: '15%' },
            { left: '85%', top: '65%' },
            { left: '25%', top: '75%' },
            { left: '45%', top: '85%' },
            { left: '60%', top: '30%' },
          ]

          return (
            <motion.div
              key={i}
              className="absolute"
              style={positions[i]}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + (i % 3),
                delay: i * 0.7,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3 + (i % 4),
              }}
            >
              <Sparkles className="h-4 w-4 text-primary/80" />
            </motion.div>
          )
        })}

        {/* Programming humor text animations */}
        {programmingHumor.map((item, i) => {
          // Calculate different positions for each text
          const positions = [
            { left: '10%', top: '15%' },
            { left: '70%', top: '20%' },
            { left: '15%', top: '65%' },
            { left: '65%', top: '70%' },
            { left: '40%', top: '25%' },
            { left: '80%', top: '40%' },
            { left: '30%', top: '60%' },
            { left: '60%', top: '50%' },
            { left: '20%', top: '40%' },
            { left: '50%', top: '75%' },
            { left: '75%', top: '60%' },
          ]

          const IconComponent = item.icon

          return (
            <motion.div
              key={`humor-${i}`}
              className="absolute z-10 rounded-md border border-border/40 bg-card/60 px-3 py-1.5 font-mono text-xs shadow-xs backdrop-blur-xs"
              style={positions[i]}
              initial={{ opacity: 0 }}
              // Replace whileInView with direct animation
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4,
                times: [0, 0.1, 0.9, 1],
                delay: 2 + i * 5, // Stagger the animations
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 30 + i * 3, // Long delay before repeating
              }}
            >
              <div className="flex items-center gap-1.5">
                <IconComponent className="h-3 w-3 text-primary" />
                <span>{item.text}</span>
              </div>
            </motion.div>
          )
        })}

        {/* Terminal with cycling messages */}
        <motion.div
          className="absolute bottom-[15%] left-[15%] z-10 w-64 overflow-hidden rounded-md border border-primary/20 bg-background/80 shadow-md backdrop-blur-xs"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-between bg-primary/20 px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">terminal</span>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/70"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500/70"></div>
              <div className="h-2 w-2 rounded-full bg-green-500/70"></div>
            </div>
          </div>
          <div className="p-3">
            <CodeMessageAnimation />
          </div>
        </motion.div>

        {/* Flying message animations */}
        <AnimatePresence>
          {animationComplete && (
            <>
              <motion.div
                className="absolute"
                style={{ left: '0%', top: '40%' }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 500, opacity: [0, 1, 0] }}
                exit={{ x: 600, opacity: 0 }}
                transition={{
                  duration: 4,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 7,
                }}
              >
                <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-xs">
                  <Send className="h-5 w-5 text-primary" />
                </div>
              </motion.div>

              <motion.div
                className="absolute"
                style={{ left: '100%', top: '60%' }}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -600, opacity: [0, 1, 0] }}
                exit={{ x: -700, opacity: 0 }}
                transition={{
                  duration: 5,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 9,
                  delay: 3,
                }}
              >
                <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-xs">
                  <Mail className="h-5 w-5 text-purple-500" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Connecting lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <motion.path
            d="M 200,150 C 250,200 300,200 350,150"
            stroke="hsl(var(--primary)/0.2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          <motion.path
            d="M 350,150 C 400,100 450,100 500,150"
            stroke="hsl(var(--primary)/0.2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
          <motion.path
            d="M 200,350 C 250,300 300,300 350,350"
            stroke="hsl(var(--primary)/0.2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.4 }}
          />
          <motion.path
            d="M 350,350 C 400,400 450,400 500,350"
            stroke="hsl(var(--primary)/0.2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.6 }}
          />
        </svg>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Connecting globally from Gdańsk, Poland
        </motion.p>
      </div>
    </div>
  )
}

export default ContactVisualization
