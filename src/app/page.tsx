import { Metadata } from 'next'

import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import { Paragraph } from '@/components/paragraph'
import Projects from '@/components/projects'

export const metadata: Metadata = {
  title: 'Home | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

export default function Home() {
  return (
    <Container>
      <span className="animate-pulse text-4xl">👋</span>
      <Heading className="font-black">Hello there! I&apos;m Kacper</Heading>
      <Paragraph
        className="mt-4 max-w-xl"
        words="I'm a full-stack developer that loves building new things and web apps that can impact pepoles around me."
      />
      <Paragraph
        className="mt-4 max-w-xl"
        words="I'm a junior software engineer with
        I'm a junior software engineer with 
        2 years of experience building applications in
        React and Next.js."
      />
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
