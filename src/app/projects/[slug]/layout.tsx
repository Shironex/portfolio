import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type Props = {
  params: {
    slug: string
  }
  children: React.ReactNode
}

const SelectedProjectLayout = ({ children, params }: Props) => {
  return (
    <>
      <SendEventOnLoad eventKey={`user viewed ${params.slug} project`} />
      {children}
    </>
  )
}

export default SelectedProjectLayout
