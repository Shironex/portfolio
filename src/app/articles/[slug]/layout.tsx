import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type ArticleLayoutProps = {
  params: Promise<{
    slug: string
  }>
  children: React.ReactNode
}

const ArticleLayout = async ({ children, params }: ArticleLayoutProps) => {
  const { slug } = await params

  return (
    <>
      <SendEventOnLoad eventKey={`user viewed article: ${slug}`} />
      {children}
    </>
  )
}

export default ArticleLayout
