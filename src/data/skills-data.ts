export interface SkillItem {
  n: string
  /** Used in earlier work but not part of the current day-to-day stack. */
  previously?: boolean
}

export interface SkillGroup {
  group: string
  icon: string
  items: SkillItem[]
}

/*
 * The first item in each group is the daily driver (the skills window
 * highlights it), so order matters. `previously` items go last.
 */
export const skillsData: SkillGroup[] = [
  {
    group: 'frontend',
    icon: '◐',
    items: [
      { n: 'React' },
      { n: 'TypeScript' },
      { n: 'Vite' },
      { n: 'TanStack' },
      { n: 'Next.js' },
      { n: 'Tailwind' },
      { n: 'Motion' },
      { n: 'shadcn/ui' },
      { n: 'React Native' },
    ],
  },
  {
    group: 'backend',
    icon: '◑',
    items: [
      { n: 'Node.js' },
      { n: 'NestJS' },
      { n: 'tRPC' },
      { n: 'PostgreSQL' },
      { n: 'Prisma' },
      { n: 'SQLite' },
      { n: 'Redis' },
      { n: 'WebSockets' },
      { n: 'RabbitMQ', previously: true },
    ],
  },
  {
    group: 'desktop',
    icon: '◓',
    items: [
      { n: 'Rust' },
      { n: 'Tauri' },
      { n: 'Electron' },
      { n: 'Native addons (C++)' },
    ],
  },
  {
    group: 'infra (self-hosted)',
    icon: '◒',
    items: [
      { n: 'Coolify' },
      { n: 'Docker' },
      { n: 'Hetzner / OVH' },
      { n: 'Cloudflare Tunnels' },
      { n: 'Tailscale' },
      { n: 'S3-compatible storage' },
      { n: 'DNS & mail' },
      { n: 'GitHub Actions' },
      { n: 'AWS', previously: true },
      { n: 'Terraform', previously: true },
    ],
  },
  {
    group: 'testing',
    icon: '◔',
    items: [
      { n: 'Vitest' },
      { n: 'Playwright' },
      { n: 'Cypress', previously: true },
    ],
  },
]
