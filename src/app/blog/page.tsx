import { Metadata } from 'next'

import { Blogs } from '@/components/blog'
import Heading from '@/components/heading'
import Highlight from '@/components/highlight'
import Container from '@/components/layout/container'
import Paragraph from '@/components/paragraph'

import { getAllBlogs } from '@/lib/get-all-blogs'

export const metadata: Metadata = {
  title: 'Blogs | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

export default async function Blog() {
  const blogs = await getAllBlogs()
  const data = blogs.map(({ component, ...meta }) => meta)

  return (
    <Container>
      <span className="text-4xl">📝</span>
      <Heading className="pb-4 font-black">I write about technology</Heading>
      <Paragraph className="pb-10">
        Ever since <Highlight> I was a kid</Highlight>, I&apos;ve been
        fascinated by technology.
      </Paragraph>
      <Blogs blogs={data} />
    </Container>
  )
}
