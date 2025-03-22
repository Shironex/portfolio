import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type Props = {
  children: React.ReactNode
}

const ProjectsLayout = ({ children }: Props) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed projects" />
      {children}
    </>
  )
}

export default ProjectsLayout
