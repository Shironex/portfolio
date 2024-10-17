import { Metadata } from 'next'

import { Blogs } from '@/components/blog'
import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import Paragraph from '@/components/paragraph'

import { getAllBlogs } from '@/lib/get-all-blogs'

export const metadata: Metadata = {
  title: 'Blogs | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

export default async function Blog() {
  const blogs = await getAllBlogs()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = blogs.map(({ component, ...meta }) => meta)

  return (
    <Container>
      <span className="text-4xl">📝</span>
      <Heading className="pb-4 font-black">
        I will definitely write some articles here{' '}
      </Heading>
      <Paragraph className="pb-10">
        Ever since I was a kid, I&apos;ve been fascinated by technology.
      </Paragraph>
      <Blogs blogs={data} />
    </Container>
  )
}
