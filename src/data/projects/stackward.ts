import { Project } from '@/types'

export const stackward: Project = {
  id: 'stackward',
  slug: 'stackward',
  title: 'stackward',
  summary:
    'A security audit for a self-hosted Linux server: Docker, Coolify or Dokploy, the reverse proxy, a Cloudflare Tunnel or Tailscale in front. A Go CLI that is read only by default, explains every finding and can apply the fixes you choose.',
  description: [
    'Most small servers are not a bare Linux box. They run Docker under Coolify or Dokploy, a proxy in front, a tunnel or a tailnet for the way in and CrowdSec on top, and each layer changes what is really exposed: a published Docker port skips the firewall, a panel port listens on every interface. I wrote stackward to read that whole stack and answer two questions: what is actually exposed, and what is misconfigured.',
    'It has 112 audit checks in 15 groups (SSH, firewall, the cloud provider firewall, Docker, updates, secrets on disk, Coolify and Dokploy, Cloudflare Tunnel, Tailscale, CrowdSec and more) and 6 outside view checks that stackward probe runs from another machine. Every finding has a stable check id, the evidence it saw and the fix, and stackward explain says why a check matters, how to verify it by hand and what the fix can break. Anything it could not inspect is reported as unknown, never as a pass.',
    'The audit only reads. It confines itself with a Landlock sandbox where the kernel supports it, talks to Docker with GET requests only, never reads the contents of secret files and sends nothing anywhere; the one opt in exception reads the cloud provider firewall with a read only token. Checks only see the collected facts, so a redacted facts file replays a report exactly, which is how bug reports become tests.',
    'Fixing is a separate, explicit step. Since 0.2, stackward plan writes the fixes down as file diffs and commands with a risk class and an undo for every step, and apply runs only the steps you name, with backups, a run journal and undo. Changes to SSH, the firewall or accounts run alone and roll back on a timer unless you confirm from a new SSH session.',
    'Releases are signed: checksums signed keylessly with cosign, GitHub build provenance, an SBOM per archive, a .deb and an install script that checks the checksum before it installs anything. The newest release is v0.4.0. Version 0.3 added the provider firewall checks for Hetzner Cloud and OVHcloud, and 0.4 makes stackward something you repeat: waivers that accept a finding on purpose with a reason and an expiry, stackward diff for drift between two reports, audits of several hosts over your own ssh, and a systemd timer that writes a Prometheus metric.',
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
    '112 audit checks in 15 groups, plus 6 outside view checks run by stackward probe',
    'Reads the whole stack: SSH, UFW and DOCKER-USER, the cloud provider firewall (opt in), Docker, Coolify and Dokploy, Cloudflare Tunnel, Tailscale, CrowdSec',
    'Every finding with a stable id, its evidence, the fix and what the fix can break',
    'Unknown is never a pass: what it cannot inspect is reported, with the reason',
    'Read only by default, inside a Landlock sandbox where the kernel supports it; no telemetry',
    'plan and apply: fixes as reviewable steps with backups, a journal, undo and a rollback timer for SSH and firewall changes',
    'Waivers with a reason and an expiry, drift reports between two audits, multi-host audits over ssh and a systemd timer',
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
