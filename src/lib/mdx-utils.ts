import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { Article } from '@/types'

// Define the articles directory
const articlesDirectory = path.join(process.cwd(), 'src/content/articles')

// Get all article slugs
export function getArticleSlugs() {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        return {
          params: {
            slug: fileName.replace(/\.mdx$/, ''),
          },
        }
      })
  } catch (error) {
    console.error('Error getting article slugs:', error)
    return []
  }
}

// Get article data by slug
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the article metadata
    const { data, content } = matter(fileContents)

    // Return the article data
    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      readTime: data.readTime || '',
      image: data.image || '/placeholder.svg?height=400&width=600',
      content,
    }
  } catch (error) {
    console.error(`Error getting article by slug (${slug}):`, error)
    return null
  }
}

// Get all articles
export function getAllArticles(): Article[] {
  try {
    const slugs = getArticleSlugs()
    const articles = slugs.map(({ params }) => {
      const article = getArticleBySlug(params.slug)
      return article
    })

    // Filter out null articles and sort by date (newest first)
    return articles
      .filter((article): article is Article => article !== null)
      .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
  } catch (error) {
    console.error('Error getting all articles:', error)
    return []
  }
}
