import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

const SelectedProjectLayout = async ({ children, params }: Props) => {
  const slug = (await params).slug

  return (
    <>
      <SendEventOnLoad eventKey={`user viewed ${slug} project`} />
      {children}
    </>
  )
}

export default SelectedProjectLayout
