import { Metadata } from 'next'

import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import Projects from '@/components/projects'
import SendEventOnLoad from '@/components/send-event-on-load'

export const metadata: Metadata = {
  title: 'Projects | Shirone',
  description: 'Shirone is a developer, gamer and music lover.',
}

const ProjectsPage = () => {
  return (
    <Container>
      <SendEventOnLoad eventKey="user viewed projects" />
      <Heading className="mb-10 font-black">
        {' '}
        What I&apos;ve been working on
      </Heading>

      <Projects />
    </Container>
  )
}

export default ProjectsPage
