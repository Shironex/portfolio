import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { ArrowRight, Calendar } from 'lucide-react'

import { Article } from '@/types'

import { Badge } from '../ui/badge'

interface ArticleCardProps {
  article: Article
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
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
          <p className="mb-4 text-muted-foreground">{article.excerpt}</p>
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
  )
}

export default ArticleCard
