import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'

import { getAllArticles } from '@/lib/mdx-utils'

export const metadata = {
  title: 'Articles & Insights | Shirone',
  description:
    'Sharing my thoughts, experiences, and tutorials on web development and technology.',
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32">
          <AnimatedGradient className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="flex flex-col items-center text-center">
              <GradientHeading
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                delay={0.1}
              >
                Articles & Insights
              </GradientHeading>

              <p className="mb-8 max-w-2xl text-xl text-muted-foreground">
                Sharing my thoughts, experiences, and tutorials on web
                development and technology.
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <article className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
                  <div className="overflow-hidden">
                    <Image
                      src={article.image || '/placeholder.svg'}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {article.readTime}
                      </span>
                    </div>
                    <h2 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">
                      {article.title}
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                      {article.excerpt}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center font-medium text-primary">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="rounded-xl border border-border bg-card p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Subscribe to My Newsletter
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  Stay updated with my latest articles, tutorials, and insights
                  on web development and technology.
                </p>
                <form className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="mt-4 text-xs text-muted-foreground">
                  I respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
