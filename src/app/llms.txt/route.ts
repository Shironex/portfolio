import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  BLOG_URL,
  EMAIL_CONTACT,
  GITHUB_URL,
} from '@/lib/constants'
import { STATIC_FEED_CACHE_CONTROL } from '@/lib/feed-cache'
import { absoluteUrl } from '@/lib/metadata-config'
import { projectPath, summaryLead } from '@/lib/utils/project-meta'

import { projectsData } from '@/data/projects-data'
import type { Project, ProjectStatus } from '@/types'

const SECTIONS: { status: ProjectStatus; heading: string }[] = [
  { status: 'shipped', heading: 'Projects' },
  { status: 'in-progress', heading: 'Projects in progress' },
  { status: 'archived', heading: 'Archived projects' },
]

function link(label: string, url: string, note: string): string {
  return `- [${label}](${url}): ${note}`
}

function projectLine(project: Project): string {
  return link(
    project.title,
    absoluteUrl(projectPath(project.slug)),
    summaryLead(project)
  )
}

/**
 * `/llms.txt` in the llmstxt.org layout: a title, a short summary, then
 * sections of links with a one-line note each. Static, built from the project
 * data and the contact constants.
 */
export function GET() {
  const sections = SECTIONS.map(({ status, heading }) => {
    const lines = projectsData
      .filter((project) => project.status === status)
      .map(projectLine)
    return lines.length > 0 ? `## ${heading}\n\n${lines.join('\n')}` : null
  }).filter((section) => section !== null)

  const body = [
    `# ${AUTHOR_FULL_NAME} (${AUTHOR_NAME})`,
    '> I am a full-stack developer working mostly in TypeScript and Rust. This site is my portfolio, built to look like a small desktop OS. Every project below has its own page with a description, a feature list and the tech stack.',
    ...sections,
    [
      '## Contact',
      '',
      link('Email', `mailto:${EMAIL_CONTACT}`, 'The best way to reach me'),
      link('GitHub', GITHUB_URL, 'My open source work'),
      link('Blog', BLOG_URL, 'Notes on what I build and what went wrong'),
    ].join('\n'),
    [
      '## Optional',
      '',
      link(
        'Projects as JSON',
        absoluteUrl('/projects.json'),
        'The same project list as structured data'
      ),
      link('Sitemap', absoluteUrl('/sitemap.xml'), 'Every page on this site'),
    ].join('\n'),
  ].join('\n\n')

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': STATIC_FEED_CACHE_CONTROL,
    },
  })
}
