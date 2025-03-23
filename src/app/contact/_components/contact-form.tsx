'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { motion } from 'motion/react'
import { useAction } from 'next-safe-action/hooks'
import { useTheme } from 'next-themes'
import { useForm } from 'react-hook-form'
import Turnstile from 'react-turnstile'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { ScrollAnimation } from '@/components/scroll-animation'

import { env } from '@/env/client'

import { sendEmailAction } from './action'
import { ContactFormSchema, contactFormSchema } from './validation'

const ContactForm = () => {
  const { theme } = useTheme()
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const { executeAsync, isPending } = useAction(sendEmailAction, {
    onSuccess: () => {
      form.reset()
      toast('Email sent successfully')
    },
    onError: ({ error }) => {
      toast(error.serverError)
    },
  })

  const handleSubmit = form.handleSubmit(async (data: ContactFormSchema) => {
    if (!data.turnstileToken) {
      toast('Please complete the captcha')
      return
    }
    await executeAsync(data)
  })

  return (
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
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      aria-label="Name"
                      type="text"
                      placeholder="Your Name"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      aria-label="Email"
                      type="email"
                      placeholder="Your email address"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      id="message"
                      aria-label="Message"
                      placeholder="Your Message"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Turnstile
              aria-label="Captcha"
              theme={theme === 'dark' ? 'dark' : 'light'}
              sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onVerify={(token: string) =>
                form.setValue('turnstileToken', token)
              }
            />

            <input
              type="hidden"
              name="verify"
              onChange={(e) => form.setValue('verify', e.target.value)}
              aria-label="Verify"
            />

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending ? 'Sending...' : 'Submit'}
              <motion.div
                animate={isPending ? { rotate: 360 } : { x: [0, 5, 0] }}
                transition={
                  isPending
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
          </form>
        </Form>
      </motion.div>
    </ScrollAnimation>
  )
}

export default ContactForm
