import { Project } from '@/types'

export const stackward: Project = {
  id: 'stackward',
  slug: 'stackward',
  title: 'stackward',
  summary:
    'A read only security audit for a self-hosted Linux server: Docker, Coolify or Dokploy, the reverse proxy, a Cloudflare Tunnel or Tailscale in front. A Go CLI that explains every finding and how to fix it.',
  description: [
    'Most small servers are not a bare Linux box. They run Docker under Coolify or Dokploy, a proxy in front, a tunnel or a tailnet for the way in and CrowdSec on top, and each layer changes what is really exposed: a published Docker port skips the firewall, a panel port listens on every interface. I wrote stackward to read that whole stack and answer two questions: what is actually exposed, and what is misconfigured.',
    'It has 104 audit checks in 14 groups (SSH, firewall, Docker, updates, secrets on disk, Coolify and Dokploy, Cloudflare Tunnel, Tailscale, CrowdSec and more) and 6 outside view checks that stackward probe runs from another machine. Every finding has a stable check id, the evidence it saw and the fix, and stackward explain says why a check matters, how to verify it by hand and what the fix can break. Anything it could not inspect is reported as unknown, never as a pass.',
    'Version 0.1 only reads. It confines itself with a Landlock sandbox where the kernel supports it, talks to Docker with GET requests only, never reads the contents of secret files and sends nothing anywhere. Checks only see the collected facts, so a redacted facts file replays a report exactly, which is how bug reports become tests.',
    'Releases are signed: checksums signed keylessly with cosign, GitHub build provenance, an SBOM per archive, a .deb and an install script that checks the checksum before it installs anything. The newest release is v0.1.2. I am working on v0.2 now: plan and apply, with backups, a rollback timer and a guard against a change that locks you out of SSH.',
  ],
  image: '/projects/stackward/thumbnail.webp',
  projectType: 'cli',
  gallery: [
    {
      src: '/projects/stackward/audit.webp',
      alt: 'stackward: the start of an audit report with the summary box and the first two fails',
      caption:
        'An audit over saved facts: the summary, the fails most severe first, and each with its rule and fix.',
    },
    {
      src: '/projects/stackward/tui.webp',
      alt: 'stackward: the findings browser in a terminal, with an open panel port selected',
      caption:
        'stackward tui: findings by group, worst first, with the evidence and the fix beside them.',
    },
    {
      src: '/projects/stackward/explain.webp',
      alt: 'stackward: explain PAAS-003 in a terminal',
      caption:
        'stackward explain: why a check matters, how to verify it by hand and what the fix can break.',
    },
  ],
  technologies: ['Go', 'Bubble Tea', 'Landlock', 'cosign'],
  features: [
    '104 audit checks in 14 groups, plus 6 outside view checks run by stackward probe',
    'Reads the whole stack: SSH, UFW and DOCKER-USER, Docker, Coolify and Dokploy, Cloudflare Tunnel, Tailscale, CrowdSec',
    'Every finding with a stable id, its evidence, the fix and what the fix can break',
    'Unknown is never a pass: what it cannot inspect is reported, with the reason',
    'Read only, inside a Landlock sandbox where the kernel supports it; no telemetry',
    'Text, JSON and Markdown reports, and a findings browser in the terminal',
    'Redacted facts files that replay a report exactly, used as golden tests',
    'Signed releases: cosign, build provenance, SBOMs, a .deb and an install script',
  ],
  techDetails: {
    stack: [
      'Lip Gloss + Bubbles',
      'golang.org/x/sys',
      'GoReleaser',
      'cosign + GitHub attestations',
      'Astro Starlight (docs)',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/stackward',
  links: [
    {
      label: 'docs',
      url: 'https://shironex.github.io/stackward/',
      kind: 'docs',
    },
    {
      label: 'latest release',
      url: 'https://github.com/Shironex/stackward/releases/latest',
      kind: 'release',
    },
  ],
  featured: true,
}
