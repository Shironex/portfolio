import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { marked } from 'marked'

import { Badge } from '@/components/ui/badge'

import { AnimatedGradient } from '@/components/animated-gradient'
import { ArticleContentSimple } from '@/components/article-content-simple'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'

import { getArticleBySlug, getArticleSlugs } from '@/lib/mdx-utils'

import './mdx.css'
import './syntax-highlight.css'

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getArticleSlugs()
  return articles
}

// Generate metadata for the article
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${article.title} | Shirone`,
    description: article.excerpt,
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Convert markdown to HTML
  const htmlContent = marked(article.content)

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32">
          <AnimatedGradient className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <div className="flex flex-col items-center text-center">
              <Link
                href="/articles"
                className="mb-8 flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Link>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {article.title}
              </h1>

              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.date}>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="container mx-auto px-4 py-8 md:px-6">
          <ScrollAnimation>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border">
              <Image
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </ScrollAnimation>
        </section>

        {/* Article Content */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <article className="mx-auto max-w-4xl">
              <ArticleContentSimple htmlContent={htmlContent} />
            </article>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
