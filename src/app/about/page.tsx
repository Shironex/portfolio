'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRight,
  Code,
  Download,
  Github,
  Headphones,
  Mail,
} from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'

import { fadeUp, staggerContainer } from '@/lib/animation-utils'

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32">
          <AnimatedGradient className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <motion.div
              className="flex flex-col items-center text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <GradientHeading
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                delay={0.1}
              >
                About Me
              </GradientHeading>

              <motion.p
                className="mb-8 max-w-2xl text-xl text-muted-foreground"
                variants={fadeUp}
              >
                Hey there, I&apos;m Kacper — a passionate developer, tech
                enthusiast, and a lover of creativity in all forms.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Image Gallery */}
            <ScrollAnimation>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="City view"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Rubik's cube"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="DJ equipment"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Code on laptop"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>
            </ScrollAnimation>

            {/* About Text */}
            <ScrollAnimation delay={0.2}>
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 text-3xl font-bold">My Journey</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    From the moment I began my coding journey, I was captivated
                    by the magic of building web applications that could
                    genuinely make a difference.
                  </p>
                  <p>
                    As a junior Next.js developer with two years of experience,
                    I specialize in turning ideas into functional, seamless
                    digital solutions. Whether it&apos;s a tool to make life
                    easier for me, my friends, or my family, I&apos;m all about
                    creating impactful software that merges performance with
                    elegance.
                  </p>
                  <p>
                    Beyond the code, I have a diverse range of interests. Music
                    is a big part of my life – I enjoy exploring different
                    genres and discovering new artists. I&apos;m also a fan of
                    problem-solving in any form, whether it&apos;s untangling
                    complex coding issues or solving a Rubik&apos;s cube.
                  </p>
                  <p>
                    And when I&apos;m not immersed in tech, you&apos;ll probably
                    find me dreaming about motorbikes; my goal is to own a
                    CFMoto 450 SS in the near future.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.05 },
                        tap: { scale: 0.98 },
                      }}
                    >
                      <Button className="gap-2">
                        Contact Me
                        <Mail className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/resume.pdf" target="_blank">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.05 },
                        tap: { scale: 0.98 },
                      }}
                    >
                      <Button variant="outline" className="gap-2">
                        Download Resume
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Interests Section */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <ScrollAnimation>
              <div className="mb-12 flex flex-col items-center text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  My Interests
                </h2>
                <p className="max-w-2xl text-muted-foreground">
                  When I&apos;m not coding, here&apos;s what keeps me busy.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid gap-8 md:grid-cols-3">
              <ScrollAnimation delay={0.1}>
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <Code className="h-6 w-6" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">Programming</h3>
                  <p className="text-muted-foreground">
                    Exploring new technologies and frameworks, contributing to
                    open-source projects, and building personal projects to
                    solve real-world problems.
                  </p>
                </motion.div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <Headphones className="h-6 w-6" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">Music</h3>
                  <p className="text-muted-foreground">
                    Discovering new artists and genres, attending concerts, and
                    creating playlists for different moods and activities.
                  </p>
                </motion.div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M14.5 22V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16"></path>
                      <path d="M2 22h20"></path>
                      <path d="M22 6h-7.5"></path>
                      <path d="M14 10h2"></path>
                      <path d="M14 14h4"></path>
                      <path d="M14 18h6"></path>
                    </svg>
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">Motorcycles</h3>
                  <p className="text-muted-foreground">
                    Dreaming about owning a CFMoto 450 SS, learning about
                    motorcycle mechanics, and planning future road trips.
                  </p>
                </motion.div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <ScrollAnimation>
            <motion.div
              className="rounded-xl border border-border bg-card p-8 md:p-12"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="flex flex-col items-center text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Let&apos;s Connect
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  I&apos;m always open to new opportunities, collaborations, or
                  just a friendly chat about tech, music, or motorcycles.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.05 },
                        tap: { scale: 0.98 },
                      }}
                    >
                      <Button size="lg" className="gap-2">
                        Get in Touch
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'loop',
                            ease: 'easeInOut',
                            times: [0, 0.6, 1],
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                  <Link
                    href="https://github.com/shirone"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={{
                        hover: { scale: 1.05 },
                        tap: { scale: 0.98 },
                      }}
                    >
                      <Button size="lg" variant="outline" className="gap-2">
                        <Github className="h-4 w-4" />
                        Follow on GitHub
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
