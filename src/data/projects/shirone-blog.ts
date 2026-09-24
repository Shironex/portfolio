import { Project } from '@/types'

export const shironeBlog: Project = {
  id: 'shirone-blog',
  slug: 'shirone-blog',
  title: 'shirone.blog',
  summary:
    'My blog: field notes on what I build and what broke along the way, from Electron pitfalls to the Shiranami Rust rewrite.',
  description: [
    'shirone.blog is where I write up what I learn while building things: Electron packaging traps, environment variables leaking into builds, terminal performance with many sessions, moving an app to a plugin architecture, and the full story of rewriting Shiranami in Rust.',
    'It is a static Astro site with MDX posts, React islands where a post needs interactivity, Tailwind CSS with the typography plugin and Shiki for code highlighting. It has an RSS feed and a sitemap, and runs as a small Docker container on my own server through Coolify.',
  ],
  projectType: 'web',
  gallery: [],
  technologies: ['Astro', 'MDX', 'React', 'Tailwind CSS', 'Docker'],
  features: [
    'Static site with MDX posts and React islands',
    'Code highlighting with Shiki',
    'RSS feed and sitemap',
    'Tags and drafts in the content collection',
    'Self-hosted with Docker and Coolify',
  ],
  techDetails: {
    stack: [
      'Astro',
      'MDX',
      'React',
      'Tailwind CSS v4',
      'Shiki',
      'TypeScript',
      'Docker',
      'Coolify',
    ],
  },
  status: 'shipped',
  duration: 'Ongoing',
  demoUrl: 'https://shirone.blog',
  githubUrl: 'https://github.com/Shironex/shirone-blog',
  featured: false,
}
