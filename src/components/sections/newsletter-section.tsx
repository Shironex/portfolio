import React from 'react'

import { Button } from '../ui/button'

const NewsletterSection = () => {
  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Subscribe to My Newsletter
            </h2>
            <p className="mb-8 max-w-2xl text-muted-foreground">
              Stay updated with my latest articles, tutorials, and insights on
              web development and technology.
            </p>
            <form className="flex w-full max-w-md flex-col gap-4 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button disabled type="submit">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              I respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
