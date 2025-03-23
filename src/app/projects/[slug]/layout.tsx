import { Metadata } from 'next'
import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

import { generateMetadata as generateMeta } from '@/lib/metadata-config'

import { projectsData } from '@/data/projects-data'

interface Props {
  params: Promise<{ slug: string }>
}

interface SelectedProjectLayoutProps extends Props {
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const project = projectsData.find((p) => p.slug === slug)

  if (!project) {
    return generateMeta({
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
      path: `/projects/${slug}`,
    })
  }

  return generateMeta({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    ogImage: project.image || '/og-projects.jpg',
    openGraph: {
      type: 'article',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_PUBLIC_URL || 'https://shirone.xyz'}${project.image || '/og-projects.jpg'}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  })
}

const SelectedProjectLayout = async ({
  children,
  params,
}: SelectedProjectLayoutProps) => {
  const slug = (await params).slug

  return (
    <>
      <SendEventOnLoad eventKey={`user viewed ${slug} project`} />
      {children}
    </>
  )
}

export default SelectedProjectLayout
