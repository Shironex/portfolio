import { Metadata } from 'next'

import Heading from '@/components/heading'
import { Highlight } from '@/components/highlight'
import Container from '@/components/layout/container'
import { Paragraph } from '@/components/paragraph'
import Projects from '@/components/projects'

export const metadata: Metadata = {
  title: 'Home | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

const HomePage = () => {
  return (
    <Container>
      <span className="text-4xl">👋</span>
      <Heading className="font-black">Hello there! I&apos;m Kacper</Heading>
      <Paragraph className="mt-4 max-w-xl">
        I&apos;m a full-stack developer that loves{' '}
        <Highlight>building new things</Highlight> and web apps that can impact
        pepoles around me.
      </Paragraph>
      <Paragraph className="mt-4 max-w-xl">
        I&apos;m a junior software engineer with{' '}
        <Highlight>2 years of experience</Highlight> building applications in
        React and Next.js.
      </Paragraph>
      <Heading
        as="h2"
        className="mb-4 mt-20 text-lg font-black md:text-lg lg:text-lg"
      >
        What I&apos;ve been working on
      </Heading>
      <Projects />
    </Container>
  )
}

export default HomePage
