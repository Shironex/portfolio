'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { motion } from 'motion/react'
import { useAction } from 'next-safe-action/hooks'
import posthog from 'posthog-js'
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

import { env } from '@/env/client'

import { sendEmailAction } from './action'
import { ContactFormSchema, contactFormSchema } from './validation'

export interface ContactFormProps {
  theme?: 'light' | 'dark'
  surface?: 'card' | 'plain'
}

export function ContactForm({
  theme = 'light',
  surface = 'plain',
}: ContactFormProps = {}) {
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
      posthog.capture('contact_form_submitted')
    },
    onError: ({ error }) => {
      toast(error.serverError)
      posthog.capture('contact_form_error', {
        error_message: error.serverError,
      })
    },
  })

  const handleSubmit = form.handleSubmit(async (data: ContactFormSchema) => {
    if (!data.turnstileToken) {
      toast('Please complete the captcha')
      return
    }
    await executeAsync(data)
  })

  const formInner = (
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
          theme={theme}
          sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onVerify={(token: string) => form.setValue('turnstileToken', token)}
        />

        <input
          type="hidden"
          name="verify"
          onChange={(e) => form.setValue('verify', e.target.value)}
          aria-label="Verify"
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full gap-2 bg-gradient-to-r from-miku to-pink text-cloud font-semibold shadow-sm hover:brightness-110 disabled:opacity-70"
        >
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
  )

  if (surface === 'card') {
    return (
      <div className="rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl p-6 md:p-8">
        {formInner}
      </div>
    )
  }

  return formInner
}

export default ContactForm
