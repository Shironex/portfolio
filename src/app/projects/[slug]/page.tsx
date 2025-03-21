import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import Container from '@/components/layout/container'
import SingleProject from '@/components/signle-project'

import { projects } from '@/lib/constants'
import { Project } from '@/lib/type'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const product = projects.find((p) => p.slug === slug) as Project | undefined
  if (product) {
    return {
      title: product.title,
      description: product.description,
    }
  } else {
    return {
      title: 'Projects | Shirone',
      description: 'Shirone is a developer, gamer and music lover.',
    }
  }
}

const ProjectOverviewPage = async ({ params }: Props) => {
  const slug = (await params).slug
  const product = projects.find((p) => p.slug === slug)

  if (!product) {
    redirect('/projects')
  }
  return (
    <Container>
      <SingleProject project={product} />
    </Container>
  )
}

export default ProjectOverviewPage
