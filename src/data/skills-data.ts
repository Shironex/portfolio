export interface SkillItem {
  n: string
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
      { n: 'React' },
      { n: 'Next.js' },
      { n: 'TypeScript' },
      { n: 'Tailwind' },
      { n: 'Motion' },
      { n: 'Electron' },
      { n: 'React Native' },
      { n: 'Shadcn' },
    ],
  },
  {
    group: 'backend',
    icon: '◑',
    items: [
      { n: 'Node.js' },
      { n: 'NestJS' },
      { n: 'PostgreSQL' },
      { n: 'Prisma' },
      { n: 'Redis' },
      { n: 'WebSockets' },
      { n: 'RabbitMQ' },
    ],
  },
  {
    group: 'devops',
    icon: '◒',
    items: [
      { n: 'Docker' },
      { n: 'GitHub Actions' },
      { n: 'Terraform' },
      { n: 'AWS' },
      { n: 'Vitest' },
      { n: 'Cypress' },
      { n: 'Grafana' },
    ],
  },
]
