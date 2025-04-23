import ArticleCard from '@/components/card/article-card'
import { PageTransition } from '@/components/layout/page-transition'
import HeroSection from '@/components/sections/hero-section'
import NewsletterSection from '@/components/sections/newsletter-section'

import { getAllArticles } from '@/lib/utils/mdx'

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
        <HeroSection
          title="Articles & Insights"
          description="Sharing my thoughts, experiences, and tutorials on web development and technology."
        />

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <NewsletterSection />
      </div>
    </PageTransition>
  )
}
