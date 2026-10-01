'use client'

import { memo } from 'react'

import type { Project } from '@/types'

import AboutApp from './apps/about-app'
import ContactApp from './apps/contact-app'
import ProjectDetailApp from './apps/project-detail-app'
import ProjectsApp from './apps/projects-app'
import ReadmeApp from './apps/readme-app'
import SkillsApp from './apps/skills-app'
import WritingApp from './apps/writing-app'
import type { HeadingLevel, WindowId } from './types'

interface AppBodyProps {
  id: WindowId
  /** Set for a project-detail window. */
  project?: Project
  onOpenProject: (p: Project) => void
  /** Level of a project's title; see `ProjectSections`. */
  projectTitleLevel?: HeadingLevel
}

/**
 * Dispatches the correct app body for a window.
 * Project-detail windows are identified by `project` being set.
 *
 * Memoized, and it takes the window's identity instead of its state: moving,
 * resizing or restacking a window does not re-render the app inside it.
 */
function AppBodyImpl({
  id,
  project,
  onOpenProject,
  projectTitleLevel,
}: AppBodyProps) {
  if (project) {
    return <ProjectDetailApp project={project} titleLevel={projectTitleLevel} />
  }

  switch (id) {
    case 'projects':
      return <ProjectsApp onOpenProject={onOpenProject} />
    case 'about':
      return <AboutApp />
    case 'skills':
      return <SkillsApp />
    case 'contact':
      return <ContactApp />
    case 'writing':
      return <WritingApp />
    case 'readme':
      return <ReadmeApp />
    default:
      return null
  }
}

export const AppBody = memo(AppBodyImpl)
