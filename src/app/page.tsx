import Heading from '@/components/heading';
import { Highlight } from '@/components/highlight';
import Container from '@/components/layout/container';
import { Paragraph } from '@/components/paragraph';

export default function Home() {
  return (
    <Container>
      <span className="text-4xl">👋</span>
      <Heading className="font-black">Hello there! I&apos;m Kacper</Heading>
      <Paragraph className="max-w-xl mt-4">
        I&apos;m a full-stack developer that loves{' '}
        <Highlight>building new things</Highlight> and web apps that can impact
        pepoles around me.
      </Paragraph>
      <Paragraph className="max-w-xl mt-4">
        I&apos;m a junior software engineer with{' '}
        <Highlight>2 years of experience</Highlight> building applications in
        React and Next.js.
      </Paragraph>
      <Heading
        as="h2"
        className="font-black text-lg md:text-lg lg:text-lg mt-20 mb-4"
      >
        What I&apos;ve been working on
      </Heading>

    </Container>
  )
}
