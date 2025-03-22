'use client'

import type React from 'react'
import { useState } from 'react'

import { Mail, MapPin, Send } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'

import { fadeUp, staggerContainer } from '@/lib/utils/animations'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast('Message sent!', {
      description:
        "Thank you for your message. I'll get back to you as soon as possible.",
    })

    setFormData({
      name: '',
      email: '',
      message: '',
    })
    setIsSubmitting(false)
  }

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
                Contact Me
              </GradientHeading>

              <motion.p
                className="mb-8 max-w-2xl text-xl text-muted-foreground"
                variants={fadeUp}
              >
                Reach out to me over email or fill up this contact form. I will
                get back to you ASAP - I promise.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <ScrollAnimation>
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 text-3xl font-bold">Get in Touch</h2>
                <p className="mb-8 text-muted-foreground">
                  I&apos;m currently available for freelance work, full-time
                  positions, or collaborations. If you have a project in mind or
                  just want to chat, feel free to reach out!
                </p>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'rgba(120,119,198,0.3)',
                      }}
                    >
                      <Mail className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">
                        support@shirone.xyz
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'rgba(120,119,198,0.3)',
                      }}
                    >
                      <MapPin className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground">Warsaw, Poland</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <motion.div
                className="rounded-xl border border-border bg-card p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={6}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Submit'}
                      <motion.div
                        animate={
                          isSubmitting ? { rotate: 360 } : { x: [0, 5, 0] }
                        }
                        transition={
                          isSubmitting
                            ? {
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                              }
                            : {
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: 'loop',
                                ease: 'easeInOut',
                                times: [0, 0.6, 1],
                              }
                        }
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <motion.div
              className="overflow-hidden rounded-xl border border-border"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="aspect-video w-full bg-muted">
                {/* Replace with actual map component or embed */}
                <div className="flex h-full items-center justify-center bg-secondary/50 p-8 text-center">
                  <p className="text-muted-foreground">
                    Map of Warsaw, Poland would be displayed here
                  </p>
                </div>
              </div>
            </motion.div>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
