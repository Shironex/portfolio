import Image from 'next/image'
import Link from 'next/link'

import { IconArrowLeft } from '@tabler/icons-react'

import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import Paragraph from '@/components/paragraph'
import Prose from '@/components/prose'

import { formatDate } from '@/lib/utils'

type BlogLayoutProps = {
  children: React.ReactNode
  meta: {
    title: string
    date: string
    image: string
  }
}

const BlogLayout = ({ children, meta }: BlogLayoutProps) => {
  return (
    <Container>
      <article>
        <header className="flex flex-col">
          <Link
            type="button"
            href={{
              pathname: '/blog',
            }}
            aria-label="Go back to articles"
            className="group mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition"
          >
            <IconArrowLeft className="d h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700" />
          </Link>

          <Heading className="py-4">{meta.title}</Heading>
          <time
            dateTime={meta.date}
            className="flex items-center text-base text-zinc-400"
          >
            <Paragraph className="text-zinc-700">
              {formatDate(meta.date)}
            </Paragraph>
          </time>
          <div className="aspect-w-16 aspect-h-10 xl:aspect-w-16 xl:aspect-h-10 relative mt-4 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={meta.image}
              alt="thumbnail"
              height="800"
              width="800"
              className={'max-h-96 w-full object-cover object-left-top'}
            />
          </div>
        </header>
        <Prose className="mt-8">{children}</Prose>
      </article>
    </Container>
  )
}

export default BlogLayout
