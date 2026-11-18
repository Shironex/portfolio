import { Project } from '@/types'

export const hinomi: Project = {
  id: 'hinomi',
  slug: 'hinomi',
  title: 'Hinomi',
  summary:
    'A small self-hosted app that tells you whether anything deployed and reachable is exposed to a serious vulnerability. It joins deployments from Coolify, Dokploy or Docker hosts with GitHub and OSV advisories, ranks every finding by real exposure and plans the fix.',
  description: [
    'GitHub can report thousands of Dependabot alerts across a few dozen repos, and most of them sit in repos that are not deployed anywhere. Meanwhile alerts can be switched off on a repo without anyone noticing, so a critical advisory on a live site produces no alert at all. I built Hinomi for my own servers, where I look after a dozen apps alone, to answer one question: is anything that is actually deployed and reachable exposed right now?',
    'It reads deployments from Coolify, Dokploy, Docker hosts or a manual list, repos and Dependabot alerts from GitHub, and checks the lockfiles on its own through OSV.dev, so repos with Dependabot off are covered too. Every finding is ranked by severity, runtime or development code, deployed or not, and public or internal. A deployed repo it cannot see into is reported as a blind spot instead of staying silent.',
    'The By fix view groups findings by the package bump that clears the most of them, and a fix plan shows the safe steps of one repo as the diff its pull request makes. With the fix runner on, Hinomi opens that pull request for me to review; it never merges and never touches a deployment. New critical findings go to Discord, a webhook or email right after a scan, with a daily digest for the rest.',
    'It is one container with a SQLite database, published to GHCR for amd64 and arm64 with an SBOM and build provenance, and it installs on a phone as an app. It has no login yet, so it sits behind Tailscale or Cloudflare Access and shows on every page how a request reached it. The newest release is v0.3.0, which guards configuration as well as dependencies: drift guards for a container running as root, a mounted Docker socket or a shared network, runtime and framework support windows from endoflife.date, image scans for deployments with no repo, a release tier for desktop apps that ship installers but deploy nowhere, and lockfiles for Go, Python, PHP and Ruby.',
  ],
  image: '/projects/hinomi/thumbnail.webp',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/hinomi/exposure.webp',
      alt: 'Hinomi: the Exposure view with the ranked findings and the top one open',
      caption:
        'Exposure: 1,286 alerts narrow to the few on public apps, ranked, with the top finding open.',
    },
    {
      src: '/projects/hinomi/finding.webp',
      alt: 'Hinomi: one finding with why it ranks where it does',
      caption:
        'Finding: why it ranks where it does, the fix and the affected apps.',
    },
    {
      src: '/projects/hinomi/fixes.webp',
      alt: 'Hinomi: the By fix view',
      caption:
        'By fix: the package bumps that clear the most findings, across repos and apps.',
    },
    {
      src: '/projects/hinomi/fix-plan.webp',
      alt: 'Hinomi: the fix plan of one repo as a diff',
      caption:
        'Fix plan: the safe steps of one repo as the diff its pull request makes.',
    },
    {
      src: '/projects/hinomi/fix-run.webp',
      alt: 'Hinomi: a fix run with its pull request and checks',
      caption:
        'Fix run: where the run stands, its pull request and the failed checks first.',
    },
    {
      src: '/projects/hinomi/deployments.webp',
      alt: 'Hinomi: the deployments map by server, shaded by exposure',
      caption:
        'Deployments: every app by server, shaded by exposure, with blind spots marked.',
    },
    {
      src: '/projects/hinomi/settings.webp',
      alt: 'Hinomi: Settings with sources, channels, runners and scans',
      caption:
        'Settings: Coolify, several GitHub sources and OSV.dev, channels, runners, scans and repo mapping.',
    },
    {
      src: '/projects/hinomi/setup.webp',
      alt: 'Hinomi: the setup steps of a new instance',
      caption: 'Setup: four steps from an empty instance to the first scan.',
    },
  ],
  technologies: ['TypeScript', 'React', 'Hono', 'SQLite', 'Docker'],
  features: [
    'Joins deployments from Coolify, Dokploy, Docker hosts or a manual list with GitHub Dependabot alerts and its own OSV.dev lockfile check',
    'Every finding ranked by severity, runtime code, deployed or not, and public or internal',
    'Drift guards: root containers, mounted Docker sockets, shared networks and runtimes near end of life',
    'Image scans for deployments with no repo, and a release tier for desktop apps that only ship installers',
    'Blind spots as findings: alerts switched off, unreadable or missing lockfiles, unmapped deployments',
    'By fix view: the package bumps that clear the most findings across repos',
    'Fix plans as diffs, and an opt in runner that opens pull requests but never merges',
    'Snooze or accept a finding with a reason, until a date or a new advisory',
    'Alerts to Discord, a webhook or email, with a daily digest',
    'One container with SQLite on GHCR (amd64 and arm64), with an SBOM and build provenance',
    'Installs on a phone as an app; shows on every page whether Tailscale or Cloudflare Access protects it',
  ],
  techDetails: {
    stack: [
      'Node.js',
      'better-sqlite3 + Drizzle',
      'TanStack Router + Query',
      'Tailwind CSS',
      'shadcn/ui + Radix',
      'Vite',
      'Zod',
      'GHCR images (amd64 + arm64)',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/hinomi',
  links: [
    {
      label: 'latest release',
      url: 'https://github.com/Shironex/hinomi/releases/latest',
      kind: 'release',
    },
  ],
  featured: true,
}
