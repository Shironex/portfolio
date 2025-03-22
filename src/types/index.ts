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
  architecture: string
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
  completedDate: string
  duration: string
  outcome: string
  demoUrl: string
  githubUrl: string
  featured: boolean
}
