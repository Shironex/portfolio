export interface NavItem {
  name: string
  path: string
}

export interface GalleryItem {
  src: string
  alt: string
  caption: string
}

export interface Challenge {
  challenge: string
  solution: string
}

export interface TechDetails {
  stack: string[]
  architecture?: string
  challenges: Challenge[]
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  description: string[]
  image: string
  gallery: GalleryItem[]
  technologies: string[]
  features: string[]
  techDetails: TechDetails
  completedDate?: string
  startDate?: string
  inProgress?: boolean
  duration: string
  outcome: string
  demoUrl: string
  githubUrl?: string
  featured: boolean
}

export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readTime: string
  image: string
  content: string
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
  image?: {
    url?: string
  }
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
