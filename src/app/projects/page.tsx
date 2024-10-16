import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import Projects from '@/components/projects'

const ProjectsPage = () => {
  return (
    <Container>
      <Heading className="mb-10 font-black">
        {' '}
        What I&apos;ve been working on
      </Heading>

      <Projects />
    </Container>
  )
}

export default ProjectsPage
