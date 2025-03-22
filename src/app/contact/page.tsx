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
import ContactVisualization from '@/components/contact-visualization'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'
import HeroSection from '@/components/sections/hero-section'

import { fadeUp, staggerContainer } from '@/lib/utils/animations'

import ContactForm from './_components/contact-form'

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
        <HeroSection
          title="Contact Me"
          description="Reach out to me over email or fill up this contact form. I will get back to you ASAP - I promise."
        />

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
                      <p className="text-muted-foreground">Gdańsk, Poland</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollAnimation>

            <ContactForm />
          </div>
        </section>

        {/* Interactive Visualization Section */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">While you&apos;re bored</h2>
            <p className="text-muted-foreground">
              You can look at this animation to see how I&apos;m connected to
              the world
            </p>
          </div>
          <ScrollAnimation>
            <ContactVisualization />
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
