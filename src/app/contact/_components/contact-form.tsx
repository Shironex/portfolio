'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Turnstile from 'react-turnstile'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { env } from '@/env/client'

import { sendEmailAction } from './action'
import { ContactFormSchema, contactFormSchema } from './validation'

const ContactForm = () => {
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })
  const { execute, isPending } = useServerAction(sendEmailAction, {
    onSuccess: () => {
      console.log('Email sent successfully')
      form.reset()
      toast('Email sent successfully')
    },
    onError: ({ err }) => {
      toast(err.message)
    },
  })

  const handleSubmit = form.handleSubmit(async (data: ContactFormSchema) => {
    if (!data.turnstileToken) {
      toast('Please complete the captcha')
      return
    }
    await execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-md bg-neutral-100 px-2 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-200"
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-md bg-neutral-100 px-2 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Your Message"
                  rows={10}
                  className="mt-4 w-full resize-none rounded-md bg-neutral-100 px-2 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Turnstile
          theme="light"
          sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onVerify={(token: string) => form.setValue('turnstileToken', token)}
        />
        <input
          type="hidden"
          name="verify"
          onChange={(e) => form.setValue('verify', e.target.value)}
        />
        <Button
          className="mt-4 w-full rounded-md bg-neutral-100 px-2 py-2 font-bold text-neutral-500"
          type="submit"
          variant={'outline'}
        >
          {isPending ? <LoadingSpinner /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

const LoadingSpinner = () => {
  return (
    <div className="flex gap-2">
      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500"></div>
    </div>
  )
}

export default ContactForm
