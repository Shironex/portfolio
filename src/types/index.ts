export interface GalleryItem {
  src: string
  alt: string
  caption: string
}

export interface TechDetails {
  stack: string[]
}

/**
 * Lifecycle of a project. `archived` covers work that is finished and no
 * longer maintained (discontinued, superseded, or kept for reference).
 */
export type ProjectStatus = 'in-progress' | 'shipped' | 'archived'

/** What a related link points at; picks the icon next to its label. */
export type ProjectLinkKind = 'blog' | 'docs' | 'npm' | 'release' | 'other'

export interface ProjectLink {
  label: string
  url: string
  kind: ProjectLinkKind
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  description: string[]
  image?: string
  projectType?: 'web' | 'cli' | 'library' | 'desktop' | 'mobile' | 'api'
  gallery: GalleryItem[]
  technologies: string[]
  features: string[]
  techDetails: TechDetails
  completedDate?: string
  startDate?: string
  status: ProjectStatus
  duration: string
  demoUrl: string
  githubUrl?: string
  /** Related reading and resources, shown beside the demo and source links. */
  links?: ProjectLink[]
  featured: boolean
}

export interface FullDiscordEmbed {
  author: {
    name: string
    icon_url?: string
    url?: string
  }
  title?: string
  url?: string
  description?: string
  fields: EmbedField[]
  color: number
  timestamp: string
  footer: {
    text: string
    icon_url?: string
  }
}

export interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

export interface MessageInfo {
  to: string
  subject: string
  body: string | React.ReactNode
}
