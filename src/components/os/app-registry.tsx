'use client'

import type { Project } from '@/types'

import AboutApp from './apps/about-app'
import ContactApp from './apps/contact-app'
import ProjectDetailApp from './apps/project-detail-app'
import ProjectsApp from './apps/projects-app'
import ReadmeApp from './apps/readme-app'
import SkillsApp from './apps/skills-app'
import type { WindowState } from './types'

interface AppBodyProps {
  window: WindowState
  onOpenProject: (p: Project) => void
}

/**
 * Dispatches the correct app body for a window state.
 * Project-detail windows are identified by `window.project` being set.
 */
export function AppBody({ window: win, onOpenProject }: AppBodyProps) {
  if (win.project) return <ProjectDetailApp project={win.project} />

  switch (win.id) {
    case 'projects':
      return <ProjectsApp onOpenProject={onOpenProject} />
    case 'about':
      return <AboutApp />
    case 'skills':
      return <SkillsApp />
    case 'contact':
      return <ContactApp />
    case 'readme':
      return <ReadmeApp />
    default:
      return null
  }
}
