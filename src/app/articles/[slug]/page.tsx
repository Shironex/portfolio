import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { marked } from 'marked'

import { Badge } from '@/components/ui/badge'

import { AnimatedGradient } from '@/components/animated-gradient'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'
import { ArticleContent } from '@/components/sections/article-content'

import { getArticleBySlug, getArticleSlugs } from '@/lib/mdx-utils'
import { generateMetadata as generateMeta } from '@/lib/metadata-config'

import { Article } from '@/types'

import './mdx.css'
import './syntax-highlight.css'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getArticleSlugs()
  return articles
}

// Generate metadata for the article
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return generateMeta({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      path: `/articles/${slug}`,
    })
  }

  return generateMeta({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    ogImage: article.image || '/og-articles.jpg',
    openGraph: {
      type: 'article',
      publishedTime: article.date,
      authors: ['Shirone'],
      tags: article.tags,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_PUBLIC_URL || 'https://shirone.xyz'}${article.image || '/og-articles.jpg'}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  })
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params

  const article = getArticleBySlug(slug)

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
        <HeroSection article={article} formattedDate={formattedDate} />
        <FeaturedImage image={article.image} title={article.title} />

        {/* Article Content */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <article className="mx-auto max-w-4xl">
              <ArticleContent htmlContent={htmlContent} />
            </article>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}

const HeroSection = ({
  article,
  formattedDate,
}: {
  article: Article
  formattedDate: string
}) => {
  return (
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
  )
}

const FeaturedImage = ({ image, title }: { image: string; title: string }) => {
  return (
    <section className="container mx-auto px-4 py-8 md:px-6">
      <ScrollAnimation>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border">
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </ScrollAnimation>
    </section>
  )
}

export default ArticlePage
