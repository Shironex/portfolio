export interface SkillItem {
  n: string
  l: number
}

export interface SkillGroup {
  group: string
  icon: string
  items: SkillItem[]
}

export const skillsData: SkillGroup[] = [
  {
    group: 'frontend',
    icon: '◐',
    items: [
      { n: 'React', l: 95 },
      { n: 'Next.js', l: 92 },
      { n: 'TypeScript', l: 94 },
      { n: 'Tailwind', l: 90 },
      { n: 'Motion', l: 78 },
      { n: 'Electron', l: 85 },
      { n: 'React Native', l: 72 },
      { n: 'Shadcn', l: 88 },
    ],
  },
  {
    group: 'backend',
    icon: '◑',
    items: [
      { n: 'Node.js', l: 90 },
      { n: 'NestJS', l: 86 },
      { n: 'PostgreSQL', l: 82 },
      { n: 'Prisma', l: 88 },
      { n: 'Redis', l: 80 },
      { n: 'WebSockets', l: 84 },
      { n: 'RabbitMQ', l: 70 },
    ],
  },
  {
    group: 'devops',
    icon: '◒',
    items: [
      { n: 'Docker', l: 84 },
      { n: 'GitHub Actions', l: 88 },
      { n: 'Terraform', l: 68 },
      { n: 'AWS', l: 72 },
      { n: 'Vitest', l: 90 },
      { n: 'Cypress', l: 78 },
      { n: 'Grafana', l: 66 },
    ],
  },
]
