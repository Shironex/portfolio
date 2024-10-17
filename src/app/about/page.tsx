import { Metadata } from 'next'

import AboutMe from '@/components/about-me'
import Heading from '@/components/heading'
import Container from '@/components/layout/container'

export const metadata: Metadata = {
  title: 'About | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

const AboutPage = () => {
  return (
    <Container>
      <span className="text-4xl">💬</span>
      <Heading className="font-black">About Me</Heading>
      <AboutMe />
    </Container>
  )
}

export default AboutPage
